<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import AccountHeaderCard from '../components/AccountHeaderCard.vue'
import AccountVehiclesTable from '../components/AccountVehiclesTable.vue'
import AccountTransitsTable from '../components/AccountTransitsTable.vue'
import AccountAddVehicleModal from '../components/AccountAddVehicleModal.vue'
import { useAccountPortal, type AccountTabKey } from '../composables/useAccountPortal'
import { ACCOUNT_TEXT } from '../constants/account'

export default defineComponent({
  name: 'AccountView',
  components: {
    AppIcon,
    AccountHeaderCard,
    AccountVehiclesTable,
    AccountTransitsTable,
    AccountAddVehicleModal,
  },
  setup() {
    return { ...useAccountPortal() }
  },
  data() {
    return {
      text: ACCOUNT_TEXT,
      showAddModal: false,
      rechargeRoute: { name: ROUTE_NAMES.recharge },
      toastMessage: '',
      autoRechargeThreshold: '100',
      whatsappAlerts: true,
      instantReceipts: true,
    }
  },
  mounted() {
    void this.fetchProfile()
  },
  methods: {
    setTab(tab: AccountTabKey): void {
      this.setActiveTab(tab)
    },
    openAddModal(): void {
      this.showAddModal = true
    },
    closeAddModal(): void {
      this.showAddModal = false
    },
    async onSaveVehicle(payload: { plate: string; alias: string }): Promise<void> {
      const ok = await this.registerVehicle(payload.plate, payload.alias)
      if (ok) {
        this.closeAddModal()
        this.notify(`¡Unidad ${payload.plate} asociada exitosamente a la flota!`)
      }
    },
    onDownloadReceipt(receiptNumber: string): void {
      this.notify(`Comprobante fiscal ${receiptNumber} generado y descargado en PDF.`)
    },
    onAssignBalance(payload: { plate: string; amount: number }): void {
      if (!this.profile) return
      const target = this.profile.vehicles.find((v) => v.plate === payload.plate)
      if (target && this.profile.totalBalance >= payload.amount) {
        target.balance += payload.amount
        target.balanceFormatted = `Bs. ${target.balance.toFixed(2)}`
        this.profile.totalBalance -= payload.amount
        this.profile.totalBalanceFormatted = `Bs. ${this.profile.totalBalance.toFixed(2)}`
        this.notify(
          `¡Automatización ejecutada! Se asignaron Bs. ${payload.amount},00 a la unidad ${payload.plate} desde el saldo consolidado.`,
        )
      } else {
        this.notify('Saldo consolidado insuficiente para realizar la transferencia automática.')
      }
    },
    setThreshold(amount: string): void {
      this.autoRechargeThreshold = amount
      this.notify(`Umbral de recarga automática actualizado a Bs. ${amount},00`)
    },
    notify(msg: string): void {
      this.toastMessage = msg
      setTimeout(() => {
        if (this.toastMessage === msg) this.toastMessage = ''
      }, 4500)
    },
  },
})
</script>

