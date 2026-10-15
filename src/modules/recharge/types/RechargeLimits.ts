/** Reglas del monto de recarga, con sus montos ya formateados para los mensajes. */
export interface RechargeLimits {
  min: number
  max: number
  /** El monto debe ser múltiplo de este valor. */
  step: number
  currency: string
  /** Comisión fija por recarga. */
  fee: number
  minLabel: string
  maxLabel: string
  stepLabel: string
}
