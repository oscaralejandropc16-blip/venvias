<script lang="ts">
import { defineComponent } from 'vue'
import BaseToast from '@/shared/ui/BaseToast.vue'
import { useToastStore, type Toast } from '@/app/stores/toast.store'

export default defineComponent({
  name: 'AppToasts',
  components: { BaseToast },
  data() {
    return {
      toastStore: useToastStore(),
    }
  },
  computed: {
    toasts(): Toast[] {
      return this.toastStore.toasts
    },
  },
  methods: {
    onClose(id: number): void {
      this.toastStore.dismiss(id)
    },
  },
})
</script>

<template>
  <div
    class="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <BaseToast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :tone="toast.tone"
        @close="onClose(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
