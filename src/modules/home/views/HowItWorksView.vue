<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorks from '../components/HowItWorks.vue'
import HowItWorksInfographic from '../components/HowItWorksInfographic.vue'
import { HOW_IT_WORKS_INFOGRAPHIC } from '../constants/howItWorks.infographic'

export default defineComponent({
  name: 'HowItWorksView',
  components: { AppIcon, HowItWorks, HowItWorksInfographic, RouterLink },
  data() {
    return {
      content: HOW_IT_WORKS_INFOGRAPHIC,
      rechargeRoute: { name: ROUTE_NAMES.recharge },
      balanceRoute: { name: ROUTE_NAMES.balance },
      pillars: [
        {
          icon: 'rayo' as const,
          title: 'Flujo continuo sin detenciones',
          desc: 'Los pórticos inteligentes leen tu vehículo a velocidad reglamentaria de autopista sin que tengas que bajar la ventanilla.',
        },
        {
          icon: 'carro' as const,
          title: 'Detección por Placa y TAG',
          desc: 'Cámaras de alta resolución combinadas con antenas de radiofrecuencia (RFID) identifican tu vehículo con total precisión.',
        },
        {
          icon: 'peaje' as const,
          title: 'Interoperabilidad nacional',
          desc: 'Tu saldo es válido en todos los peajes habilitados de Venezuela. Un solo registro para transitar por todo el país.',
        },
        {
          icon: 'tarjeta' as const,
          title: 'Recarga multicanal inmediata',
          desc: 'Acredita fondos al instante a través de Pago Móvil, BDV en Línea o mediante tarjeta de débito/crédito con el Botón IPG.',
        },
      ],
    }
  },
})
</script>

<template>
  <div class="how-view wrap">
    <!-- Hero Header -->
    <header class="how-hero">
      <div class="how-hero__badge">
        <span class="how-hero__dot" aria-hidden="true"></span>
        <span>SISTEMA NACIONAL DE PEAJES · GUÍA OFICIAL</span>
      </div>
      <h1 class="how-hero__title">Tu placa es tu pase libre</h1>
      <p class="how-hero__sub">
        Conoce la tecnología de cobro dinámico Free Flow que moderniza las autopistas de Venezuela, eliminando colas y barreras físicas.
      </p>
    </header>

    <!-- Interactive Stepper Track -->
    <section class="how-stepper-wrap" aria-label="Recorrido paso a paso">
      <HowItWorks :plain="false" />
    </section>

    <!-- Key Pillars Bento Grid -->
    <section class="how-pillars" aria-labelledby="pillars-title">
      <div class="how-pillars__header">
        <span class="how-pillars__eyebrow">TECNOLOGÍA Y EFICIENCIA</span>
        <h2 id="pillars-title" class="how-pillars__title">¿Por qué el sistema VenVías es diferente?</h2>
        <p class="how-pillars__desc">
          Diseñado para optimizar los tiempos de viaje de millones de conductores en las principales vías del territorio nacional.
        </p>
      </div>

      <div class="how-pillars__grid">
        <article v-for="p in pillars" :key="p.title" class="pillar-card">
          <div class="pillar-card__icon" aria-hidden="true">
            <AppIcon :name="p.icon" :size="24" />
          </div>
          <h3 class="pillar-card__title">{{ p.title }}</h3>
          <p class="pillar-card__desc">{{ p.desc }}</p>
        </article>
      </div>
    </section>

    <!-- Official MPPT Downloadable Infographic -->
    <section class="how-infographic-wrap" aria-label="Infografía técnica del cobro por placa">
      <HowItWorksInfographic />
    </section>

    <!-- Bottom Call-To-Action Kiosk -->
    <section class="how-cta" aria-labelledby="cta-title">
      <div class="how-cta__card">
        <div class="how-cta__tricolor" aria-hidden="true"></div>
        <div class="how-cta__content">
          <span class="how-cta__tag">CIRCULA SEGURO</span>
          <h2 id="cta-title" class="how-cta__title">¿Listo para transitar por los peajes de Venezuela?</h2>
          <p class="how-cta__desc">
            Recarga tu saldo con anticipación o verifica el estado de tu vehículo ingresando tu número de placa.
          </p>
          <div class="how-cta__actions">
            <RouterLink :to="rechargeRoute" class="btn btn--primario how-cta__btn">
              <AppIcon name="rayo" :size="18" />
              <span>Recargar saldo ahora</span>
            </RouterLink>
            <RouterLink :to="balanceRoute" class="btn btn--secundario how-cta__btn-sec">
              <AppIcon name="placa" :size="18" />
              <span>Consultar saldo disponible</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.how-view {
  padding-block: var(--space-8) var(--space-16);
  display: grid;
  gap: var(--space-12);
}

@media (min-width: 900px) {
  .how-view {
    padding-block: var(--space-12) var(--space-16);
    gap: var(--space-16);
  }
}

