<script lang="ts">
import { defineComponent } from 'vue'
import PageStub from '@/shared/ui/PageStub.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { DEBT_CONDITIONS_TEXT } from '../constants/debt'

export default defineComponent({
  name: 'DebtConditionsView',
  components: { PageStub },
  data() {
    return {
      text: DEBT_CONDITIONS_TEXT,
      homeRoute: { name: ROUTE_NAMES.home },
    }
  },
})
</script>

<template>
  <PageStub :title="text.title" :next="text.next" :back-to="homeRoute" back-label="Volver al inicio" />
</template>
