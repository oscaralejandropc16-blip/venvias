<script lang="ts">
import { defineComponent } from 'vue'
import PageStub from '@/shared/ui/PageStub.vue'
import PlateConfirm from '@/modules/plates/components/PlateConfirm.vue'
import { usePlateFromRoute } from '@/modules/plates/composables/usePlateFromRoute'
import { PLATE_FORM_ANCHOR, ROUTE_NAMES } from '@/core/constants/routing'
import { DEBT_STUB_TEXT } from '../constants/debt'

export default defineComponent({
  name: 'DebtView',
  components: { PageStub, PlateConfirm },
  setup() {
    return { ...usePlateFromRoute() }
  },
  data() {
    return {
      text: DEBT_STUB_TEXT,
      backRoute: { name: ROUTE_NAMES.home, hash: `#${PLATE_FORM_ANCHOR}` },
    }
  },
})
</script>

<template>
  <PageStub :title="text.title" :next="text.next" :back-to="backRoute" back-label="Volver a la placa">
    <PlateConfirm :plate="plate" :has-plate="hasPlate" />
  </PageStub>
</template>
