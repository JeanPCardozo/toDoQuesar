<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          TodoQuasar
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area
        :style="
          !visible
            ? 'height: calc(100% - 270px); margin-top: 170px; border-right: 1px solid #ddd'
            : 'height:100%'
        "
      >
        <q-list padding>
          <q-item-label header class="text-grey-8">
            Menú de navegación
          </q-item-label>
          <EssentialLink
            v-for="link in essentialLinks"
            :key="link.title"
            :link="link"
          /> </q-list
      ></q-scroll-area>
      <q-img
        v-if="!visible"
        class="fixed-top"
        src="../../public/background.jpg"
        style="height: 170px;"
      >
        <div class="fixed-bottom">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold text-capitalize">
            {{ email | username }}
          </div>
          <div>{{ email }}</div>
          <div class="row justify-end">
            <q-btn rounded outline class="q-mt-md" to="/Profile" size="sm">Editar Datos</q-btn>
          </div>
        </div>
      </q-img>
      <div v-if="!visible" class="row justify-center q-mt-lg">
        <q-btn color="red" @click="logout">Cerrar sesión</q-btn>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";
export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      visible: false,
      email: ""
    };
  },
  methods: {
    logout() {
      this.$q
        .dialog({
          title: "Cerrar sesión",
          message: "¿Estás seguro de cerrar sesión?",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          localStorage.removeItem("user");

          this.$q.notify({
            message: "sesión cerrada",
            color: "blue-4",
            textColor: "white",
            icon: "cloud_done"
          });

          this.$router.push({ path: "/LogIn" });
        });
    },
    ValidateUser() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.visible = user == null ? true : false;
      this.email = this.visible ? "" : user.email;
    }
  },
  computed: {
    essentialLinks() {
      return [
        {
          title: "Home",
          to: "/",
          icon: "home",
          visible: this.visible
        },
        {
          title: "To-do",
          to: "/Tasks",
          icon: "notes",
          visible: !this.visible
        },
        {
          title: "Registrar Usuario",
          to: "/Register",
          icon: "person",
          visible: this.visible
        },
        {
          title: "Iniciar sesión",
          to: "/LogIn",
          icon: "person",
          visible: this.visible
        }
      ];
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
  updated() {
    this.ValidateUser();
  }
};
</script>
