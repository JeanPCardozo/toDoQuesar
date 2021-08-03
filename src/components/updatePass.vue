<template>
  <div>
    <q-card push class="bg-grey-1 shadow-15">
      <q-card-section>
        <p class="text-grey-8 text-h5 text-center">Actualizar Contraseña</p>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row justify-center">
          <q-input
            color="white"
            standout="bg-info text-white"
            class=" col-md-6 col-xs-12"
            :type="show ? 'text' : 'password'"
            filled
            v-model="pass"
            label="Digita tu contraseña"
            hint="contraseña de más de 6 carácteres"
            lazy-rules
            :rules="[
              val => (val && val.length > 0) || 'por favor digita su contraseña'
            ]"
          >
            <template v-slot:append>
              <q-btn flat @click="show = !show"
                ><q-icon :name="show ? 'visibility_off' : 'visibility'"
              /></q-btn>
            </template>
          </q-input>
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
          @click="updatePass"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: JSON.parse(localStorage.getItem("user")),
    show: false,
    pass: "",
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
    updatePass() {
      if (navigator.onLine) {
        this.progress.loading = true;
        this.progress.percentage = 0;

        this.interval = setInterval(() => {
          this.progress.percentage += Math.floor(Math.random() * 20);

          if (this.progress.percentage >= 100) {
            if (this.pass != "" && this.pass.length >= 6) {
              const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
              const URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
              try {
                this.$axios
                  .post(URL, {
                    idToken: this.user.idToken,
                    password: this.pass,
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
                    console.log(error.response);
                    if (error.response) {
                      let { data } = error.response;
                      if (
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
                      }
                    }
                  });
              } catch (error) {}
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
  }
};
</script>
