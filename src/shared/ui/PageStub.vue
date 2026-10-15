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
    <h1>{{ title }}</h1>
    <slot />
    <p class="stub__next">{{ next }}</p>
    <RouterLink :to="backTo" class="btn btn--secundario">{{ backLabel }}</RouterLink>
  </section>
</template>

<style scoped>
.stub { display: grid; gap: var(--space-6); justify-items: center; text-align: center; padding-block: var(--space-14); min-height: 60vh; align-content: start; }
.stub h1 { font-size: clamp(30px, 2vw + 20px, 44px); line-height: 1.15; font-weight: 600; }
.stub__next { max-width: 48ch; color: var(--texto-suave); }
</style>
