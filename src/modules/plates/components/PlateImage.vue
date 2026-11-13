<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { plateImageLabel } from '../constants/plateEntry.messages'
import { formatPlate } from '../utils/plate'

const GHOST_SLOTS = ['A', 'B', '1', '2', '3', 'C', 'D'] as const

interface PlateSlotDisplay {
  index: number
  char: string
  isFilled: boolean
  isGroupEnd: boolean
}

/**
 * La placa venezolana de solo lectura: el mismo dibujo y proporciones de 7 casillas
 * que `PlateField`, unificado al tamaño estándar (max-width: 420px).
 */
export default defineComponent({
  name: 'PlateImage',
  props: {
    value: { type: String, required: true },
    size: { type: String as PropType<'xs' | 'sm' | 'md'>, default: 'md' },
  },
  computed: {
    label(): string {
      return plateImageLabel(formatPlate(this.value))
    },
    slots(): PlateSlotDisplay[] {
      const val = this.value
      const len = val.length

      return GHOST_SLOTS.map((_, index) => {
        const isFilled = index < len
        const char = isFilled ? val[index] : ''
        return {
          index,
          char,
          isFilled,
          isGroupEnd: index === 1 || index === 4,
        }
      })
    },
  },
})
</script>

<template>
  <div class="pi" :class="`pi--${size}`" role="img" :aria-label="label">
    <div class="pi__chars" aria-hidden="true">
      <span
        v-for="s in slots"
        :key="s.index"
        class="pi__slot"
        :class="{ 'is-filled': s.isFilled, 'is-group-end': s.isGroupEnd }"
      >
        {{ s.char }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Mismo dibujo y proporciones que PlateField: tamaño unificado estándar (max-width: 420px) */
.pi {
  position: relative;
  aspect-ratio: 404 / 204;
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  container-type: inline-size;
  background: url('@/assets/plate-venezuela.svg') center / 100% 100% no-repeat;
  border-radius: 4% / 7.8%;
  box-shadow: var(--elev-1);
}

.pi--md {
  max-width: 420px;
}

.pi--sm {
  max-width: 280px;
}

.pi--xs {
  max-width: 130px;
  box-shadow: var(--elev-1);
}

.pi__chars {
  position: absolute;
  inset: 32% 5% 26%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(3px, 1.2cqi, 6px);
}

.pi__slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(26px, 10.5cqi, 44px);
  height: clamp(36px, 14cqi, 60px);
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(18, 33, 66, 0.32);
  border-radius: 4px;
  font: 600 clamp(22px, 9cqi, 38px) / 1 var(--font-mono);
  color: var(--marino-900);
}

.pi__slot.is-group-end {
  margin-right: clamp(6px, 2.5cqi, 12px);
}

.pi__slot:not(.is-filled) {
  background: rgba(255, 255, 255, 0.45);
  border-color: rgba(18, 33, 66, 0.12);
}
</style>
