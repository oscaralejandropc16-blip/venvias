<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateImage from '@/modules/plates/components/PlateImage.vue'
import { RECHARGE_RECEIPT_TEXT } from '../constants/recharge'
import type { RechargeReceipt } from '../types/RechargeReceipt'

/** Comprobante: monto acreditado, saldo nuevo, referencia y el código para consultar el saldo. */
export default defineComponent({
  name: 'RechargeReceiptCard',
  components: { AppIcon, PlateImage },
  props: {
    receipt: { type: Object as PropType<RechargeReceipt>, required: true },
  },
  data() {
    return { text: RECHARGE_RECEIPT_TEXT }
  },
  computed: {
    referenceLabel(): string {
      // Con el Botón de Pago IPG, la referencia es el número de operación del banco.
      return this.receipt.paymentMethod === 'ipg' ? this.text.operationNumber : this.text.reference
    },
  },
})
</script>

<template>
  <div class="rc">
    <p class="rc__head"><AppIcon name="recibo" :size="18" />{{ text.title }}</p>

    <div class="rc__main">
      <PlateImage :value="receipt.plate" size="sm" />
      <p class="rc__credited">
        {{ text.credited }}
        <strong>{{ receipt.amount }}</strong>
      </p>
    </div>

    <dl class="rc__data">
      <div><dt>{{ text.balanceAfter }}</dt><dd class="rc__balance">{{ receipt.balanceAfter }}</dd></div>
      <div><dt>{{ referenceLabel }}</dt><dd>{{ receipt.reference }}</dd></div>
      <div v-if="receipt.paidAt"><dt>{{ text.paidAt }}</dt><dd class="rc__date">{{ receipt.paidAt }}</dd></div>
    </dl>

    <div class="rc__code">
      <p class="rc__code-label">{{ text.securityCode }}</p>
      <p class="rc__code-value">{{ receipt.securityCode }}</p>
      <p class="rc__code-note"><AppIcon name="info" :size="18" />{{ text.securityCodeNote }}</p>
    </div>
  </div>
</template>

<style scoped>
.rc {
  padding: var(--space-4) var(--space-6) var(--space-6);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  box-shadow: var(--elev-1); text-align: left;
}
.rc__head {
  display: flex; align-items: center; gap: 6px; padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--borde); font: 500 15px/20px var(--font-display); color: var(--marino-900);
}
.rc__head svg { flex: none; color: var(--azul-700); }

.rc__main { display: grid; justify-items: center; gap: var(--space-3); padding-block: var(--space-6) var(--space-4); text-align: center; }
.rc__credited { display: grid; gap: var(--space-1); color: var(--texto-suave); }
.rc__credited strong { font: 500 clamp(30px, 3vw + 18px, 40px)/1.1 var(--font-mono); color: var(--marino-900); }

.rc__data { margin: 0; display: grid; gap: var(--space-2); padding-top: var(--space-3); border-top: 1px solid var(--borde); }
.rc__data > div { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); }
.rc__data dt { color: var(--texto-suave); }
.rc__data dd { margin: 0; font: 500 15px/1.3 var(--font-mono); color: var(--marino-900); text-align: right; overflow-wrap: anywhere; }
.rc__data .rc__balance { color: var(--azul-700); }
.rc__data .rc__date { font-family: var(--font-body); }

.rc__code {
  display: grid; justify-items: center; gap: var(--space-1); margin-top: var(--space-4);
  padding: var(--space-4); border-radius: var(--radius-sm); background: var(--azul-100); text-align: center;
}
.rc__code-label { font-size: 14px; font-weight: 500; color: var(--marino-900); }
.rc__code-value { font: 500 30px/1.2 var(--font-mono); letter-spacing: .24em; margin-right: -.24em; color: var(--marino-900); }
.rc__code-note { display: flex; align-items: center; gap: 6px; font-size: 14px; line-height: 20px; color: var(--marino-900); }
.rc__code-note svg { flex: none; }
</style>
