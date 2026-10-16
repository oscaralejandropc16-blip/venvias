<script lang="ts">
import { defineComponent } from 'vue'

// La carretera de VenVías: cinta amarilla en perspectiva, con rayas blancas de eje,
// que converge en punta hacia la izquierda y se abre hacia la derecha, como en el logo.
export default defineComponent({
  name: 'RoadRibbon',
  props: {
    vertical: { type: Boolean, default: false },
  },
})
</script>

<template>
  <svg v-if="!vertical" class="road" viewBox="0 0 1440 170" preserveAspectRatio="none" aria-hidden="true">
    <path d="M0 96 C 380 92 860 58 1440 8 L1440 170 C 900 150 420 112 0 102 Z" fill="var(--amarillo-carretera)" />
    <path class="road__lane" d="M60 99 C 460 100 900 92 1440 70" />
    <path class="road__lane" d="M60 100.5 C 460 106 900 122 1440 118" />
  </svg>
  <svg v-else class="road road--v" viewBox="0 0 120 900" preserveAspectRatio="none" aria-hidden="true">
    <path d="M58 0 C 54 300 30 600 0 900 L120 900 C 96 600 66 300 62 0 Z" fill="var(--amarillo-carretera)" />
    <path class="road__lane" d="M60 30 C 58 320 46 620 40 900" />
    <path class="road__lane" d="M60 30 C 62 320 74 620 80 900" />
  </svg>
</template>

<style scoped>
.road { width: 100%; height: 100%; display: block; }
.road__lane {
  fill: none;
  stroke: #fff;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 26 22;
  vector-effect: non-scaling-stroke;
  animation: roadFlow 1.4s linear infinite;
}
@keyframes roadFlow {
  to {
    stroke-dashoffset: -48;
  }
}
@media (prefers-reduced-motion: reduce) {
  .road__lane {
    animation: none;
  }
}
</style>
