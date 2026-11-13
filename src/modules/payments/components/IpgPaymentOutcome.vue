<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { IconName } from '@/shared/icons/iconPaths'
import { IPG_PAYMENT_STATUS_LABELS, IPG_PAYMENT_TEXT } from '../constants/ipgPayment'
import type { IpgPaymentResult } from '../types/IpgPaymentResult'

/**
 * Resultado del cobro por el Botón de Pago IPG: aprobado, rechazado o por
 * confirmar (el banco no respondió). Muestra motivo, número de operación, monto,
 * fecha y estado. Las acciones llegan por el slot `actions`.
 * `hideHeader` deja fuera icono y título cuando la vista ya los pinta.
 */
export default defineComponent({
  name: 'IpgPaymentOutcome',
  components: { AppIcon },
  props: {
    result: { type: Object as PropType<IpgPaymentResult>, required: true },
    hideHeader: { type: Boolean, default: false },
  },
  data() {
    return { text: IPG_PAYMENT_TEXT, statusLabels: IPG_PAYMENT_STATUS_LABELS }
  },
  computed: {
    tone(): string {
      return { approved: 'out--ok', denied: 'out--denied', unknown: 'out--unknown' }[this.result.status]
    },
    icon(): IconName {
      return { approved: 'check', denied: 'alert', unknown: 'info' }[this.result.status] as IconName
    },
    title(): string {
      const { approvedTitle, deniedTitle, unknownTitle } = this.text
      return { approved: approvedTitle, denied: deniedTitle, unknown: unknownTitle }[this.result.status]
    },
    message(): string {
      if (this.result.status === 'approved') return this.text.approvedText
      if (this.result.status === 'unknown') return this.text.unknownText
      return this.result.reason || this.text.deniedFallback
    },
  },
})
</script>

<template>
  <div class="out" :class="tone">
    <div v-if="!hideHeader" class="out__head">
      <span class="out__icon" aria-hidden="true"><AppIcon :name="icon" :size="28" /></span>
      <p class="out__title">{{ title }}</p>
      <p class="out__message">{{ message }}</p>
    </div>

    <dl class="out__data">
      <div v-if="result.operationNumber"><dt>{{ text.operationNumber }}</dt><dd>{{ result.operationNumber }}</dd></div>
      <div v-if="result.amount"><dt>{{ text.amount }}</dt><dd>{{ result.amount }}</dd></div>
      <div v-if="result.processedAt"><dt>{{ text.processedAt }}</dt><dd class="out__date">{{ result.processedAt }}</dd></div>
      <div>
        <dt>{{ text.status }}</dt>
        <dd><span class="out__badge">{{ statusLabels[result.status] }}</span></dd>
      </div>
    </dl>

    <div v-if="$slots.actions" class="out__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.out { text-align: left; }
.out__head { display: grid; justify-items: center; gap: var(--space-2); margin-bottom: var(--space-6); text-align: center; }
.out__icon { display: grid; place-items: center; width: 56px; height: 56px; margin-bottom: var(--space-2); border-radius: 50%; color: #fff; }
.out--ok .out__icon { background: var(--exito); }
.out--denied .out__icon { background: var(--alerta); }
.out--unknown .out__icon { background: var(--azul-700); }
.out__title { font: 600 22px/1.25 var(--font-display); color: var(--marino-900); }
.out__message { max-width: 44ch; color: var(--texto-suave); }

.out__data {
  margin: 0; display: grid; gap: var(--space-2); padding: var(--space-4) var(--space-6);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
}
.out__data > div { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); min-height: 32px; }
.out__data dt { color: var(--texto-suave); }
.out__data dd { margin: 0; font: 500 15px/1.3 var(--font-mono); color: var(--marino-900); text-align: right; overflow-wrap: anywhere; }
.out__data .out__date { font-family: var(--font-body); }
.out__badge {
  display: inline-flex; align-items: center; min-height: 28px; padding: 2px 12px;
  border: 1px solid; border-radius: var(--radius-pill); font: 500 13px/1 var(--font-body);
}
.out--ok .out__badge { background: var(--exito); border-color: var(--exito); color: var(--marino-900); }
.out--denied .out__badge { background: var(--superficie); border-color: var(--alerta); color: var(--alerta); }
.out--unknown .out__badge { background: var(--azul-100); border-color: var(--azul-100); color: var(--marino-900); }

.out__actions { display: grid; gap: var(--space-3); margin-top: var(--space-6); }
@media (min-width: 560px) { .out__actions { grid-template-columns: 1fr 1fr; } }
</style>
