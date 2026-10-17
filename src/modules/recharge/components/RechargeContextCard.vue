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
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-xl, 20px);
  box-shadow: 0 10px 30px -10px rgba(18, 33, 66, 0.06), 0 1px 3px rgba(18, 33, 66, 0.04);
  text-align: left;
}
.rcc__main { display: flex; align-items: center; gap: var(--space-4); }
.rcc__main > :first-child { flex: none; }
.rcc__total { display: grid; gap: 2px; min-width: 0; }
.rcc__total span { font-size: 13px; font-weight: 500; color: var(--texto-suave); }
.rcc__total strong { font: 700 24px/1.15 var(--font-mono); color: #122142; white-space: nowrap; }
.rcc__links { display: flex; flex-wrap: wrap; column-gap: var(--space-4); }
.rcc__link {
  min-height: 44px; padding: 0; border: 0; background: none; cursor: pointer;
  font-size: 14px; font-weight: 500; color: #0038A8; text-decoration: underline;
  transition: color 0.2s ease;
}
.rcc__link:hover {
  color: #122142;
}
.rcc__detail { box-shadow: none; }
.rcc__note {
  display: flex; align-items: flex-start; gap: 6px; padding-top: var(--space-3); border-top: 1px dashed var(--borde);
  font-size: 13px; line-height: 18px; color: var(--texto-suave);
}
.rcc__note svg { flex: none; margin-top: 1px; color: #0038A8; }
</style>
