import { DEFAULT_OTP_LENGTH } from '../constants/ipgPayment'
import type { IpgOtpChallenge } from '../types/IpgOtpChallenge'
import type { IpgOtpChallengeDto } from '../types/IpgOtpChallengeDto'

export function mapIpgOtpChallengeDtoToView(dto: IpgOtpChallengeDto): IpgOtpChallenge {
  const length = dto.otp_length
  return {
    challengeId: dto.challenge_id,
    otpLength: typeof length === 'number' && Number.isInteger(length) && length > 0 ? length : DEFAULT_OTP_LENGTH,
  }
}
