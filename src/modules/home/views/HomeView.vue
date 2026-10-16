<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import RoadRibbon from '@/shared/ui/RoadRibbon.vue'
import PlateForm from '@/modules/plates/components/PlateForm.vue'
import type { PlateSubmission } from '@/modules/plates/types/Plate'
import { useRechargeAmounts } from '@/modules/recharge/composables/useRechargeAmounts'
import TollsSummaryCard from '@/modules/tolls/components/TollsSummaryCard.vue'
import { TOLLS_TEXT } from '@/modules/tolls/constants/tolls'
import { ACCOUNT_PERKS } from '@/modules/account/constants/account'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorks from '../components/HowItWorks.vue'
import { FAQS, SAFETY_ITEMS } from '../constants/home.content'
import tagImg from '@/assets/tag-venvias.webp'
import plateImg from '@/assets/plate-venezuela.svg'
import heroBgImg from '@/assets/hero-highway.jpg'

export default defineComponent({
  name: 'HomeView',
  components: { AppIcon, RoadRibbon, PlateForm, TollsSummaryCard, HowItWorks },
  setup() {
    return { ...useRechargeAmounts() }
  },
  data() {
    return {
      heroBgImg,
      tagImg,
      plateImg,
      safety: SAFETY_ITEMS,
      faqs: FAQS,
      accountPerks: ACCOUNT_PERKS,
      tollsText: TOLLS_TEXT,
      accountRoute: { name: ROUTE_NAMES.account },
    }
  },
  mounted() {
    void this.fetchAmountOptions()
  },
  methods: {
    onPlateSubmit(submission: PlateSubmission): void {
      const query: Record<string, string> = { placa: submission.plate }
      if (submission.amountId) query.monto = submission.amountId
      const name = submission.intent === 'recargar' ? ROUTE_NAMES.recharge : ROUTE_NAMES.debt
      void this.$router.push({ name, query })
    },
  },
})
</script>

