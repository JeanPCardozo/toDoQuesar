<template>
  <div class="q-pa-md q-gutter-sm">
    <p
      class="text-weight-light text-center text-grey-8 text-h4 text-capitalize	"
    >
      Iniciar sesión
    </p>

    <div class=" q-pa-md row q-gutter-md justify-center">
      <q-card class="text-center col-xs-12 col-sm-8 col-md-6 bg-grey-4">
        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              color="blue-9"
              v-model="email"
              label="Digita tu correo"
              lazy-rules
              :rules="[
                val => (val && val.length > 0) || 'Por favor escriba un correo'
              ]"
            />
            <q-input
              filled
              color="blue-9"
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
                  ><q-icon :name="show ? 'visibility_off' : 'visibility'"
                /></q-btn>
              </template>
            </q-input>

            <div>
              <q-btn
                :loading="progress.loading"
                :percentage="progress.percentage"
                dark-percentage
                unelevated
                label="Iniciar sesión"
                type="submit"
                color="green"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div class=" q-pa-md row q-gutter-md justify-center">
      <q-btn flat color="info" rounded @click="prompt = true"
        >Recuperar contraseña</q-btn
      >

      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6 text-info">Ingresa tu correo</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              dense
              color="info"
              v-model="address"
              autofocus
              @keyup.enter="prompt = false"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn push color="red-6" label="Cancelar" v-close-popup />
            <q-btn
              push
              color="green-6"
              label="Enviar correo"
              @click="recoverPassword"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: {
        loading: false,
        percentage: 0
      },
      interval: null,
      email: "",
      pass: "",
      show: false,
      prompt: false,
      address: ""
    };
  },

  methods: {
    async onSubmit() {
      if (navigator.onLine) {
        this.progress.loading = true;
        this.progress.percentage = 0;

        this.interval = await setInterval(() => {
          this.progress.percentage += Math.floor(Math.random() * 20);

          if (this.progress.percentage >= 100) {
            if (this.pass.length >= 6 && this.email != "") {
              if (this.validateEmail) {
                const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
                const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

                this.$axios
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
                    localStorage.setItem("user", JSON.stringify(response.data));
                    this.$router.push({ path: "/Tasks" });
                  })
                  .catch(error => {
                    if (error.response) {
                      let { data } = error.response;
                      if (
                        data.error.message == "INVALID_PASSWORD" ||
                        data.error.message == "EMAIL_NOT_FOUND"
                      ) {
                        this.$q.notify({
                          color: "red-4",
                          textColor: "white",
                          icon: "warning",
                          message: "Correo y/o contraseña incorrecta"
                        });
                      }
                    }
                  });
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
            clearInterval(this.interval);
            this.progress.loading = false;
          }
        }, 300);
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

    async recoverPassword() {
      if (navigator.onLine) {
        const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
        const URL = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`;
        try {
          await this.$axios
            .post(URL, {
              email: this.address,
              requestType: "PASSWORD_RESET"
            })
            .then(result => {
              if (result.status == 200) {
                this.address = "";
                this.$q.notify({
                  color: "green-4",
                  textColor: "white",
                  icon: "cloud_done",
                  message:
                    "Correo enviado, por favor verifica en correos no deseados"
                });
              }
            });
        } catch (error) {
          if (error.response) {
            let { data } = error.response;
            if ((data.error.message = "EMAIL_NOT_FOUND")) {
              this.$q.notify({
                color: "red-4",
                textColor: "white",
                icon: "warning",
                message: "Correo inválido"
              });
            }
          }
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
