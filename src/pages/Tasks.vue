<template>
  <div class="q-pa-md q-gutter-sm">
    <q-input v-model="search" filled type="search" placeholder="Search...">
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>
    <q-editor
      toolbar-text-color="white"
      toolbar-toggle-color="yellow-8"
      toolbar-bg="primary"
      content-class="bg-amber-3"
      min-height="5rem"
      v-model="editor"
      :definitions="{
        createUpdate: {
          tip: this.editionStatus ? 'Actualizar Task' : 'Guardar Task',
          icon: this.editionStatus ? 'update' : 'save',
          label: this.editionStatus ? 'Actualizar' : 'Guardar',
          handler: this.saveOrEditTask
        },
        cancel: {
          label: 'Cancelar',
          icon: 'cancel',
          handler: this.cancelUpdate
        }
      }"
      :toolbar="[['createUpdate'], this.editionStatus ? ['cancel'] : []]"
    />

    <div>
      <q-chip>
        <q-avatar color="red" text-color="white">{{
          countWithoutCheckTasks
        }}</q-avatar>
        Tareas sin hacer
      </q-chip>
      <q-chip>
        <q-avatar color="green" text-color="white">{{
          countCheckedTasks
        }}</q-avatar>
        Tareas hechas
      </q-chip>
    </div>

    <q-card
      class="row"
      flat
      bordered
      v-for="task in filteredTasks"
      :key="task.id"
    >
      <q-toggle
        size="sm"
        v-model="task.data.check"
        checked-icon="check"
        color="green"
        unchecked-icon="clear"
        @input="updateStatus(task.id, task.data)"
      />
      <q-card-section
        :class="task.data.check ? 'tachar' : ''"
        class="col"
        v-html="limitText(task.data.description)"
      />
      <q-btn flat color="warning" icon="edit" @click="editTask(task.id)" />
      <q-btn
        flat
        color="negative"
        icon="delete"
        @click="deleteTask(task.id, task.data)"
      />
    </q-card>

    <div v-show="tasks.length == 0" class="flex flex-center">
      <h6>Sin notas</h6>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    countCheckedTasks: 0,
    countWithoutCheckTasks: 0,
    search: "",
    editor: "",
    editionStatus: false,
    tasks: [],
    idEdit: "",
    user: JSON.parse(localStorage.getItem("user"))
  }),
  methods: {
    cancelUpdate() {
      this.editionStatus = false;
      this.editor = "";
    },
    limitText(text) {
      if (text.length > 35) {
        return `${text.substr(0, 35)}...`;
      } else {
        return text;
      }
    },
    saveOrEditTask() {
      if (this.editionStatus) {
        this.updateTask();
      } else {
        this.createTask();
      }
    },
    async updateStatus(id, info) {
      if (navigator.onLine) {
        await this.$axios
          .put(
            `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}/${id}.json?auth=${this.user.idToken}`,
            {
              description: info.description,
              check: !!info.check,
              status: true
            }
          )
          .then(() => this.$mount())
          .catch(error => {});

        this.CheckTasks();
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    async listTasks() {
      if (navigator.onLine) {
        this.tasks = [];
        const { data } = await this.$axios.get(
          `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}.json?auth=${this.user.idToken}`
        );

        for (let item in data) {
          if (data[item].status === true) {
            this.tasks.push({
              id: item,
              data: data[item]
            });
          }
        }

        this.CheckTasks();
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    async createTask() {
      if (navigator.onLine) {
        if (this.editorTrim) {
          await this.$axios
            .post(
              `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}.json?auth=${this.user.idToken}`,
              {
                check: false,
                description: this.editorTrim,
                status: true
              }
            )
            .then(() => {
              this.listTasks();
              this.editor = "";
              this.CheckTasks();
              this.$q.notify({
                message: "Tarea Guardada",
                color: "green-4",
                textColor: "white",
                icon: "cloud_done"
              });
            })
            .catch(error => {});
        } else {
          this.$q.notify({
            textColor: "grey-8",
            color: "yellow-4",
            icon: "warning",
            message: "Estás creando una tarea si texto"
          });
        }
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    deleteTask(id, info) {
      if (navigator.onLine) {
        this.$q
          .dialog({
            title: "Eliminar Tarea",
            message: "¿Estás seguro de eliminar esta tarea?",
            cancel: true,
            persistent: true
          })
          .onOk(async () => {
            await this.$axios
              .put(
                `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}/${id}.json?auth=${this.user.idToken}`,
                {
                  description: info.description,
                  check: !!info.check,
                  status: false
                }
              )
              .then(() => {
                this.$q.notify({
                  message: "tarea eliminada",
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done"
                });
                this.listTasks();
              });

            this.CheckTasks();
          });
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    async editTask(id) {
      if (navigator.onLine) {
        this.editionStatus = true;
        const { data } = await this.$axios.get(
          `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}/${id}.json?auth=${this.user.idToken}`
        );

        this.editor = data.description;
        this.idEdit = id;
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    async updateTask() {
      if (navigator.onLine) {
        const { data } = await this.$axios.get(
          `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}/${this.idEdit}.json?auth=${this.user.idToken}`
        );

        await this.$axios
          .put(
            `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${this.user.localId}/${this.idEdit}.json?auth=${this.user.idToken}`,
            {
              description: this.editorTrim,
              status: data.status,
              check: data.check
            }
          )
          .then(() => {
            this.editionStatus = false;
            this.editor = "";
            this.listTasks();

            this.$q.notify({
              message: "Tarea Actualizada",
              color: "green-4",
              textColor: "white",
              icon: "cloud_done"
            });
          });
      } else {
        this.$q.notify({
          color: "negative",
          position: "top",
          icon: "signal_wifi_statusbar_connected_no_internet_4",
          message: "Por favor conectate a internet",
          timeout: 2000
        });
      }
    },
    CheckTasks() {
      this.countCheckedTasks = 0;
      this.countWithoutCheckTasks = 0;
      this.tasks.forEach(task =>
        task.data.check === true
          ? this.countCheckedTasks++
          : this.countWithoutCheckTasks++
      );
    }
  },
  computed: {
    filteredTasks() {
      return this.search != ""
        ? this.tasks.filter(task =>
            task.data.description
              .toUpperCase()
              .trim()
              .includes(this.search.toUpperCase().trim())
          )
        : this.tasks;
    },
    editorTrim() {
      return this.editor.replace(/<br>/gi, "");
    }
  },

  created() {
    this.listTasks();
  }
};
</script>

<style>
.tachar {
  text-decoration: line-through;
}
</style>
