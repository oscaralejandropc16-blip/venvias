import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastTone = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  tone: ToastTone
  duration: number
}

export interface ShowToastOptions {
  tone?: ToastTone
  /** Duración en ms antes de auto-cerrar. 0 = persistente. */
  duration?: number
}

const DEFAULT_DURATION = 5000
const ERROR_DURATION = 6000

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 1
  const timers = new Map<number, ReturnType<typeof setTimeout>>()

  function dismiss(id: number) {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function show(message: string, options: ShowToastOptions = {}): number {
    const id = nextId++
    const toast: Toast = {
      id,
      message,
      tone: options.tone ?? 'info',
      duration: options.duration ?? DEFAULT_DURATION,
    }
    toasts.value.push(toast)
    if (toast.duration > 0) {
      timers.set(
        id,
        setTimeout(() => dismiss(id), toast.duration),
      )
    }
    return id
  }

  function success(message: string, options?: Omit<ShowToastOptions, 'tone'>) {
    return show(message, { ...options, tone: 'success' })
  }

  function error(message: string, options?: Omit<ShowToastOptions, 'tone'>) {
    return show(message, { tone: 'error', duration: ERROR_DURATION, ...options })
  }

  function warning(message: string, options?: Omit<ShowToastOptions, 'tone'>) {
    return show(message, { ...options, tone: 'warning' })
  }

  function info(message: string, options?: Omit<ShowToastOptions, 'tone'>) {
    return show(message, { ...options, tone: 'info' })
  }

  return { toasts, show, success, error, warning, info, dismiss }
})
