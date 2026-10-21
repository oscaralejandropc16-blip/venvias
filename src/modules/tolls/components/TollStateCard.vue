<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { TOLLS_TEXT, tollsInStateLabel } from '../constants/tolls'
import type { TollStateGroup } from '../types/Toll'

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
        <div class="state-card__identity">
          <div class="state-card__icon-box" aria-hidden="true">
            <AppIcon name="peaje" :size="20" class="state-card__icon" />
          </div>
          <div class="state-card__text">
            <div class="state-card__name-row">
              <span class="state-card__name">{{ group.state }}</span>
              <span class="state-card__live-pill">
                <span class="state-card__live-dot" aria-hidden="true"></span>
                Operativo
              </span>
            </div>
            <span class="state-card__count">{{ countLabel }} · Red Nacional</span>
          </div>
        </div>

        <div class="state-card__action">
          <span class="state-card__action-text">{{ expanded ? 'Ocultar estaciones' : 'Ver estaciones' }}</span>
          <div class="state-card__chevron-btn" :class="{ 'state-card__chevron-btn--open': expanded }" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
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
        <div class="state-card__grid">
          <div
            v-for="t in group.tolls"
            :key="t.id"
            class="toll-tile"
            :class="{ 'toll-tile--selected': t.id === selectedId }"
          >
            <div class="toll-tile__top">
              <div class="toll-tile__badge" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div class="toll-tile__info">
                <h4 class="toll-tile__name">{{ t.name }}</h4>
                <p class="toll-tile__road">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toll-tile__road-icon" aria-hidden="true">
                    <path d="M4 19L8 5M16 5l4 14M12 5v14" />
                  </svg>
                  <span>{{ t.road || text.roadPending }}</span>
                </p>
              </div>
            </div>

            <div class="toll-tile__bottom">
              <span class="toll-tile__tech-tag">Cobro por placa</span>
              <button
                :id="`toll-${t.id}`"
                type="button"
                class="toll-tile__btn"
                :class="{ 'is-selected': t.id === selectedId }"
                :aria-pressed="t.id === selectedId"
                @click="$emit('select', t.id)"
              >
                <span>{{ t.id === selectedId ? 'En el mapa' : 'Ubicar en mapa' }}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.state-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.state-card:hover {
  box-shadow: 0 10px 30px -4px rgba(0, 56, 168, 0.08);
  border-color: #cbd5e1;
}

.state-card--open {
  border-color: rgba(0, 56, 168, 0.35);
  box-shadow: 0 12px 35px -6px rgba(0, 56, 168, 0.1);
}

.state-card__heading {
  margin: 0;
  font: inherit;
}

.state-card__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 22px;
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease;
}

.state-card__toggle:hover {
  background: #f8fafc;
}

.state-card--open .state-card__toggle {
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
}

.state-card__toggle:focus-visible {
  outline: 2px solid #0038A8;
  outline-offset: -2px;
}

.state-card__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.state-card__icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 56, 168, 0.08), rgba(56, 189, 248, 0.12));
  border: 1px solid rgba(0, 56, 168, 0.14);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.state-card__toggle:hover .state-card__icon-box,
.state-card--open .state-card__icon-box {
  background: #0038A8;
  border-color: #0038A8;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.25);
}

.state-card__icon {
  color: #0038A8;
  transition: color 0.25s ease;
}

.state-card__toggle:hover .state-card__icon,
.state-card--open .state-card__icon {
  color: #ffffff;
}

.state-card__text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.state-card__name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.state-card__name {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}

.state-card__live-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  font-size: 11px;
  font-weight: 600;
}

.state-card__live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.state-card__count {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.state-card__action {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.state-card__action-text {
  font-size: 13.5px;
  font-weight: 600;
  color: #0038A8;
  transition: color 0.2s;
}

.state-card__chevron-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: grid;
  place-items: center;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.state-card__toggle:hover .state-card__chevron-btn {
  border-color: #0038A8;
  color: #0038A8;
}

.state-card__chevron-btn--open {
  transform: rotate(180deg);
  background: #0038A8;
  border-color: #0038A8;
  color: #ffffff !important;
}

/* Panel Desplegable */
.state-card__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.state-card--open .state-card__panel {
  grid-template-rows: 1fr;
}

.state-card__clip {
  overflow: hidden;
}

.state-card__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 16px 20px 22px;
  background: #fbfcfe;
}

@media (min-width: 640px) {
  .state-card__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Ficha / Tarjeta de Peaje Individual */
.toll-tile {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.toll-tile:hover {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow: 0 8px 20px -4px rgba(0, 56, 168, 0.1);
}

.toll-tile--selected {
  border-color: #0038A8;
  background: #f0f7ff;
  box-shadow: 0 0 0 2px rgba(0, 56, 168, 0.2), 0 8px 24px -4px rgba(0, 56, 168, 0.15);
}

.toll-tile__top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.toll-tile__badge {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: rgba(0, 56, 168, 0.08);
  color: #0038A8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.toll-tile--selected .toll-tile__badge {
  background: #0038A8;
  color: #ffffff;
}

.toll-tile__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.toll-tile__name {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.25;
}

.toll-tile__road {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}

.toll-tile__road-icon {
  color: #64748b;
  flex-shrink: 0;
}

.toll-tile__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.toll-tile__tech-tag {
  font-size: 11.5px;
  font-weight: 600;
  color: #0284c7;
  letter-spacing: 0.02em;
}

.toll-tile__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0038A8;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toll-tile__btn:hover {
  background: #0038A8;
  border-color: #0038A8;
  color: #ffffff;
}

.toll-tile__btn.is-selected {
  background: #0038A8;
  border-color: #0038A8;
  color: #ffffff;
}

@media (max-width: 640px) {
  .state-card__toggle {
    padding: 14px 16px;
  }
  .state-card__action-text {
    display: none;
  }
  .state-card__name {
    font-size: 16px;
  }
  .toll-tile {
    padding: 12px 14px;
  }
}
</style>
