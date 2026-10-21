<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import EmptyState from '@/shared/ui/EmptyState.vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import TollsMap from '../components/TollsMap.vue'
import TollStateCard from '../components/TollStateCard.vue'
import { useTollsList } from '../composables/useTollsList'
import { TOLLS_TEXT, tollsCountLabel } from '../constants/tolls'
import { groupTollsByState } from '../utils/groupTolls'
import type { Toll, TollStateGroup } from '../types/Toll'

const SKELETON_CARDS = 5

export default defineComponent({
  name: 'TollsView',
  components: { EmptyState, AppIcon, TollsMap, TollStateCard, RouterLink },
  setup() {
    return { ...useTollsList() }
  },
  data() {
    return {
      text: TOLLS_TEXT,
      selectedId: null as string | null,
      selectedState: 'ALL' as string,
      openStates: [] as string[],
      loaded: false,
      skeletonCards: SKELETON_CARDS,
      searchQuery: '',
    }
  },
  computed: {
    allGroups(): TollStateGroup[] {
      return groupTollsByState(this.tolls)
    },
    filteredTolls(): Toll[] {
      let list = this.tolls
      if (this.selectedState !== 'ALL') {
        list = list.filter((t) => t.state.toLowerCase() === this.selectedState.toLowerCase())
      }
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase()
        list = list.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.state.toLowerCase().includes(q) ||
            (t.road && t.road.toLowerCase().includes(q))
        )
      }
      return list
    },
    groups(): TollStateGroup[] {
      return groupTollsByState(this.filteredTolls)
    },
    countLabel(): string {
      return tollsCountLabel(this.tolls.length, this.allGroups.length)
    },
    selectedToll(): Toll | null {
      return this.tolls.find((t) => t.id === this.selectedId) ?? null
    },
    announcement(): string {
      const t = this.selectedToll
      return t ? `${t.name}, ${t.state}. ${t.road || this.text.roadPending}.` : ''
    },
    allOpen(): boolean {
      return this.groups.length > 0 && this.groups.every((g) => this.isOpen(g.state))
    },
  },
  watch: {
    searchQuery(q: string) {
      if (q.trim()) {
        this.openStates = this.groups.map((g) => g.state)
      }
    },
  },
  mounted() {
    void this.load()
  },
  methods: {
    async load(): Promise<void> {
      await this.fetchTolls()
      this.loaded = true
      this.openStates = []
    },
    clearSearch(): void {
      this.searchQuery = ''
    },
    setStateFilter(state: string): void {
      this.selectedState = state
      if (state !== 'ALL') {
        if (!this.openStates.includes(state)) {
          this.openStates = [...this.openStates, state]
        }
      }
    },
    recenterMap(): void {
      const mapComp = this.$refs.map as { fitAll?: (animate?: boolean) => void } | undefined
      if (mapComp?.fitAll) {
        mapComp.fitAll(true)
      }
    },
    isOpen(state: string): boolean {
      return this.openStates.includes(state)
    },
    toggleState(state: string): void {
      this.openStates = this.isOpen(state)
        ? this.openStates.filter((s) => s !== state)
        : [...this.openStates, state]
    },
    toggleAll(): void {
      if (this.allOpen) {
        this.openStates = []
      } else {
        this.openStates = this.groups.map((g) => g.state)
      }
    },
    selectFromList(id: string): void {
      this.selectedId = id
      const map = (this.$refs.map as { $el: HTMLElement } | undefined)?.$el
      if (map && map.getBoundingClientRect().top < 0) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        map.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
      }
    },
    selectFromMap(id: string | null): void {
      this.selectedId = id
      const toll = this.tolls.find((t) => t.id === id)
      if (toll && !this.isOpen(toll.state)) {
        this.openStates = [...this.openStates, toll.state]
      }
    },
  },
})
</script>

