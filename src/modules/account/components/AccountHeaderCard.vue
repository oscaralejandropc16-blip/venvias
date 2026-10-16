<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { ACCOUNT_TEXT } from '../constants/account'
import type { AccountProfile } from '../types/AccountTypes'

export default defineComponent({
  name: 'AccountHeaderCard',
  components: { AppIcon },
  props: {
    profile: { type: Object as PropType<AccountProfile>, required: true },
  },
  data() {
    return {
      text: ACCOUNT_TEXT,
      rechargeRoute: { name: ROUTE_NAMES.recharge },
    }
  },
})
</script>

<template>
  <div class="acc-header">
    <div class="acc-header__top">
      <div class="acc-header__identity">
        <div class="acc-header__avatar">
          <AppIcon name="carro" :size="24" />
        </div>
        <div>
          <span class="acc-header__badge">{{ text.badge }}</span>
          <h2 class="acc-header__name">{{ profile.name }}</h2>
          <p class="acc-header__doc">RIF / Doc: <strong>{{ profile.documentId }}</strong> · {{ profile.email }}</p>
        </div>
      </div>

      <div class="acc-header__cta">
        <RouterLink :to="rechargeRoute" class="btn btn--primario">
          <AppIcon name="rayo" :size="18" />
          {{ text.actions.rechargeFleet }}
        </RouterLink>
      </div>
    </div>

    <div class="acc-header__metrics">
      <div class="metric-card">
        <span class="metric-card__label">{{ text.stats.totalBalance }}</span>
        <span class="metric-card__val text-mono">{{ profile.totalBalanceFormatted }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-card__label">{{ text.stats.vehiclesCount }}</span>
        <span class="metric-card__val">{{ profile.vehiclesCount }}</span>
      </div>
      <div class="metric-card">
        <span class="metric-card__label">{{ text.stats.activeTags }}</span>
        <span class="metric-card__val text-exito">{{ profile.activeTagsCount }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.acc-header {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--elev-1);
  display: grid;
  gap: var(--space-6);
}

.acc-header__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.acc-header__identity {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.acc-header__avatar {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--fondo-frio);
  color: var(--azul-700);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.acc-header__badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--azul-700);
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.acc-header__name {
  font: 600 20px/26px var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.acc-header__doc {
  font-size: 13px;
  color: var(--texto-suave);
  margin-top: 2px;
}

.acc-header__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--borde);
}

.metric-card {
  display: grid;
  gap: 4px;
}

.metric-card__label {
  font-size: 13px;
  color: var(--texto-suave);
}

.metric-card__val {
  font: 600 24px/28px var(--font-display);
  color: var(--marino-900);
}

.text-mono {
  font-family: var(--font-mono);
}

.text-exito {
  color: var(--exito);
}
</style>
