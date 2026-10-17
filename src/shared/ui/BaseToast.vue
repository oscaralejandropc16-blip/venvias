<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { IconName } from '@/shared/icons/iconPaths'
import type { ToastTone } from '@/app/stores/toast.store'

// Importado de toll-management-ui con la paleta de VenVías: el rojo de sistema es el único
// rojo, el éxito usa el azul de marca (el verde del lazo no entra en piezas de VenVías).
const TONE_ICONS: Record<ToastTone, IconName> = {
  success: 'check',
  error: 'alert',
  warning: 'alert',
  info: 'info',
}

const TONE_CLASSES: Record<ToastTone, string> = {
  success: 'border-azul-700 text-marino-900',
  error: 'border-alerta text-marino-900',
  warning: 'border-amarillo-carretera text-marino-900',
  info: 'border-borde text-marino-900',
}

const ICON_COLOR: Record<ToastTone, string> = {
  success: 'text-azul-700',
  error: 'text-alerta',
  warning: 'text-marino-900',
  info: 'text-azul-700',
}

export default defineComponent({
  name: 'BaseToast',
  components: { AppIcon },
  props: {
    message: { type: String, required: true },
    tone: { type: String as PropType<ToastTone>, default: 'info' },
  },
  emits: {
    close: () => true,
  },
  computed: {
    icon(): IconName {
      return TONE_ICONS[this.tone]
    },
    containerClass(): string {
      return TONE_CLASSES[this.tone]
    },
    iconClass(): string {
      return ICON_COLOR[this.tone]
    },
    role(): string {
      return this.tone === 'error' || this.tone === 'warning' ? 'alert' : 'status'
    },
  },
})
</script>

<template>
  <div
    :role="role"
    :class="[
      'pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-solid border-l-4 bg-white/95 backdrop-blur-md px-4 py-3.5 shadow-2xl transition-all duration-200',
      containerClass,
    ]"
  >
    <AppIcon :name="icon" :size="20" :class="['mt-0.5 flex-none', iconClass]" />
    <p class="flex-1 text-[15px] font-medium leading-[22px] text-[#122142]">{{ message }}</p>
    <button
      type="button"
      class="-mr-1 flex-none cursor-pointer rounded-full border-0 bg-transparent p-1.5 text-texto-suave hover:bg-slate-100 hover:text-[#122142] transition-colors"
      aria-label="Cerrar"
      @click="$emit('close')"
    >
      <AppIcon name="close" :size="16" />
    </button>
  </div>
</template>
