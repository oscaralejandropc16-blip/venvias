<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { SAMPLE_PLATE } from '../constants/plateEntry.messages'
import { formatPlate } from '../utils/plate'

export default defineComponent({
  name: 'PlatePreview',
  props: {
    value: { type: String, default: SAMPLE_PLATE },
    size: { type: String as PropType<'sm' | 'md'>, default: 'md' },
  },
  computed: {
    text(): string {
      return formatPlate(this.value)
    },
  },
})
</script>

<template>
  <div class="pp" :class="`pp--${size}`">
    <span class="pp__bolt" /><span class="pp__bolt" /><span class="pp__bolt" /><span class="pp__bolt" />
    <span class="pp__country">Venezuela</span>
    <span class="pp__value">{{ text }}</span>
  </div>
</template>

<style scoped>
.pp {
  position: relative; display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  aspect-ratio: 2 / 1; background: #fff; container-type: inline-size;
  border: 2px solid var(--marino-900); border-radius: var(--radius-placa);
}
.pp--sm { width: 168px; }
.pp--md { width: min(100%, 340px); border-width: 3px; }
.pp__country { font: 500 clamp(9px, 4.4cqi, 14px)/1 var(--font-body); letter-spacing: .14em; text-transform: uppercase; color: var(--azul-700); }
.pp__bolt { position: absolute; width: 4.5cqi; height: 4.5cqi; border-radius: 50%; background: var(--fondo-frio); border: 1.5px solid #9aa6c2; }
.pp__bolt:nth-of-type(1) { left: 4.5%; top: 9%; } .pp__bolt:nth-of-type(2) { right: 4.5%; top: 9%; }
.pp__bolt:nth-of-type(3) { left: 4.5%; bottom: 9%; } .pp__bolt:nth-of-type(4) { right: 4.5%; bottom: 9%; }
/* La matrícula escala con la placa, no con la pantalla */
.pp__value { font: 500 13cqi/1 var(--font-mono); letter-spacing: .08em; color: var(--marino-900); white-space: nowrap; }
</style>