<template>
  <!-- Hero tecnológico de alto impacto: fondo oscuro azul marino con imagen sutil de autopista y peaje inteligente -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__bg" aria-hidden="true">
      <img :src="heroBgImg" alt="" class="hero__bg-img" />
      <div class="hero__bg-overlay"></div>
      <div class="hero__bg-glow"></div>
    </div>

    <div class="wrap hero__inner">
      <span class="hero__badge">
        <AppIcon name="info" :size="15" class="hero__badge-icon" />
        República Bolivariana de Venezuela · MPPT
      </span>
      <h1 id="hero-title">
        Paga tus peajes con tu placa.
        <span class="hero__title-accent">Sin registrarte.</span>
      </h1>
      <p class="hero__sub">Recarga saldo y se descuenta solo al pasar por los peajes habilitados a nivel nacional.</p>
      <PlateForm :amount-options="amountOptions" @submit="onPlateSubmit" />
    </div>
    <div class="hero__road"><RoadRibbon /></div>
  </section>

  <HowItWorks plain class="pt-10 md:pt-16" />

  <!-- Sección TAG y Placa: tarjeta blanca flotante con soft shadow -->
  <section class="section wrap" aria-labelledby="tag-title">
    <div class="split bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div>
        <h2 id="tag-title" class="text-slate-900 font-bold">¿Tienes TAG? Sigue con él.</h2>
        <p class="lead text-slate-600">
          El TAG es el método de pago preferido para el pago de peajes. El pago por placa es su alternativa:
          si no tienes TAG, solo necesitas tu placa.
        </p>
      </div>
      <div class="tag__pair" aria-hidden="true">
        <img :src="tagImg" alt="" width="720" height="324" loading="lazy" decoding="async" class="tag__sticker" />
        <span class="tag__or">o</span>
        <img :src="plateImg" alt="" width="404" height="204" loading="lazy" decoding="async" class="tag__plate" />
      </div>
    </div>
  </section>

  <!-- Sección Peajes habilitados -->
  <section class="tolls section bg-slate-50/50" aria-labelledby="tolls-title">
    <div class="wrap split gap-8">
      <div>
        <h2 id="tolls-title" class="text-slate-900 font-bold">{{ tollsText.title }}</h2>
        <p class="lead text-slate-600">{{ tollsText.intro }}</p>
      </div>
      <TollsSummaryCard />
    </div>
  </section>

  <!-- Sección Seguridad: tarjeta blanca flotante con soft shadow -->
  <section class="section wrap pb-8" aria-labelledby="safety-title">
    <div class="split items-stretch min-[900px]:grid-cols-[1fr_1.2fr] bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div>
        <h2 id="safety-title" class="text-slate-900 font-bold">Seguro, aunque no tengas cuenta</h2>
        <p class="lead max-w-[44ch] text-slate-600">Pagar con tu placa no te obliga a dar más datos de los necesarios.</p>
      </div>
      <dl class="plain-list divided divided--rows">
        <div v-for="s in safety" :key="s.title">
          <dt class="row-title flex items-center gap-3 font-semibold text-slate-900"><AppIcon :name="s.icon" class="icon-accent" />{{ s.title }}</dt>
          <dd class="m-0 mt-1 ml-9 text-slate-500">{{ s.text }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- Sección Mi Cuenta: tarjeta blanca flotante con soft shadow -->
  <section class="section wrap pt-0" aria-labelledby="account-title">
    <div class="account split min-[900px]:grid-cols-[1.2fr_1fr] bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div>
        <h2 id="account-title" class="text-slate-900 font-bold">¿Varias placas o una flota? Crea tu cuenta cuando quieras.</h2>
        <p class="lead max-w-[44ch] mb-6 text-slate-600">La cuenta es opcional. Suma herramientas para quien maneja más de un vehículo.</p>
        <RouterLink :to="accountRoute" class="btn btn--secundario">Conoce Mi cuenta</RouterLink>
      </div>
      <ul class="plain-list gap-4">
        <li v-for="p in accountPerks" :key="p" class="flex items-start gap-3 text-slate-800 font-medium">
          <AppIcon name="check" :size="20" class="icon-accent mt-0.5" />{{ p }}
        </li>
      </ul>
    </div>
  </section>

  <!-- Sección FAQ: tarjeta blanca flotante con soft shadow -->
  <section class="section wrap pt-0 gap-6" aria-labelledby="faq-title">
    <div class="split items-start min-[900px]:grid-cols-[1fr_2fr] bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-100">
      <h2 id="faq-title" class="text-slate-900 font-bold">Preguntas frecuentes</h2>
      <div class="divided">
        <details v-for="f in faqs" :key="f.q">
          <summary class="row-title flex items-center justify-between gap-4 py-4 cursor-pointer list-none text-slate-900 font-medium hover:text-blue-700 transition-colors">
            {{ f.q }}<AppIcon name="chevron" :size="22" class="icon-accent" />
          </summary>
          <p class="pb-4 max-w-[65ch] text-slate-600 leading-relaxed">{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero: fondo oscuro azul marino con imagen de autopista tecnológica y texto blanco */
.hero {
  position: relative;
  overflow: hidden;
  background: #071329;
  color: #ffffff;
  padding-bottom: clamp(40px, 5vw, 76px);
}

.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 36%;
  opacity: 0.22;
  filter: saturate(1.2) contrast(1.15);
  transform: scale(1.03);
}

.hero__bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(7, 19, 41, 0.82) 0%,
    rgba(6, 14, 30, 0.72) 40%,
    rgba(5, 12, 26, 0.92) 85%,
    #050c1b 100%
  );
}

.hero__bg-glow {
  position: absolute;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: min(100%, 900px);
  height: 520px;
  background: radial-gradient(circle, rgba(0, 102, 204, 0.25) 0%, rgba(10, 108, 196, 0.1) 45%, transparent 70%);
  filter: blur(48px);
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: clamp(14px, 2vh, 28px);
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: #e2e8f0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  margin-bottom: clamp(8px, 1.4vh, 14px);
  transition: all 0.25s var(--ease-out);
}
.hero__badge:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}
.hero__badge-icon {
  color: #38bdf8;
  flex-shrink: 0;
}

