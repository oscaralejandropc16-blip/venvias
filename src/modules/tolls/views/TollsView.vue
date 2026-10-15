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
      /** Estados con la tarjeta abierta; pueden estar abiertas varias a la vez. */
      openStates: [] as string[],
      loaded: false,
      skeletonCards: SKELETON_CARDS,
    }
  },
  computed: {
    groups(): TollStateGroup[] {
      return groupTollsByState(this.tolls)
    },
    countLabel(): string {
      return tollsCountLabel(this.tolls.length, this.groups.length)
    },
    selectedToll(): Toll | null {
      return this.tolls.find((t) => t.id === this.selectedId) ?? null
    },
    announcement(): string {
      const t = this.selectedToll
      return t ? `${t.name}, ${t.state}. ${t.road || this.text.roadPending}.` : ''
    },
  },
  mounted() {
    void this.load()
  },
  methods: {
    async load(): Promise<void> {
      await this.fetchTolls()
      this.loaded = true
    },
    isOpen(state: string): boolean {
      return this.openStates.includes(state)
    },
    toggleState(state: string): void {
      this.openStates = this.isOpen(state)
        ? this.openStates.filter((s) => s !== state)
        : [...this.openStates, state]
    },
    selectFromList(id: string): void {
      this.selectedId = id
      // El mapa queda arriba de las tarjetas: si su borde superior salió de la vista, se trae
      // de vuelta para que se vea el vuelo al pin.
      const map = (this.$refs.map as { $el: HTMLElement } | undefined)?.$el
      if (map && map.getBoundingClientRect().top < 0) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        map.scrollIntoView({ block: 'start', behavior: reduced ? 'auto' : 'smooth' })
      }
    },
    selectFromMap(id: string | null): void {
      this.selectedId = id
      const toll = this.tolls.find((t) => t.id === id)
      // Tocar un pin abre la tarjeta de su estado, sin mover la página fuera del mapa.
      if (toll && !this.isOpen(toll.state)) this.openStates = [...this.openStates, toll.state]
    },
  },
})
</script>

<template>
  <section class="section wrap tolls" aria-labelledby="tolls-title">
    <header class="tolls__head">
      <h1 id="tolls-title">{{ text.title }}</h1>
      <p class="tolls__intro">{{ text.intro }}</p>
      <p v-if="tolls.length" class="tolls__count">
        <AppIcon name="peaje" :size="20" class="icon-accent" />{{ countLabel }}
      </p>
      <p v-if="tolls.length" class="tolls__note">{{ text.roadsNote }}</p>
    </header>

    <template v-if="tollsLoading || !loaded">
      <p class="visually-hidden">{{ text.loading }}</p>
      <div class="tolls__map tolls__map--placeholder" aria-hidden="true" />
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

    <template v-else>
      <TollsMap ref="map" class="tolls__map" :tolls="tolls" :selected-id="selectedId" @select="selectFromMap" />
      <section class="tolls__states" aria-labelledby="tolls-states-title">
        <h2 id="tolls-states-title" class="tolls__states-title">{{ text.statesTitle }}</h2>
        <div class="tolls__cards">
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
.tolls { display: grid; gap: var(--space-8); }
.tolls__head { display: grid; gap: var(--space-3); }
.tolls__head h1 { font-size: clamp(30px, 2vw + 20px, 44px); line-height: 1.15; font-weight: 600; }
.tolls__intro { max-width: 56ch; color: var(--texto-suave); }
.tolls__count {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-1); font: 500 15px/20px var(--font-body); color: var(--marino-900);
}
.tolls__note { margin-top: calc(-1 * var(--space-2)); font-size: 14px; line-height: 20px; color: var(--texto-suave); }

/* El mapa ocupa todo el ancho de la página */
.tolls__map { height: max(320px, 55svh); scroll-margin-top: 80px; }
.tolls__map--placeholder { border-radius: var(--radius-md); background: var(--fondo-frio); border: 1px solid var(--borde); }

.tolls__states { display: grid; gap: var(--space-4); }
.tolls__states-title { font-size: clamp(22px, 1vw + 16px, 26px); line-height: 1.25; }
/* Una tarjeta por fila, a todo el ancho */
.tolls__cards { display: grid; gap: var(--space-4); }

.tolls__skeleton {
  height: 72px; border-radius: var(--radius-md); background: var(--fondo-frio);
  animation: tolls-pulse 1.4s var(--ease-out) infinite alternate;
}
@keyframes tolls-pulse { from { opacity: 1; } to { opacity: 0.5; } }

.tolls__status { max-width: 560px; }

@media (min-width: 900px) {
  .tolls__map { height: clamp(440px, calc(100svh - 360px), 680px); }
}
</style>
