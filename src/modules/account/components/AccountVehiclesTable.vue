<script lang="ts">
import { defineComponent, type PropType, ref, computed } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateImage from '@/modules/plates/components/PlateImage.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import type { AccountVehicle } from '../types/AccountTypes'
import tagImg from '@/assets/tag-venvias.webp'

export default defineComponent({
  name: 'AccountVehiclesTable',
  components: { AppIcon, PlateImage },
  props: {
    vehicles: { type: Array as PropType<AccountVehicle[]>, required: true },
  },
  emits: ['add-vehicle', 'assign-balance', 'notify'],
  setup(props, { emit }) {
    const searchQuery = ref('')
    const activeFilter = ref<'all' | 'tags' | 'plates' | 'low_balance'>('all')
    const showingPlateFor = ref<Record<string, boolean>>({})

    const toggleVisual = (plate: string) => {
      showingPlateFor.value[plate] = !showingPlateFor.value[plate]
    }

    // Mapeo de telemetría y tipos para enriquecer cada tarjeta
    const vehicleTelemetry = (plate: string) => {
      switch (plate.toUpperCase()) {
        case 'AB123CD':
          return {
            category: 'Pick-up · Categoría 1',
            lastPass: 'Peaje Tazón · Hace 3 horas',
            statusDesc: 'Antena RFID 915 MHz activa',
            isLow: false,
          }
        case 'AC456EF':
          return {
            category: 'Carga Pesada · 4 Ejes',
            lastPass: 'Peaje Guacara · Ayer 18:40',
            statusDesc: 'Antena RFID 915 MHz activa',
            isLow: false,
          }
        case 'AD789GH':
          return {
            category: 'Camión Mediano · 2 Ejes',
            lastPass: 'Peaje La Cabrera · Hace 2 días',
            statusDesc: 'Lectura Óptica ALPR en Cabina',
            isLow: true,
          }
        default:
          return {
            category: 'Vehículo Liviano · Categoría 1',
            lastPass: 'Sin tránsitos recientes',
            statusDesc: 'Lectura Óptica ALPR',
            isLow: false,
          }
      }
    }

    const filteredVehicles = computed(() => {
      return props.vehicles.filter((v) => {
        // Filtro por texto
        const query = searchQuery.value.toLowerCase().trim()
        const matchesQuery =
          !query ||
          v.plate.toLowerCase().includes(query) ||
          v.alias.toLowerCase().includes(query)

        if (!matchesQuery) return false

        // Filtro por categoría
        if (activeFilter.value === 'tags') return v.tagStatus === 'ACTIVE'
        if (activeFilter.value === 'plates') return v.tagStatus !== 'ACTIVE'
        if (activeFilter.value === 'low_balance') return v.balance <= 50

        return true
      })
    })

    const counts = computed(() => {
      return {
        all: props.vehicles.length,
        tags: props.vehicles.filter((v) => v.tagStatus === 'ACTIVE').length,
        plates: props.vehicles.filter((v) => v.tagStatus !== 'ACTIVE').length,
        lowBalance: props.vehicles.filter((v) => v.balance <= 50).length,
      }
    })

    const onQuickAssignBalance = (v: AccountVehicle) => {
      emit('assign-balance', { plate: v.plate, amount: 50 })
    }

    return {
      tagImg,
      searchQuery,
      activeFilter,
      filteredVehicles,
      counts,
      vehicleTelemetry,
      onQuickAssignBalance,
      showingPlateFor,
      toggleVisual,
    }
  },
  methods: {
    vehicleRechargeRoute(plate: string) {
      return {
        name: ROUTE_NAMES.recharge,
        query: { placa: plate },
      }
    },
  },
})
</script>

