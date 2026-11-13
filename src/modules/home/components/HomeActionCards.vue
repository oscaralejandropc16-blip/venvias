<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { HomeActionCardItem } from '../types/Home'

export default defineComponent({
  name: 'HomeActionCards',
  components: { AppIcon },
  props: {
    cards: {
      type: Array as PropType<HomeActionCardItem[]>,
      required: true,
    },
  },
})
</script>

<template>
  <div class="cards-grid" role="region" aria-label="Opciones de servicio">
    <article
      v-for="card in cards"
      :key="card.id"
      class="action-card"
      :class="{ 'action-card--primary': card.primary }"
    >
      <div class="action-card__header">
        <div class="action-card__icon" aria-hidden="true">
          <AppIcon :name="card.icon" :size="24" />
        </div>
        <span v-if="card.badge" class="action-card__badge">{{ card.badge }}</span>
      </div>

      <div class="action-card__body">
        <h2 class="action-card__title">{{ card.title }}</h2>
        <p class="action-card__desc">{{ card.description }}</p>
      </div>

      <div class="action-card__footer">
        <RouterLink
          :to="card.route"
          class="btn action-card__btn"
          :class="card.primary ? 'btn--primario' : 'btn--secundario'"
        >
          <span>{{ card.buttonText }}</span>
          <AppIcon name="arrow" :size="18" />
        </RouterLink>
      </div>
    </article>
  </div>
</template>

<style scoped>
.cards-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: 1fr;
  width: 100%;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}

.action-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-lg);
  padding: clamp(24px, 3vw, 32px);
  box-shadow: var(--elev-1);
  transition:
    transform 0.25s var(--ease-out),
    box-shadow 0.25s var(--ease-out),
    border-color 0.25s var(--ease-out);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--elev-card);
  border-color: var(--borde-fuerte);
}

.action-card--primary {
  border-color: rgba(0, 87, 163, 0.35);
  background: linear-gradient(180deg, #ffffff 0%, var(--fondo-frio) 100%);
}

.action-card--primary:hover {
  border-color: var(--azul-700);
}

.action-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.action-card__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--azul-100);
  color: var(--azul-700);
  transition:
    background-color 0.2s var(--ease-out),
    color 0.2s var(--ease-out);
}

.action-card:hover .action-card__icon {
  background: var(--azul-700);
  color: #ffffff;
}

.action-card__badge {
  font: 500 12px/1 var(--font-mono);
  padding: 6px 10px;
  border-radius: var(--radius-pill);
  background: var(--azul-100);
  color: var(--azul-700);
  letter-spacing: 0.02em;
}

.action-card__body {
  flex: 1 1 auto;
}

.action-card__title {
  font: 600 clamp(20px, 1.3vw + 16px, 24px) / 1.25 var(--font-display);
  color: var(--marino-900);
  margin-bottom: var(--space-2);
}

.action-card__desc {
  font: 400 15px / 23px var(--font-body);
  color: var(--texto-suave);
  margin-bottom: var(--space-6);
  max-width: 38ch;
}

.action-card__footer {
  margin-top: auto;
}

.action-card__btn {
  width: 100%;
  justify-content: center;
  min-height: 48px;
  font-size: 15px;
}
</style>
