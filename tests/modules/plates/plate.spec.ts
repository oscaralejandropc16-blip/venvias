import { describe, expect, it } from 'vitest'
import {
  formatPlate,
  hasForeignChars,
  normalizePlate,
  plateChars,
  plateStatus,
} from '@/modules/plates/utils/plate'

describe('plate utils', () => {
  it('normaliza a mayúsculas, quita separadores y corta en 7', () => {
    expect(normalizePlate('ab-123 cd')).toBe('AB123CD')
    expect(normalizePlate('ab123cdxyz')).toBe('AB123CD')
  })

  it('formatea la placa sin agrupar', () => {
    expect(formatPlate('AB123CD')).toBe('AB123CD')
    expect(formatPlate('')).toBe('')
  })

  it('clasifica el estado de la placa', () => {
    expect(plateStatus('')).toBe('empty')
    expect(plateStatus('AB12')).toBe('short')
    expect(plateStatus('ABCDEF')).toBe('invalid')
    expect(plateStatus('123456')).toBe('invalid')
    expect(plateStatus('AB123C')).toBe('valid')
    expect(plateStatus('AB123CD')).toBe('valid')
  })

  it('detecta caracteres ajenos a una placa', () => {
    expect(hasForeignChars('AB 123-CD')).toBe(false)
    expect(hasForeignChars('AB*123')).toBe(true)
  })

  it('separa la placa en caracteres sueltos', () => {
    expect(plateChars('AB1').map((c) => c.ch)).toEqual(['A', 'B', '1'])
  })
})
