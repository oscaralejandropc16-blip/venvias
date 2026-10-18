<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlatePreview from '@/modules/plates/components/PlatePreview.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import type { AccountVehicle } from '../types/AccountTypes'

export default defineComponent({
  name: 'AccountVehiclesTable',
  components: { AppIcon, PlatePreview },
  props: {
    vehicles: { type: Array as PropType<AccountVehicle[]>, required: true },
  },
  emits: ['add-vehicle'],
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
  <div class="vehicles-wrap">
    <div class="vehicles-header">
      <div>
        <h3 class="vehicles-title">Vehículos y TAGs asociados</h3>
        <p class="vehicles-sub">Consulta el saldo individual y estado del dispositivo de cada unidad.</p>
      </div>
      <button type="button" class="btn btn--primario btn--sm" @click="$emit('add-vehicle')">
        <AppIcon name="plus" :size="16" />
        Asociar vehículo
      </button>
    </div>

    <div class="vehicles-grid">
      <article v-for="v in vehicles" :key="v.plate" class="v-card">
        <div class="v-card__top">
          <PlatePreview :value="v.plate" size="sm" />
          <span class="v-badge" :class="`v-badge--${v.tagStatusTone}`">
            <AppIcon v-if="v.tagStatus === 'ACTIVE'" name="check" :size="14" />
            <AppIcon v-else name="info" :size="14" />
            {{ v.tagStatusLabel }}
          </span>
        </div>

        <div class="v-card__body">
          <h4 class="v-card__alias">{{ v.alias }}</h4>
          <p v-if="v.tagId" class="v-card__tag">
            <AppIcon name="recibo" :size="14" />
            TAG: <strong>{{ v.tagId }}</strong>
          </p>
          <p v-else class="v-card__tag text-suave">Sin dispositivo TAG vinculado</p>
        </div>

        <div class="v-card__footer">
          <div class="v-card__balance">
            <span class="bal-label">Saldo disponible</span>
            <span class="bal-value">{{ v.balanceFormatted }}</span>
          </div>

          <RouterLink :to="vehicleRechargeRoute(v.plate)" class="btn btn--secundario btn--sm">
            <AppIcon name="rayo" :size="14" />
            Recargar
          </RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.vehicles-wrap {
  display: grid;
  gap: var(--space-4);
}

.vehicles-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.vehicles-title {
  font: 600 18px/24px var(--font-display);
  color: var(--marino-900);
}

.vehicles-sub {
  font-size: 14px;
  color: var(--texto-suave);
  margin-top: 2px;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: var(--space-4);
}

.v-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-xl, 20px);
  padding: var(--space-6);
  box-shadow: 0 10px 28px -6px rgba(18, 33, 66, 0.06), 0 1px 3px rgba(18, 33, 66, 0.04);
  display: grid;
  gap: var(--space-4);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out), border-color 0.2s var(--ease-out);
  animation: vCardIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes vCardIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.v-card:hover {
  transform: translateY(-3px);
  border-color: #0038A8;
  box-shadow: 0 16px 36px -8px rgba(0, 56, 168, 0.12);
}

.v-card :deep(.plate) {
  transition: transform 0.25s var(--ease-out);
}
.v-card:hover :deep(.plate) {
  transform: scale(1.03);
}

.v-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.v-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
}

.v-badge--success {
  background: #f0fdf4;
  color: var(--exito);
  border: 1px solid rgba(0, 177, 64, 0.2);
}

.v-badge--warning {
  background: #fefce8;
  color: #854d0e;
  border: 1px solid rgba(234, 179, 8, 0.3);
}

.v-badge--alert {
  background: #fdf2f2;
  color: var(--rojo-sistema);
  border: 1px solid rgba(207, 20, 43, 0.2);
}

.v-card__body {
  display: grid;
  gap: 2px;
}

.v-card__alias {
  margin: 0;
  font: 600 15px/20px var(--font-display);
  color: var(--marino-900);
}

.v-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--texto-suave);
  margin: 0;
}

.v-card__tag strong {
  font-family: var(--font-mono);
  color: var(--azul-700);
}

.v-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-3);
  border-top: 1px solid var(--borde);
  gap: var(--space-2);
}

.v-card__balance {
  display: grid;
}

.bal-label {
  font-size: 11px;
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.bal-value {
  font: 600 16px/20px var(--font-mono);
  color: var(--marino-900);
}

.text-suave {
  color: var(--texto-suave);
}

@media (prefers-reduced-motion: reduce) {
  .v-card,
  .v-card :deep(.plate) {
    animation: none !important;
    transition: none !important;
  }
}
</style>
