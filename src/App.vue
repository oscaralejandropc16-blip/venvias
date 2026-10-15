<script lang="ts">
import { defineComponent } from 'vue'
import AppToasts from '@/app/layouts/AppToasts.vue'

export default defineComponent({
  name: 'App',
  components: { AppToasts },
})
</script>

<template>
  <RouterView />
  <AppToasts />
</template>
