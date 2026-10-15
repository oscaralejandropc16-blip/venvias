/** Reto OTP tal como lo entrega el backend (o su mock). */
export interface IpgOtpChallengeDto {
  challenge_id: string
  /** Dígitos del código; si falta se usan los de `DEFAULT_OTP_LENGTH`. */
  otp_length?: number | null
}
