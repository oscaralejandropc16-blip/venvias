<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Página de un paso que todavía no se diseña: titular, contenido opcional (slot),
 * nota de lo que sigue y un enlace de regreso. Solo presentación.
 */
export default defineComponent({
  name: 'PageStub',
  props: {
    title: { type: String, required: true },
    next: { type: String, required: true },
    backTo: { type: [String, Object] as PropType<RouteLocationRaw>, required: true },
    backLabel: { type: String, required: true },
  },
})
</script>

<template>
  <section class="stub wrap">
    <div class="stub__card">
      <div class="stub__tricolor" aria-hidden="true"></div>
      <h1 class="stub__title">{{ title }}</h1>
      <slot />
      <p class="stub__next">{{ next }}</p>
      <RouterLink :to="backTo" class="btn btn--primario stub__btn">{{ backLabel }}</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.stub {
  display: grid;
  place-items: center;
  padding-block: var(--space-12);
  min-height: 60vh;
}

.stub__card {
  position: relative;
  width: 100%;
  max-width: 580px;
  background: #ffffff;
  border-radius: var(--radius-2xl, 24px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 20px 45px -12px rgba(18, 33, 66, 0.08);
  padding: var(--space-10) var(--space-8);
  display: grid;
  gap: var(--space-5);
  justify-items: center;
  text-align: center;
  overflow: hidden;
  animation: stubFadeIn 0.35s var(--ease-out);
}

.stub__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
}

.stub__title {
  font: 700 clamp(26px, 2.5vw + 16px, 36px)/1.2 var(--font-display);
  color: #122142;
  letter-spacing: -0.02em;
  margin: 0;
}

.stub__next {
  max-width: 44ch;
  font-size: 15px;
  line-height: 22px;
  color: var(--texto-suave);
  margin: 0;
}

.stub__btn {
  min-height: 48px;
  padding-inline: var(--space-6);
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.2);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.stub__btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 56, 168, 0.3);
}

@keyframes stubFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stub__card {
    animation: none;
  }
  .stub__btn:hover {
    transform: none;
  }
}
</style>
