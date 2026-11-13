<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { TOLLS_TEXT, tollsInStateLabel } from '../constants/tolls'
import type { TollStateGroup } from '../types/Toll'

/**
 * Tarjeta desplegable de un estado con sus peajes. Solo presenta: la vista decide
 * qué tarjeta está abierta y qué peaje está seleccionado.
 */
export default defineComponent({
  name: 'TollStateCard',
  components: { AppIcon },
  props: {
    group: { type: Object as PropType<TollStateGroup>, required: true },
    expanded: { type: Boolean, default: false },
    selectedId: { type: String as PropType<string | null>, default: null },
  },
  emits: {
    toggle: () => true,
    select: (id: string) => typeof id === 'string',
  },
  data() {
    return { text: TOLLS_TEXT }
  },
  computed: {
    slug(): string {
      return this.group.state.toLowerCase().replace(/\s+/g, '-')
    },
    countLabel(): string {
      return tollsInStateLabel(this.group.tolls.length)
    },
  },
})
</script>

<template>
  <article class="state-card" :class="{ 'state-card--open': expanded }">
    <h3 class="state-card__heading">
      <button
        :id="`estado-${slug}`"
        type="button"
        class="state-card__toggle"
        :aria-expanded="expanded"
        :aria-controls="`estado-${slug}-peajes`"
        @click="$emit('toggle')"
      >
        <span class="state-card__name">{{ group.state }}</span>
        <span class="state-card__count">{{ countLabel }}</span>
        <AppIcon name="chevron" :size="22" class="state-card__chevron" />
      </button>
    </h3>
    <div
      :id="`estado-${slug}-peajes`"
      class="state-card__panel"
      role="region"
      :aria-labelledby="`estado-${slug}`"
      :inert="!expanded"
    >
      <div class="state-card__clip">
        <ul class="plain-list divided state-card__rows">
          <li v-for="t in group.tolls" :key="t.id">
            <button
              :id="`toll-${t.id}`"
              type="button"
              class="toll-row"
              :aria-pressed="t.id === selectedId"
              @click="$emit('select', t.id)"
            >
              <span class="toll-row__name">{{ t.name }}</span>
              <span class="toll-row__road">{{ t.road || text.roadPending }}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<style scoped>
.state-card {
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  transition: border-color 0.2s var(--ease-out);
}
.state-card:hover, .state-card--open { border-color: var(--azul-100); }
.state-card__heading { margin: 0; font: inherit; }
.state-card__toggle {
  width: 100%; display: flex; align-items: center; gap: var(--space-3);
  padding: var(--space-4) var(--space-6); min-height: 72px;
  background: none; border: 0; border-radius: var(--radius-md); cursor: pointer; text-align: left;
}
.state-card__toggle:focus-visible { outline-offset: -3px; }
.state-card__name { font: 500 20px/28px var(--font-display); color: var(--marino-900); }
.state-card__count { font: 400 14px/20px var(--font-body); color: var(--texto-suave); }
.state-card__chevron {
  margin-left: auto; flex: none; color: var(--azul-700);
  transition: transform 0.3s var(--ease-out);
}
.state-card--open .state-card__chevron { transform: rotate(180deg); }

/* Despliegue: la fila de la grilla crece de 0fr a 1fr, sin medir alturas. */
.state-card__panel {
  display: grid; grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s var(--ease-out);
}
.state-card--open .state-card__panel { grid-template-rows: 1fr; }
.state-card__clip { overflow: hidden; min-height: 0; }
.state-card__rows { margin: 0 var(--space-3) var(--space-3); }
.state-card__rows > li { padding-block: var(--space-1); }
.state-card__rows > li:last-child { border-bottom: 0; }

.toll-row {
  width: 100%; display: grid; gap: 2px; text-align: left; cursor: pointer;
  padding: var(--space-3); border: 0; border-radius: var(--radius-sm);
  background: transparent;
  transition: background-color 0.2s var(--ease-out);
}
.toll-row:hover { background: var(--fondo-frio); }
.toll-row[aria-pressed='true'] { background: var(--azul-100); }
.toll-row:focus-visible { outline-offset: 0; }
.toll-row__name { font: 500 18px/26px var(--font-display); color: var(--marino-900); }
.toll-row__road { font: 400 14px/20px var(--font-body); color: var(--texto-suave); }
.toll-row[aria-pressed='true'] .toll-row__road { color: var(--texto); }
</style>
