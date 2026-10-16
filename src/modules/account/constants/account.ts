import type { VehicleTagStatus } from '../types/AccountTypes'

export const VEHICLE_TAG_STATUS_LABELS: Record<VehicleTagStatus, string> = {
  ACTIVE: 'TAG Activo',
  INACTIVE: 'Sin TAG (Solo Placa)',
  PENDING_INSTALL: 'TAG Pendiente de Entrega',
}

export const VEHICLE_TAG_STATUS_TONES: Record<VehicleTagStatus, 'success' | 'warning' | 'alert'> = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  PENDING_INSTALL: 'alert',
}

export const ACCOUNT_TRANSIT_STATUS_LABELS: Record<string, string> = {
  PAID: 'Debitado con éxito',
  EXEMPT: 'Paso Exento',
  PENDING: 'En procesamiento',
}

export const ACCOUNT_TRANSIT_STATUS_TONES: Record<string, 'success' | 'warning' | 'alert'> = {
  PAID: 'success',
  EXEMPT: 'warning',
  PENDING: 'alert',
}

export const ACCOUNT_TEXT = {
  title: 'Portal de Gestión de Cuenta',
  subtitle: 'Administra tus vehículos, TAGs asociados, historial de pasos y comprobantes de pago.',
  badge: 'VenVías · Gran Misión Transporte Venezuela',
  tabs: {
    vehicles: 'Mis Vehículos y TAGs',
    transits: 'Historial de Tránsitos',
    statements: 'Comprobantes y Facturación',
    alerts: 'Alertas y Configuración',
  },
  stats: {
    totalBalance: 'Saldo Consolidado',
    vehiclesCount: 'Vehículos Registrados',
    activeTags: 'TAGs Operativos',
  },
  actions: {
    addVehicle: 'Asociar nuevo vehículo',
    rechargeFleet: 'Recargar saldo de cuenta',
    downloadReceipt: 'Descargar Comprobante',
    linkTag: 'Vincular TAG',
  },
  notices: {
    optionalAccount: 'Recuerda: Si solo deseas pagar o recargar una placa de paso, no necesitas cuenta ni contraseña.',
  },
}

/** Lo que suma la cuenta opcional. Se muestra en inicio como invitación, nunca como requisito. */
export const ACCOUNT_PERKS = [
  'Administra varias placas y asocia tu TAG',
  'Activa la autorecarga y recibe alertas de saldo',
  'Consulta tu historial, comprobantes y facturas',
  'Guarda tus métodos de pago',
]