.hero h1 {
  font-size: clamp(26px, 2.2vw + 12px, 46px);
  line-height: 1.2;
  font-weight: 700;
  max-width: 24ch;
  color: #ffffff;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.6);
  letter-spacing: -0.01em;
  margin: 0;
}
.hero h1 span.hero__title-accent {
  display: block;
  color: #38bdf8;
  font-weight: 700;
  line-height: 1.25;
  padding-bottom: 2px;
  text-shadow: 0 0 24px rgba(56, 189, 248, 0.45), 0 2px 8px rgba(0, 0, 0, 0.6);
}

.hero__sub {
  margin: 6px 0 clamp(10px, 1.8vh, 18px);
  max-width: 46ch;
  color: #cbd5e1;
  font-size: clamp(14px, 1vw + 7px, 16px);
  line-height: 1.45;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.hero__road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: clamp(32px, 4.5vw, 64px);
  z-index: 1;
}

/* Ajuste proporcional de formulario para visibilidad completa en primer pliegue */
.hero :deep(.pf) {
  width: min(100%, 410px);
}
.hero :deep(.pf__modo) {
  width: min(100%, 330px);
  min-height: 38px;
  align-self: center;
  margin-bottom: clamp(10px, 1.6vh, 16px);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
.hero :deep(.pf__modo label) {
  min-height: 36px;
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  transition: all 0.25s var(--ease-out);
}
.hero :deep(.pf__modo label:hover:not(.on)) {
  color: #e2e8f0;
}
.hero :deep(.pf__modo label.on) {
  color: #ffffff;
  font-weight: 600;
}
.hero :deep(.pf__modo-thumb) {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.hero :deep(.plate__foot) {
  margin-top: 6px;
  font-size: 13px;
  color: #e2e8f0;
  font-weight: 500;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.hero :deep(.pf__go) {
  min-height: 48px;
  margin-top: clamp(10px, 1.6vh, 16px);
  font-size: 15px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px -4px rgba(0, 87, 163, 0.65), 0 0 24px rgba(10, 108, 196, 0.4);
  font-weight: 600;
  transition: all 0.25s var(--ease-out);
}
.hero :deep(.pf__nota) {
  margin-top: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.hero :deep(.plate) {
  box-shadow: 0 25px 50px -10px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 102, 204, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
}
.hero :deep(.plate:hover) {
  transform: translateY(-2px);
  box-shadow: 0 32px 64px -10px rgba(0, 0, 0, 0.8), 0 0 50px rgba(0, 102, 204, 0.4);
}
.hero :deep(.plate.is-focused) {
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.5), 0 32px 64px -10px rgba(0, 0, 0, 0.8);
}

.hero :deep(.plate__foot svg) {
  color: #38bdf8;
}
.hero :deep(.plate__hint) {
  color: #94a3b8;
}
.hero :deep(.plate__error) {
  color: #f87171;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.6);
}

.hero :deep(.pf__montos legend) {
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.hero :deep(.pf__chips label) {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: all 0.2s var(--ease-out);
}
.hero :deep(.pf__chips label:hover) {
  border-color: #38bdf8;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}
.hero :deep(.pf__chips label.on) {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px #38bdf8, 0 8px 24px rgba(0, 87, 163, 0.55);
  transform: translateY(-1px);
}
.hero :deep(.pf__chips label.on span) {
  color: #ffffff;
}
.hero :deep(.pf__chips label.on small) {
  color: #e0f2fe;
}

/* TAG y placa */
.tag__pair { display: flex; align-items: center; gap: var(--space-4); }
.tag__sticker {
  display: block; width: clamp(132px, 36vw, 220px); height: auto; flex: none;
  border-radius: var(--radius-sm); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.tag__or { font: 500 20px/1 var(--font-display); color: var(--texto-suave); }
.tag__plate { width: min(100%, 240px); height: auto; }
@media (min-width: 900px) { .tag__pair { justify-content: center; } }

/* Peajes habilitados */
.tolls :deep(.empty > p) { margin-top: var(--space-3); max-width: 52ch; }

/* Cuenta opcional */
.account {
  background: #ffffff;
  border-radius: var(--radius-xl);
}

/* Preguntas frecuentes */
summary::-webkit-details-marker { display: none; }
summary svg { transition: transform .3s var(--ease-out); }
details[open] summary svg { transform: rotate(180deg); }
</style>
