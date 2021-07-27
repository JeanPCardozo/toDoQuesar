<template>
  <div>
    <q-img
      class="absolute-top"
      src="https://cdn.quasar.dev/img/material.png"
      style="height:100%"
    >
      <div class="absolute-top bg-transparent">
        <q-avatar size="100px" class="q-mt-xl">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
        <div class="text-weight-bold text-h4 text-capitalize">
          {{ user.email | username }}
        </div>
        <div class="text-subtitle1">{{ user.email }}</div>
        <q-form @submit="update" class="q-ma-md">
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
          <div class="row justify-end">
            <q-btn
              :loading="progress.loading"
              :percentage="progress.percentage"
              dark-percentage
              unelevated
              rounded
              push
              label="Guardar Datos"
              size="sm"
              type="submit"
              color="green"
            />
          </div>
        </q-form>
      </div>
    </q-img>
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
    async update() {
      this.progress.loading = true;
      this.progress.percentage = 0;

      this.interval = await setInterval(() => {
        this.progress.percentage += Math.floor(Math.random() * 20);

        if (this.progress.percentage >= 100) {
          if (this.email != "") {
            if (this.validateEmail) {
              const apiKey = "AIzaSyDiStz7omsuavpzOm5kAYhnBs-mjs8fOMs";
              const URL = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`;
              try {
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
  mounted() {
    this.email = this.user.email;
  }
};
</script>
