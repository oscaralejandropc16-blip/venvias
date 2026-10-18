<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { RECHARGE_TEXT } from '../constants/recharge'
import type { RechargeAmountOption } from '../types/RechargeAmountOption'

/** Montos en píldoras y, en «Otro monto», un campo para escribirlo. Emite `select` y `custom`. */
export default defineComponent({
  name: 'AmountPicker',
  components: { AppIcon },
  props: {
    options: { type: Array as PropType<RechargeAmountOption[]>, required: true },
    modelValue: { type: String, required: true },
    customAmount: { type: String, required: true },
    currency: { type: String, required: true },
    customHint: { type: String, default: '' },
    error: { type: String, default: '' },
  },
  emits: {
    select: (_id: string) => true,
    custom: (_text: string) => true,
  },
  data() {
    return { text: RECHARGE_TEXT }
  },
  computed: {
    customSelected(): boolean {
      return this.options.some((o) => o.custom && o.id === this.modelValue)
    },
  },
  methods: {
    focusCustom(): void {
      this.$nextTick(() => (this.$refs.custom as HTMLInputElement | undefined)?.focus())
    },
    onSelect(option: RechargeAmountOption): void {
      this.$emit('select', option.id)
      if (option.custom) this.focusCustom()
    },
  },
})
</script>

<template>
  <fieldset class="ap">
    <legend class="ap__legend">{{ text.amountLegend }}</legend>
    <div class="ap__chips">
      <label v-for="o in options" :key="o.id" :class="{ on: modelValue === o.id }">
        <input type="radio" name="monto" :value="o.id" :checked="modelValue === o.id" @change="onSelect(o)" />
        <span :class="{ 'ap__amount': o.amount !== null }">{{ o.label }}</span>
        <small v-if="o.detail">{{ o.detail }}</small>
      </label>
    </div>

    <div v-if="customSelected" class="ap__custom">
      <label for="monto-otro" class="ap__custom-label">{{ text.customAmountLabel }}</label>
      <div class="ap__field" :class="{ 'is-error': error }">
        <span class="ap__currency" aria-hidden="true">{{ currency }}</span>
        <input
          id="monto-otro"
          ref="custom"
          :value="customAmount"
          type="text"
          inputmode="decimal"
          autocomplete="off"
          :placeholder="text.customAmountPlaceholder"
          :aria-invalid="error ? 'true' : 'false'"
          aria-describedby="monto-ayuda monto-error"
          @input="$emit('custom', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <p id="monto-ayuda" class="ap__hint">{{ customHint }}</p>
    </div>

    <p v-if="error" id="monto-error" class="ap__error" role="alert"><AppIcon name="alert" :size="18" />{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.ap { border: 0; margin: 0; padding: 0; min-width: 0; }
.ap__legend { padding: 0; margin-bottom: var(--space-3); font: 600 17px/24px var(--font-display); color: #122142; letter-spacing: -0.01em; }
.ap__chips { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
@media (min-width: 520px) { .ap__chips { grid-template-columns: repeat(3, 1fr); gap: var(--space-3); } }
.ap__chips label {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  padding: 6px 14px;
  border: 1.5px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-md, 12px);
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}
.ap__chips label:hover {
  border-color: #0038A8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -2px rgba(0, 56, 168, 0.12);
}
.ap__chips label.on {
  background: #EFF6FF;
  border-color: #0038A8;
  box-shadow: 0 0 0 1px #0038A8, 0 4px 14px -2px rgba(0, 56, 168, 0.15);
}
.ap__chips label:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.ap__chips input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.ap__chips span { font: 600 15px/1.2 var(--font-body); color: #122142; }
.ap__chips .ap__amount { font: 700 16px/1.2 var(--font-mono); }
.ap__chips small { font: 600 11px/1.4 var(--font-mono); color: var(--texto-suave); }
.ap__chips label.on small { color: #0038A8; }

.ap__chips label:active {
  transform: scale(0.97);
}

.ap__custom {
  margin-top: var(--space-4);
  display: grid;
  gap: var(--space-2);
  animation: apCustomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes apCustomIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.ap__custom-label { font-size: 14px; font-weight: 600; color: #122142; }
.ap__field {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 56px;
  padding: 0 var(--space-4);
  border: 1.5px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-md, 12px);
  background: #ffffff;
  transition: border-color .2s var(--ease-out), box-shadow .2s var(--ease-out);
}
.ap__field:focus-within { border-color: #0038A8; box-shadow: 0 0 0 4px rgba(0, 56, 168, 0.12); }
.ap__field.is-error { border-color: var(--alerta); }
.ap__currency { font: 600 17px/1 var(--font-mono); color: var(--texto-suave); }
.ap__field input {
  flex: 1; min-width: 0; border: 0; padding: 0; background: transparent; outline: none;
  font: 700 20px/1 var(--font-mono); color: #122142;
}
.ap__hint { font-size: 13px; line-height: 18px; color: var(--texto-suave); }
.ap__error {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 14px; font-weight: 500;
}
.ap__error svg { flex: none; }

@media (prefers-reduced-motion: reduce) {
  .ap__chips label:hover,
  .ap__chips label:active,
  .ap__custom {
    transform: none !important;
    animation: none !important;
  }
}
</style>
