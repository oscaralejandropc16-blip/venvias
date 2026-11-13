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
.seg { border: 0; margin: 0; padding: 0; min-width: 0; }
.seg__legend { padding: 0; margin-bottom: var(--space-2); font-size: 15px; font-weight: 500; color: var(--marino-900); }
.seg__track {
  position: relative; display: grid; padding: 4px;
  background: var(--azul-100); border-radius: var(--radius-pill);
}
.seg__track label {
  position: relative; z-index: 1; display: grid; place-items: center; min-height: 44px;
  border-radius: var(--radius-pill); font-weight: 500; font-size: 15px; color: var(--marino-900);
  cursor: pointer; transition: color .3s var(--ease-out);
}
.seg__track label.on { color: #fff; }
.seg__track input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
.seg__track label:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.seg__thumb {
  position: absolute; top: 4px; bottom: 4px; left: 4px;
  background: var(--azul-700); border-radius: var(--radius-pill);
  transition: transform .45s var(--ease-out);
}
</style>
