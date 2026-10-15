<script lang="ts">
import { defineComponent } from 'vue'
import { formatPlate } from '@/modules/plates/utils/plate'

/**
 * Barra que acompaña el scroll del pago: placa, total y paso. Repite lo que ya
 * está en la ficha, así que es solo visual (`aria-hidden`). La vista decide
 * cuándo se muestra con `visible`.
 */
export default defineComponent({
  name: 'RechargeContextBar',
  props: {
    plate: { type: String, required: true },
    total: { type: String, required: true },
    stepLabel: { type: String, required: true },
    visible: { type: Boolean, default: false },
  },
  computed: {
    plateText(): string {
      return formatPlate(this.plate)
    },
  },
})
</script>

<template>
  <div class="rcb" :class="{ 'is-on': visible }" aria-hidden="true">
    <span class="rcb__plate">{{ plateText }}</span>
    <span class="rcb__total">{{ total }}</span>
    <span class="rcb__step">{{ stepLabel }}</span>
  </div>
</template>

<style scoped>
.rcb {
  display: flex; align-items: center; gap: var(--space-3); height: 52px; padding: 0 var(--space-4);
  background: var(--superficie); border-bottom: 1px solid var(--borde); box-shadow: var(--elev-2);
  opacity: 0; transform: translateY(-8px); pointer-events: none;
  transition: opacity .25s var(--ease-out), transform .25s var(--ease-out);
}
.rcb.is-on { opacity: 1; transform: none; }
.rcb__plate {
  flex: none; padding: 4px 8px; border: 2px solid var(--marino-900); border-radius: var(--radius-placa);
  font: 500 15px/1 var(--font-mono); letter-spacing: .06em; color: var(--marino-900); white-space: nowrap;
}
.rcb__total { font: 500 15px/1 var(--font-mono); color: var(--marino-900); white-space: nowrap; }
.rcb__step { margin-left: auto; min-width: 0; font-size: 13px; color: var(--texto-suave); text-align: right; }
</style>
