<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { ICON_PATHS, type IconName } from './iconPaths'

export default defineComponent({
  name: 'AppIcon',
  props: {
    name: { type: String as PropType<IconName>, required: true },
    size: { type: Number, default: 24 },
  },
  computed: {
    path(): string {
      return ICON_PATHS[this.name]
    },
  },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="path" />
  </svg>
</template>
