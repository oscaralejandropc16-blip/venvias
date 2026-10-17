<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import CodeInput from '@/shared/ui/CodeInput.vue'
import { IPG_PAYMENT_TEXT, otpDigitLabel, otpHelp } from '../constants/ipgPayment'

/**
 * Código OTP de la app BDV: resumen de lo que se paga, casillas del código,
 * error y botón de verificar (habilitado con el código completo). Emite
 * `update:otp`, `verify` y `edit` (volver a los datos del pagador).
 */
export default defineComponent({
  name: 'IpgOtpVerification',
  components: { AppIcon, CodeInput },
  props: {
    otp: { type: String, required: true },
    length: { type: Number, required: true },
    /** Línea de resumen: «Pagas Bs. 500,00 · Visa · V-•••5678». */
    summary: { type: String, default: '' },
    complete: { type: Boolean, required: true },
    confirming: { type: Boolean, default: false },
    error: { type: String, default: '' },
  },
  emits: {
    'update:otp': (_value: string) => true,
    verify: () => true,
    edit: () => true,
  },
  data() {
    return { text: IPG_PAYMENT_TEXT, digitLabel: otpDigitLabel }
  },
  computed: {
    help(): string {
      return otpHelp(this.length)
    },
  },
  methods: {
    focus(): void {
      ;(this.$refs.code as { focus: () => void } | undefined)?.focus()
    },
  },
})
</script>

<template>
  <form class="otp" novalidate @submit.prevent="$emit('verify')">
    <p v-if="summary" class="otp__summary"><AppIcon name="tarjeta" :size="18" />{{ summary }}</p>

    <fieldset class="otp__code">
      <legend>{{ text.otpLegend }}</legend>
      <p id="otp-ayuda" class="otp__help">{{ help }}</p>
      <CodeInput
        ref="code"
        :model-value="otp"
        :length="length"
        :digit-label="digitLabel"
        :describedby="error ? 'otp-ayuda otp-error' : 'otp-ayuda'"
        :error="!!error"
        :disabled="confirming"
        @update:model-value="$emit('update:otp', $event)"
      />
      <p v-if="error" id="otp-error" class="otp__error" role="alert"><AppIcon name="alert" :size="18" />{{ error }}</p>
    </fieldset>

    <button type="submit" class="btn btn--primario otp__go" :disabled="!complete || confirming">
      {{ confirming ? text.verifying : text.verify }}
    </button>
    <button type="button" class="link-quiet otp__edit" @click="$emit('edit')">{{ text.editPayer }}</button>
  </form>
</template>

<style scoped>
.otp {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-xl, 20px);
  box-shadow: 0 12px 32px -8px rgba(18, 33, 66, 0.06), 0 1px 3px rgba(18, 33, 66, 0.04);
  padding: var(--space-6) var(--space-5);
  text-align: center;
}
@media (min-width: 440px) {
  .otp {
    padding: var(--space-8) var(--space-7);
  }
}
.otp__summary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md, 12px);
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #122142;
}
.otp__summary svg { flex: none; color: #0038A8; }
.otp__code { margin: var(--space-6) 0 0; padding: 0; border: 0; min-width: 0; }
.otp__code legend { padding: 0; margin: 0 auto; font: 600 19px/26px var(--font-display); color: #122142; letter-spacing: -0.01em; }
.otp__help { margin: var(--space-1) auto var(--space-4); max-width: 40ch; font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.otp__error {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 14px; font-weight: 500;
}
.otp__error svg { flex: none; }
.otp__go {
  width: 100%;
  min-height: 54px;
  margin-top: var(--space-6);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.22);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}
.otp__go:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 56, 168, 0.32);
}
.otp__edit {
  align-self: center; min-height: 44px; margin-top: var(--space-3); padding: 0 var(--space-2);
  border: 0; background: none; cursor: pointer; text-decoration: underline;
  font-size: 14px; font-weight: 500; color: #0038A8;
  transition: color 0.2s ease;
}
.otp__edit:hover {
  color: #122142;
}
@media (prefers-reduced-motion: reduce) {
  .otp__go:not(:disabled):hover {
    transform: none;
  }
}
</style>
