<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { IconName } from '@/shared/icons/iconPaths'

/**
 * Estado vacío de la marca: tarjeta con icono, titular y una acción opcional.
 * Solo presentación: el contenido llega por props y la acción por el slot `action`.
 */
export default defineComponent({
  name: 'EmptyState',
  components: { AppIcon },
  props: {
    icon: { type: String as PropType<IconName>, default: 'info' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
})
</script>

<template>
  <div class="empty">
    <AppIcon :name="icon" :size="32" />
    <p class="text-[15px] text-texto-suave">
      <strong class="row-title block">{{ title }}</strong>{{ description }}
    </p>
    <slot name="action" />
  </div>
</template>

<style scoped>
.empty {
  display: grid; gap: var(--space-4); justify-items: start;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 1.25rem;
  padding: clamp(24px, 4vw, 36px);
  color: var(--marino-900);
  box-shadow: 0 10px 25px -5px rgba(18, 33, 66, 0.06), 0 8px 10px -6px rgba(18, 33, 66, 0.04);
}
</style>
