<script lang="ts">
import { defineComponent } from 'vue'
import AppHeader from '@/app/layouts/AppHeader.vue'
import AppFooter from '@/app/layouts/AppFooter.vue'

/** Layout del sitio público: nav fija, contenido y pie. Ninguna ruta pide cuenta. */
export default defineComponent({
  name: 'PublicLayout',
  components: { AppHeader, AppFooter },
})
</script>

<template>
  <a class="skip" href="#contenido">Saltar al contenido</a>
  <AppHeader />
  <main id="contenido">
    <RouterView />
  </main>
  <AppFooter />
</template>
