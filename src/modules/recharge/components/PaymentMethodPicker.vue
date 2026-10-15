<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import ChoiceCards, { type ChoiceCardOption } from '@/shared/ui/ChoiceCards.vue'
import { RECHARGE_TEXT } from '../constants/recharge'
import type { PaymentMethodOption } from '../types/PaymentMethodOption'

/**
 * Métodos de pago como tarjetas de radio. Emite `select` con el id elegido.
 * `collapsed` lo pliega a una fila con el método elegido y «Cambiar», que emite `expand`.
 */
export default defineComponent({
  name: 'PaymentMethodPicker',
  components: { AppIcon, ChoiceCards },
  props: {
    methods: { type: Array as PropType<PaymentMethodOption[]>, required: true },
    modelValue: { type: String, required: true },
    collapsed: { type: Boolean, default: false },
  },
  emits: {
    select: (_id: string) => true,
    expand: () => true,
  },
  data() {
    return { text: RECHARGE_TEXT }
  },
  computed: {
    options(): ChoiceCardOption[] {
      return this.methods.map((m) => ({ value: m.id, title: m.name, description: m.description, icon: m.icon }))
    },
    selected(): PaymentMethodOption | null {
      return this.methods.find((m) => m.id === this.modelValue) ?? null
    },
  },
  methods: {
    /** Enfoca la opción elegida (o la primera); plegado, el botón «Cambiar». */
    focus(): void {
      const root = this.$el as HTMLElement | undefined
      const target =
        root?.querySelector<HTMLElement>('.pmc__change') ??
        root?.querySelector<HTMLInputElement>('input:checked') ??
        root?.querySelector<HTMLInputElement>('input')
      target?.focus()
    },
  },
})
</script>

<template>
  <div v-if="collapsed && selected" class="pmc">
    <p class="pmc__legend">{{ text.methodChosen }}</p>
    <div class="pmc__row">
      <AppIcon :name="selected.icon" class="pmc__icon" />
      <strong>{{ selected.name }}</strong>
      <button type="button" class="pmc__change" :aria-label="text.changeMethodLabel" @click="$emit('expand')">
        {{ text.changeMethod }}
      </button>
    </div>
  </div>
  <ChoiceCards
    v-else
    :options="options"
    :model-value="modelValue"
    name="metodo"
    :legend="text.methodLegend"
    @update:model-value="$emit('select', $event)"
  />
</template>

<style scoped>
.pmc__legend { margin-bottom: var(--space-2); font: 500 15px/22px var(--font-body); color: var(--marino-900); }
.pmc__row {
  display: flex; align-items: center; gap: var(--space-3); min-height: 56px; padding: var(--space-1) var(--space-2) var(--space-1) var(--space-4);
  border: 1px solid var(--azul-700); border-radius: var(--radius-sm); background: var(--azul-100);
}
.pmc__icon { flex: none; color: var(--azul-700); }
.pmc__row strong { flex: 1; min-width: 0; font-weight: 500; color: var(--marino-900); }
.pmc__change {
  flex: none; min-height: 44px; padding: 0 var(--space-2); border: 0; background: none; cursor: pointer;
  font-size: 15px; font-weight: 500; color: var(--azul-700); text-decoration: underline;
}
</style>