<template>
  <div class="vehicles-hub">
    <!-- Barra Superior de Gestión de Flota -->
    <div class="vehicles-hub__header">
      <div>
        <h3 class="vehicles-hub__title">Vehículos y Unidades de Flota</h3>
        <p class="vehicles-hub__sub">
          Monitorea el saldo individual, telemetría de pasos y tecnología de cobro de cada unidad.
        </p>
      </div>

      <button type="button" class="btn-rect btn-rect--primary" @click="$emit('add-vehicle')">
        <AppIcon name="plus" :size="16" />
        <span>Asociar Vehículo</span>
      </button>
    </div>

    <!-- Barra de Filtros y Búsqueda Automatizada (Sin Píldoras) -->
    <div class="vehicles-hub__toolbar">
      <!-- Buscador en tiempo real -->
      <div class="vehicles-hub__search-box">
        <svg viewBox="0 0 20 20" class="vehicles-hub__search-icon" fill="currentColor">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="vehicles-hub__search-input"
          placeholder="Buscar por placa o alias de unidad..."
          aria-label="Buscar vehículos"
        />
        <button
          v-if="searchQuery"
          type="button"
          class="vehicles-hub__clear-search"
          @click="searchQuery = ''"
          title="Limpiar búsqueda"
        >
          ✕
        </button>
      </div>

      <!-- Pestañas de Filtro Rectangulares (Sin forma de píldora) -->
      <div class="vehicles-hub__filters" role="group" aria-label="Filtrar por estatus">
        <button
          type="button"
          class="filter-rect-btn"
          :class="{ 'is-active': activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          Todos <span class="filter-count">{{ counts.all }}</span>
        </button>

        <button
          type="button"
          class="filter-rect-btn"
          :class="{ 'is-active': activeFilter === 'tags' }"
          @click="activeFilter = 'tags'"
        >
          Con TAG RFID <span class="filter-count">{{ counts.tags }}</span>
        </button>

        <button
          type="button"
          class="filter-rect-btn"
          :class="{ 'is-active': activeFilter === 'plates' }"
          @click="activeFilter = 'plates'"
        >
          Por Placa ALPR <span class="filter-count">{{ counts.plates }}</span>
        </button>

        <button
          type="button"
          class="filter-rect-btn filter-rect-btn--alert"
          :class="{ 'is-active': activeFilter === 'low_balance' }"
          @click="activeFilter = 'low_balance'"
        >
          ⚠️ Saldo Crítico <span class="filter-count filter-count--alert">{{ counts.lowBalance }}</span>
        </button>
      </div>
    </div>

    <!-- Lista Vacía si el filtro no coincide -->
    <div v-if="filteredVehicles.length === 0" class="vehicles-empty">
      <AppIcon name="info" :size="32" class="text-slate-400" />
      <p class="font-semibold text-slate-700">No se encontraron unidades con los filtros seleccionados.</p>
      <button type="button" class="btn-rect btn-rect--secondary" @click="searchQuery = ''; activeFilter = 'all'">
        Restablecer filtros
      </button>
    </div>

    <!-- Cuadrícula Moderna de Tarjetas de Vehículos -->
    <div v-else class="vehicles-grid">
      <article
        v-for="v in filteredVehicles"
        :key="v.plate"
        class="v-card"
        :class="{ 'v-card--critical': v.balance <= 0 }"
      >
        <!-- Cabecera de la tarjeta: Dispositivo (TAG Verde Oficial o Placa Nacional) -->
        <div class="v-card__top">
          <!-- Si tiene TAG Activo y no está en modo placa: Dispositivo TAG Verde Oficial -->
          <div
            v-if="v.tagStatus === 'ACTIVE' && !showingPlateFor[v.plate]"
            class="v-card__tag-device-wrap"
            title="Dispositivo TAG RFID VenVías oficial adherido al parabrisas. Clic para ver matrícula."
            @click="toggleVisual(v.plate)"
          >
            <img :src="tagImg" alt="Dispositivo TAG VenVías RFID" class="v-card__tag-device-img" />
            <div class="v-card__tag-plate-stamp">
              <span class="tag-plate-flag" aria-hidden="true">🇻🇪</span>
              <span class="tag-plate-code">{{ v.plate }}</span>
            </div>
            <button
              type="button"
              class="v-card__tag-flip-btn"
              title="Ver placa metálica"
              aria-label="Ver placa metálica"
              @click.stop="toggleVisual(v.plate)"
            >
              Placa ⇄
            </button>
          </div>

          <!-- Si el usuario alternó a ver la placa o es un vehículo de cobro por Placa ALPR -->
          <div
            v-else
            class="v-card__plate-wrap"
            :class="{ 'is-clickable': v.tagStatus === 'ACTIVE' }"
            @click="v.tagStatus === 'ACTIVE' ? toggleVisual(v.plate) : null"
          >
            <PlateImage :value="v.plate" class="v-card__plate-img" />
            <button
              v-if="v.tagStatus === 'ACTIVE'"
              type="button"
              class="v-card__tag-flip-btn v-card__tag-flip-btn--on-plate"
              title="Ver dispositivo TAG verde"
              aria-label="Ver dispositivo TAG verde"
              @click.stop="toggleVisual(v.plate)"
            >
              TAG Verde ⇄
            </button>
          </div>

          <!-- Distintivo Rectangular de Estatus (Sin forma de píldora) -->
          <div class="v-card__status-col">
            <div
              class="v-status-badge"
              :class="v.tagStatus === 'ACTIVE' ? 'v-status-badge--active' : 'v-status-badge--plate'"
            >
              <span
                class="v-status-badge__dot"
                :class="v.tagStatus === 'ACTIVE' ? 'bg-emerald-500' : 'bg-sky-500'"
                aria-hidden="true"
              ></span>
              <span>{{ v.tagStatus === 'ACTIVE' ? 'TAG RFID Activo' : 'Lectura por Placa' }}</span>
            </div>

            <span v-if="v.tagId" class="v-card__serial-tag">
              {{ v.tagId }}
            </span>
            <span v-else class="v-card__serial-tag v-card__serial-tag--alpr">
              ALPR en Cabina
            </span>
          </div>
        </div>

        <!-- Cuerpo: Alias, Categoría y Telemetría -->
        <div class="v-card__body">
          <div class="v-card__title-row">
            <h4 class="v-card__alias">{{ v.alias }}</h4>
            <span class="v-card__plate-badge">{{ v.plate }}</span>
          </div>

          <div class="v-card__meta-strip">
            <span class="v-card__category">{{ vehicleTelemetry(v.plate).category }}</span>
            <span class="v-card__meta-sep">•</span>
            <span v-if="v.tagId" class="v-card__tag-id">
              Antena <strong>915 MHz</strong>
            </span>
            <span v-else class="v-card__tag-id text-slate-500">
              Lectura Digital OCR
            </span>
          </div>

          <!-- Telemetría de Último Paso -->
          <div class="v-card__telemetry">
            <AppIcon name="peaje" :size="13" class="text-slate-400" />
            <span>{{ vehicleTelemetry(v.plate).lastPass }}</span>
          </div>
        </div>

        <!-- Pie Financiero y Acciones Rápidas -->
        <div class="v-card__footer">
          <div class="v-card__balance-col">
            <span class="bal-label">Saldo Disponible</span>
            <div class="bal-val-row">
              <span
                class="bal-val"
                :class="v.balance <= 0 ? 'text-amber-600' : 'text-slate-900'"
              >
                {{ v.balanceFormatted }}
              </span>
              <span
                v-if="v.balance <= 0"
                class="bal-warning-tag"
                title="Sin saldo para transitar"
              >
                Requiere Saldo
              </span>
            </div>
          </div>

          <!-- Acciones Rápidas -->
          <div class="v-card__actions">
            <!-- Botón Inteligente de Asignación si tiene saldo 0 -->
            <button
              v-if="v.balance <= 0"
              type="button"
              class="btn-quick-transfer"
              @click="onQuickAssignBalance(v)"
              title="Asignar Bs. 50 inmediatamente desde la cuenta consolidada"
            >
              <AppIcon name="rayo" :size="13" />
              <span>+Bs. 50 Auto</span>
            </button>

            <!-- Botón de Recarga Tradicional Rectangular (Sin píldora) -->
            <RouterLink
              :to="vehicleRechargeRoute(v.plate)"
              class="btn-action-rect"
              :class="v.balance <= 0 ? 'btn-action-rect--primary' : 'btn-action-rect--secondary'"
            >
              <span>Recargar</span>
              <svg viewBox="0 0 20 20" class="w-3.5 h-3.5" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
              </svg>
            </RouterLink>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   GESTIÓN DE FLOTA Y VEHÍCULOS (DISEÑO RECTANGULAR EJECUTIVO - SIN PÍLDORAS)
   ========================================================================== */

