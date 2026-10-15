import type { IconName } from '@/shared/icons/iconPaths'
import type { WalletStatus, WalletStatusTone } from '../types/WalletSummary'

export const SECURITY_CODE_LENGTH = 6

export const BALANCE_TEXT = {
  title: 'Consulta tu saldo',
  intro: 'Escribe la placa y el código de seguridad de tu último comprobante. Solo verás el saldo disponible.',
  codeLegend: 'Código de seguridad',
  codeHelp: 'Son los seis dígitos que aparecen en el comprobante de tu última recarga.',
  submit: 'Consultar saldo',
  submitting: 'Consultando…',
  resultTitle: 'Saldo de tu placa',
  balanceLabel: 'Saldo disponible',
  statusLabel: 'Estado',
  rechargeThis: 'Recargar esta placa',
  another: 'Consultar otra placa',
}

export const BALANCE_MESSAGES = {
  codeIncomplete: 'Escribe los seis dígitos del código de seguridad.',
  requestFailed: 'No pudimos consultar el saldo. Vuelve a intentar en un momento.',
}

export function codeDigitLabel(position: number, total: number): string {
  return `Dígito ${position} de ${total}`
}

export const WALLET_STATUS_LABELS: Record<WalletStatus, string> = {
  ACTIVE: 'Activa',
  LOW_BALANCE: 'Saldo bajo',
  ZERO_BALANCE: 'Sin saldo',
  BLOCKED: 'Bloqueada',
  REVIEW: 'En revisión',
}

export const WALLET_STATUS_TONES: Record<WalletStatus, WalletStatusTone> = {
  ACTIVE: 'ok',
  LOW_BALANCE: 'low',
  ZERO_BALANCE: 'alert',
  BLOCKED: 'alert',
  REVIEW: 'low',
}

export const WALLET_TONE_ICONS: Record<WalletStatusTone, IconName> = {
  ok: 'check',
  low: 'info',
  alert: 'alert',
}
