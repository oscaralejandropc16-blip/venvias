/** Opción de monto lista para pintar en el formulario de recarga. */
export interface RechargeAmountOption {
  id: string
  /** Texto principal: el monto corto («Bs. 250») o el nombre de la opción. */
  label: string
  /** Texto bajo la etiqueta; vacío cuando el monto ya lo dice todo. */
  detail: string
  /** Monto en la moneda de cobro; `null` en «Otro monto» o mientras no esté definido. */
  amount: number | null
  /** `true` cuando el conductor escribe el monto. */
  custom: boolean
}
