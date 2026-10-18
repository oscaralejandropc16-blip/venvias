import type { DebtStatus } from '../types/DebtSummary'
import type { DebtTransitStatus } from '../types/DebtTransit'

export const DEBT_STATUS_LABELS: Record<DebtStatus, string> = {
  CLEAR: 'Al día · Sin deuda',
  DEBT_PENDING: 'Tránsitos pendientes de pago',
  DEBT_OVERDUE: 'Plazo de pago vencido',
}

export const DEBT_STATUS_TONES: Record<DebtStatus, 'success' | 'warning' | 'alert'> = {
  CLEAR: 'success',
  DEBT_PENDING: 'warning',
  DEBT_OVERDUE: 'alert',
}

export const TRANSIT_STATUS_LABELS: Record<DebtTransitStatus, string> = {
  PENDING: 'Pendiente',
  OVERDUE: 'Vencido',
  PAID: 'Pagado',
}

export const TRANSIT_STATUS_TONES: Record<DebtTransitStatus, 'warning' | 'alert' | 'success'> = {
  PENDING: 'warning',
  OVERDUE: 'alert',
  PAID: 'success',
}

export const DEBT_TEXT = {
  title: 'Consulta y pago de tránsitos',
  subtitle: 'Revisa los tránsitos por peajes registrados con tu placa y salda tu cuenta sin demoras.',
  badge: 'Consulta y Regularización Oficial',
  searchPrompt: 'Ingresa una placa para verificar si registra tránsitos pendientes',
  searching: 'Consultando registro de peajes...',
  noDebtTitle: '¡Esta placa está al día!',
  noDebtDesc: 'No se registran tránsitos pendientes de cobro ni multas asociadas.',
  noDebtRechargePrompt: 'Puedes recargar saldo preventivo para circular sin interrupciones.',
  hasDebtTitle: 'Detalle de tránsitos pendientes',
  totalToPay: 'Total a cancelar',
  payAllBtn: 'Pagar deuda completa',
  transitsCount: (count: number) => (count === 1 ? '1 tránsito registrado' : `${count} tránsitos registrados`),
  viewConditions: 'Ver condiciones y plazos de pago',
  tableHeaders: {
    toll: 'Estación de peaje',
    date: 'Fecha y hora',
    category: 'Categoría',
    amount: 'Monto',
    status: 'Estatus',
  },
  paidSuccessTitle: '¡Deuda cancelada con éxito!',
  paidSuccessDesc: 'El pago ha sido procesado y tus tránsitos han quedado solventes en el sistema.',
}

export const DEBT_CONDITIONS = {
  title: 'Términos y condiciones del pago por placa',
  subtitle: 'Marco operativo y legal para el cobro de tránsitos peaje sin detención vehicular.',
  updatedAt: 'Resolución Ministerial N° 042 · Gaceta Oficial',
  sections: [
    {
      id: 'registro-transito',
      title: '1. Registro automático del tránsito',
      content:
        'Al transitar por las vías habilitadas con pórticos o canales automáticos VenVías, el sistema realiza la captura óptica y electrónica de la placa del vehículo. Si el vehículo no posee saldo suficiente en su cuenta prepagada o no cuenta con dispositivo TAG activo, el paso se registra como tránsito pendiente de pago.',
    },
    {
      id: 'plazos',
      title: '2. Plazos para el pago voluntario',
      content:
        'El usuario cuenta con un lapso continuo de setenta y dos (72) horas a partir del momento de la captura fotográfica para realizar el pago del monto exacto de la tarifa correspondiente a la categoría del vehículo a través del portal público oficial de VenVías.',
    },
    {
      id: 'recargos',
      title: '3. Recargos y sanciones administrativas',
      content:
        'Transcurrido el plazo voluntario de 72 horas sin que se haya liquidado el saldo adeudado, el sistema aplicará los recargos previstos en la Ley de Transporte Terrestre y normas vigentes de peajes nacionales. La acumulación reiterada de tránsitos impagos dará lugar a la retención preventiva en puntos de control o suspensión del tránsito automatizado.',
    },
    {
      id: 'metodos',
      title: '4. Medios autorizados de liquidación',
      content:
        'Los pagos de tránsitos pendientes pueden realizarse exclusivamente a través de los canales autorizados: Pago Móvil C2P/P2P, pasarela interbancaria nacional (IPG) o transferencia en línea respaldada con comprobante digital emitido por el sistema.',
    },
    {
      id: 'comprobante',
      title: '5. Solvencia y comprobante fiscal',
      content:
        'Una vez confirmado el pago, el sistema emitirá el Comprobante Digital de Solvencia con código QR y número de referencia único para su verificación inmediata por las autoridades competentes en carretera.',
    },
  ],
}
