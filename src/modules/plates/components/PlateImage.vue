<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { plateImageLabel } from '../constants/plateEntry.messages'
import type { PlateChar } from '../types/Plate'
import { formatPlate, plateChars } from '../utils/plate'
import plateBg from '@/assets/plate-venezuela.svg'

/**
 * La placa venezolana de solo lectura: el mismo dibujo de `PlateField`, para
 * que la placa escrita acompañe al conductor en los pasos siguientes.
 */
export default defineComponent({
  name: 'PlateImage',
  props: {
    value: { type: String, required: true },
    size: { type: String as PropType<'xs' | 'sm' | 'md'>, default: 'md' },
  },
  data() {
    return {
      plateBg,
    }
  },
  computed: {
    chars(): PlateChar[] {
      return plateChars(this.value)
    },
    label(): string {
      return plateImageLabel(formatPlate(this.value))
    },
  },
})
</script>

<template>
  <div
    class="pi"
    :class="`pi--${size}`"
    :style="{ backgroundImage: `url(${plateBg})` }"
    role="img"
    :aria-label="label"
  >
    <span class="pi__chars" aria-hidden="true">
      <span v-for="c in chars" :key="c.key">{{ c.ch }}</span>
    </span>
  </div>
</template>

<style scoped>
/* Mismo dibujo y proporciones que PlateField: la matrícula escala con la placa */
.pi {
  position: relative; aspect-ratio: 404 / 204; container-type: inline-size;
  background: url('@/assets/plate-venezuela.svg') center / 100% 100% no-repeat;
  border-radius: 4% / 7.8%;
  box-shadow: var(--elev-2);
}
.pi--md { width: min(100%, 360px); }
.pi--sm { width: min(100%, 260px); }
.pi--xs { width: 112px; box-shadow: var(--elev-1); }
.pi__chars {
  position: absolute; inset: 33% 6% 28%; display: flex; align-items: center; justify-content: center;
  font: 500 15cqi/1 var(--font-mono); letter-spacing: .08em; color: var(--marino-900); white-space: nowrap;
}
</style>
