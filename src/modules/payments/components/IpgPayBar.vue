<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { IPG_PAYMENT_TEXT, ipgMissingHint } from '../constants/ipgPayment'
import type { IpgPayerField } from '../types/IpgPayer'

/**
 * Barra del Botón de Pago IPG: total, «Pagar» y, debajo, lo que falta por llenar
 * (o qué pasa al pagar). Flota al pie de la pantalla mientras su contenedor
 * está a la vista; conviene que sea su último hijo. Solo presenta: emite `submit`.
 */
export default defineComponent({
  name: 'IpgPayBar',
  props: {
    /** Total ya formateado, p. ej. «Bs. 500,00». */
    total: { type: String, required: true },
    payerValid: { type: Boolean, required: true },
    missing: { type: Array as PropType<IpgPayerField[]>, default: () => [] },
    requesting: { type: Boolean, default: false },
    /** Plegada abajo mientras el contexto no la necesita (p. ej. antes de llegar al formulario). */
    visible: { type: Boolean, default: true },
  },
  emits: {
    submit: () => true,
  },
  data() {
    return { text: IPG_PAYMENT_TEXT }
  },
  computed: {
    hint(): string {
      return this.missing.length ? ipgMissingHint(this.missing) : this.text.payHint
    },
  },
})
</script>

<template>
  <div class="cpb" :class="{ 'is-hidden': !visible }">
    <p id="pago-ipg-total" class="cpb__total">
      <span>{{ text.total }}</span>
      <strong>{{ total }}</strong>
    </p>
    <button
      type="button"
      class="btn btn--primario cpb__go"
      :disabled="!payerValid || requesting"
      aria-describedby="pago-ipg-total pago-ipg-ayuda"
      @click="$emit('submit')"
    >
      {{ requesting ? text.requesting : text.pay }}
    </button>
    <p id="pago-ipg-ayuda" class="cpb__hint" :class="{ 'is-todo': missing.length }">{{ hint }}</p>
  </div>
</template>

<style scoped>
.cpb {
  position: sticky;
  bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
  z-index: 4;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--space-1) var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-xl, 20px);
  box-shadow: 0 16px 40px -10px rgba(18, 33, 66, 0.14), 0 2px 8px rgba(18, 33, 66, 0.04);
  text-align: left;
  transition: transform .3s var(--ease-out), opacity .3s var(--ease-out), visibility 0s;
}
.cpb.is-hidden {
  transform: translateY(calc(100% + var(--space-4)));
  opacity: 0;
  visibility: hidden;
  transition: transform .3s var(--ease-out), opacity .3s var(--ease-out), visibility 0s .3s;
}
.cpb__total { display: grid; min-width: 0; }
.cpb__total span { font-size: 13px; line-height: 18px; color: var(--texto-suave); font-weight: 500; }
.cpb__total strong { font: 700 20px/1.2 var(--font-mono); color: #122142; white-space: nowrap; }
.cpb__go {
  min-height: 50px;
  padding-inline: var(--space-7);
  font-size: 16px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.22);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}
.cpb__go:not(:disabled)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: payBarShimmer 4s ease-in-out infinite 1.5s;
}
@keyframes payBarShimmer {
  0% { left: -100%; }
  30%, 100% { left: 200%; }
}

.cpb__go:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 56, 168, 0.32);
}
.cpb__hint { grid-column: 1 / -1; font-size: 13px; line-height: 18px; color: var(--texto-suave); }
.cpb__hint.is-todo { color: #122142; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  .cpb__go:not(:disabled):hover,
  .cpb__go:not(:disabled)::after {
    transform: none !important;
    animation: none !important;
  }
}
</style>
