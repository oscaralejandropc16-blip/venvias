import { describe, expect, it } from 'vitest'
import { usePlateEntry } from '@/modules/plates/composables/usePlateEntry'
import { PLATE_ERROR_MESSAGES, PLATE_FOREIGN_CHARS_HINT } from '@/modules/plates/constants/plateEntry.messages'

describe('usePlateEntry', () => {
  it('normaliza lo escrito y conserva la posición del cursor', () => {
    const entry = usePlateEntry()
    const change = entry.applyInput('ab-12', 3)
    expect(change).toEqual({ value: 'AB12', caret: 2 })
    expect(entry.plate.value).toBe('AB12')
  })

  it('avisa cuando se escriben caracteres que una placa no lleva', () => {
    const entry = usePlateEntry()
    entry.applyInput('AB*', 3)
    expect(entry.hint.value).toBe(PLATE_FOREIGN_CHARS_HINT)
  })

  it('no deja continuar con una placa incompleta', () => {
    const entry = usePlateEntry()
    entry.applyInput('AB1', 3)
    expect(entry.validate()).toBeNull()
    expect(entry.error.value).toBe(PLATE_ERROR_MESSAGES.short)
  })

  it('arma la solicitud de recarga con el monto elegido', () => {
    const entry = usePlateEntry()
    entry.applyInput('AB123CD', 7)
    entry.setAmount('monto-1')
    expect(entry.validate()).toEqual({ intent: 'recargar', plate: 'AB123CD', amountId: 'monto-1' })
  })

  it('la consulta de deuda no lleva monto y cambiar de modo limpia el error', () => {
    const entry = usePlateEntry()
    entry.validate()
    expect(entry.error.value).toBe(PLATE_ERROR_MESSAGES.empty)
    expect(entry.setIntent('deuda')).toBe(true)
    expect(entry.error.value).toBe('')
    expect(entry.setIntent('deuda')).toBe(false)
    entry.applyInput('AB123CD', 7)
    entry.setAmount('monto-1')
    expect(entry.validate()).toEqual({ intent: 'deuda', plate: 'AB123CD' })
  })

  it('suelta el monto si la placa vuelve a quedar incompleta', () => {
    const entry = usePlateEntry()
    entry.applyInput('AB123CD', 7)
    entry.setAmount('monto-2')
    entry.applyInput('AB123', 5)
    expect(entry.amountId.value).toBe('')
  })
})
