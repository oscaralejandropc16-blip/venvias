/** Reglas del monto de recarga tal como las entrega el backend (o su mock). */
export interface RechargeLimitsDto {
  min: number
  max: number
  step: number
  currency: string
  /** Comisión fija por recarga, en la misma moneda. */
  fee: number
}
