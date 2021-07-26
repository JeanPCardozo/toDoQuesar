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
      <q-list>
        <q-item-label header class="text-grey-8">
          Menú de navegación
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          :link="link"
        />
      </q-list>
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
      visible: false
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
    validando() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.visible = user == null ? true : false;
    }
  },
  computed: {
    essentialLinks() {
      return [
        {
          title: "To-do",
          to: "/",
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
  updated() {
    this.validando()
  }
};
</script>
