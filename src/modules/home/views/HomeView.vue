<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
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
  components: { AppIcon, PlateForm, TollsSummaryCard, HowItWorks },
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
  <!-- Hero Split 2 Columnas: Máximo impacto ejecutivo, balance visual y flujo natural -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__grid">
      <!-- Columna Izquierda: Mensaje Institucional, Propuesta de Valor y Pilares Oficiales -->
      <div class="hero__intro">
        <div class="hero__badge">
          <span class="hero__badge-pulse" aria-hidden="true"></span>
          <AppIcon name="info" :size="15" class="hero__badge-icon" />
          <span>República Bolivariana de Venezuela · MPPT</span>
        </div>

        <h1 id="hero-title" class="hero__title">
          Paga tus peajes <br class="hidden sm:inline" />con tu placa.
          <span class="hero__title-accent">Sin registrarte.</span>
        </h1>

        <p class="hero__sub">
          Recarga saldo en Bolívares y transita libremente sin demoras por los peajes habilitados a nivel nacional. El débito se realiza automáticamente por lectura digital de tu matrícula.
        </p>

        <!-- Pilares clave del servicio gubernamental -->
        <div class="hero__features">
          <div class="hero__feature-card">
            <div class="hero__feature-icon">
              <AppIcon name="rayo" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Paso continuo y sin colas</h3>
              <p class="hero__feature-desc">Sin necesidad de detenerte a pagar en efectivo</p>
            </div>
          </div>

          <div class="hero__feature-card">
            <div class="hero__feature-icon">
              <AppIcon name="tarjeta" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Recarga directa en Bolívares (Bs.)</h3>
              <p class="hero__feature-desc">Pago Móvil, Botón IPG y tarjetas bancarias</p>
            </div>
          </div>

          <div class="hero__feature-card">
            <div class="hero__feature-icon">
              <AppIcon name="peaje" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Red Oficial Nacional</h3>
              <p class="hero__feature-desc">Válido en los principales corredores viales del país</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Tarjeta Ejecutiva Flotante de Gestión de Matrícula -->
      <div class="hero__card-col">
        <div class="hero__card">
          <div class="hero__card-header">
            <div class="flex items-center gap-2">
              <span class="hero__card-status-dot"></span>
              <span class="hero__card-status-text">Terminal Digital Oficial</span>
            </div>
            <span class="hero__card-badge">En línea 24/7</span>
          </div>

          <PlateForm :amount-options="amountOptions" @submit="onPlateSubmit" />
        </div>
      </div>
    </div>
  </section>

  <HowItWorks plain />

  <!-- Sección TAG vs Placa: Formato Bento Comparativo de Alta Gama -->
  <section class="section wrap" aria-labelledby="tag-title">
    <div class="tag-bento grid md:grid-cols-2 gap-6 items-stretch">
      <!-- Tarjeta TAG -->
      <div class="bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-4 border border-emerald-200">
            <AppIcon name="check" :size="14" />
            Dispositivo Adherido
          </span>
          <h2 id="tag-title" class="text-2xl font-bold text-slate-900 mb-3">¿Tienes TAG? Sigue con él.</h2>
          <p class="text-slate-600 leading-relaxed text-[15px]">
            El TAG es el método preferido para usuarios frecuentes y flotas comerciales. Adherido al parabrisas, el débito se procesa de inmediato en cada paso.
          </p>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[100px]">
          <img :src="tagImg" alt="TAG VenVías" width="360" height="162" loading="lazy" class="max-h-24 w-auto object-contain" />
        </div>
      </div>

      <!-- Tarjeta Pago por Placa -->
      <div class="bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-200">
        <div>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 mb-4 border border-blue-200">
            <AppIcon name="rayo" :size="14" />
            Sin Trámites ni Instalaciones
          </span>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">¿No tienes TAG? Usa tu Placa.</h2>
          <p class="text-slate-600 leading-relaxed text-[15px]">
            El pago por placa es la alternativa oficial: no requieres comprar ningún dispositivo ni citas previas. Solo necesitas tu matrícula activa con saldo recargado.
          </p>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[100px]">
          <img :src="plateImg" alt="Placa venezolana" width="240" height="121" loading="lazy" class="max-h-24 w-auto object-contain drop-shadow-md" />
        </div>
      </div>
    </div>
  </section>

  <!-- Sección Peajes habilitados -->
  <section class="tolls section bg-slate-50/50" aria-labelledby="tolls-title">
    <div class="wrap split gap-8">
      <div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          <AppIcon name="peaje" :size="14" />
          Cobertura Nacional
        </span>
        <h2 id="tolls-title" class="text-slate-900 font-bold text-3xl">{{ tollsText.title }}</h2>
        <p class="lead text-slate-600">{{ tollsText.intro }}</p>
      </div>
      <TollsSummaryCard />
    </div>
  </section>

  <!-- Sección Seguridad: Cuadrícula de 3 Tarjetas de Confianza -->
  <section class="section wrap pb-8" aria-labelledby="safety-title">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
        <AppIcon name="check" :size="14" />
        Protección y Privacidad
      </span>
      <h2 id="safety-title" class="text-3xl font-bold text-slate-900">Seguro, aunque no tengas cuenta</h2>
      <p class="text-slate-600 mt-2 text-base">Pagar con tu placa no te obliga a dar más datos de los estrictamente necesarios.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <div
        v-for="s in safety"
        :key="s.title"
        class="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-start transition-transform hover:-translate-y-1 duration-200"
      >
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 flex-shrink-0">
          <AppIcon :name="s.icon" :size="22" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">{{ s.title }}</h3>
        <p class="text-slate-600 text-sm leading-relaxed">{{ s.text }}</p>
      </div>
    </div>
  </section>

  <!-- Sección Mi Cuenta / Flotas: Banner Ejecutivo de Alto Nivel -->
  <section class="section wrap pt-0" aria-labelledby="account-title">
    <div class="account-card bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/80 relative overflow-hidden">
      <div class="split min-[900px]:grid-cols-[1.25fr_1fr] relative z-10 items-center gap-8">
        <div>
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
            <AppIcon name="carro" :size="14" />
            Servicio Corporativo y Comercial
          </span>
          <h2 id="account-title" class="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
            ¿Varias placas o una flota? Gestiona todo en Mi Cuenta.
          </h2>
          <p class="lead max-w-[46ch] mb-6 text-slate-600 text-base md:text-lg leading-relaxed">
            La cuenta es 100% opcional. Te permite consolidar pagos, activar recargas automáticas y descargar comprobantes fiscales para tu empresa.
          </p>
          <RouterLink :to="accountRoute" class="btn btn--primario shadow-lg">
            Conoce Mi cuenta
          </RouterLink>
        </div>
        <ul class="plain-list gap-3.5 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <li v-for="p in accountPerks" :key="p" class="flex items-start gap-3 text-slate-800 text-sm md:text-base font-medium">
            <AppIcon name="check" :size="18" class="text-blue-600 mt-0.5 flex-shrink-0" />
            <span>{{ p }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Sección FAQ: tarjeta blanca flotante con soft shadow -->
  <section class="section wrap pt-0 gap-6" aria-labelledby="faq-title">
    <div class="split items-start min-[900px]:grid-cols-[1fr_2fr] bg-white rounded-2xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-100">
      <div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
          <AppIcon name="info" :size="14" />
          Centro de Ayuda
        </span>
        <h2 id="faq-title" class="text-slate-900 font-bold text-3xl">Preguntas frecuentes</h2>
        <p class="text-slate-600 mt-2 text-sm leading-relaxed">
          Respuestas a las dudas más comunes sobre el uso y pago de peajes en Venezuela.
        </p>
      </div>
      <div class="divided">
        <details v-for="f in faqs" :key="f.q">
          <summary class="row-title flex items-center justify-between gap-4 py-4 cursor-pointer list-none text-slate-900 font-medium hover:text-blue-700 transition-colors">
            {{ f.q }}<AppIcon name="chevron" :size="22" class="icon-accent" />
          </summary>
          <p class="pb-4 max-w-[65ch] text-slate-600 leading-relaxed text-[15px]">{{ f.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Hero Split: 2 columnas en escritorio, balanceado y corporativo */
.hero {
  position: relative;
  overflow: hidden;
  background: radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.45) 0px, transparent 55%),
              radial-gradient(at 100% 0%, rgba(224, 242, 254, 0.45) 0px, transparent 55%),
              #f8fafc;
  color: #122142;
  padding-bottom: clamp(48px, 6vw, 84px);
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(32px, 4vw, 56px);
  padding-top: clamp(28px, 4vw, 52px);
  align-items: center;
}
@media (min-width: 960px) {
  .hero__grid {
    grid-template-columns: 1.15fr 0.85fr;
  }
}

.hero__intro {
  text-align: left;
}
@media (max-width: 959px) {
  .hero__intro {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
  margin-bottom: clamp(14px, 2vh, 22px);
  transition: all 0.25s var(--ease-out);
}
.hero__badge-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
}
.hero__badge-icon {
  color: #0057a3;
}

.hero__title {
  font-size: clamp(32px, 3.2vw + 16px, 54px);
  line-height: 1.15;
  font-weight: 700;
  color: #122142;
  letter-spacing: -0.02em;
  margin: 0;
}
.hero__title-accent {
  display: block;
  color: #0057a3;
  font-weight: 700;
  line-height: 1.2;
}

.hero__sub {
  margin: 14px 0 clamp(20px, 3vh, 32px);
  max-width: 52ch;
  color: #475569;
  font-size: clamp(16px, 1.1vw + 8px, 18px);
  line-height: 1.55;
}

/* 3 Pilares clave en el hero izquierdo */
.hero__features {
  display: grid;
  gap: 12px;
  margin-top: 8px;
  width: 100%;
}
@media (min-width: 560px) and (max-width: 959px) {
  .hero__features {
    grid-template-columns: repeat(3, 1fr);
  }
}
.hero__feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 8px rgba(18, 33, 66, 0.03);
  text-align: left;
  transition: all 0.2s var(--ease-out);
}
.hero__feature-card:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(18, 33, 66, 0.06);
}
.hero__feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #eff6ff;
  color: #0057a3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.hero__feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #122142;
  margin: 0;
}
.hero__feature-desc {
  font-size: 13px;
  color: #64748b;
  margin: 2px 0 0;
}

