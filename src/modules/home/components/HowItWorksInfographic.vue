<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import infographic from '@/assets/how-it-works/cobro-por-placa.png'
import { HOW_IT_WORKS_INFOGRAPHIC } from '../constants/howItWorks.infographic'

export default defineComponent({
  name: 'HowItWorksInfographic',
  components: { AppIcon },
  data() {
    return {
      infographic,
      content: HOW_IT_WORKS_INFOGRAPHIC,
    }
  },
})
</script>

<template>
  <div class="infographic-card">
    <div class="infographic-tricolor" aria-hidden="true"></div>

    <div class="infographic-card__header">
      <div class="infographic-card__meta">
        <div class="infographic-card__kicker">
          <span class="infographic-card__kicker-line" aria-hidden="true"></span>
          <span>Arquitectura y Flujo Operativo</span>
        </div>
        <h3 class="infographic-card__title">Diagrama Oficial del Cobro por Placa</h3>
        <p class="infographic-card__sub">
          Arquitectura del cobro automatizado por placa: detección óptica, validación bancaria y paso continuo sin detención.
        </p>
      </div>

      <div class="infographic-card__actions">
        <a :href="infographic" download="cobro-por-placa.png" class="btn btn--primario infographic-dl-btn">
          <AppIcon name="arrow" :size="18" class="infographic-dl-icon" />
          <span>{{ content.download }}</span>
        </a>
      </div>
    </div>

    <div class="infographic-frame">
      <img
        :src="infographic"
        :alt="content.alt"
        width="1024"
        height="1536"
        decoding="async"
        class="infographic-img"
      />
    </div>
  </div>
</template>

<style scoped>
.infographic-card {
  position: relative;
  max-width: 960px;
  margin-inline: auto;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-2xl, 24px);
  box-shadow: 0 20px 45px -12px rgba(18, 33, 66, 0.08), 0 1px 3px rgba(18, 33, 66, 0.04);
  padding: var(--space-8);
  overflow: hidden;
  text-align: left;
}

@media (min-width: 640px) {
  .infographic-card {
    padding: var(--space-10) var(--space-8);
  }
}

.infographic-tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
  overflow: hidden;
}
.infographic-tricolor::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
  animation: infoTricolorSweep 4.5s ease-in-out infinite;
}
@keyframes infoTricolorSweep {
  0% { left: -50%; }
  35%, 100% { left: 150%; }
}

.infographic-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid rgba(226, 232, 240, 0.85);
}

.infographic-card__meta {
  max-width: 580px;
}

.infographic-card__kicker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #0038A8;
  margin-bottom: var(--space-2);
}
.infographic-card__kicker-line {
  width: 18px;
  height: 2px;
  background: linear-gradient(90deg, #0038A8, #0284c7);
  border-radius: 2px;
}

.infographic-card__title {
  margin: 0 0 var(--space-2);
  font: 700 clamp(20px, 2.5vw, 26px)/1.2 var(--font-display);
  color: #122142;
  letter-spacing: -0.02em;
}

.infographic-card__sub {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--texto-suave);
}

.infographic-dl-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 var(--space-5);
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.22);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.infographic-dl-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: infoBtnShimmer 4s ease-in-out infinite 2s;
}
@keyframes infoBtnShimmer {
  0% { left: -100%; }
  30%, 100% { left: 200%; }
}

.infographic-dl-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(0, 56, 168, 0.32);
}

.infographic-dl-icon {
  transform: rotate(90deg);
}

.infographic-frame {
  position: relative;
  border-radius: var(--radius-xl, 20px);
  overflow: hidden;
  background: #F8FAFC;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: inset 0 2px 4px rgba(18, 33, 66, 0.04);
}

.infographic-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.infographic-frame:hover .infographic-img {
  transform: scale(1.015);
}

@media (prefers-reduced-motion: reduce) {
  .infographic-tricolor::after,
  .infographic-dl-btn::after,
  .infographic-dl-btn:hover,
  .infographic-frame:hover .infographic-img {
    animation: none !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
