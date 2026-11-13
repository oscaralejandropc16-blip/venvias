<script lang="ts">
import { defineComponent } from 'vue'
import PageStub from '@/shared/ui/PageStub.vue'
import PlateConfirm from '@/modules/plates/components/PlateConfirm.vue'
import PlateField from '@/modules/plates/components/PlateField.vue'
import { usePlateFromRoute } from '@/modules/plates/composables/usePlateFromRoute'
import { formatPlate, plateStatus } from '@/modules/plates/utils/plate'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { DEBT_STUB_TEXT } from '../constants/debt'

export default defineComponent({
  name: 'DebtView',
  components: { PageStub, PlateConfirm, PlateField },
  setup() {
    return { ...usePlateFromRoute() }
  },
  data() {
    return {
      text: DEBT_STUB_TEXT,
      localPlate: '',
      backRoute: { name: ROUTE_NAMES.home },
    }
  },
  computed: {
    activePlate(): string {
      return this.hasPlate ? this.plate : this.localPlate
    },
    isLocalValid(): boolean {
      return plateStatus(this.localPlate) === 'valid'
    },
    footText(): string {
      return this.isLocalValid
        ? `Placa lista: ${formatPlate(this.localPlate)}`
        : 'Escribe la placa para consultar saldo deudor'
    },
  },
  methods: {
    onPlateTyped(raw: string): void {
      this.localPlate = raw
    },
    onSearchDebt(): void {
      if (this.isLocalValid) {
        void this.$router.push({
          name: ROUTE_NAMES.debt,
          query: { placa: this.localPlate },
        })
      }
    },
  },
})
</script>

<template>
  <PageStub :title="text.title" :next="text.next" :back-to="backRoute" back-label="Volver al inicio">
    <div class="debt-plate-wrap">
      <PlateConfirm v-if="hasPlate" :plate="plate" :has-plate="hasPlate" />
      <div v-else class="debt-input-wrap">
        <PlateField
          :model-value="localPlate"
          :foot-text="footText"
          :is-valid="isLocalValid"
          @typed="onPlateTyped"
        />
        <button
          type="button"
          class="btn btn--primario debt-go"
          :disabled="!isLocalValid"
          @click="onSearchDebt"
        >
          Consultar saldo deudor
        </button>
      </div>
    </div>
  </PageStub>
</template>

<style scoped>
.debt-plate-wrap {
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.debt-input-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
.debt-go {
  width: 100%;
  min-height: 48px;
  margin-top: var(--space-3);
}
</style>
