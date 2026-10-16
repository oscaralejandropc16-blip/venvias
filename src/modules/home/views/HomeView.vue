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

export default defineComponent({
  name: 'HomeView',
  components: { AppIcon, RoadRibbon, PlateForm, TollsSummaryCard, HowItWorks },
  setup() {
    return { ...useRechargeAmounts() }
  },
  data() {
    return {
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
  <!-- Hero Light Mode: diseño 100% limpio, unificado y corporativo con degradado sutil pizarra a blanco -->
  <section class="hero" aria-labelledby="hero-title">
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

  <HowItWorks plain class="pt-6 md:pt-10" />

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
/* Hero: estilo claro (Light Mode) 100% limpio, unificado y corporativo */
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 55%, #f8fafc 100%);
  color: #122142;
  padding-bottom: clamp(64px, 8vw, 130px);
}

.hero__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: clamp(24px, 3.5vw, 48px);
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  color: #0057a3;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 10px rgba(18, 33, 66, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.9);
  margin-bottom: clamp(10px, 1.8vh, 18px);
  transition: all 0.25s var(--ease-out);
}
.hero__badge:hover {
  border-color: #0057a3;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.12);
}
.hero__badge-icon {
  color: #0057a3;
  flex-shrink: 0;
}

.hero h1 {
  font-size: clamp(30px, 2.6vw + 14px, 52px);
  line-height: 1.16;
  font-weight: 700;
  max-width: 22ch;
  color: #122142;
  letter-spacing: -0.02em;
  margin: 0;
}
.hero h1 span.hero__title-accent {
  display: block;
  color: #0057a3;
  font-weight: 700;
  line-height: 1.2;
}

.hero__sub {
  margin: 10px 0 clamp(16px, 2.2vh, 26px);
  max-width: 48ch;
  color: #475569;
  font-size: clamp(15px, 1.1vw + 8px, 18px);
  line-height: 1.5;
}

.hero__road {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: clamp(56px, 8vw, 130px);
  z-index: 1;
}

/* Tamaño de la placa compacto y estilizado para no ocupar toda la pantalla */
.hero :deep(.pf) {
  width: min(100%, 350px);
  margin-inline: auto;
}

.hero :deep(.pf__modo) {
  width: min(100%, 300px);
  min-height: 40px;
  align-self: center;
  margin-bottom: clamp(12px, 2vh, 20px);
  background: #e2e8f0;
  border-radius: var(--radius-pill);
  padding: 4px;
}
.hero :deep(.pf__modo label) {
  min-height: 34px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
  transition: all 0.25s var(--ease-out);
}
.hero :deep(.pf__modo label:hover:not(.on)) {
  color: #122142;
}
.hero :deep(.pf__modo label.on) {
  color: #ffffff;
  font-weight: 600;
}
.hero :deep(.pf__modo-thumb) {
  background: #0057a3;
  box-shadow: 0 2px 8px rgba(0, 87, 163, 0.35);
}

.hero :deep(.plate) {
  box-shadow: 0 14px 30px -6px rgba(18, 33, 66, 0.14), 0 4px 10px -2px rgba(18, 33, 66, 0.06);
  border-radius: 4% / 7.8%;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
}
.hero :deep(.plate:hover) {
  transform: translateY(-2px);
  box-shadow: 0 20px 38px -6px rgba(18, 33, 66, 0.18), 0 6px 14px -2px rgba(18, 33, 66, 0.08);
}
.hero :deep(.plate.is-focused) {
  box-shadow: 0 0 0 4px #dce6fb, 0 16px 32px -6px rgba(18, 33, 66, 0.16);
}

.hero :deep(.plate__foot) {
  margin-top: 10px;
  font-size: 14px;
  color: #475569;
  font-weight: 500;
}
.hero :deep(.plate__foot svg) {
  color: #0057a3;
}
.hero :deep(.plate__hint) {
  color: #64748b;
  font-size: 13px;
}
.hero :deep(.plate__error) {
  color: #cf142b;
}

.hero :deep(.pf__montos legend) {
  color: #122142;
  font-weight: 600;
  font-size: 15px;
}
.hero :deep(.pf__chips label) {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 6px rgba(18, 33, 66, 0.04);
  transition: all 0.2s var(--ease-out);
}
.hero :deep(.pf__chips label:hover) {
  border-color: #0057a3;
  transform: translateY(-1px);
}
.hero :deep(.pf__chips label.on) {
  background: #dce6fb;
  border-color: #0057a3;
  box-shadow: 0 0 0 2px #0057a3;
}
.hero :deep(.pf__chips label.on span) {
  color: #122142;
  font-weight: 600;
}
.hero :deep(.pf__chips label.on small) {
  color: #0057a3;
}

.hero :deep(.pf__go) {
  min-height: 48px;
  margin-top: clamp(12px, 2vh, 20px);
  font-size: 15px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.3);
  transition: all 0.25s var(--ease-out);
}
.hero :deep(.pf__go:hover) {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
  box-shadow: 0 6px 20px rgba(0, 87, 163, 0.45);
  transform: translateY(-1px);
}
.hero :deep(.pf__nota) {
  margin-top: 8px;
  font-size: 13px;
  color: #64748b;
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
