<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { ACCOUNT_TEXT } from '../constants/account'
import type { AccountProfile } from '../types/AccountTypes'

export default defineComponent({
  name: 'AccountHeaderCard',
  components: { AppIcon },
  props: {
    profile: { type: Object as PropType<AccountProfile>, required: true },
  },
  emits: ['add-vehicle', 'configure-automation'],
  data() {
    return {
      text: ACCOUNT_TEXT,
      rechargeRoute: { name: ROUTE_NAMES.recharge },
    }
  },
})
</script>

<template>
  <div class="acc-header">
    <!-- Barra Tricolor Superior Sutil -->
    <div class="acc-header__tricolor" aria-hidden="true"></div>

    <!-- Sección Superior: Identidad Corporativa y Acciones Rápidas -->
    <div class="acc-header__top">
      <div class="acc-header__identity">
        <div class="acc-header__avatar">
          <AppIcon name="camion" :size="28" />
        </div>
        <div class="acc-header__details">
          <div class="acc-header__meta-row">
            <span class="acc-header__corp-tag">
              <span class="acc-header__live-dot" aria-hidden="true"></span>
              Cuenta Corporativa Activa
            </span>
            <span class="acc-header__divider" aria-hidden="true">·</span>
            <span class="acc-header__sub-tag">SENIAT Verificada</span>
          </div>

          <h2 class="acc-header__name">{{ profile.name }}</h2>

          <div class="acc-header__info-strip">
            <span class="acc-header__info-item">
              RIF: <strong>{{ profile.documentId }}</strong>
            </span>
            <span class="acc-header__dot-sep" aria-hidden="true">•</span>
            <span class="acc-header__info-item">{{ profile.email }}</span>
            <span class="acc-header__dot-sep" aria-hidden="true">•</span>
            <span class="acc-header__info-item text-emerald-600 font-semibold">
              Conexión Bancaria IPG Activa
            </span>
          </div>
        </div>
      </div>

      <!-- Acciones de Cabecera (Botones Rectangulares Modernos - Sin Píldoras) -->
      <div class="acc-header__actions">
        <RouterLink :to="rechargeRoute" class="btn-rect btn-rect--primary">
          <AppIcon name="rayo" :size="16" />
          <span>Recargar Saldo de Flota</span>
        </RouterLink>

        <button
          type="button"
          class="btn-rect btn-rect--secondary"
          @click="$emit('add-vehicle')"
        >
          <AppIcon name="plus" :size="16" />
          <span>Asociar Vehículo</span>
        </button>
      </div>
    </div>

    <!-- Panel de Métricas Automatizadas y Telemetría Financiera -->
    <div class="acc-header__metrics">
      <!-- Métrica 1: Saldo Consolidado -->
      <div class="metric-card metric-card--balance">
        <div class="metric-card__header">
          <span class="metric-card__label">Saldo Consolidado en Cuenta</span>
          <span class="metric-status-badge metric-status-badge--success">
            ● Salud Óptima
          </span>
        </div>

        <div class="metric-card__val-row">
          <span class="metric-card__val">{{ profile.totalBalanceFormatted }}</span>
        </div>

        <!-- Barra de Salud Financiera -->
        <div class="metric-card__progress-wrap">
          <div class="metric-card__progress-bar">
            <div class="metric-card__progress-fill" style="width: 85%;"></div>
          </div>
          <span class="metric-card__hint">~28 tránsitos promedio de flota disponibles</span>
        </div>
      </div>

      <!-- Métrica 2: Vehículos y TAGs Habilitados -->
      <div class="metric-card">
        <div class="metric-card__header">
          <span class="metric-card__label">Unidades en Operación</span>
          <span class="metric-status-badge metric-status-badge--info">
            100% Autorizados
          </span>
        </div>

        <div class="metric-card__val-row">
          <span class="metric-card__val">{{ profile.vehiclesCount }}</span>
          <span class="metric-card__unit">Vehículos</span>
        </div>

        <div class="metric-card__sub-detail">
          <span class="text-emerald-700 font-semibold">{{ profile.activeTagsCount }} con TAG RFID</span>
          <span class="text-slate-400">·</span>
          <span class="text-slate-600">1 con Placa ALPR</span>
        </div>
      </div>

      <!-- Métrica 3: Estado de Automatización -->
      <div class="metric-card">
        <div class="metric-card__header">
          <span class="metric-card__label">Regla de Recarga Automática</span>
          <span class="metric-status-badge metric-status-badge--emerald">
            <span class="metric-pulse-dot" aria-hidden="true"></span>
            Activa
          </span>
        </div>

        <div class="metric-card__val-row">
          <span class="metric-card__val text-emerald-700">Bs. 100,00</span>
          <span class="metric-card__unit">Umbral mínimo</span>
        </div>

        <div class="metric-card__sub-detail">
          <span class="text-slate-600">Débito automático interbancario ante saldo bajo</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   TARJETA EJECUTIVA DE CABECERA DE CUENTA (ESTRUCTURA MODERNA - SIN PÍLDORAS)
   ========================================================================== */

