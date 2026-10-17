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
    <!-- Orbes de iluminación ambiental tecnológica -->
    <div class="hero__glow-orb hero__glow-orb--1" aria-hidden="true"></div>
    <div class="hero__glow-orb hero__glow-orb--2" aria-hidden="true"></div>

    <div class="wrap hero__grid">
      <!-- Columna Izquierda: Mensaje Institucional, Métricas y Pilares Oficiales -->
      <div class="hero__intro">
        <div class="hero__badge">
          <span class="hero__badge-pulse" aria-hidden="true"></span>
          <AppIcon name="info" :size="14" class="hero__badge-icon" />
          <span>SISTEMA NACIONAL DE TELEPEAJE · MPPT</span>
        </div>

        <h1 id="hero-title" class="hero__title">
          Paga tus peajes <br class="hidden sm:inline" />con tu placa.
          <span class="hero__title-accent">Rápido. Seguro. Sin registrarte.</span>
        </h1>

        <p class="hero__sub">
          Recarga saldo en Bolívares (Bs.) y transita libremente sin demoras por los peajes habilitados de Venezuela. Lectura digital instantánea de tu matrícula vehicular.
        </p>

        <!-- Barra de métricas institucionales en vivo -->
        <div class="hero__stats">
          <div class="hero__stat-card">
            <div class="hero__stat-val">10+</div>
            <div class="hero__stat-lbl">Peajes Activos</div>
          </div>
          <div class="hero__stat-card">
            <div class="hero__stat-val">0 seg</div>
            <div class="hero__stat-lbl">Espera en Cabina</div>
          </div>
          <div class="hero__stat-card">
            <div class="hero__stat-val">100%</div>
            <div class="hero__stat-lbl">Digital en Bolívares</div>
          </div>
        </div>

        <!-- Pilares clave del servicio gubernamental con micro-tarjetas estilizadas -->
        <div class="hero__features">
          <div class="hero__feature-card">
            <div class="hero__feature-icon hero__feature-icon--cyan">
              <AppIcon name="rayo" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Paso continuo sin colas</h3>
              <p class="hero__feature-desc">Sin necesidad de detenerte a pagar en efectivo</p>
            </div>
          </div>

          <div class="hero__feature-card">
            <div class="hero__feature-icon hero__feature-icon--emerald">
              <AppIcon name="tarjeta" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Recargas en Bolívares (Bs.)</h3>
              <p class="hero__feature-desc">Pago Móvil, BDV y Botón IPG bancario</p>
            </div>
          </div>

          <div class="hero__feature-card">
            <div class="hero__feature-icon hero__feature-icon--amber">
              <AppIcon name="peaje" :size="20" />
            </div>
            <div>
              <h3 class="hero__feature-title">Red Oficial Nacional</h3>
              <p class="hero__feature-desc">Válido en los principales corredores del país</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Tarjeta Ejecutiva Flotante de Kiosco Digital -->
      <div class="hero__card-col">
        <div class="hero__card">
          <div class="hero__card-header">
            <div class="flex items-center gap-2">
              <span class="hero__card-status-dot"></span>
              <span class="hero__card-status-text">Terminal Digital Oficial</span>
            </div>
            <span class="hero__card-badge">
              <span class="hero__badge-pulse hero__badge-pulse--sm" aria-hidden="true"></span>
              En línea 24/7
            </span>
          </div>

          <div class="hero__ocr-indicator">
            <AppIcon name="placa" :size="14" />
            <span>Lectura Digital de Matrícula (OCR)</span>
          </div>

          <PlateForm :amount-options="amountOptions" @submit="onPlateSubmit" />

          <div class="hero__card-trust">
            <div class="hero__trust-item">
              <AppIcon name="check" :size="13" class="text-emerald-600" />
              <span>Sin comisiones extras</span>
            </div>
            <div class="hero__trust-item">
              <AppIcon name="recibo" :size="13" class="text-blue-600" />
              <span>Comprobante oficial</span>
            </div>
          </div>

          <div class="hero__payment-badges">
            <span class="hero__pay-badge">Pago Móvil</span>
            <span class="hero__pay-badge">Botón IPG</span>
            <span class="hero__pay-badge">Banca Nacional</span>
            <span class="hero__pay-badge">Débito / Crédito</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <HowItWorks plain />

  <!-- Sección TAG vs Placa: Formato Bento Comparativo de Alta Gama -->
  <section class="section wrap" aria-labelledby="tag-title">
    <div class="tag-bento grid md:grid-cols-2 gap-6 items-stretch">
      <!-- Tarjeta TAG -->
      <div class="tag-bento-card bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
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
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[100px] overflow-hidden">
          <img :src="tagImg" alt="TAG VenVías" width="360" height="162" loading="lazy" class="max-h-24 w-auto object-contain" />
        </div>
      </div>

      <!-- Tarjeta Pago por Placa -->
      <div class="tag-bento-card bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
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
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[100px] overflow-hidden">
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
        class="safety-card bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-start"
      >
        <div class="safety-icon-box w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5 flex-shrink-0">
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
/* Hero Split: 2 columnas en escritorio, balanceado y corporativo con ambient lighting */
.hero {
  position: relative;
  overflow: hidden;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(rgba(0, 87, 163, 0.07) 1.5px, transparent 1.5px),
    radial-gradient(at 0% 0%, rgba(219, 234, 254, 0.55) 0px, transparent 55%),
    radial-gradient(at 100% 100%, rgba(224, 242, 254, 0.5) 0px, transparent 55%);
  background-size: 24px 24px, 100% 100%, 100% 100%;
  color: #122142;
  padding-bottom: clamp(48px, 6vw, 84px);
}

