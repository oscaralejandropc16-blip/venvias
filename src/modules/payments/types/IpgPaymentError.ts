/**
 * Fallas del Botón de Pago IPG que la UI explica con un mensaje propio.
 * - Al pedir el código: `payer_rejected`, `method_unavailable`, `bank_unavailable`, `payment_in_progress`.
 * - Al confirmar: `otp_invalid`, `otp_expired`, `otp_blocked`, `confirm_unknown`.
 */
export type IpgErrorKind =
  | 'payer_rejected'
  | 'method_unavailable'
  | 'bank_unavailable'
  | 'payment_in_progress'
  | 'otp_invalid'
  | 'otp_expired'
  | 'otp_blocked'
  | 'confirm_unknown'

/** Error del service ya clasificado; la vista nunca lee códigos ni estados HTTP. */
export class IpgPaymentError extends Error {
  readonly kind: IpgErrorKind
  /** Intentos que le quedan al código (`otp_invalid`). */
  readonly attemptsLeft: number | null

  constructor(kind: IpgErrorKind, attemptsLeft: number | null = null) {
    super(kind)
    this.name = 'IpgPaymentError'
    this.kind = kind
    this.attemptsLeft = attemptsLeft
  }
}
