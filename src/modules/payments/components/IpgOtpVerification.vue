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
.otp { display: flex; flex-direction: column; align-items: stretch; }
.otp__summary {
  display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 6px;
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); background: var(--azul-100);
  font-size: 15px; line-height: 22px; color: var(--marino-900);
}
.otp__summary svg { flex: none; color: var(--azul-700); }
.otp__code { margin: var(--space-6) 0 0; padding: 0; border: 0; min-width: 0; }
.otp__code legend { padding: 0; margin: 0 auto; font: 500 18px/26px var(--font-display); color: var(--marino-900); }
.otp__help { margin: var(--space-1) auto var(--space-4); max-width: 40ch; font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.otp__error {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 15px; font-weight: 500;
}
.otp__error svg { flex: none; }
.otp__go { width: 100%; min-height: 56px; margin-top: var(--space-6); font-size: 16px; }
.otp__edit {
  align-self: center; min-height: 44px; margin-top: var(--space-2); padding: 0 var(--space-2);
  border: 0; background: none; cursor: pointer; text-decoration: underline;
}
</style>
