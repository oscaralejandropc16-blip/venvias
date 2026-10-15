<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateImage from '@/modules/plates/components/PlateImage.vue'
import { RECHARGE_TEXT } from '../constants/recharge'
import type { RechargeSummary as RechargeSummaryData } from '../types/RechargeSummary'
import RechargeSummary from './RechargeSummary.vue'

/**
 * Ficha compacta del pago: placa pequeña y total, con el desglose a pedido.
 * Ocupa poco para que el método y sus datos queden cerca. Emite `change-plate`.
 */
export default defineComponent({
  name: 'RechargeContextCard',
  components: { AppIcon, PlateImage, RechargeSummary },
  props: {
    plate: { type: String, required: true },
    summary: { type: Object as PropType<RechargeSummaryData>, required: true },
  },
  emits: {
    'change-plate': () => true,
  },
  data() {
    return { text: RECHARGE_TEXT, detailOpen: false }
  },
})
</script>

<template>
  <div class="rcc">
    <div class="rcc__main">
      <PlateImage :value="plate" size="xs" />
      <p class="rcc__total">
        <span>{{ text.totalToPay }}</span>
        <strong>{{ summary.total }}</strong>
      </p>
    </div>
    <div class="rcc__links">
      <button type="button" class="rcc__link" @click="$emit('change-plate')">{{ text.changePlate }}</button>
      <button
        type="button"
        class="rcc__link"
        :aria-expanded="detailOpen ? 'true' : 'false'"
        aria-controls="recarga-detalle"
        @click="detailOpen = !detailOpen"
      >
        {{ detailOpen ? text.hideDetail : text.showDetail }}
      </button>
    </div>
    <RechargeSummary v-if="detailOpen" id="recarga-detalle" :summary="summary" class="rcc__detail" />
    <p class="rcc__note"><AppIcon name="info" :size="16" />{{ text.plateNotice }}</p>
  </div>
</template>

<style scoped>
.rcc {
  display: grid; gap: var(--space-2); padding: var(--space-4);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  box-shadow: var(--elev-1); text-align: left;
}
.rcc__main { display: flex; align-items: center; gap: var(--space-4); }
.rcc__main > :first-child { flex: none; }
.rcc__total { display: grid; gap: 2px; min-width: 0; }
.rcc__total span { font-size: 14px; color: var(--texto-suave); }
.rcc__total strong { font: 500 22px/1.15 var(--font-mono); color: var(--marino-900); white-space: nowrap; }
.rcc__links { display: flex; flex-wrap: wrap; column-gap: var(--space-4); }
.rcc__link {
  min-height: 44px; padding: 0; border: 0; background: none; cursor: pointer;
  font-size: 15px; font-weight: 500; color: var(--azul-700); text-decoration: underline;
}
.rcc__detail { box-shadow: none; }
.rcc__note {
  display: flex; align-items: flex-start; gap: 6px; padding-top: var(--space-2); border-top: 1px dashed var(--borde);
  font-size: 14px; line-height: 20px; color: var(--texto-suave);
}
.rcc__note svg { flex: none; margin-top: 2px; color: var(--azul-700); }
</style>
