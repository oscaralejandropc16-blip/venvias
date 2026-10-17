<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlatePreview from '@/modules/plates/components/PlatePreview.vue'
import { DEBT_TEXT } from '../constants/debt'
import type { DebtSummary } from '../types/DebtSummary'

export default defineComponent({
  name: 'DebtSummaryCard',
  components: { AppIcon, PlatePreview },
  props: {
    debt: { type: Object as PropType<DebtSummary>, required: true },
    paying: { type: Boolean, default: false },
  },
  emits: ['pay', 'another'],
  data() {
    return {
      text: DEBT_TEXT,
    }
  },
})
</script>

<template>
  <div class="debt-card" :class="`is-${debt.statusTone}`">
    <div class="debt-card__header">
      <PlatePreview :value="debt.plate" size="sm" />
      <span class="debt-card__badge" :class="`badge--${debt.statusTone}`">
        <AppIcon v-if="debt.totalDebt > 0" name="alert" :size="16" />
        <AppIcon v-else name="check" :size="16" />
        {{ debt.statusLabel }}
      </span>
    </div>

    <div class="debt-card__body">
      <p class="debt-card__label">{{ text.totalToPay }}</p>
      <div class="debt-card__amount">{{ debt.totalDebtFormatted }}</div>
      <p class="debt-card__count">{{ text.transitsCount(debt.transitsCount) }}</p>
    </div>

    <div class="debt-card__actions">
      <button
        v-if="debt.totalDebt > 0"
        type="button"
        class="btn btn--primario w-full"
        :disabled="paying"
        @click="$emit('pay')"
      >
        <AppIcon v-if="paying" name="rayo" :size="18" class="animate-spin" />
        <AppIcon v-else name="rayo" :size="18" />
        {{ paying ? 'Procesando pago...' : text.payAllBtn }}
      </button>
      <button type="button" class="btn btn--secundario btn--sm w-full" @click="$emit('another')">
        Consultar otra placa
      </button>
    </div>
  </div>
</template>

<style scoped>
.debt-card {
  display: grid;
  gap: var(--space-6);
  padding: var(--space-8);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-2xl, 24px);
  box-shadow: 0 16px 40px -10px rgba(18, 33, 66, 0.08), 0 1px 3px rgba(18, 33, 66, 0.04);
  text-align: center;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out), border-color 0.2s var(--ease-out);
}

.debt-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 48px -10px rgba(18, 33, 66, 0.12);
}

.debt-card.is-alert {
  border-color: rgba(207, 20, 43, 0.35);
  box-shadow: 0 16px 40px -10px rgba(207, 20, 43, 0.12);
}

.debt-card.is-warning {
  border-color: rgba(247, 209, 23, 0.5);
  box-shadow: 0 16px 40px -10px rgba(234, 179, 8, 0.12);
}

.debt-card.is-success {
  border-color: rgba(0, 177, 64, 0.35);
  box-shadow: 0 16px 40px -10px rgba(0, 177, 64, 0.12);
}

.debt-card__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.debt-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
}

.badge--alert {
  background: #fdf2f2;
  color: var(--rojo-sistema);
  border: 1px solid rgba(207, 20, 43, 0.2);
}

.badge--warning {
  background: #fefce8;
  color: #854d0e;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.badge--success {
  background: #f0fdf4;
  color: var(--exito);
  border: 1px solid rgba(0, 177, 64, 0.2);
}

.debt-card__body {
  display: grid;
  gap: var(--space-2);
}

.debt-card__label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--texto-suave);
  font-weight: 600;
}

.debt-card__amount {
  font: 800 clamp(38px, 4vw + 20px, 52px)/1.1 var(--font-mono);
  color: #122142;
}

.debt-card__count {
  font-size: 14px;
  color: var(--texto-suave);
}

.debt-card__actions {
  display: grid;
  gap: var(--space-3);
}

.debt-card__actions .btn--primario {
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.25);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.debt-card__actions .btn--primario:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 56, 168, 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .debt-card,
  .debt-card__actions .btn--primario {
    transform: none !important;
  }
}
</style>
