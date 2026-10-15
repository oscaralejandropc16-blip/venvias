import { IPG_PAYMENT_MESSAGES } from '../constants/ipgPayment'
import type { DocumentType } from '../types/IpgPayer'

// Reglas provisionales: confirmar con el backend/banco cuántos caracteres lleva cada documento.
const RULES: Record<DocumentType, { pattern: RegExp; message: string }> = {
  V: { pattern: /^\d{6,8}$/, message: IPG_PAYMENT_MESSAGES.cedulaLength },
  E: { pattern: /^\d{6,8}$/, message: IPG_PAYMENT_MESSAGES.cedulaLength },
  P: { pattern: /^[A-Z0-9]{5,12}$/, message: IPG_PAYMENT_MESSAGES.passportLength },
  J: { pattern: /^\d{9}$/, message: IPG_PAYMENT_MESSAGES.rifLength },
  G: { pattern: /^\d{9}$/, message: IPG_PAYMENT_MESSAGES.rifLength },
  C: { pattern: /^\d{9}$/, message: IPG_PAYMENT_MESSAGES.rifLength },
}

/** El pasaporte admite letras y números; los demás documentos, solo números. */
export function isAlphanumericDocument(type: DocumentType): boolean {
  return type === 'P'
}

/** Limpia lo escrito: solo dígitos, o letras mayúsculas y dígitos en el pasaporte. */
export function normalizeDocumentNumber(type: DocumentType, raw: string): string {
  return isAlphanumericDocument(type) ? raw.toUpperCase().replace(/[^A-Z0-9]/g, '') : raw.replace(/\D/g, '')
}

/** Mensaje del problema del número, o `''` si cumple la regla de su tipo. */
export function documentProblem(type: DocumentType, value: string): string {
  if (!value) return IPG_PAYMENT_MESSAGES.documentRequired
  const rule = RULES[type]
  return rule.pattern.test(value) ? '' : rule.message
}

/** Documento enmascarado para mostrarlo: «V-•••5678». */
export function maskDocument(type: DocumentType, value: string): string {
  if (!value) return ''
  const visible = value.slice(-4)
  return `${type}-${value.length > 4 ? '•••' : ''}${visible}`
}
