/**
 * Service de saldos. Es la única capa que conoce los paths de la API y la
 * forma cruda (DTO). Mientras no haya backend sirve el mock adyacente; al
 * conectarlo solo cambia este archivo.
 */

import { hasApiBackend, httpClient } from '@/core/api/httpClient'
import { mapWalletSummaryDtoToView } from '../mappers/walletSummary.mapper'
import type { WalletSummary } from '../types/WalletSummary'
import type { WalletSummaryDto } from '../types/WalletSummaryDto'
import balanceMock from './balance.mock.json'

const PATHS = {
  balanceInquiry: '/public/wallets/balance-inquiry/',
}

// Copia en memoria del mock: las recargas simuladas suben el saldo mientras dura la sesión.
const mockWallets = new Map<string, WalletSummaryDto>(
  balanceMock.wallets.map((w) => [w.plate, { ...w, currency: balanceMock.currency }]),
)

function mockWallet(plate: string): WalletSummaryDto {
  // Una placa sin movimientos todavía no tiene saldo.
  return mockWallets.get(plate) ?? { plate, balance: 0, currency: balanceMock.currency, status: 'ZERO_BALANCE' }
}

/** Consulta protegida: la placa y el código de seguridad del último comprobante. */
export async function inquireBalance(plate: string, securityCode: string): Promise<WalletSummary> {
  // El mock solo revisa el formato del código (lo hace el composable), como el prototipo anterior.
  const dto = hasApiBackend
    ? await httpClient.post<WalletSummaryDto>(
        PATHS.balanceInquiry,
        { plate, security_code: securityCode },
        // Placa o código que no calzan se explican junto al formulario, no en un toast.
        { silentStatuses: [400, 403, 404] },
      )
    : mockWallet(plate)
  return mapWalletSummaryDtoToView(dto)
}

/**
 * Solo mock: acredita una recarga simulada y devuelve el saldo resultante. Con
 * backend el comprobante ya trae el saldo nuevo; el saldo nunca se expone sin
 * código de seguridad.
 */
export function creditMockWallet(plate: string, amount: number): WalletSummary {
  const wallet = mockWallet(plate)
  const refilled = wallet.status === 'ZERO_BALANCE' || wallet.status === 'LOW_BALANCE'
  const next = { ...wallet, balance: wallet.balance + amount, status: refilled ? 'ACTIVE' : wallet.status }
  mockWallets.set(plate, next)
  return mapWalletSummaryDtoToView(next)
}
