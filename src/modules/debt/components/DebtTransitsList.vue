<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { DEBT_TEXT } from '../constants/debt'
import type { DebtTransit } from '../types/DebtTransit'

export default defineComponent({
  name: 'DebtTransitsList',
  components: { AppIcon },
  props: {
    transits: { type: Array as PropType<DebtTransit[]>, required: true },
  },
  data() {
    return {
      text: DEBT_TEXT,
    }
  },
})
</script>

<template>
  <div class="transits-wrap">
    <div class="transits-header">
      <h3 class="transits-title">{{ text.hasDebtTitle }}</h3>
      <span class="transits-count">{{ transits.length }} registros</span>
    </div>

    <div class="transits-list">
      <article
        v-for="transit in transits"
        :key="transit.id"
        class="transit-item"
        :class="`is-${transit.statusTone}`"
      >
        <div class="transit-item__icon">
          <AppIcon name="peaje" :size="20" />
        </div>

        <div class="transit-item__info">
          <div class="transit-item__main">
            <h4 class="transit-item__toll">{{ transit.tollName }}</h4>
            <span class="transit-item__badge" :class="`badge--${transit.statusTone}`">
              {{ transit.statusLabel }}
            </span>
          </div>

          <p class="transit-item__road">{{ transit.highway }} · {{ transit.state }}</p>

          <div class="transit-item__meta">
            <span class="meta-item">
              <AppIcon name="recibo" :size="14" />
              {{ transit.passedAtFormatted }}
            </span>
            <span class="meta-item">
              <AppIcon name="carro" :size="14" />
              {{ transit.category }}
            </span>
            <span v-if="transit.citationNumber" class="meta-item meta-item--citation">
              Ref: {{ transit.citationNumber }}
            </span>
          </div>
        </div>

        <div class="transit-item__amount">
          <span class="amount-value">{{ transit.amountFormatted }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.transits-wrap {
  display: grid;
  gap: var(--space-4);
}

.transits-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--borde);
}

.transits-title {
  font: 600 18px/24px var(--font-display);
  color: var(--marino-900);
}

.transits-count {
  font-size: 13px;
  color: var(--texto-suave);
  font-weight: 500;
}

.transits-list {
  display: grid;
  gap: var(--space-3);
}

.transit-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4) var(--space-5);
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-sm);
  box-shadow: var(--elev-1);
  transition: transform 0.15s var(--ease-out), box-shadow 0.15s var(--ease-out);
}

.transit-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(18, 33, 66, 0.08);
}

.transit-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: var(--fondo-frio);
  color: var(--azul-700);
  flex-shrink: 0;
}

.transit-item.is-alert .transit-item__icon {
  background: #fdf2f2;
  color: var(--rojo-sistema);
}

.transit-item__info {
  display: grid;
  gap: 4px;
}

.transit-item__main {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.transit-item__toll {
  margin: 0;
  font: 600 16px/20px var(--font-display);
  color: var(--marino-900);
}

.transit-item__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.badge--alert {
  background: #fdf2f2;
  color: var(--rojo-sistema);
}

.badge--warning {
  background: #fefce8;
  color: #854d0e;
}

.badge--success {
  background: #f0fdf4;
  color: var(--exito);
}

.transit-item__road {
  margin: 0;
  font-size: 13px;
  color: var(--texto-suave);
}

.transit-item__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 12px;
  color: var(--texto-suave);
  flex-wrap: wrap;
  margin-top: 2px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.meta-item--citation {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--azul-700);
  background: var(--azul-100);
  padding: 1px 6px;
  border-radius: 4px;
}

.transit-item__amount {
  text-align: right;
  flex-shrink: 0;
}

.amount-value {
  font: 600 18px/22px var(--font-mono);
  color: var(--marino-900);
}

@media (max-width: 640px) {
  .transit-item {
    grid-template-columns: 1fr auto;
  }
  .transit-item__icon {
    display: none;
  }
}
</style>