/* Hero Header */
.how-hero {
  text-align: center;
  max-width: 780px;
  margin: 0 auto;
}

.how-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: var(--azul-100);
  border: 1px solid rgba(0, 56, 168, 0.2);
  border-radius: var(--radius-pill);
  font: 600 12px/1 var(--font-mono);
  letter-spacing: 0.06em;
  color: #0038A8;
  margin-bottom: var(--space-4);
}

.how-hero__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0038A8;
  box-shadow: 0 0 0 3px rgba(0, 56, 168, 0.2);
}

.how-hero__title {
  font: 800 clamp(32px, 4.5vw, 52px)/1.15 var(--font-display);
  color: #122142;
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-3);
}

.how-hero__sub {
  font-size: clamp(16px, 2vw, 18px);
  line-height: 28px;
  color: var(--texto-suave);
  max-width: 64ch;
  margin: 0 auto;
}

/* Stepper wrapper */
.how-stepper-wrap {
  width: 100%;
}

/* Pillars Section */
.how-pillars {
  display: grid;
  gap: var(--space-8);
  text-align: center;
}

.how-pillars__header {
  max-width: 680px;
  margin: 0 auto;
}

.how-pillars__eyebrow {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0038A8;
  margin-bottom: var(--space-2);
}

.how-pillars__title {
  font: 700 clamp(24px, 3vw, 34px)/1.25 var(--font-display);
  color: #122142;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-2);
}

.how-pillars__desc {
  font-size: 15px;
  line-height: 24px;
  color: var(--texto-suave);
  margin: 0;
}

.how-pillars__grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}

@media (min-width: 600px) {
  .how-pillars__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .how-pillars__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.pillar-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-xl, 20px);
  padding: var(--space-6);
  box-shadow: 0 10px 25px -5px rgba(18, 33, 66, 0.05), 0 1px 3px rgba(18, 33, 66, 0.03);
  text-align: left;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out), border-color 0.25s var(--ease-out);
}

.pillar-card:hover {
  transform: translateY(-4px);
  border-color: #0038A8;
  box-shadow: 0 16px 36px -8px rgba(0, 56, 168, 0.12);
}

.pillar-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--azul-100);
  color: #0038A8;
  display: grid;
  place-items: center;
  margin-bottom: var(--space-4);
  transition: background-color 0.2s, color 0.2s;
}

.pillar-card:hover .pillar-card__icon {
  background: #0038A8;
  color: #ffffff;
}

.pillar-card__title {
  margin: 0 0 var(--space-2);
  font: 600 17px/22px var(--font-display);
  color: #122142;
}

.pillar-card__desc {
  margin: 0;
  font-size: 14px;
  line-height: 21px;
  color: var(--texto-suave);
}

/* Infographic section */
.how-infographic-wrap {
  width: 100%;
}

/* Call to action */
.how-cta {
  width: 100%;
}

.how-cta__card {
  position: relative;
  background: linear-gradient(135deg, #122142 0%, #0038A8 100%);
  border-radius: var(--radius-2xl, 24px);
  padding: var(--space-8) var(--space-6);
  text-align: center;
  color: #ffffff;
  overflow: hidden;
  box-shadow: 0 20px 45px -10px rgba(18, 33, 66, 0.25);
}

@media (min-width: 768px) {
  .how-cta__card {
    padding: var(--space-12) var(--space-8);
  }
}

.how-cta__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
}

.how-cta__content {
  max-width: 680px;
  margin: 0 auto;
}

.how-cta__tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #F9D616;
  text-transform: uppercase;
  margin-bottom: var(--space-2);
}

.how-cta__title {
  font: 700 clamp(24px, 3vw, 36px)/1.2 var(--font-display);
  color: #ffffff;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.02em;
}

.how-cta__desc {
  font-size: 16px;
  line-height: 24px;
  color: #C9D4EA;
  margin: 0 0 var(--space-6);
}

.how-cta__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.how-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 var(--space-6);
  font-size: 15px;
  font-weight: 600;
  background: #ffffff;
  color: #0038A8;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.how-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  background: #ffffff;
  color: #002D80;
}

.how-cta__btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 56, 168, 0.15), transparent);
  transform: skewX(-20deg);
  pointer-events: none;
}

.how-cta__btn:hover::after {
  animation: ctaShimmer 1s ease infinite;
}

.how-cta__btn-sec {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 52px;
  padding: 0 var(--space-6);
  font-size: 15px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius-md);
  transition: all 0.2s var(--ease-out);
}

.how-cta__btn-sec:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #ffffff;
  transform: translateY(-2px);
}

@keyframes ctaShimmer {
  from {
    left: -100%;
  }
  to {
    left: 200%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pillar-card:hover,
  .how-cta__btn:hover,
  .how-cta__btn-sec:hover {
    transform: none;
  }
  .how-cta__btn::after {
    display: none;
  }
}
</style>