<template>
  <section class="section wrap tolls" aria-labelledby="tolls-title">
    <!-- ═══ Encabezado Principal Ejecutivo ═══ -->
    <header class="tolls__head">
      <div class="tolls__hero-meta">
        <h1 id="tolls-title" class="tolls__title">
          Peajes habilitados
          <span class="tolls__title-gradient">a nivel nacional</span>
        </h1>
        <p class="tolls__intro">
          Pasa por cualquiera de estos peajes y el cobro se realiza automáticamente por lectura de tu placa venezolana, sin detenerte en cabina ni manejar efectivo.
        </p>
      </div>

      <!-- Métricas Ejecutivas del Sistema Vial -->
      <div v-if="tolls.length" class="tolls__metrics">
        <div class="tolls__metric-card tolls__metric-card--blue">
          <div class="tolls__metric-val">{{ tolls.length }}</div>
          <div class="tolls__metric-lbl">Peajes Activos</div>
        </div>
        <div class="tolls__metric-card tolls__metric-card--red">
          <div class="tolls__metric-val">{{ allGroups.length }}</div>
          <div class="tolls__metric-lbl">Estados Conectados</div>
        </div>
        <div class="tolls__metric-card tolls__metric-card--amber">
          <div class="tolls__metric-val">100%</div>
          <div class="tolls__metric-lbl">Paso Continuo</div>
        </div>
      </div>
    </header>

    <!-- Estados de carga / error -->
    <template v-if="tollsLoading || !loaded">
      <p class="visually-hidden">{{ text.loading }}</p>
      <div class="tolls__map-skeleton" aria-hidden="true" />
      <div class="tolls__cards" aria-hidden="true">
        <div v-for="n in skeletonCards" :key="n" class="tolls__skeleton" />
      </div>
    </template>

    <EmptyState v-else-if="tollsError" icon="alert" :title="tollsError" class="tolls__status">
      <template #action>
        <button type="button" class="btn btn--secundario" @click="load">{{ text.retry }}</button>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="tolls.length === 0"
      icon="peaje"
      :title="text.emptyTitle"
      :description="text.emptyDescription"
      class="tolls__status"
    />

    <!-- Contenido Principal con Mapa e Interacciones -->
    <template v-else>
      <!-- Mapa Oficial de Peajes con Frame de Control Ejecutivo -->
      <div class="tolls__map-frame">
        <div class="tolls__map-bar">
          <div class="tolls__map-status">
            <span class="tolls__map-radar" aria-hidden="true">
              <span class="tolls__map-radar-ping"></span>
              <span class="tolls__map-radar-core"></span>
            </span>
            <span class="tolls__map-status-text">Red Nacional en Tiempo Real</span>
          </div>

          <div class="tolls__map-actions">
            <span class="tolls__map-counter">
              <strong>{{ filteredTolls.length }}</strong> {{ filteredTolls.length === 1 ? 'estación' : 'estaciones' }}
            </span>
            <button
              type="button"
              class="tolls__map-recenter-btn"
              title="Centrar mapa nacional"
              @click="recenterMap"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
              </svg>
              <span>Centrar vista</span>
            </button>
          </div>
        </div>

        <div class="tolls__map-wrapper">
          <TollsMap
            ref="map"
            class="tolls__map"
            :tolls="filteredTolls"
            :selected-id="selectedId"
            @select="selectFromMap"
          />
        </div>
      </div>

      <!-- Barra de Filtros y Búsqueda -->
      <div class="tolls__controls-bar">
        <!-- Segmented Tabs por Estado -->
        <div class="tolls__state-tabs" role="tablist" aria-label="Filtrar por estado">
          <button
            type="button"
            role="tab"
            :aria-selected="selectedState === 'ALL'"
            class="tolls__state-tab"
            :class="{ 'tolls__state-tab--active': selectedState === 'ALL' }"
            @click="setStateFilter('ALL')"
          >
            <span>Todos</span>
            <span class="tolls__tab-badge">{{ tolls.length }}</span>
          </button>
          <button
            v-for="group in allGroups"
            :key="group.state"
            type="button"
            role="tab"
            :aria-selected="selectedState === group.state"
            class="tolls__state-tab"
            :class="{ 'tolls__state-tab--active': selectedState === group.state }"
            @click="setStateFilter(group.state)"
          >
            <span>{{ group.state }}</span>
            <span class="tolls__tab-badge">{{ group.tolls.length }}</span>
          </button>
        </div>

        <!-- Buscador -->
        <div class="tolls__search-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tolls__search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="tolls__search-input"
            placeholder="Buscar por estación, troncal o autopista..."
            aria-label="Buscar peajes"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="tolls__search-clear"
            aria-label="Limpiar búsqueda"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Listado de Peajes por Estado en Acordeón -->
      <section class="tolls__states" aria-labelledby="tolls-states-title">
        <div class="tolls__states-head">
          <div class="tolls__states-head-meta">
            <h2 id="tolls-states-title" class="tolls__states-title">
              Estaciones habilitadas por estado
            </h2>
            <span class="tolls__states-caption">
              {{ groups.length }} {{ groups.length === 1 ? 'estado mostrado' : 'estados mostrados' }} · {{ filteredTolls.length }} peajes
            </span>
          </div>

          <button
            v-if="groups.length > 0"
            type="button"
            class="tolls__toggle-all-btn"
            @click="toggleAll"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="allOpen" d="M18 15l-6-6-6 6" />
              <path v-else d="M6 9l6 6 6-6" />
            </svg>
            <span>{{ allOpen ? 'Cerrar todos' : 'Desplegar todos' }}</span>
          </button>
        </div>

        <!-- Mensaje si no hay resultados en la búsqueda -->
        <div v-if="groups.length === 0" class="tolls__no-results">
          <AppIcon name="alert" :size="26" class="tolls__no-results-ico" />
          <p>No se encontraron estaciones que coincidan con "<strong>{{ searchQuery }}</strong>".</p>
          <button type="button" class="tolls__reset-btn" @click="clearSearch(); setStateFilter('ALL')">
            Restablecer filtros
          </button>
        </div>

        <!-- Bento Grid de tarjetas de estados -->
        <div v-else class="tolls__cards">
          <TollStateCard
            v-for="group in groups"
            :key="group.state"
            :group="group"
            :expanded="isOpen(group.state)"
            :selected-id="selectedId"
            @toggle="toggleState(group.state)"
            @select="selectFromList"
          />
        </div>
      </section>

      <!-- Banner de Viaje Ejecutivo (CTA de Recarga y Asistencia) -->
      <aside class="tolls__cta-card">
        <div class="tolls__cta-inner">
          <div class="tolls__cta-meta">
            <h3 class="tolls__cta-title">¿Listo para transitar sin efectivo por toda Venezuela?</h3>
            <p class="tolls__cta-desc">
              Recarga tu placa venezolana en segundos con Pago Móvil o transferencia bancaria y cruza cualquier peaje del país de manera 100% fluida.
            </p>
          </div>
          <div class="tolls__cta-actions">
            <RouterLink to="/recharge" class="tolls__cta-btn-primary">
              Recargar mi placa
            </RouterLink>
            <RouterLink to="/how-it-works" class="tolls__cta-btn-secondary">
              Cómo funciona
            </RouterLink>
          </div>
        </div>
      </aside>
    </template>

    <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<style scoped>
