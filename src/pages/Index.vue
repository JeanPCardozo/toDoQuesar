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
        update: {
          tip: this.editionStatus ? 'Actualizar Task' : 'Guardar Task',
          icon: this.editionStatus ? 'update' : 'save',
          label: this.editionStatus ? 'Actualizar' : 'Guardar',
          handler: this.saveOrEditTask
        }
      }"
      :toolbar="[['bold', 'italic', 'strike', 'underline'], ['update']]"
    />

    <div v-if="username != ''" class="q-gutter-sm">
      <q-chip>
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        {{ username }}
      </q-chip>
    </div>

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

    <q-card class="row" flat bordered v-for="task in tasks" :key="task.id">
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
        v-html="task.data.description"
      />
      <!-- <q-btn flat color="warning" icon="edit" @click="editTask(item.id)" />-->
      <q-btn
        flat
        :disabled="search ? true : false"
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
  data() {
    return {
      check: false,
      countCheckedTasks: 0,
      countWithoutCheckTasks: 0,
      search: "",
      editor: "",
      filterTasks: [],
      tasks: [],
      id: "",
      username: "",
      editionStatus: false
    };
  },
  methods: {
    saveOrEditTask() {
      if (this.editionStatus) {
        this.updateTask();
      } else {
        this.createTask();
      }
    },
    async updateStatus(id, info) {
      await this.$axios
        .put(
          `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${id}.json`,
          {
            description: info.description,
            check: !!info.check,
            status: true
          }
        )
        .then(() => this.$mount());

      this.CheckTasks();
    },
    async listTasks() {
      this.tasks = [];
      const { data } = await this.$axios.get(
        "https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks.json"
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
    },
    async createTask() {
      await this.$axios
        .post(
          "https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks.json",
          {
            check: false,
            description: this.editor,
            status: true
          }
        )
        .then(() => this.listTasks());
      this.editor = "";
      this.CheckTasks();

      this.$q.notify({
        message: "Tarea Guardada",
        color: "green-4",
        textColor: "white",
        icon: "cloud_done"
      });
    },
    deleteTask(id, info) {
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
              `https://todoquasar-9b9ee-default-rtdb.firebaseio.com/tasks/${id}.json`,
              {
                description: info.description,
                check: !!info.check,
                status: false
              }
            )
            .then(() => this.listTasks());

          //this.filterTasks = this.tasks;
          this.CheckTasks();
        });
    },
    editTask(id) {
      this.id = id;
      this.editionStatus = true;
      this.tasks.find(task => {
        if (task.id === this.id) {
          this.editor = task.text;
        }
      });
    },
    async updateTask() {
      try {
        await db
          .collection("tasks")
          .doc(this.id)
          .update({
            text: this.editorTrim
          });

        let taskEdited = this.tasks.find(task => task.id === this.id);
        taskEdited.text = this.editorTrim;
      } catch (error) {
      } finally {
        this.index = 0;
        this.id = "";
        this.editionStatus = false;
        this.editor = "";
      }
    },
    async nameUser() {
      const resultDB = await db.collection("user").get();
      resultDB.forEach(user => (this.username = user.data().name));
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
    filtered() {
      if (this.search.length > 0) {
        return (this.filterTasks = this.tasks.filter(
          task =>
            task.text.toLowerCase().indexOf(this.search.toLowerCase()) !== -1
        ));
      } else {
        return this.tasks;
      }
    },
    editorTrim() {
      return this.editor.replace(/<br>/gi, "");
    }
  },
  created() {
    this.tasks;
    this.filterTasks = this.tasks;
    this.listTasks();
    this.nameUser();
  }
};
</script>

<style>
.tachar {
  text-decoration: line-through;
}
</style>
