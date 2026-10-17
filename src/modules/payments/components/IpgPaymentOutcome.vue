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
.out {
  text-align: left;
  animation: outFadeIn 0.35s var(--ease-out);
}
.out__head { display: grid; justify-items: center; gap: var(--space-2); margin-bottom: var(--space-6); text-align: center; }
.out__icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: var(--space-2);
  border-radius: 50%;
  color: #fff;
  transition: transform 0.3s var(--ease-out);
}
.out--ok .out__icon {
  background: var(--exito);
  box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.15);
  animation: outPulseOk 2s infinite ease-in-out;
}
.out--denied .out__icon {
  background: var(--alerta);
  box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.15);
  animation: outPulseDenied 2s infinite ease-in-out;
}
.out--unknown .out__icon {
  background: #0038A8;
  box-shadow: 0 0 0 8px rgba(0, 56, 168, 0.15);
  animation: outPulseUnknown 2s infinite ease-in-out;
}
.out__title { font: 700 24px/1.25 var(--font-display); color: #122142; letter-spacing: -0.01em; }
.out__message { max-width: 44ch; font-size: 15px; line-height: 22px; color: var(--texto-suave); }

.out__data {
  margin: 0;
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-6);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-xl, 20px);
  box-shadow: 0 10px 30px -10px rgba(18, 33, 66, 0.06);
}
.out__data > div { display: flex; justify-content: space-between; align-items: center; gap: var(--space-4); min-height: 34px; }
.out__data dt { font-size: 14px; color: var(--texto-suave); }
.out__data dd { margin: 0; font: 600 15px/1.3 var(--font-mono); color: #122142; text-align: right; overflow-wrap: anywhere; }
.out__data .out__date { font-family: var(--font-body); font-weight: 500; font-size: 14px; }
.out__badge {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 3px 14px;
  border: 1px solid;
  border-radius: var(--radius-pill);
  font: 600 13px/1 var(--font-body);
  letter-spacing: 0.02em;
}
.out--ok .out__badge { background: #ECFDF5; border-color: #6EE7B7; color: #065F46; }
.out--denied .out__badge { background: #FEF2F2; border-color: #FCA5A5; color: #991B1B; }
.out--unknown .out__badge { background: #EFF6FF; border-color: #BFDBFE; color: #1E40AF; }

.out__actions { display: grid; gap: var(--space-3); margin-top: var(--space-6); }
@media (min-width: 560px) { .out__actions { grid-template-columns: 1fr 1fr; } }

@keyframes outFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes outPulseOk {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.15);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(16, 185, 129, 0.05);
  }
}

@keyframes outPulseDenied {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.15);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(239, 68, 68, 0.05);
  }
}

@keyframes outPulseUnknown {
  0%, 100% {
    box-shadow: 0 0 0 6px rgba(0, 56, 168, 0.15);
  }
  50% {
    box-shadow: 0 0 0 12px rgba(0, 56, 168, 0.05);
  }
}

@media (prefers-reduced-motion: reduce) {
  .out {
    animation: none;
  }
  .out--ok .out__icon,
  .out--denied .out__icon,
  .out--unknown .out__icon {
    animation: none;
  }
}
</style>