<template>
  <main class="account-view section wrap" aria-labelledby="account-title">
    <!-- Cabecera Institucional Sobria (Sin píldoras) -->
    <header class="account-view__hero">
      <div class="account-view__kicker">
        <span class="account-view__kicker-line" aria-hidden="true"></span>
        <span>{{ text.badge }}</span>
      </div>
      <h1 id="account-title" class="account-view__title">{{ text.title }}</h1>
      <p class="account-view__subtitle">{{ text.subtitle }}</p>
    </header>

    <!-- Toast de Notificación Reactiva de Automatizaciones -->
    <div v-if="toastMessage" class="toast-banner" role="status">
      <div class="toast-banner__icon">
        <AppIcon name="check" :size="16" />
      </div>
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Indicador de Carga -->
    <div v-if="loading && !profile" class="account-loading" aria-live="polite">
      <AppIcon name="rayo" :size="32" class="animate-spin text-azul-700" />
      <p>Cargando información ejecutiva de cuenta...</p>
    </div>

    <div v-else-if="profile" class="account-content">
      <!-- 1. Tarjeta de Comando Ejecutivo de Cabecera -->
      <AccountHeaderCard
        :profile="profile"
        @add-vehicle="openAddModal"
        @configure-automation="setTab('alerts')"
      />

      <!-- 2. Navegación por Pestañas Rectangulares (Segmented Control - Sin Píldoras) -->
      <nav class="account-tabs" aria-label="Secciones de la cuenta">
        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'vehicles' }"
          @click="setTab('vehicles')"
        >
          <AppIcon name="camion" :size="16" />
          <span>{{ text.tabs.vehicles }}</span>
          <span class="tab-badge">{{ profile.vehiclesCount }}</span>
        </button>

        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'transits' }"
          @click="setTab('transits')"
        >
          <AppIcon name="peaje" :size="16" />
          <span>{{ text.tabs.transits }}</span>
        </button>

        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'statements' }"
          @click="setTab('statements')"
        >
          <AppIcon name="recibo" :size="16" />
          <span>{{ text.tabs.statements }}</span>
        </button>

        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'alerts' }"
          @click="setTab('alerts')"
        >
          <AppIcon name="rayo" :size="16" />
          <span>Automatización y Alertas</span>
        </button>
      </nav>

      <!-- 3. Pestaña 1: Gestión de Vehículos con Automatizaciones -->
      <section v-if="activeTab === 'vehicles'" class="tab-panel">
        <AccountVehiclesTable
          :vehicles="profile.vehicles"
          @add-vehicle="openAddModal"
          @assign-balance="onAssignBalance"
        />
      </section>

      <!-- 4. Pestaña 2: Tránsitos recientes y telemetría de peajes -->
      <section v-else-if="activeTab === 'transits'" class="tab-panel">
        <AccountTransitsTable
          :transits="profile.recentTransits"
          @download-receipt="onDownloadReceipt"
        />
      </section>

      <!-- 5. Pestaña 3: Comprobantes fiscales y facturación SENIAT -->
      <section v-else-if="activeTab === 'statements'" class="tab-panel">
        <div class="statements-box">
          <div class="statements-header">
            <div>
              <h3 class="statements-title">Comprobantes y Solvencias de Pago Fiscal</h3>
              <p class="statements-sub">
                Descarga tus comprobantes digitales válidos ante el SENIAT y autoridades de tránsito nacional.
              </p>
            </div>

            <button
              type="button"
              class="btn-rect btn-rect--secondary"
              @click="notify('Descarga masiva de comprobantes fiscales del mes iniciada en formato ZIP.')"
            >
              <AppIcon name="recibo" :size="16" />
              <span>Descargar Relación Mensual</span>
            </button>
          </div>

          <div class="statements-list">
            <div
              v-for="t in profile.recentTransits"
              :key="t.receiptNumber"
              class="statement-item"
            >
              <div class="statement-item__left">
                <div class="statement-icon">
                  <AppIcon name="recibo" :size="20" />
                </div>
                <div>
                  <h4 class="statement-title">Factura Digital {{ t.receiptNumber }}</h4>
                  <p class="statement-meta">
                    {{ t.passedAtFormatted }} · {{ t.tollName }} · Placa: <strong>{{ t.plateFormatted }}</strong>
                  </p>
                </div>
              </div>
              <div class="statement-item__right">
                <span class="statement-amount">{{ t.amountFormatted }}</span>
                <button
                  type="button"
                  class="btn-download-rect"
                  @click="onDownloadReceipt(t.receiptNumber)"
                  title="Descargar PDF"
                >
                  <AppIcon name="arrow" :size="14" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Pestaña 4: Automatización Inteligente y Alertas -->
      <section v-else-if="activeTab === 'alerts'" class="tab-panel">
        <div class="alerts-box">
          <div class="alerts-header">
            <div>
              <h3 class="alerts-title">Reglas de Automatización de Flota</h3>
              <p class="alerts-sub">
                Garantiza paso continuo en cabinas sin requerir recargas manuales diarias.
              </p>
            </div>
            <div class="automation-active-badge">
              <span class="auto-pulse-dot" aria-hidden="true"></span>
              <span>Motor de Recarga Activo</span>
            </div>
          </div>

          <div class="alerts-grid">
            <!-- Automatización 1: Recarga Automática por Umbral -->
            <div class="alert-option alert-option--featured">
              <div class="alert-option__body">
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-slate-900 text-base">Recarga Automática Inteligente de Flotilla</h4>
                  <span class="tag-rect tag-rect--emerald">Recomendado</span>
                </div>
                <p class="text-sm text-slate-600 mt-1">
                  Cuando el saldo consolidado de la empresa sea inferior al umbral, el sistema solicitará automáticamente el débito interbancario a tu cuenta vinculada.
                </p>

                <div class="threshold-selector mt-4">
                  <span class="text-xs font-bold uppercase text-slate-500 tracking-wider">
                    Selecciona el Umbral de Disparo:
                  </span>
                  <div class="threshold-buttons mt-2">
                    <button
                      v-for="amt in ['50', '100', '200', '500']"
                      :key="amt"
                      type="button"
                      class="threshold-btn"
                      :class="{ 'is-selected': autoRechargeThreshold === amt }"
                      @click="setThreshold(amt)"
                    >
                      Bs. {{ amt }},00
                    </button>
                  </div>
                </div>

                <div class="bank-link-card mt-4">
                  <div class="bank-link-icon">
                    <AppIcon name="tarjeta" :size="20" class="text-blue-700" />
                  </div>
                  <div class="text-xs text-slate-600">
                    <strong class="text-slate-900 block">Banco de Venezuela (Cuenta Jurídica)</strong>
                    Cta: ****4819 · IPG Interbancario Automatizado
                  </div>
                  <span class="bank-verified-tag">Vinculado</span>
                </div>
              </div>
            </div>

            <!-- Automatización 2: Alertas Push y WhatsApp en tiempo real -->
            <div class="alert-option">
              <div class="alert-option__body">
                <h4 class="font-bold text-slate-900 text-base">Notificaciones WhatsApp y SMS en Vivo</h4>
                <p class="text-sm text-slate-600 mt-1">
                  Envío de alertas inmediatas a gerencia cuando un vehículo cruce un peaje o una unidad tenga saldo crítico.
                </p>
                <div class="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>Destino: <strong>+58 412-***5678</strong></span>
                  <span>·</span>
                  <button
                    type="button"
                    class="text-blue-700 font-semibold hover:underline"
                    @click="notify('Notificación de prueba enviada a WhatsApp y correo registrado.')"
                  >
                    Enviar prueba
                  </button>
                </div>
              </div>

              <label class="toggle-switch" aria-label="Activar notificaciones">
                <input v-model="whatsappAlerts" type="checkbox" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal para asociar vehículo -->
    <AccountAddVehicleModal
      v-if="showAddModal"
      @close="closeAddModal"
      @save="onSaveVehicle"
    />

    <!-- Aviso institucional en el pie -->
    <footer class="account-view__notice">
      <AppIcon name="info" :size="16" />
      <span>{{ text.notices.optionalAccount }}</span>
      <RouterLink :to="rechargeRoute" class="notice-link">Recargar placa directamente</RouterLink>
    </footer>
  </main>
