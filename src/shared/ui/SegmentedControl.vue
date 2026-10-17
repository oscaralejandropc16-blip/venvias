<script lang="ts">
import { defineComponent, type PropType } from 'vue'

export interface SegmentedOption {
  value: string
  label: string
}

/**
 * Conmutador en píldora sobre radios nativos: el pulgar azul se desliza a la
 * opción elegida. Solo presentación: emite `update:modelValue` con el valor.
 */
export default defineComponent({
  name: 'SegmentedControl',
  props: {
    options: { type: Array as PropType<SegmentedOption[]>, required: true },
    modelValue: { type: String, required: true },
    /** `name` del grupo de radios; único por formulario. */
    name: { type: String, required: true },
    legend: { type: String, required: true },
    /** Oculta la leyenda a la vista (sigue para lectores de pantalla). */
    legendHidden: { type: Boolean, default: false },
  },
  emits: {
    'update:modelValue': (_value: string) => true,
  },
  computed: {
    selectedIndex(): number {
      return this.options.findIndex((o) => o.value === this.modelValue)
    },
    thumbStyle(): Record<string, string> {
      const count = Math.max(this.options.length, 1)
      return {
        width: `calc((100% - 8px) / ${count})`,
        transform: `translateX(${Math.max(this.selectedIndex, 0) * 100}%)`,
      }
    },
  },
})
</script>

<template>
  <fieldset class="seg">
    <legend :class="legendHidden ? 'visually-hidden' : 'seg__legend'">{{ legend }}</legend>
    <div class="seg__track" :style="{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }">
      <label v-for="opt in options" :key="opt.value" :class="{ on: modelValue === opt.value }">
        <input
          type="radio"
          :name="name"
          :value="opt.value"
          :checked="modelValue === opt.value"
          @change="$emit('update:modelValue', opt.value)"
        />
        {{ opt.label }}
      </label>
      <span v-if="selectedIndex >= 0" class="seg__thumb" :style="thumbStyle" aria-hidden="true"></span>
    </div>
  </fieldset>
</template>

<style scoped>
.seg {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}
.seg__legend {
  padding: 0;
  margin-bottom: var(--space-2);
  font-size: 15px;
  font-weight: 600;
  color: #122142;
}
.seg__track {
  position: relative;
  display: grid;
  padding: 5px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-pill);
  box-shadow: inset 0 2px 4px rgba(18, 33, 66, 0.04);
}
.seg__track label {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 44px;
  border-radius: var(--radius-pill);
  font-weight: 600;
  font-size: 15px;
  color: #64748b;
  cursor: pointer;
  transition: color 0.25s var(--ease-out);
  user-select: none;
}
.seg__track label:hover:not(.on) {
  color: #122142;
}
.seg__track label.on {
  color: #ffffff;
}
.seg__track input {
  position: absolute;
  opacity: 0;
  inset: 0;
  margin: 0;
  cursor: pointer;
}
.seg__track label:has(input:focus-visible) {
  outline: 3px solid #0038A8;
  outline-offset: 2px;
}
.seg__thumb {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  background: linear-gradient(135deg, #0038A8 0%, #002b80 100%);
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.3), 0 1px 3px rgba(0, 56, 168, 0.2);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .seg__track label,
  .seg__thumb {
    transition: none !important;
  }
}
</style>
