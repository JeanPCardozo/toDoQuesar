<template>
  <div>
    <q-card push class="bg-grey-1 shadow-15">
      <q-card-section>
        <p class="text-grey-8 text-h5 text-center">Actualizar correo</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row justify-center">
          <q-input
            color="white"
            standout="bg-info text-white"
            class=" col-md-6 col-xs-12"
            type="email"
            filled
            v-model="email"
            label="Digita tu correo"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'por favor digita tu correo'
            ]"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions class="row justify-end q-pa-md q-gutter-sm">
        <q-btn
          icon="close"
          rounded
          push
          label="Cancelar"
          size="md"
          color="grey"
          @click="cancel"
        /><q-btn
          icon="check"
          :loading="progress.loading"
          :percentage="progress.percentage"
          dark-percentage
          unelevated
          rounded
          push
          label="Guardar Datos"
          size="md"
          color="green"
          @click="updateEmail"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    email: "",
    progress: {
      loading: false,
      percentage: 0
    },
    interval: null
  }),
  methods: {
    cancel() {
      this.$emit("hidden");
    },
    async updateEmail() {
      if (navigator.onLine) {
        this.progress.loading = true;
        this.progress.percentage = 0;

        this.interval = await setInterval(() => {
          this.progress.percentage += Math.floor(Math.random() * 20);

          if (this.progress.percentage >= 100) {
            if (this.email != "") {
              if (this.validateEmail) {
                const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
                const URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
                this.$axios
                  .post(URL, {
                    idToken: this.user.idToken,
                    email: this.email,
                    returnSecureToken: true
                  })
                  .then(response => {
                    this.$q.notify({
                      color: "green-4",
                      textColor: "white",
                      icon: "cloud_done",
                      message: "Datos guadados"
                    });
                    localStorage.setItem("user", JSON.stringify(response.data));
                    this.$emit("hidden");
                  })
                  .catch(error => {
                    if (error.response) {
                      let { data } = error.response;
                      if (
                        data.error.message ==
                          "CREDENTIAL_TOO_OLD_LOGIN_AGAIN" ||
                        data.error.message ==
                          "INVALID_REQ_TYPE : Unsupported request parameters."
                      ) {
                        localStorage.removeItem("user");
                        this.$router.push({ path: "/LogIn" });
                        this.$q.notify({
                          color: "red-4",
                          textColor: "white",
                          icon: "warning",
                          message:
                            "La sesión ha caducado. Vuelve a iniciar sesión"
                        });
                      } else {
                        if (data.error.message == "EMAIL_EXISTS") {
                          this.$q.notify({
                            color: "red-4",
                            textColor: "white",
                            icon: "warning",
                            message:
                              "El correo ya existe, por favor ingresa otro"
                          });
                        }
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
    }
  },
  computed: {
    validateEmail() {
      const reLargo = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
      return reLargo.test(this.email);
    }
  },
  mounted() {
    this.email = this.user.email;
  }
};
</script>