.tolls {
  display: grid;
  gap: var(--space-8);
  padding-block: var(--space-4) var(--space-12);
}

/* ── Encabezado y Métricas ── */
.tolls__head {
  display: grid;
  gap: 24px;
  animation: tollsFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (min-width: 900px) {
  .tolls__head {
    grid-template-columns: 1.4fr 1fr;
    align-items: center;
  }
}

.tolls__hero-meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tolls__title {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: clamp(30px, 3vw + 16px, 44px);
  line-height: 1.15;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
  margin: 0;
}

.tolls__title-gradient {
  background: linear-gradient(135deg, #0038A8 0%, #0284c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}

.tolls__intro {
  max-width: 60ch;
  color: #475569;
  font-size: clamp(15px, 1.1vw, 16.5px);
  line-height: 1.6;
  margin: 0;
}

/* Métricas en tríada oficial VenVías */
.tolls__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.tolls__metric-card {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  padding: 14px 12px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tolls__metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 56, 168, 0.08);
}

.tolls__metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.tolls__metric-card--blue::before  { background: linear-gradient(90deg, #0038A8, #38bdf8); }
.tolls__metric-card--red::before   { background: linear-gradient(90deg, #CE1126, #f87171); }
.tolls__metric-card--amber::before { background: linear-gradient(90deg, #d97706, #fbbf24); }

.tolls__metric-val {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 800;
  line-height: 1.15;
}

.tolls__metric-card--blue .tolls__metric-val  { color: #0038A8; }
.tolls__metric-card--red .tolls__metric-val   { color: #CE1126; }
.tolls__metric-card--amber .tolls__metric-val { color: #d97706; }

.tolls__metric-lbl {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4px;
}

/* ── Frame y Mapa Oficial ── */
.tolls__map-frame {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 45px -10px rgba(0, 56, 168, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
  animation: tollsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.tolls__map-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 20px;
  background: #0f172a;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tolls__map-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tolls__map-radar {
  position: relative;
  display: inline-flex;
  width: 10px;
  height: 10px;
}

.tolls__map-radar-ping {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #22c55e;
  opacity: 0.75;
  animation: radar-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.tolls__map-radar-core {
  position: relative;
  display: inline-flex;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

@keyframes radar-ping {
  75%, 100% {
    transform: scale(2.4);
    opacity: 0;
  }
}

.tolls__map-status-text {
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #f1f5f9;
}

.tolls__map-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tolls__map-counter {
  font-size: 12.5px;
  color: #94a3b8;
}

.tolls__map-counter strong {
  color: #f8fafc;
  font-weight: 700;
}

.tolls__map-recenter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tolls__map-recenter-btn:hover {
  background: #0038A8;
  border-color: #0038A8;
}

.tolls__map-wrapper {
  position: relative;
  width: 100%;
}

.tolls__map {
  height: clamp(380px, 60svh, 560px);
  scroll-margin-top: 80px;
}

.tolls__map-skeleton {
  height: 440px;
  border-radius: 1.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  animation: tolls-pulse 1.4s ease-in-out infinite alternate;
}

/* ── Barra de Filtros y Búsqueda ── */
.tolls__controls-bar {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (min-width: 960px) {
  .tolls__controls-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.tolls__state-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: thin;
}

.tolls__state-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 8px 14px;
  border-radius: 10px;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 13.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.tolls__state-tab:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.tolls__state-tab--active {
  background: #0038A8;
  border-color: #0038A8;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.25);
}

.tolls__state-tab--active:hover {
  background: #002d87;
  border-color: #002d87;
  color: #ffffff;
}

.tolls__tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #475569;
  font-size: 11.5px;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}

.tolls__state-tab--active .tolls__tab-badge {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.tolls__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

@media (min-width: 960px) {
  .tolls__search-wrap {
    max-width: 380px;
  }
}

.tolls__search-icon {
  position: absolute;
  left: 14px;
  color: #64748b;
  pointer-events: none;
}

.tolls__search-input {
  width: 100%;
  height: 44px;
  padding: 0 38px 0 40px;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 14px;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.tolls__search-input:focus {
  outline: none;
  border-color: #0038A8;
  box-shadow: 0 0 0 3px rgba(0, 56, 168, 0.12);
}

.tolls__search-clear {
  position: absolute;
  right: 12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 0;
  background: #f1f5f9;
  color: #64748b;
  font-size: 11px;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}

.tolls__search-clear:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* ── Sección de Estados y Peajes ── */
.tolls__states {
  display: grid;
  gap: var(--space-4);
  animation: tollsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.tolls__states-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 4px;
}

.tolls__states-head-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tolls__states-title {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: clamp(22px, 1vw + 18px, 28px);
  line-height: 1.25;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.tolls__states-caption {
  font-size: 13.5px;
  color: #64748b;
  font-weight: 500;
}

.tolls__toggle-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 7px 14px;
  border-radius: 9px;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 600;
  color: #0038A8;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.tolls__toggle-all-btn:hover {
  background: #eff6ff;
  border-color: #0038A8;
  color: #0038A8;
}

.tolls__cards {
  display: grid;
  gap: var(--space-4);
}

.tolls__no-results {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 1rem;
  padding: 36px 20px;
  text-align: center;
  color: #64748b;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.tolls__no-results-ico {
  color: #f59e0b;
}

.tolls__reset-btn {
  background: #0038A8;
  color: #ffffff;
  border: 0;
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.tolls__reset-btn:hover {
  background: #0284c7;
}

/* ── Banner de Viaje Ejecutivo (CTA) ── */
.tolls__cta-card {
  margin-top: 12px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 1.5rem;
  padding: clamp(24px, 4vw, 36px);
  color: #ffffff;
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.15);
  position: relative;
  overflow: hidden;
}

.tolls__cta-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 340px;
  height: 340px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 56, 168, 0.4) 0%, transparent 70%);
  pointer-events: none;
}

.tolls__cta-inner {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 24px;
}

@media (min-width: 860px) {
  .tolls__cta-inner {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}

.tolls__cta-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tolls__cta-title {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: clamp(20px, 1.8vw, 24px);
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.01em;
}

.tolls__cta-desc {
  color: #cbd5e1;
  font-size: clamp(14px, 1.05vw, 15.5px);
  line-height: 1.55;
  max-width: 65ch;
  margin: 0;
}

.tolls__cta-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.tolls__cta-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #0038A8;
  color: #ffffff;
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 14.5px;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.35);
  transition: all 0.2s ease;
}

.tolls__cta-btn-primary:hover {
  background: #0284c7;
  transform: translateY(-1px);
}

.tolls__cta-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #f8fafc;
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 14.5px;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.tolls__cta-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.4);
}

.tolls__skeleton {
  height: 76px;
  border-radius: 1.25rem;
  background: #f1f5f9;
  animation: tolls-pulse 1.4s ease-in-out infinite alternate;
}

@keyframes tolls-pulse {
  from { opacity: 1; }
  to { opacity: 0.5; }
}

@keyframes tollsFadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tolls__status {
  max-width: 560px;
}

@media (prefers-reduced-motion: reduce) {
  .tolls__head,
  .tolls__map-frame,
  .tolls__states,
  .tolls__metric-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>

