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
        this.notify('¡Vehículo asociado con éxito a tu cuenta!')
      }
    },
    onDownloadReceipt(receiptNumber: string): void {
      this.notify(`Comprobante ${receiptNumber} descargado en formato PDF.`)
    },
    notify(msg: string): void {
      this.toastMessage = msg
      setTimeout(() => {
        if (this.toastMessage === msg) this.toastMessage = ''
      }, 4000)
    },
  },
})
</script>

<template>
  <main class="account-view section wrap" aria-labelledby="account-title">
    <header class="account-view__hero">
      <span class="account-view__badge">
        <AppIcon name="info" :size="14" />
        {{ text.badge }}
      </span>
      <h1 id="account-title" class="account-view__title">{{ text.title }}</h1>
      <p class="account-view__subtitle">{{ text.subtitle }}</p>
    </header>

    <!-- Toast de acción -->
    <div v-if="toastMessage" class="toast-banner" role="status">
      <AppIcon name="check" :size="18" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading && !profile" class="account-loading" aria-live="polite">
      <AppIcon name="rayo" :size="32" class="animate-spin text-azul-700" />
      <p>Cargando información de cuenta...</p>
    </div>

    <div v-else-if="profile" class="account-content">
      <!-- Tarjeta superior de métricas y perfil -->
      <AccountHeaderCard :profile="profile" />

      <!-- Navegación por pestañas -->
      <nav class="account-tabs" aria-label="Secciones de la cuenta">
        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'vehicles' }"
          @click="setTab('vehicles')"
        >
          <AppIcon name="carro" :size="16" />
          {{ text.tabs.vehicles }} ({{ profile.vehiclesCount }})
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'transits' }"
          @click="setTab('transits')"
        >
          <AppIcon name="peaje" :size="16" />
          {{ text.tabs.transits }}
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'statements' }"
          @click="setTab('statements')"
        >
          <AppIcon name="recibo" :size="16" />
          {{ text.tabs.statements }}
        </button>
        <button
          type="button"
          class="tab-btn"
          :class="{ 'is-active': activeTab === 'alerts' }"
          @click="setTab('alerts')"
        >
          <AppIcon name="rayo" :size="16" />
          {{ text.tabs.alerts }}
        </button>
      </nav>

      <!-- Pestaña 1: Vehículos -->
      <section v-if="activeTab === 'vehicles'" class="tab-panel">
        <AccountVehiclesTable :vehicles="profile.vehicles" @add-vehicle="openAddModal" />
      </section>

      <!-- Pestaña 2: Tránsitos recientes -->
      <section v-else-if="activeTab === 'transits'" class="tab-panel">
        <AccountTransitsTable
          :transits="profile.recentTransits"
          @download-receipt="onDownloadReceipt"
        />
      </section>

      <!-- Pestaña 3: Comprobantes fiscales -->
      <section v-else-if="activeTab === 'statements'" class="tab-panel">
        <div class="statements-box">
          <div class="statements-header">
            <div>
              <h3 class="statements-title">Comprobantes y Solvencias de Pago</h3>
              <p class="statements-sub">
                Descarga tus comprobantes digitales válidos ante el SENIAT y autoridades de tránsito.
              </p>
            </div>
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
                    {{ t.passedAtFormatted }} · {{ t.tollName }} · Placa: {{ t.plateFormatted }}
                  </p>
                </div>
              </div>
              <div class="statement-item__right">
                <span class="statement-amount">{{ t.amountFormatted }}</span>
                <button
                  type="button"
                  class="btn btn--secundario btn--sm"
                  @click="onDownloadReceipt(t.receiptNumber)"
                >
                  <AppIcon name="arrow" :size="14" />
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pestaña 4: Alertas y Configuración -->
      <section v-else-if="activeTab === 'alerts'" class="tab-panel">
        <div class="alerts-box">
          <h3 class="alerts-title">Configuración de Saldo y Notificaciones</h3>
          <p class="alerts-sub">Asegura que tus vehículos nunca se queden sin saldo en carretera.</p>

          <div class="alerts-grid">
            <div class="alert-option">
              <div class="alert-option__body">
                <h4>Notificaciones por WhatsApp / SMS</h4>
                <p>Recibe un mensaje cuando un vehículo transite por un peaje o el saldo sea inferior a Bs. 50.</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="alert-option">
              <div class="alert-option__body">
                <h4>Recarga Automática de Flotilla</h4>
                <p>Debita automáticamente de tu cuenta bancaria cuando el saldo total baje de:</p>
                <div class="threshold-input-wrap">
                  <span>Bs.</span>
                  <input v-model="autoRechargeThreshold" type="number" class="threshold-input" />
                </div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" checked />
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
.account-view {
  display: grid;
  gap: var(--space-8);
  max-width: 1040px;
}