/* Columna Derecha: Tarjeta de Pago */
.hero__card-col {
  display: flex;
  justify-content: center;
  width: 100%;
}
.hero__card {
  width: min(100%, 420px);
  background: #ffffff;
  border-radius: 1.5rem;
  padding: clamp(20px, 2.5vw, 28px);
  box-shadow: 0 20px 45px -10px rgba(18, 33, 66, 0.12), 0 8px 20px -4px rgba(18, 33, 66, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  position: relative;
}
.hero__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}
.hero__card-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0057a3;
}
.hero__card-status-text {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.hero__card-badge {
  font-size: 11px;
  font-weight: 600;
  color: #0057a3;
  background: #eff6ff;
  padding: 3px 10px;
  border-radius: 500px;
  border: 1px solid #dbeafe;
}

/* Formulario dentro de la tarjeta */
.hero__card :deep(.pf) {
  width: 100%;
  margin: 0;
}
.hero__card :deep(.pf__modo) {
  width: 100%;
  min-height: 40px;
  margin-bottom: 14px;
  background: #f1f5f9;
  border-radius: var(--radius-pill);
  padding: 4px;
}
.hero__card :deep(.pf__modo label) {
  min-height: 34px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  transition: all 0.25s var(--ease-out);
}
.hero__card :deep(.pf__modo label:hover:not(.on)) {
  color: #122142;
}
.hero__card :deep(.pf__modo label.on) {
  color: #ffffff;
  font-weight: 600;
}
.hero__card :deep(.pf__modo-thumb) {
  background: #0057a3;
  box-shadow: 0 2px 8px rgba(0, 87, 163, 0.35);
}

.hero__card :deep(.plate) {
  width: 100%;
  max-width: 320px;
  margin-inline: auto;
  box-shadow: 0 10px 24px -4px rgba(18, 33, 66, 0.12), 0 4px 8px -2px rgba(18, 33, 66, 0.05);
  border-radius: 4% / 7.8%;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
}
.hero__card :deep(.plate:hover) {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px -4px rgba(18, 33, 66, 0.16);
}
.hero__card :deep(.plate.is-focused) {
  box-shadow: 0 0 0 3px #dce6fb, 0 12px 28px -4px rgba(18, 33, 66, 0.14);
}

.hero__card :deep(.plate__foot) {
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}
.hero__card :deep(.plate__foot svg) {
  color: #0057a3;
}
.hero__card :deep(.plate__hint) {
  color: #64748b;
  font-size: 12px;
}
.hero__card :deep(.plate__error) {
  color: #cf142b;
  font-size: 13px;
}

.hero__card :deep(.pf__montos legend) {
  color: #122142;
  font-weight: 600;
  font-size: 14px;
}
.hero__card :deep(.pf__chips label) {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: var(--radius-pill);
  box-shadow: 0 1px 4px rgba(18, 33, 66, 0.04);
  transition: all 0.2s var(--ease-out);
}
.hero__card :deep(.pf__chips label:hover) {
  border-color: #0057a3;
  transform: translateY(-1px);
}
.hero__card :deep(.pf__chips label.on) {
  background: #dce6fb;
  border-color: #0057a3;
  box-shadow: 0 0 0 2px #0057a3;
}
.hero__card :deep(.pf__chips label.on span) {
  color: #122142;
  font-weight: 600;
}
.hero__card :deep(.pf__chips label.on small) {
  color: #0057a3;
}

.hero__card :deep(.pf__go) {
  min-height: 48px;
  margin-top: 14px;
  font-size: 15px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  font-weight: 600;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.3);
  transition: all 0.25s var(--ease-out);
}
.hero__card :deep(.pf__go:hover) {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
  box-shadow: 0 6px 20px rgba(0, 87, 163, 0.45);
  transform: translateY(-1px);
}
.hero__card :deep(.pf__nota) {
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

/* Peajes habilitados */
.tolls :deep(.empty > p) { margin-top: var(--space-3); max-width: 52ch; }

/* Preguntas frecuentes */
summary::-webkit-details-marker { display: none; }
summary svg { transition: transform .3s var(--ease-out); }
details[open] summary svg { transform: rotate(180deg); }
</style>
