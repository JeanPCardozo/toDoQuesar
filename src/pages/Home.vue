<template>
  <div class=" text-grey-8 text-center q-pa-md flex flex-center">
    <div>
      <div class="text-h1 q-mt-xl">
        Bienvenido a To-do Quasar
      </div>

      <div class="text-h4 q-mt-lg" style="opacity:.4">
        Inicia sesión o regístrate
      </div>

      <div class="q-gutter-sm">
        <q-btn
        class="q-mt-xl"
        color="blue"
        text-color="white"
        unelevated
        to="/LogIn"
        label="Iniciar sesión"
        no-caps
      />
      <q-btn
        class="q-mt-xl"
        color="blue"
        text-color="white"
        unelevated
        to="/Register"
        label="Registrar"
        no-caps
      />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>