</template>

<style scoped>
/* ==========================================================================
   PORTAL DE GESTIÓN DE CUENTA Y FLOTAS (SIN PÍLDORAS - ESTILO EJECUTIVO)
   ========================================================================== */

.account-view {
  display: grid;
  gap: 28px;
  max-width: 1080px;
}

.account-view__hero {
  display: grid;
  gap: 8px;
  text-align: center;
  justify-items: center;
  animation: acctFadeIn 0.5s ease-out both;
}

.account-view__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0284c7;
  margin-bottom: 2px;
}

.account-view__kicker-line {
  width: 18px;
  height: 2px;
  background: linear-gradient(90deg, #0057a3, #38bdf8);
  border-radius: 2px;
}

.account-view__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(26px, 2.8vw, 36px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.15;
  margin: 0;
}

.account-view__subtitle {
  font-size: 15.5px;
  color: #64748b;
  max-width: 60ch;
  line-height: 1.5;
}

/* Toast de Notificación Reactiva */
.toast-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: #f0fdf4;
  color: #14532d;
  border: 1px solid #a7f3d0;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(18, 33, 66, 0.05);
  animation: toast-fade 0.25s ease-out;
}

.toast-banner__icon {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #10b981;
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

@keyframes toast-fade {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes acctFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.account-loading {
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 60px 0;
  color: #64748b;
}

.account-content {
  display: grid;
  gap: 24px;
}

/* ==========================================================================
   NAVEGACIÓN POR PESTAÑAS (SEGMENTED CONTROL - SIN PÍLDORAS)
   ========================================================================== */

.account-tabs {
  display: flex;
  background: #ffffff;
  padding: 6px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(18, 33, 66, 0.04);
  gap: 6px;
  overflow-x: auto;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.tab-btn:hover:not(.is-active) {
  color: #0f172a;
  background: #f8fafc;
}

.tab-btn.is-active {
  background: #0057a3;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 87, 163, 0.25);
}

.tab-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.08);
}

.tab-btn.is-active .tab-badge {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.tab-panel {
  display: grid;
  gap: 16px;
  animation: acctFadeIn 0.35s ease-out;
}

/* Cajas de Pestañas */
.statements-box,
.alerts-box {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 20px;
  padding: clamp(24px, 3.5vw, 36px);
  box-shadow: 0 16px 40px -10px rgba(18, 33, 66, 0.07);
  display: grid;
  gap: 24px;
}

.statements-header,
.alerts-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.statements-title,
.alerts-title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.statements-sub,
.alerts-sub {
  font-size: 14px;
  color: #64748b;
  margin-top: 3px;
}

.automation-active-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 700;
  color: #047857;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 4px 10px;
  border-radius: 6px;
}

.auto-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

/* Lista de Comprobantes */
.statements-list {
  display: grid;
  gap: 10px;
}

.statement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  gap: 16px;
  transition: all 0.2s ease;
}

