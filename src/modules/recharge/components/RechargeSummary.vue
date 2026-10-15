<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { RECHARGE_SUMMARY_LABELS } from '../constants/recharge'
import type { RechargeSummary } from '../types/RechargeSummary'

/** Resumen antes de pagar: placa, monto, comisión y total. */
export default defineComponent({
  name: 'RechargeSummary',
  components: { AppIcon },
  props: {
    summary: { type: Object as PropType<RechargeSummary>, required: true },
  },
  data() {
    return { labels: RECHARGE_SUMMARY_LABELS }
  },
})
</script>

<template>
  <div class="rs">
    <p class="rs__head"><AppIcon name="recibo" :size="18" />{{ labels.title }}</p>
    <dl>
      <div><dt>{{ labels.plate }}</dt><dd>{{ summary.plate }}</dd></div>
      <div><dt>{{ labels.amount }}</dt><dd>{{ summary.amount }}</dd></div>
      <div><dt>{{ labels.fee }}</dt><dd>{{ summary.fee }}</dd></div>
      <div class="rs__total"><dt>{{ labels.total }}</dt><dd>{{ summary.total }}</dd></div>
    </dl>
  </div>
</template>

<style scoped>
.rs {
  padding: var(--space-4) var(--space-6) var(--space-6);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  box-shadow: var(--elev-1); text-align: left;
}
.rs__head {
  display: flex; align-items: center; gap: 6px; padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--borde); font: 500 15px/20px var(--font-display); color: var(--marino-900);
}
.rs__head svg { flex: none; color: var(--azul-700); }
.rs dl { margin: var(--space-3) 0 0; display: grid; gap: var(--space-2); }
.rs dl > div { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); }
.rs dt { color: var(--texto-suave); }
.rs dd { margin: 0; font: 500 15px/1.3 var(--font-mono); color: var(--marino-900); white-space: nowrap; }
.rs .rs__total { margin-top: var(--space-1); padding-top: var(--space-3); border-top: 1px solid var(--borde); }
.rs__total dt { font-weight: 500; color: var(--marino-900); }
.rs__total dd { font-size: 18px; }
</style>
