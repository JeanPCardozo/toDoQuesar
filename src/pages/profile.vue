<template>
  <div>
    <q-img
      class="fixed"
      src="../../public/background.jpg"
      style="height:100%"
    >
      <div class="fixed-full">
        <q-avatar size="100px" class="q-mt-xl">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold text-h4 text-capitalize">
          {{ user.email | username }}
        </div>
        <div class="text-subtitle1">{{ user.email }}</div>

        <div class="row justify-center q-ma-md q-gutter-md">
          <q-btn
            icon="update"
            class="bg-teal text-white"
            rounded
            push
            @click="
              showFormEmail = true;
              showFormPass = false;
            "
            >Actualizar Correo</q-btn
          >
          <q-btn
            icon="update"
            class="bg-teal text-white"
            rounded
            push
            @click="
              showFormEmail = false;
              showFormPass = true;
            "
            >Actualizar Contraseña</q-btn
          >
        </div>

        <p
          v-if="!showFormEmail && !showFormPass"
          class="text-center text-white text-body1 q-ma-xl"
        >
          Selecciona una opción para realizar tus actualizaciones
          <br />
          <q-icon
            class="q-mt-md"
            name="manage_accounts"
            style="font-size:80px"
          ></q-icon>
        </p>
        <updateEmail @hidden="showFormEmail = false" v-if="showFormEmail" />
        <updatePass @hidden="showFormPass = false" v-if="showFormPass" />
      </div>
    </q-img>
  </div>
</template>

<script>
import updateEmail from "../components/updateEmail.vue";
import updatePass from "../components/updatePass.vue";
export default {
  data: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    showFormEmail: false,
    showFormPass: false
  }),
  components: {
    updateEmail,
    updatePass
  },
  methods: {
    /*async verificarCorreo() {
      const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
      await this.$axios
        .post(
          `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
          {
            requestType: "VERIFY_EMAIL",
            idToken: this.user.idToken
          }
        )
        .then(() => {
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "correo enviado"
          });
        });
    }*/
  },
  filters: {
    username(email) {
      let arrayText = email.split("");
      let numberText = -1;
      for (let i in arrayText) {
        if (arrayText[i] === "@") {
          numberText = i;
        }
      }
      return email.slice(0, numberText);
    }
  },
  updated() {
    this.email = this.user.email;
  }
};
</script>
