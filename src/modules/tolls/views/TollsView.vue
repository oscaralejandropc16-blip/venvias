<script lang="ts">
import { defineComponent } from 'vue'
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
  components: { EmptyState, AppIcon, TollsMap, TollStateCard },
  setup() {
    return { ...useTollsList() }
  },
  data() {
    return {
      text: TOLLS_TEXT,
      selectedId: null as string | null,
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
      if (!this.searchQuery.trim()) return this.tolls
      const q = this.searchQuery.trim().toLowerCase()
      return this.tolls.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.state.toLowerCase().includes(q) ||
          (t.road && t.road.toLowerCase().includes(q))
      )
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
        // Al buscar, expande automáticamente los estados que tengan coincidencias
        this.openStates = this.groups.map((g) => g.state)
      } else {
        // Al limpiar la búsqueda, regresa a la vista limpia cerrada
        this.openStates = []
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
      // Los acordeones inician cerrados por defecto para una vista limpia y ejecutiva
      this.openStates = []
    },
    clearSearch(): void {
      this.searchQuery = ''
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
          Pasa por cualquiera de estos peajes y el cobro se realiza automáticamente por lectura de tu placa venezolana, sin detenerte en cabina.
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
          <div class="tolls__metric-lbl">Paso Continuo ALPR</div>
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
      <!-- Mapa Oficial de Peajes -->
      <div class="tolls__map-wrapper">
        <TollsMap ref="map" class="tolls__map" :tolls="tolls" :selected-id="selectedId" @select="selectFromMap" />
      </div>

      <!-- Barra de Búsqueda Interactiva -->
      <div class="tolls__controls">
        <div class="tolls__search-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tolls__search-icon" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="tolls__search-input"
            placeholder="Buscar por peaje, estado o autopista..."
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
              {{ text.statesTitle }}
            </h2>
            <span class="tolls__states-caption">{{ text.roadsNote }}</span>
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
          <AppIcon name="alert" :size="24" class="tolls__no-results-ico" />
          <p>No se encontraron peajes que coincidan con "<strong>{{ searchQuery }}</strong>".</p>
          <button type="button" class="tolls__reset-btn" @click="clearSearch">Ver todos los peajes</button>
        </div>

        <!-- Acordeón de tarjetas de estados -->
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

/* ── Mapa y Contenedor ── */
.tolls__map-wrapper {
  position: relative;
  border-radius: 1.5rem;
  box-shadow: 0 20px 45px -10px rgba(0, 56, 168, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.9);
  overflow: hidden;
  animation: tollsFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.tolls__map {
  height: clamp(380px, 60svh, 580px);
  scroll-margin-top: 80px;
}

.tolls__map-skeleton {
  height: 440px;
  border-radius: 1.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  animation: tolls-pulse 1.4s ease-in-out infinite alternate;
}

/* ── Barra de Búsqueda Interactiva ── */
.tolls__controls {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: -8px;
}

.tolls__search-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.tolls__search-icon {
  position: absolute;
  left: 16px;
  color: #64748b;
  pointer-events: none;
}

.tolls__search-input {
  width: 100%;
  height: 52px;
  padding: 0 44px 0 46px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 15px;
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.tolls__search-input:focus {
  outline: none;
  border-color: #0038A8;
  box-shadow: 0 0 0 3px rgba(0, 56, 168, 0.12);
}

.tolls__search-clear {
  position: absolute;
  right: 14px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 0;
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
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
  gap: var(--space-3);
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
  .tolls__map-wrapper,
  .tolls__states,
  .tolls__metric-card {
    animation: none !important;
    transition: none !important;
  }
}
</style>
