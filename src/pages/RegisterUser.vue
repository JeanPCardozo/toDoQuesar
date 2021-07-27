<template>
  <div class="q-pa-md q-gutter-sm">
    <p
      class="text-weight-light text-center text-grey-8 text-h4 text-capitalize	"
    >
      registrar usuario
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
              v-model="pass1"
              :type="show1 ? 'text' : 'password'"
              label="Digitar contraseña"
              hint="contraseña de más de 6 carácteres"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0 && val.length >= 6) ||
                  'Por favor verifique su contraseña'
              ]"
              ><template v-slot:append>
                <q-btn flat @click="show1 = !show1"
                  ><q-icon :name="show1 ? 'visibility_off' : 'visibility'"
                /></q-btn>
              </template>
            </q-input>
            <q-input
              filled
              color="blue-9"
              v-model="pass2"
              :type="show ? 'text' : 'password'"
              label="Confirmar contraseña"
              hint="contraseña de más de 6 carácteres"
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
                label="Registrar usuario"
                type="submit"
                color="green"
              />
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
      progress: {
        loading: false,
        percentage: 0
      },
      interval: null,
      email: "",
      pass1: "",
      pass2: "",
      show: false,
      show1: false
    };
  },

  methods: {
    async onSubmit() {
      this.progress.loading = true;
      this.progress.percentage = 0;

      this.interval = await setInterval(() => {
        this.progress.percentage += Math.floor(Math.random() * 20);

        if (this.progress.percentage >= 100) {
          if (
            this.pass1 === this.pass2 &&
            this.pass1.length >= 6 &&
            this.email != ""
          ) {
            if (this.validateEmail) {
              const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
              const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
              try {
                this.$axios
                  .post(URL, {
                    email: this.email,
                    password: this.pass1,
                    returnSecureToken: true
                  })
                  .then(response => {
                    this.$q.notify({
                      color: "green-4",
                      textColor: "white",
                      icon: "cloud_done",
                      message: "Registrado"
                    });
                    localStorage.setItem("user", JSON.stringify(response.data));
                    this.$router.push({ path: "/Tasks" });
                  })
                  .catch(error => console.log(error));
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
          }
          clearInterval(this.interval);
          this.progress.loading = false;
        }
      }, 300);
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
