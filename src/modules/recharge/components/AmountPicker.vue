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
.ap__legend { padding: 0; margin-bottom: var(--space-3); font: 500 18px/26px var(--font-display); color: var(--marino-900); }
.ap__chips { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-2); }
@media (min-width: 520px) { .ap__chips { grid-template-columns: repeat(3, 1fr); } }
.ap__chips label {
  position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 56px; padding: 4px 12px; border: 1px solid var(--borde); border-radius: var(--radius-pill);
  background: var(--superficie); cursor: pointer; transition: border-color .2s, background-color .2s;
}
.ap__chips label:hover { border-color: var(--azul-700); }
.ap__chips label.on { background: var(--azul-100); border-color: var(--azul-700); }
.ap__chips label:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.ap__chips input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.ap__chips span { font: 500 15px/1.2 var(--font-body); color: var(--marino-900); }
.ap__chips .ap__amount { font: 500 16px/1.2 var(--font-mono); }
.ap__chips small { font: 500 11px/1.4 var(--font-mono); color: var(--texto-suave); }
.ap__chips label.on small { color: var(--marino-900); }

.ap__custom { margin-top: var(--space-4); display: grid; gap: var(--space-2); }
.ap__custom-label { font-size: 15px; font-weight: 500; color: var(--marino-900); }
.ap__field {
  display: flex; align-items: center; gap: var(--space-2); min-height: 56px; padding: 0 var(--space-4);
  border: 1px solid var(--borde); border-radius: var(--radius-sm); background: var(--superficie);
  transition: border-color .2s var(--ease-out), box-shadow .2s var(--ease-out);
}
.ap__field:focus-within { border-color: var(--accion); box-shadow: 0 0 0 4px var(--azul-100); }
.ap__field.is-error { border-color: var(--alerta); }
.ap__currency { font: 500 18px/1 var(--font-mono); color: var(--texto-suave); }
.ap__field input {
  flex: 1; min-width: 0; border: 0; padding: 0; background: transparent; outline: none;
  font: 500 20px/1 var(--font-mono); color: var(--marino-900);
}
.ap__hint { font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.ap__error {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 15px; font-weight: 500;
}
.ap__error svg { flex: none; }
</style>
