<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { RECHARGE_STEPS, RECHARGE_TEXT } from '../constants/recharge'
import type { RechargeStep } from '../types/RechargeStep'

/** Avance de la recarga: paso actual y completados en azul con check; pendientes en gris. */
export default defineComponent({
  name: 'RechargeProgress',
  components: { AppIcon },
  props: {
    step: { type: String as PropType<RechargeStep>, required: true },
  },
  data() {
    return { steps: RECHARGE_STEPS, text: RECHARGE_TEXT }
  },
  computed: {
    current(): number {
      return this.steps.findIndex((s) => s.id === this.step)
    },
  },
})
</script>

<template>
  <ol class="rp" :aria-label="text.progressLabel">
    <li
      v-for="(s, i) in steps"
      :key="s.id"
      class="rp__step"
      :class="{ 'is-current': i === current, 'is-done': i < current }"
      :aria-current="i === current ? 'step' : undefined"
    >
      <span class="rp__dot" aria-hidden="true">
        <AppIcon v-if="i < current" name="check" :size="16" />
        <template v-else>{{ i + 1 }}</template>
      </span>
      <span class="rp__label">
        {{ s.label }}<span v-if="i < current" class="visually-hidden"> ({{ text.stepDone }})</span>
      </span>
    </li>
  </ol>
</template>

<style scoped>
.rp { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); }
.rp__step { position: relative; display: flex; flex-direction: column; align-items: center; gap: var(--space-2); text-align: center; }
/* Tramo que llega a cada paso: azul si ese paso ya está en curso o hecho */
.rp__step + .rp__step::before {
  content: ''; position: absolute; top: 16px; right: 50%; left: -50%; height: 2px;
  background: var(--borde); transition: background-color .3s var(--ease-out);
}
.rp__step.is-current::before, .rp__step.is-done::before { background: #0038A8; }
.rp__dot {
  position: relative; z-index: 1; display: grid; place-items: center; width: 34px; height: 34px;
  border: 2px solid var(--borde); border-radius: 50%; background: #ffffff;
  font: 600 14px/1 var(--font-mono); color: var(--texto-suave);
  transition: all .3s var(--ease-out);
}
.is-done .rp__dot { background: #0038A8; border-color: #0038A8; color: #fff; }
.is-current .rp__dot {
  background: #0038A8;
  border-color: #0038A8;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(0, 56, 168, 0.2);
  animation: rpPulse 2s infinite ease-in-out;
}
.rp__label { font-size: 13px; line-height: 18px; font-weight: 500; color: var(--texto-suave); }
.is-current .rp__label { color: #122142; font-weight: 600; }
@media (min-width: 768px) { .rp__label { font-size: 14px; } }

@keyframes rpPulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(0, 56, 168, 0.2);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(0, 56, 168, 0.06);
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-current .rp__dot {
    animation: none;
  }
}
</style>
