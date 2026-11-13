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
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  padding: var(--space-6); color: var(--marino-900);
}
</style>
