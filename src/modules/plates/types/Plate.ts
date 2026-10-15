/** Resultado de validar lo escrito en el campo de placa. */
export type PlateStatus = 'empty' | 'short' | 'invalid' | 'valid'

/** Qué quiere hacer el conductor con la placa. */
export type PlateIntent = 'recargar' | 'deuda'

/** Un carácter de la placa ya escrito. */
export interface PlateChar {
  ch: string
  key: string
}

/** Lo que el formulario de placa entrega al confirmar. */
export interface PlateSubmission {
  intent: PlateIntent
  plate: string
  /** Id de la opción de monto elegida; solo en recargas. */
  amountId?: string
}

/** Resultado de normalizar lo escrito en el campo de placa. */
export interface PlateInputChange {
  /** Valor normalizado que debe quedar en el campo. */
  value: string
  /** Posición del cursor tras normalizar lo escrito antes de él. */
  caret: number
}