.statement-item:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(18, 33, 66, 0.05);
}

.statement-item__left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.statement-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: #f0f9ff;
  color: #0284c7;
  border: 1px solid #bae6fd;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.statement-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.statement-meta {
  font-size: 12.5px;
  color: #64748b;
  margin-top: 2px;
}

.statement-item__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.statement-amount {
  font-family: var(--font-mono, monospace);
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.btn-download-rect {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0057a3;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-download-rect:hover {
  background: #0057a3;
  color: #ffffff;
  border-color: #0057a3;
}

/* Panel de Automatizaciones */
.alerts-grid {
  display: grid;
  gap: 18px;
}

.alert-option {
  padding: 20px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.alert-option--featured {
  background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
  border-color: #bae6fd;
}

.tag-rect {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.tag-rect--emerald {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

/* Selector de Umbral de Recarga */
.threshold-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.threshold-btn {
  padding: 6px 14px;
  font-size: 12.5px;
  font-weight: 700;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.threshold-btn:hover {
  border-color: #0057a3;
  color: #0057a3;
}

.threshold-btn.is-selected {
  background: #0057a3;
  color: #ffffff;
  border-color: #0057a3;
  box-shadow: 0 2px 8px rgba(0, 87, 163, 0.25);
}

.bank-link-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: fit-content;
}

.bank-link-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f0f9ff;
  display: grid;
  place-items: center;
}

.bank-verified-tag {
  font-size: 11px;
  font-weight: 700;
  color: #047857;
  background: #ecfdf5;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 12px;
}

/* Switch Toggle Rectangular */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 13px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .toggle-slider {
  background-color: #0057a3;
}

input:checked + .toggle-slider:before {
  transform: translateX(22px);
}

/* Botón Rectangular Genérico */
.btn-rect {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none !important;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
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
}

/* Pie de Página de Aviso */
.account-view__notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
  flex-wrap: wrap;
  padding-top: 10px;
}

.notice-link {
  color: #0057a3;
  font-weight: 600;
  text-decoration: underline;
}
</style>
