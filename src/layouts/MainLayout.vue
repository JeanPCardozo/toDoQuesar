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
          Todo Windows
        </q-toolbar-title>

        <!--<q-toggle
          label="Modo Oscuro"
          color="red"
          :false-value="true"
          :true-value="false"
          v-model="activeDark"
        />-->
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
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "To-do",
    to: "/",
    icon: "notes"
  },
  {
    title: "Actualizar / Registrar Datos Usuario",
    to: "/Data",
    icon: "person"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      activeDark: false,
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  }
};
</script>