.acc-header {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 20px;
  padding: clamp(24px, 3vw, 32px);
  box-shadow:
    0 16px 40px -10px rgba(18, 33, 66, 0.07),
    0 1px 3px rgba(18, 33, 66, 0.03);
  display: grid;
  gap: 24px;
  overflow: hidden;
  transition: box-shadow 0.25s var(--ease-out);
}

.acc-header:hover {
  box-shadow: 0 20px 48px -10px rgba(18, 33, 66, 0.11);
}

/* Barra Tricolor Superior */
.acc-header__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3.5px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
}

.acc-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.acc-header__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

/* Avatar de Flota */
.acc-header__avatar {
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(0, 87, 163, 0.25);
}

.acc-header__details {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.acc-header__meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

/* Etiquetas Rectangulares Limpias (Sin forma de píldora) */
.acc-header__corp-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #0284c7;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  padding: 3px 8px;
  border-radius: 6px;
}

.acc-header__live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0284c7;
}

.acc-header__divider {
  color: #cbd5e1;
  font-weight: bold;
}

.acc-header__sub-tag {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.acc-header__name {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(20px, 2.2vw, 24px);
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

.acc-header__info-strip {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 10px;
  margin-top: 5px;
  font-size: 13px;
  color: #64748b;
}

.acc-header__dot-sep {
  opacity: 0.4;
}

/* Grupo de Botones de Acción (Rectangulares - Sin Píldoras) */
.acc-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-rect {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 13.5px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none !important;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.btn-rect--primary {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.28);
}

.btn-rect--primary:hover {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
  box-shadow: 0 6px 18px rgba(0, 87, 163, 0.38);
  transform: translateY(-1px);
}

.btn-rect--secondary {
  background: #f8fafc;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.btn-rect--secondary:hover {
  background: #ffffff;
  border-color: #0057a3;
  color: #0057a3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

/* Cuadrícula de Métricas */
.acc-header__metrics {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid #f1f5f9;
}

@media (min-width: 768px) {
  .acc-header__metrics {
    grid-template-columns: 1.3fr 1fr 1fr;
  }
}

.metric-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  transition: all 0.2s ease;
}

.metric-card:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 6px 16px rgba(18, 33, 66, 0.05);
}

.metric-card--balance {
  background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
  border-color: #bae6fd;
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.metric-card__label {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

/* Badges de estatus rectangulares estándar (Sin forma de píldora) */
.metric-status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.metric-status-badge--success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.metric-status-badge--info {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.metric-status-badge--emerald {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.metric-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  animation: pulseMini 2s infinite ease-in-out;
}

@keyframes pulseMini {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.metric-card__val-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.metric-card__val {
  font-family: var(--font-mono, monospace);
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.metric-card__unit {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.metric-card__progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 2px;
}

.metric-card__progress-bar {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.metric-card__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 3px;
}

.metric-card__hint {
  font-size: 11.5px;
  color: #64748b;
}

.metric-card__sub-detail {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
