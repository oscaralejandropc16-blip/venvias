<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { DEBT_CONDITIONS } from '../constants/debt'

export default defineComponent({
  name: 'DebtConditionsView',
  components: { AppIcon },
  data() {
    return {
      conditions: DEBT_CONDITIONS,
      debtRoute: { name: ROUTE_NAMES.debt },
    }
  },
})
</script>

<template>
  <main class="conditions-view section wrap" aria-labelledby="conditions-title">
    <div class="conditions-nav">
      <RouterLink :to="debtRoute" class="conditions-back">
        <AppIcon name="arrow" :size="16" class="rotate-180" />
        Volver a la consulta de deudas
      </RouterLink>
    </div>

    <header class="conditions-hero">
      <span class="conditions-badge">
        <AppIcon name="recibo" :size="14" />
        {{ conditions.updatedAt }}
      </span>
      <h1 id="conditions-title" class="conditions-title">{{ conditions.title }}</h1>
      <p class="conditions-subtitle">{{ conditions.subtitle }}</p>
    </header>

    <div class="conditions-content">
      <article
        v-for="section in conditions.sections"
        :key="section.id"
        class="condition-card"
      >
        <h2 class="condition-card__title">{{ section.title }}</h2>
        <p class="condition-card__text">{{ section.content }}</p>
      </article>
    </div>

    <footer class="conditions-foot">
      <RouterLink :to="debtRoute" class="btn btn--primario">
        <AppIcon name="arrow" :size="18" />
        Consultar estado de una placa
      </RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.conditions-view {
  display: grid;
  gap: var(--space-8);
  max-width: 820px;
}

.conditions-nav {
  display: flex;
}

.conditions-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--azul-700);
  text-decoration: none;
  transition: color 0.15s;
}

.conditions-back:hover {
  text-decoration: underline;
}

.conditions-hero {
  display: grid;
  gap: var(--space-3);
  text-align: center;
  justify-items: center;
}

.conditions-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  background: var(--azul-100);
  color: var(--azul-700);
  padding: 4px 14px;
  border-radius: var(--radius-pill);
}

.conditions-title {
  font: 600 clamp(26px, 2.2vw + 16px, 36px)/1.2 var(--font-display);
  color: var(--marino-900);
}

.conditions-subtitle {
  font-size: 16px;
  color: var(--texto-suave);
  max-width: 58ch;
}

.conditions-content {
  display: grid;
  gap: var(--space-4);
}

.condition-card {
  padding: var(--space-8);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-md);
  box-shadow: var(--elev-1);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.condition-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--elev-2);
}

.condition-card__title {
  font: 600 20px/26px var(--font-display);
  color: var(--marino-900);
  margin-bottom: var(--space-3);
}

.condition-card__text {
  font-size: 15px;
  line-height: 1.7;
  color: var(--texto);
}

.conditions-foot {
  display: flex;
  justify-content: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--borde);
}
</style>
