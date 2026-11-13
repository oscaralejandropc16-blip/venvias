<script lang="ts">
import { defineComponent } from 'vue'
import PageStub from '@/shared/ui/PageStub.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'

export default defineComponent({
  name: 'NotFoundView',
  components: { PageStub },
  data() {
    return {
      homeRoute: { name: ROUTE_NAMES.home },
    }
  },
})
</script>

<template>
  <PageStub
    title="No encontramos esta página"
    next="Puede que el enlace esté mal escrito o que la página ya no exista."
    :back-to="homeRoute"
    back-label="Volver al inicio"
  />
</template>