/* Orbes flotantes de iluminación ambiental */
.hero__glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  opacity: 0.75;
  animation: floatOrb 10s ease-in-out infinite alternate;
}
.hero__glow-orb--1 {
  top: -80px;
  left: -80px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(0, 87, 163, 0.15) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 70%);
}
.hero__glow-orb--2 {
  bottom: -60px;
  right: -60px;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(0, 87, 163, 0.08) 50%, transparent 70%);
  animation-duration: 14s;
  animation-direction: alternate-reverse;
}
@keyframes floatOrb {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(24px, 18px) scale(1.08); }
  100% { transform: translate(-18px, 26px) scale(0.95); }
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: #0057a3;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  box-shadow: 0 2px 12px rgba(18, 33, 66, 0.06);
  border: 1px solid rgba(191, 219, 254, 0.9);
  margin-bottom: clamp(14px, 2vh, 22px);
  transition: all 0.25s var(--ease-out);
  animation: heroFadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.hero__badge:hover {
  transform: translateY(-1px);
  border-color: #0057a3;
  box-shadow: 0 4px 16px rgba(0, 87, 163, 0.12);
}
.hero__badge-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: pulseDot 2s infinite;
}
@keyframes pulseDot {
  0%, 100% { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.05); }
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
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}
.hero__title-accent {
  display: block;
  background: linear-gradient(135deg, #0057a3 0%, #0284c7 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  line-height: 1.2;
}

.hero__sub {
  margin: 14px 0 clamp(16px, 2.5vh, 24px);
  max-width: 52ch;
  color: #475569;
  font-size: clamp(15px, 1vw + 8px, 17px);
  line-height: 1.55;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
}

/* Barra de métricas institucionales en vivo */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-block: 8px 24px;
  width: 100%;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}
.hero__stat-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 14px;
  padding: 10px 14px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(18, 33, 66, 0.04);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s var(--ease-out), border-color 0.25s;
}
.hero__stat-card:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 10px 24px -2px rgba(0, 87, 163, 0.14);
  border-color: #93c5fd;
}
.hero__stat-val {
  font-size: 20px;
  font-weight: 700;
  color: #0057a3;
  line-height: 1.2;
  transition: color 0.2s;
}
.hero__stat-card:hover .hero__stat-val {
  color: #0284c7;
}
.hero__stat-lbl {
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* 3 Pilares clave en el hero izquierdo con hover y acentos */
.hero__features {
  display: grid;
  gap: 12px;
  width: 100%;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both;
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
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 2px 10px rgba(18, 33, 66, 0.03);
  text-align: left;
  transition: all 0.25s var(--ease-out);
}
.hero__feature-card:hover {
  background: #ffffff;
  border-color: #93c5fd;
  transform: translateX(4px);
  box-shadow: 0 8px 22px rgba(18, 33, 66, 0.08);
}
.hero__feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s var(--ease-out);
}
.hero__feature-card:hover .hero__feature-icon {
  transform: scale(1.12) rotate(6deg);
}
.hero__feature-icon--cyan { background: #ecfeff; color: #0891b2; box-shadow: 0 2px 8px rgba(8, 145, 178, 0.15); }
.hero__feature-icon--emerald { background: #ecfdf5; color: #059669; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.15); }
.hero__feature-icon--amber { background: #fffbeb; color: #d97706; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15); }

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

/* Columna Derecha: Tarjeta de Pago Kiosco Digital */
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
  box-shadow: 0 25px 50px -12px rgba(18, 33, 66, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.9), 0 8px 24px -4px rgba(0, 87, 163, 0.06);
  position: relative;
  transition: box-shadow 0.3s var(--ease-out), transform 0.3s var(--ease-out);
  animation: heroFadeInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
}
.hero__card:hover {
  box-shadow: 0 30px 60px -12px rgba(18, 33, 66, 0.16), 0 0 0 1px rgba(147, 197, 253, 0.9), 0 12px 28px -4px rgba(0, 87, 163, 0.1);
}
.hero__card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 28px;
  right: 28px;
  height: 3px;
  border-radius: 0 0 4px 4px;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
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
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #0057a3;
  background: #eff6ff;
  padding: 3px 10px;
  border-radius: 500px;
  border: 1px solid #dbeafe;
}
.hero__badge-pulse--sm {
  width: 6px;
  height: 6px;
}

.hero__ocr-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #0057a3;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  border-radius: 6px;
  padding: 4px 10px;
  margin-bottom: 12px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
}
.hero__ocr-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: ocrBeam 3.5s ease-in-out infinite;
}
@keyframes ocrBeam {
  0% { left: -100%; }
  35%, 100% { left: 200%; }
}

