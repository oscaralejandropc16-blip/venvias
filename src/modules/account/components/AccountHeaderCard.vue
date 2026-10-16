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
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-md);
  padding: var(--space-8);
  box-shadow: var(--elev-1);
  display: grid;
  gap: var(--space-6);
  transition: box-shadow 0.2s var(--ease-out);
}

.acc-header:hover {
  box-shadow: var(--elev-2);
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
  gap: var(--space-5);
}

.acc-header__avatar {
  width: 58px;
  height: 58px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 87, 163, 0.25);
}

.acc-header__badge {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--azul-700);
  background: var(--azul-100);
  padding: 3px 10px;
  border-radius: var(--radius-pill);
  letter-spacing: 0.04em;
  margin-bottom: 6px;
}

.acc-header__name {
  font: 600 22px/28px var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.acc-header__doc {
  font-size: 14px;
  color: var(--texto-suave);
  margin-top: 4px;
}

.acc-header__metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-4);
  padding-top: var(--space-6);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
}

.metric-card {
  display: grid;
  gap: 4px;
  background: var(--fondo);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(226, 232, 240, 0.6);
}

.metric-card__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--texto-suave);
}

.metric-card__val {
  font: 600 26px/30px var(--font-display);
  color: var(--marino-900);
}

.text-mono {
  font-family: var(--font-mono);
  color: var(--marino-900);
}

.text-exito {
  color: var(--exito);
}
</style>
