/** Reto OTP abierto por el banco: se confirma con el código de la app BDV. */
export interface IpgOtpChallenge {
  challengeId: string
  otpLength: number
}