.vehicles-hub {
  display: grid;
  gap: 20px;
}

.vehicles-hub__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.vehicles-hub__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.vehicles-hub__sub {
  font-size: 14px;
  color: #64748b;
  margin-top: 3px;
}

/* Barra de Filtros y Herramientas */
.vehicles-hub__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  background: #ffffff;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(18, 33, 66, 0.03);
}

.vehicles-hub__search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 7px 12px;
  min-width: 260px;
  flex-grow: 1;
  max-width: 380px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.vehicles-hub__search-box:focus-within {
  border-color: #0057a3;
  box-shadow: 0 0 0 3px rgba(0, 87, 163, 0.12);
  background: #ffffff;
}

.vehicles-hub__search-icon {
  width: 16px;
  height: 16px;
  color: #64748b;
  flex-shrink: 0;
}

.vehicles-hub__search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13.5px;
  color: #0f172a;
  width: 100%;
}

.vehicles-hub__clear-search {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font-size: 12px;
  padding: 2px 4px;
}
.vehicles-hub__clear-search:hover {
  color: #0f172a;
}

/* Botones de Filtro Rectangulares (Sin forma de píldora) */
.vehicles-hub__filters {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-rect-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.filter-rect-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.filter-rect-btn.is-active {
  background: #0057a3;
  color: #ffffff;
  border-color: #0057a3;
  box-shadow: 0 2px 8px rgba(0, 87, 163, 0.25);
}

.filter-count {
  font-size: 11px;
  padding: 1px 5px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  font-weight: 700;
}

.filter-rect-btn.is-active .filter-count {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.filter-rect-btn--alert {
  color: #b45309;
  background: #fffbeb;
  border-color: #fde68a;
}

.filter-rect-btn--alert.is-active {
  background: #d97706;
  border-color: #d97706;
  color: #ffffff;
}

/* Estado Vacío */
.vehicles-empty {
  background: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  display: grid;
  place-items: center;
  gap: 12px;
}

/* Cuadrícula de Tarjetas */
.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 16px;
}

.v-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow:
    0 10px 24px -6px rgba(18, 33, 66, 0.05),
    0 1px 3px rgba(18, 33, 66, 0.03);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
}

