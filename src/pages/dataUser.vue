<template>
  <div class="q-pa-md q-gutter-sm">
    <p
      class="text-weight-light text-center text-grey-8 text-h4 text-capitalize	"
    >
      actualizar / registrar usuario
    </p>

    <div class=" q-pa-md row q-gutter-md justify-center">
      <q-card class="text-center col-6 bg-grey-4">
        <q-card-section>
          <q-form v-if="id == ''" @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              v-model="username"
              label="Digita tu nombre"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Por favor escribe un nombre'
              ]"
            />

            <div>
              <q-btn label="Registrar" type="submit" color="green" />
            </div>
          </q-form>

          <q-form v-else @submit="onUpdate" class="q-gutter-md">
            <q-input
              filled
              v-model="username"
              label="Digita tu nombre"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Por favor escribe un nombre'
              ]"
            />

            <div>
              <q-btn label="Actualizar" type="submit" color="green" />
              <q-btn
                label="Eliminar"
                color="red"
                @click="deleteUser"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { db } from "boot/firebase";
export default {
  data() {
    return {
      username: "",
      id: ""
    };
  },

  methods: {
    async loadDataUser() {
      const resultDB = await db.collection("user").get();
      resultDB.forEach(user => {
        this.username = user.data().name;
        this.id = user.id;
      });
    },
    async onSubmit() {
      await db.collection("user").add({
        name: this.username
      });

      this.loadDataUser();

      this.$q.notify({
        color: "green-4",
        textColor: "white",
        icon: "cloud_done",
        message: "Registrado"
      });
    },
    async onUpdate() {
      try {
        await db
          .collection("user")
          .doc(this.id)
          .update({
            name: this.username
          });

        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Actualizado"
        });
      } catch (error) {}
    },
    deleteUser() {
      this.$q
        .dialog({
          title: "Eliminar usuario",
          message: "¿Estás seguro de eliminar este usuario?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await db
              .collection("user")
              .doc(this.id)
              .delete();
            this.username = "";
            this.id = "";

            this.$q.notify({
              color: "red-4",
              textColor: "white",
              icon: "cloud_done",
              message: "Eliminado"
            });
          } catch (error) {}
        });
    }
  },
  created() {
    this.loadDataUser();
  }
};
</script>
