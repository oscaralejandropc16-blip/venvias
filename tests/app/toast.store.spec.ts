import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useToastStore } from '@/app/stores/toast.store'

describe('toast store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('muestra y cierra solo al vencer la duración', () => {
    const store = useToastStore()
    store.success('Listo', { duration: 1000 })
    expect(store.toasts).toHaveLength(1)
    expect(store.toasts[0].tone).toBe('success')
    vi.advanceTimersByTime(1000)
    expect(store.toasts).toHaveLength(0)
  })

  it('un toast persistente se cierra a mano', () => {
    const store = useToastStore()
    const id = store.error('Falló', { duration: 0 })
    vi.advanceTimersByTime(60_000)
    expect(store.toasts).toHaveLength(1)
    store.dismiss(id)
    expect(store.toasts).toHaveLength(0)
  })
})
