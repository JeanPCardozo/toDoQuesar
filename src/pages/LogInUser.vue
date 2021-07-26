<template>
  <div class="q-pa-md q-gutter-sm">
    <p
      class="text-weight-light text-center text-grey-8 text-h4 text-capitalize	"
    >
      Iniciar sesión
    </p>

    <div class=" q-pa-md row q-gutter-md justify-center">
      <q-card class="text-center col-6 bg-grey-4">
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              v-model="email"
              label="Digita tu correo"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Por favor escriba un correo'
              ]"
            />
            <q-input
              filled
              v-model="pass"
              :type="show ? 'text' : 'password'"
              label="Digita una contraseña"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0 && val.length >= 6) ||
                  'Por favor verifique su contraseña'
              ]"
              ><template v-slot:append>
                <q-btn flat @click="show = !show"
                  ><q-icon :name="show ? 'visibility' : 'visibility_off'"
                /></q-btn>
              </template>
            </q-input>

            <div>
              <q-btn label="Iniciar sesión" type="submit" color="green" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      pass: "",
      show: false
    };
  },

  methods: {
    async onSubmit() {
      if (this.pass.length >= 6 && this.email != "") {
        if (this.validateEmail) {
          const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
          const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
          try {
            await this.$axios
              .post(URL, {
                email: this.email,
                password: this.pass,
                returnSecureToken: true
              })
              .then(response => {
                this.$q.notify({
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done",
                  message: "Has Iniciado sesión"
                });
                this.$router.push({ path: "/Tasks" });
                localStorage.setItem("user", JSON.stringify(response.data));
              })
              .catch(error => {});
          } catch (error) {}
        } else {
          this.$q.notify({
            color: "red-4",
            textColor: "white",
            icon: "warning",
            message: "Verifica tu correo"
          });
        }
      } else {
        this.$q.notify({
          color: "red-4",
          textColor: "white",
          icon: "warning",
          message: "Verifica tus datos"
        });
        return;
      }
    }
  },
  computed: {
    validateEmail() {
      const reLargo = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
      return reLargo.test(this.email);
    }
  }
};
</script>
