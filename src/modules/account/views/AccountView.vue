<script lang="ts">
import { defineComponent } from 'vue'
import PageStub from '@/shared/ui/PageStub.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { ACCOUNT_STUB_TEXT } from '../constants/account'

export default defineComponent({
  name: 'AccountView',
  components: { PageStub },
  data() {
    return {
      text: ACCOUNT_STUB_TEXT,
      homeRoute: { name: ROUTE_NAMES.home },
    }
  },
})
</script>

<template>
  <PageStub :title="text.title" :next="text.next" :back-to="homeRoute" back-label="Volver al inicio" />
</template>