.v-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 16px 36px -8px rgba(0, 87, 163, 0.12);
}

.v-card--critical {
  border-color: #fed7aa;
  background: linear-gradient(180deg, #fffbf5 0%, #ffffff 100%);
}

.v-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

/* Dispositivo TAG Verde Oficial (Windshield Sticker) */
.v-card__tag-device-wrap {
  width: 164px;
  height: 82px;
  position: relative;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.22), 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1.5px solid #86efac;
  background: #2e8b57;
  cursor: pointer;
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.v-card__tag-device-wrap:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 22px rgba(16, 185, 129, 0.32);
}

.v-card__tag-device-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.v-card__tag-plate-stamp {
  position: absolute;
  bottom: 4px;
  left: 6px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  padding: 1.5px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  gap: 4px;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.35);
}

.tag-plate-flag {
  font-size: 10px;
}

.v-card__tag-flip-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(255, 255, 255, 0.92);
  color: #065f46;
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.4);
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.15s ease;
}

.v-card__tag-flip-btn:hover {
  background: #ffffff;
  color: #047857;
  transform: scale(1.04);
}

.v-card__tag-flip-btn--on-plate {
  top: 4px;
  right: 4px;
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #047857;
}

.v-card__plate-wrap {
  position: relative;
  flex-shrink: 0;
}

.v-card__plate-wrap.is-clickable {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.v-card__plate-wrap.is-clickable:hover {
  transform: translateY(-1px);
}

.v-card__plate-img {
  width: 164px;
  flex-shrink: 0;
}

/* Columna de Estatus */
.v-card__status-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.v-card__serial-tag {
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  font-weight: 700;
  color: #047857;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 2px 6px;
  border-radius: 5px;
  letter-spacing: 0.02em;
}

.v-card__serial-tag--alpr {
  color: #0284c7;
  background: #f0f9ff;
  border-color: #bae6fd;
}

/* Distintivos Rectangulares (Sin forma de píldora) */
.v-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 8px;
  border-radius: 6px;
}

.v-status-badge--active {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.v-status-badge--plate {
  background: #f0f9ff;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.v-status-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.v-card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.v-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.v-card__plate-badge {
  font-family: var(--font-mono, monospace);
  font-size: 11.5px;
  font-weight: 700;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  padding: 1.5px 6px;
  border-radius: 5px;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

.v-card__alias {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

.v-card__meta-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
}

.v-card__meta-sep {
  opacity: 0.4;
}

.v-card__telemetry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
  padding: 4px 8px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #f1f5f9;
  width: fit-content;
}

.v-card__footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  gap: 10px;
}

.v-card__balance-col {
  display: flex;
  flex-direction: column;
}

.bal-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.bal-val-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 2px;
}

.bal-val {
  font-family: var(--font-mono, monospace);
  font-size: 17px;
  font-weight: 800;
}

.bal-warning-tag {
  font-size: 10px;
  font-weight: 700;
  color: #c2410c;
  background: #ffedd5;
  border: 1px solid #fed7aa;
  padding: 1px 5px;
  border-radius: 4px;
  text-transform: uppercase;
}

.v-card__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Botón de Asignación Rápida Automática */
.btn-quick-transfer {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 7px 10px;
  font-size: 11.5px;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-quick-transfer:hover {
  background: #047857;
  color: #ffffff;
  border-color: #047857;
  box-shadow: 0 4px 10px rgba(4, 120, 87, 0.25);
}

/* Botón de Recarga Rectangular */
.btn-action-rect {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  font-size: 12.5px;
  font-weight: 700;
  border-radius: 8px;
  text-decoration: none !important;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-action-rect--secondary {
  background: #f8fafc;
  color: #0057a3;
  border: 1px solid #bae6fd;
}

.btn-action-rect--secondary:hover {
  background: #0057a3;
  color: #ffffff;
  border-color: #0057a3;
  box-shadow: 0 4px 10px rgba(0, 87, 163, 0.25);
}

.btn-action-rect--primary {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 87, 163, 0.25);
}

.btn-action-rect--primary:hover {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
  box-shadow: 0 6px 14px rgba(0, 87, 163, 0.35);
}

/* Botón Rectangular Compartido */
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

.btn-rect--primary {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 87, 163, 0.25);
}

.btn-rect--primary:hover {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
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
}
</style>