.hero__card-trust {
  display: flex;
  justify-content: space-around;
  gap: 8px;
  margin-top: 12px;
}
.hero__trust-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
}

.hero__payment-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
}
.hero__pay-badge {
  font-size: 10.5px;
  font-weight: 500;
  color: #64748b;
  background: #f8fafc;
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s var(--ease-out);
}
.hero__pay-badge:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #0057a3;
  transform: translateY(-1px);
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
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 24px -4px rgba(18, 33, 66, 0.12), 0 4px 8px -2px rgba(18, 33, 66, 0.05);
  border-radius: 4% / 7.8%;
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
}
/* Línea de escaneo láser OCR inteligente */
.hero__card :deep(.plate)::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 87, 163, 0.7), rgba(56, 189, 248, 0.9), transparent);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.8), 0 0 4px rgba(0, 87, 163, 0.6);
  pointer-events: none;
  animation: plateLaser 4s ease-in-out infinite;
}
@keyframes plateLaser {
  0%, 100% { top: 6%; opacity: 0; }
  12%, 88% { opacity: 0.85; }
  50% { top: 92%; }
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
  position: relative;
  overflow: hidden;
  transition: all 0.25s var(--ease-out);
}
.hero__card :deep(.pf__go)::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  animation: btnShimmer 4s ease-in-out infinite 1.5s;
}
@keyframes btnShimmer {
  0% { left: -100%; }
  30%, 100% { left: 200%; }
}
.hero__card :deep(.pf__go:hover) {
  background: linear-gradient(135deg, #004b8d 0%, #0057a3 100%);
  box-shadow: 0 8px 24px rgba(0, 87, 163, 0.45);
  transform: translateY(-2px);
}
.hero__card :deep(.pf__nota) {
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
}

/* Animaciones de entrada escalonada del Hero */
@keyframes heroFadeInDown {
  from { opacity: 0; transform: translateY(-16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes heroFadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes heroFadeInRight {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Bento cards interactividad y animación */
.tag-bento-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.tag-bento-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -10px rgba(18, 33, 66, 0.12);
  border-color: #93c5fd;
}
.tag-bento-card img {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tag-bento-card:hover img {
  transform: scale(1.08) translateY(-2px);
}

/* Tarjetas de Seguridad y Confianza */
.safety-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.safety-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px -8px rgba(18, 33, 66, 0.1);
  border-color: #93c5fd;
}
.safety-icon-box {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s, color 0.3s;
}
.safety-card:hover .safety-icon-box {
  transform: scale(1.12) rotate(-6deg);
  background-color: #dbeafe;
  color: #0057a3;
}

/* Tarjeta Mi Cuenta Corporativa */
.account-card {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.account-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(18, 33, 66, 0.14);
  border-color: #93c5fd;
}

/* Peajes habilitados */
.tolls :deep(.empty > p) { margin-top: var(--space-3); max-width: 52ch; }

/* Preguntas frecuentes */
summary::-webkit-details-marker { display: none; }
summary svg { transition: transform .3s var(--ease-out); }
details {
  border-radius: 12px;
  transition: background-color 0.2s ease, padding 0.2s ease;
}
details[open] {
  background-color: #f8fafc;
  padding-inline: 12px;
}
details[open] summary svg {
  transform: rotate(180deg);
  color: #0057a3;
}
details[open] p {
  animation: faqSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes faqSlide {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__glow-orb,
  .hero__badge,
  .hero__title,
  .hero__sub,
  .hero__stats,
  .hero__features,
  .hero__card,
  .hero__badge-pulse,
  .hero__ocr-indicator::after,
  .hero__card :deep(.plate)::after,
  .hero__card :deep(.pf__go)::after,
  .tag-bento-card,
  .tag-bento-card img,
  .safety-card,
  .safety-icon-box,
  .account-card,
  details[open] p {
    animation: none !important;
    transition: none !important;
  }
}
</style>
