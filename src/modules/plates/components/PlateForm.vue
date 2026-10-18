<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { useHeroStore } from '@/app/stores/hero.store'
import { PLATE_FORM_ANCHOR } from '@/core/constants/routing'
import type { RechargeAmountOption } from '@/modules/recharge/types/RechargeAmountOption'
import { usePlateEntry } from '../composables/usePlateEntry'
import PlateField from './PlateField.vue'
import {
  PLATE_INTENT_OPTIONS,
  PLATE_PROMPTS,
  PLATE_SUBMIT_LABELS,
  plateReadyLabel,
} from '../constants/plateEntry.messages'
import type { PlateIntent, PlateSubmission } from '../types/Plate'
import { formatPlate } from '../utils/plate'

/**
 * La placa es el formulario. Pinta la placa venezolana, el conmutador
 * recargar / pagar deuda y los montos; emite `submit` con la solicitud
 * validada y la vista decide a dónde navegar.
 */
export default defineComponent({
  name: 'PlateForm',
  components: { AppIcon, PlateField },
  props: {
    amountOptions: { type: Array as PropType<RechargeAmountOption[]>, default: () => [] },
  },
  emits: {
    submit: (_payload: PlateSubmission) => true,
  },
  setup() {
    return { ...usePlateEntry() }
  },
  data() {
    return {
      hero: useHeroStore(),
      anchorId: PLATE_FORM_ANCHOR,
      intentOptions: PLATE_INTENT_OPTIONS,
      swinging: false,
      observer: null as IntersectionObserver | null,
    }
  },
  computed: {
    footText(): string {
      return this.isValid ? plateReadyLabel(formatPlate(this.plate)) : PLATE_PROMPTS[this.intent]
    },
    submitLabel(): string {
      return PLATE_SUBMIT_LABELS[this.intent]
    },
    showAmounts(): boolean {
      return this.intent === 'recargar' && this.isValid
    },
  },
  watch: {
    async isValid(ok: boolean) {
      if (!ok) return
      // En dispositivos móviles, si los montos empujan el botón fuera de pantalla, lo traemos suavemente.
      await this.$nextTick()
      const btn = this.$refs.goButton as HTMLButtonElement | undefined
      if (btn && window.innerWidth < 768 && btn.getBoundingClientRect().bottom > window.innerHeight) {
        const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        btn.scrollIntoView({ block: 'nearest', behavior: smooth ? 'smooth' : 'auto' })
      }
    },
  },
  mounted() {
    this.observer = new IntersectionObserver(
      ([entry]) => this.hero.setPlateInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    this.observer.observe(this.$refs.root as HTMLElement)
  },
  beforeUnmount() {
    this.observer?.disconnect()
    this.hero.setPlateInView(null)
  },
  methods: {
    focusPlate(): void {
      const field = this.$refs.field as { focus: () => void } | undefined
      field?.focus()
    },
    onTyped(raw: string): void {
      this.applyInput(raw, raw.length)
    },
    onIntentChange(next: PlateIntent): void {
      if (!this.setIntent(next)) return
      this.swinging = false
      // Reinicia la animación aunque se cambie de modo dos veces seguidas.
      requestAnimationFrame(() => {
        this.swinging = true
      })
    },
    onSubmit(): void {
      const submission = this.validate()
      if (!submission) {
        this.focusPlate()
        return
      }
      this.$emit('submit', submission)
    },
  },
})
</script>

<template>
  <form :id="anchorId" ref="root" class="pf" novalidate @submit.prevent="onSubmit">
    <fieldset class="pf__modo">
      <legend class="visually-hidden">¿Qué quieres hacer?</legend>
      <label v-for="opt in intentOptions" :key="opt.value" :class="{ on: intent === opt.value }">
        <input
          type="radio"
          name="modo"
          :value="opt.value"
          :checked="intent === opt.value"
          @change="onIntentChange(opt.value)"
        />
        {{ opt.label }}
      </label>
      <span class="pf__modo-thumb" :class="{ right: intent === 'deuda' }" aria-hidden="true"></span>
    </fieldset>

    <PlateField
      ref="field"
      :model-value="plate"
      :foot-text="footText"
      :hint="hint"
      :error="error"
      :is-valid="isValid"
      :swinging="swinging"
      @typed="onTyped"
      @swing-end="swinging = false"
    />

    <Transition name="montos">
      <fieldset v-if="showAmounts" class="pf__montos">
        <legend>¿Cuánto quieres recargar?</legend>
        <div class="pf__chips">
          <label v-for="a in amountOptions" :key="a.id" :class="{ on: amountId === a.id }">
            <input type="radio" name="monto" :value="a.id" :checked="amountId === a.id" @change="setAmount(a.id)" />
            <span :class="{ 'pf__chip-amount': a.amount !== null }">{{ a.label }}</span>
            <small v-if="a.detail">{{ a.detail }}</small>
          </label>
        </div>
      </fieldset>
    </Transition>

    <button ref="goButton" type="submit" class="btn btn--primario pf__go">
      {{ submitLabel }}
      <AppIcon name="arrow" :size="20" />
    </button>
    <p class="pf__nota">Sin registro. Antes de pagar, confirmas la placa y el monto.</p>
  </form>
</template>

<style scoped>
.pf { width: min(100%, 520px); margin-inline: auto; display: flex; flex-direction: column; }

/* Conmutador de modo */
.pf__modo {
  position: relative; display: grid; grid-template-columns: 1fr 1fr;
  margin: 0 0 var(--space-4); padding: 4px; border: 0;
  background: var(--azul-100); border-radius: var(--radius-pill);
}
.pf__modo label {
  position: relative; z-index: 1; display: grid; place-items: center; min-height: 44px;
  border-radius: var(--radius-pill); font-weight: 500; font-size: 15px; color: var(--marino-900);
  cursor: pointer; transition: color .3s var(--ease-out);
}
.pf__modo label.on { color: #fff; }
.pf__modo input { position: absolute; opacity: 0; inset: 0; cursor: pointer; }
.pf__modo label:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.pf__modo-thumb {
  position: absolute; top: 4px; bottom: 4px; left: 4px; width: calc(50% - 4px);
  background: var(--azul-700); border-radius: var(--radius-pill);
  transition: transform .45s var(--ease-out);
}
.pf__modo-thumb.right { transform: translateX(100%); }

/* Montos: aparecen cuando la placa es válida */
.pf__montos { border: 0; margin: var(--space-3) 0 0; padding: 0; }
.pf__montos legend { padding: 0; margin-bottom: var(--space-2); font-size: 14px; font-weight: 500; color: var(--marino-900); }
.pf__chips { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
.pf__chips label {
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 50px; padding: 4px; border: 1px solid var(--borde); border-radius: var(--radius-pill);
  cursor: pointer; transition: border-color .2s, background-color .2s;
}
.pf__chips label:hover { border-color: var(--azul-700); }
.pf__chips label.on { background: var(--azul-100); border-color: var(--azul-700); }
.pf__chips label:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.pf__chips input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.pf__chips span { font: 500 15px/1.2 var(--font-body); color: var(--marino-900); }
.pf__chips .pf__chip-amount { font: 500 15px/1.2 var(--font-mono); }
.pf__chips small { font: 500 11px/1.4 var(--font-mono); color: var(--texto-suave); }
.pf__chips label.on small { color: var(--marino-900); }
.montos-enter-active { transition: opacity .35s var(--ease-out), transform .35s var(--ease-out); }
.montos-enter-from { opacity: 0; transform: translateY(-8px); }

.pf__go { width: 100%; min-height: 56px; margin-top: var(--space-3); font-size: 16px; }
.pf__nota { margin-top: var(--space-3); text-align: center; font-size: 14px; line-height: 20px; color: var(--texto-suave); }

@media (min-width: 768px) {
  .pf__modo { width: 380px; align-self: center; margin-bottom: var(--space-6); }
  .pf__go { margin-top: var(--space-6); }
}
</style>
