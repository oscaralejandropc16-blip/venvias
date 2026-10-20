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
            <span class="state-card__name">{{ group.state }}</span>
            <span class="state-card__count">{{ countLabel }}</span>
          </div>
        </div>

        <div class="state-card__action">
          <span class="state-card__action-text">{{ expanded ? 'Ocultar' : 'Ver peajes' }}</span>
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
        <ul class="plain-list state-card__rows">
          <li v-for="t in group.tolls" :key="t.id">
            <button
              :id="`toll-${t.id}`"
              type="button"
              class="toll-row"
              :class="{ 'toll-row--selected': t.id === selectedId }"
              :aria-pressed="t.id === selectedId"
              @click="$emit('select', t.id)"
            >
              <div class="toll-row__main">
                <div class="toll-row__marker" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div class="toll-row__details">
                  <span class="toll-row__name">{{ t.name }}</span>
                  <span class="toll-row__road">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="toll-row__road-icon" aria-hidden="true">
                      <path d="M4 19L8 5M16 5l4 14M12 5v14" />
                    </svg>
                    {{ t.road || text.roadPending }}
                  </span>
                </div>
              </div>

              <div class="toll-row__action">
                <span class="toll-row__locate-btn">
                  <span>Ubicar en mapa</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </article>
</template>

<style scoped>
.state-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.state-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(0, 56, 168, 0.08);
  border-color: #cbd5e1;
}

.state-card--open {
  border-color: #0038A8;
  box-shadow: 0 10px 28px -4px rgba(0, 56, 168, 0.12);
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
  border-bottom: 1px solid #f1f5f9;
}

.state-card__toggle:focus-visible {
  outline: 2px solid #0038A8;
  outline-offset: -2px;
}

.state-card__identity {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.state-card__icon-box {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: rgba(0, 56, 168, 0.06);
  border: 1px solid rgba(0, 56, 168, 0.12);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.state-card__toggle:hover .state-card__icon-box,
.state-card--open .state-card__icon-box {
  background: #0038A8;
  border-color: #0038A8;
}

.state-card__icon {
  color: #0038A8;
  transition: color 0.2s ease;
}

.state-card__toggle:hover .state-card__icon,
.state-card--open .state-card__icon {
  color: #ffffff;
}

.state-card__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.state-card__name {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 17.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}

.state-card__count {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.state-card__action {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.state-card__action-text {
  font-size: 13px;
  font-weight: 600;
  color: #0038A8;
  transition: opacity 0.2s;
}

.state-card__chevron-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: grid;
  place-items: center;
  color: #0038A8;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.state-card__toggle:hover .state-card__chevron-btn {
  background: #0038A8;
  border-color: #0038A8;
  color: #ffffff;
}

.state-card__chevron-btn--open {
  transform: rotate(180deg);
  background: rgba(0, 56, 168, 0.08);
  border-color: rgba(0, 56, 168, 0.2);
  color: #0038A8;
}

/* ── Panel Desplegable (Accordion) ── */
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
  min-height: 0;
}

.state-card__rows {
  margin: 0;
  padding: 14px 18px 18px;
  background: #f8fafc;
  display: grid;
  gap: 8px;
}

.state-card__rows > li {
  list-style: none;
}

/* ── Fila de Peaje Re-diseñada ── */
.toll-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 13px 18px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.toll-row:hover {
  border-color: #0038A8;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.08);
  transform: translateX(3px);
}

.toll-row--selected,
.toll-row[aria-pressed='true'] {
  background: #eff6ff;
  border-color: #0038A8;
  box-shadow: 0 4px 16px rgba(0, 56, 168, 0.12);
}

.toll-row:focus-visible {
  outline: 2px solid #0038A8;
  outline-offset: 1px;
}

.toll-row__main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.toll-row__marker {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(0, 56, 168, 0.06);
  color: #0038A8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.toll-row:hover .toll-row__marker,
.toll-row--selected .toll-row__marker {
  background: #0038A8;
  color: #ffffff;
}

.toll-row__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.toll-row__name {
  font-family: var(--font-display, Poppins, sans-serif);
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.toll-row__road {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12.5px;
  color: #64748b;
}

.toll-row__road-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.toll-row__action {
  flex-shrink: 0;
}

.toll-row__locate-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: #0038A8;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.toll-row:hover .toll-row__locate-btn,
.toll-row--selected .toll-row__locate-btn {
  background: #0038A8;
  color: #ffffff;
}

@media (max-width: 640px) {
  .state-card__toggle {
    padding: 14px 16px;
  }
  .state-card__action-text {
    display: none;
  }
  .state-card__rows {
    padding: 10px 12px 14px;
  }
  .toll-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
  }
  .toll-row__action {
    width: 100%;
  }
  .toll-row__locate-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-card,
  .state-card__chevron-btn,
  .state-card__panel,
  .toll-row {
    animation: none !important;
    transition: none !important;
  }
}
</style>
