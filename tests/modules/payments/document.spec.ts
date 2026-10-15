import { describe, expect, it } from 'vitest'
import { IPG_PAYMENT_MESSAGES } from '@/modules/payments/constants/ipgPayment'
import { documentProblem, maskDocument, normalizeDocumentNumber } from '@/modules/payments/utils/document'

describe('documento del pagador', () => {
  it('normaliza: solo dígitos, salvo el pasaporte que admite letras en mayúscula', () => {
    expect(normalizeDocumentNumber('V', '12.345.678')).toBe('12345678')
    expect(normalizeDocumentNumber('J', 'J-12345678-9')).toBe('123456789')
    expect(normalizeDocumentNumber('P', 'ab 12-34c')).toBe('AB1234C')
  })

  it('la cédula (V, E) lleva de 6 a 8 dígitos', () => {
    expect(documentProblem('V', '123456')).toBe('')
    expect(documentProblem('E', '12345678')).toBe('')
    expect(documentProblem('V', '12345')).toBe(IPG_PAYMENT_MESSAGES.cedulaLength)
    expect(documentProblem('V', '123456789')).toBe(IPG_PAYMENT_MESSAGES.cedulaLength)
  })

  it('el RIF (J, G, C) lleva 9 dígitos', () => {
    for (const type of ['J', 'G', 'C'] as const) {
      expect(documentProblem(type, '123456789')).toBe('')
      expect(documentProblem(type, '12345678')).toBe(IPG_PAYMENT_MESSAGES.rifLength)
    }
  })

  it('el pasaporte lleva de 5 a 12 letras o números', () => {
    expect(documentProblem('P', 'AB123')).toBe('')
    expect(documentProblem('P', 'AB12')).toBe(IPG_PAYMENT_MESSAGES.passportLength)
    expect(documentProblem('P', 'A'.repeat(13))).toBe(IPG_PAYMENT_MESSAGES.passportLength)
  })

  it('sin número pide escribirlo', () => {
    expect(documentProblem('V', '')).toBe(IPG_PAYMENT_MESSAGES.documentRequired)
  })

  it('enmascara dejando los cuatro últimos', () => {
    expect(maskDocument('V', '12345678')).toBe('V-•••5678')
    expect(maskDocument('J', '1234')).toBe('J-1234')
    expect(maskDocument('V', '')).toBe('')
  })
})