.account-view__hero {
  display: grid;
  gap: var(--space-2);
  text-align: center;
  justify-items: center;
}

.account-view__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--azul-100);
  color: var(--azul-700);
  font-size: 13px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
}

.account-view__title {
  font: 600 clamp(28px, 2.5vw + 18px, 38px)/1.15 var(--font-display);
  color: var(--marino-900);
}

.account-view__subtitle {
  font-size: 16px;
  color: var(--texto-suave);
  max-width: 58ch;
}

.toast-banner {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-5);
  background: #f0fdf4;
  color: #14532d;
  border: 1px solid rgba(0, 177, 64, 0.3);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  animation: toast-fade 0.2s ease-out;
}

@keyframes toast-fade {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.account-loading {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  padding: var(--space-14) 0;
  color: var(--texto-suave);
}

.account-content {
  display: grid;
  gap: var(--space-6);
}

.account-tabs {
  display: inline-flex;
  background: #ffffff;
  padding: 6px;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 14px rgba(18, 33, 66, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
  gap: 4px;
  overflow-x: auto;
  max-width: 100%;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: var(--radius-pill);
  font: 500 14px var(--font-body);
  color: var(--texto-suave);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s var(--ease-out);
}

.tab-btn:hover {
  color: var(--azul-700);
  background: rgba(0, 87, 163, 0.05);
}

.tab-btn.is-active {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.3);
  font-weight: 600;
}

.tab-panel {
  display: grid;
  gap: var(--space-4);
}

.statements-box,
.alerts-box {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-md);
  padding: var(--space-8);
  box-shadow: var(--elev-1);
  display: grid;
  gap: var(--space-6);
}

.statements-title,
.alerts-title {
  font: 600 18px/24px var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.statements-sub,
.alerts-sub {
  font-size: 14px;
  color: var(--texto-suave);
  margin-top: 2px;
}

.statements-list {
  display: grid;
  gap: var(--space-3);
}

.statement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border: 1px solid var(--borde);
  border-radius: var(--radius-sm);
  gap: var(--space-3);
  flex-wrap: wrap;
}

.statement-item__left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.statement-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--azul-100);
  color: var(--azul-700);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.statement-title {
  margin: 0;
  font: 600 15px var(--font-display);
  color: var(--marino-900);
}

.statement-meta {
  margin: 0;
  font-size: 12px;
  color: var(--texto-suave);
}

.statement-item__right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.statement-amount {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--marino-900);
}

.alerts-grid {
  display: grid;
  gap: var(--space-4);
}

.alert-option {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--fondo-frio);
  border-radius: var(--radius-sm);
  gap: var(--space-4);
}

.alert-option__body h4 {
  margin: 0;
  font: 600 15px var(--font-display);
  color: var(--marino-900);
}

.alert-option__body p {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--texto-suave);
}

.threshold-input-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-family: var(--font-mono);
  font-weight: 600;
}

.threshold-input {
  width: 90px;
  padding: 4px 8px;
  border: 1px solid var(--borde);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 14px;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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
  transition: 0.2s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--azul-700);
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.account-view__notice {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--fondo-frio);
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--texto-suave);
  flex-wrap: wrap;
  text-align: center;
}

.notice-link {
  color: var(--azul-700);
  font-weight: 500;
  text-decoration: underline;
}
</style>
