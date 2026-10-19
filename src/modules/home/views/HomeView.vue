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

import { useHeroTimeOfDay } from '../composables/useHeroTimeOfDay'

export default defineComponent({
  name: 'HomeView',
  components: { AppIcon, PlateForm, TollsSummaryCard, HowItWorks },
  setup() {
    return {
      ...useRechargeAmounts(),
      ...useHeroTimeOfDay(),
    }
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
  <section class="hero" :class="`hero--${currentTime}`" aria-labelledby="hero-title">
    <!-- Fondo Moderno de Alta Gama: Autopistas Reales Dinámicas (Día, Tarde, Noche) + Aurora Mesh -->
    <div class="hero__bg" :class="`hero__bg--${currentTime}`" aria-hidden="true">
      <!-- Capas de fotos de autopistas venezolanas con cross-fade cinematográfico -->
      <div class="hero__photo-stage">
        <img
          :src="dayImg"
          alt=""
          class="hero__photo-layer"
          :class="{ 'is-active': currentTime === 'day' }"
          loading="eager"
        />
        <img
          :src="sunsetImg"
          alt=""
          class="hero__photo-layer"
          :class="{ 'is-active': currentTime === 'sunset' }"
          loading="eager"
        />
        <img
          :src="nightImg"
          alt=""
          class="hero__photo-layer"
          :class="{ 'is-active': currentTime === 'night' }"
          loading="eager"
        />
      </div>

      <!-- Velo de legibilidad y contraste degradado (Atmospheric Scrim) -->
      <div class="hero__scrim"></div>

      <!-- Transición sutil al pie del Hero -->
      <div class="hero__bg-bottom-fade"></div>
    </div>

    <div class="wrap hero__grid">
      <!-- Columna Izquierda: Mensaje Institucional, Métricas y Pilares Oficiales -->
      <div class="hero__intro">
        <!-- Selector ambiental sobrio (Día / Tarde / Noche) -->
        <div class="hero__scene-switch" role="group" aria-label="Ambiente de autopista">
          <button
            type="button"
            class="hero__scene-btn"
            :class="{ 'is-active': currentTime === 'day' }"
            @click="setTimeOfDay('day')"
          >
            ☀️ Día
          </button>
          <button
            type="button"
            class="hero__scene-btn"
            :class="{ 'is-active': currentTime === 'sunset' }"
            @click="setTimeOfDay('sunset')"
          >
            🌅 Tarde
          </button>
          <button
            type="button"
            class="hero__scene-btn"
            :class="{ 'is-active': currentTime === 'night' }"
            @click="setTimeOfDay('night')"
          >
            🌙 Noche
          </button>
          <button
            v-if="timeMode === 'manual'"
            type="button"
            class="hero__scene-btn hero__scene-btn--auto"
            @click="setAuto()"
          >
            Auto
          </button>
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
            <span class="hero__card-status-text">TERMINAL DIGITAL OFICIAL</span>
            <span class="hero__card-status-sub">24/7 · Recargas en Línea</span>
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
          <div class="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            Dispositivo Adherido
          </div>
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
          <div class="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
            <AppIcon name="rayo" :size="14" />
            Sin Trámites ni Instalaciones
          </div>
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
        <div class="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
          <AppIcon name="peaje" :size="14" />
          Cobertura Nacional
        </div>
        <h2 id="tolls-title" class="text-slate-900 font-bold text-3xl">{{ tollsText.title }}</h2>
        <p class="lead text-slate-600">{{ tollsText.intro }}</p>
      </div>
      <TollsSummaryCard />
    </div>
  </section>

  <!-- Sección Seguridad: Cuadrícula de 3 Tarjetas de Confianza -->
  <section class="section wrap pb-8" aria-labelledby="safety-title">
    <div class="text-center max-w-2xl mx-auto mb-10">
      <div class="inline-flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
        <AppIcon name="check" :size="14" />
        Protección y Privacidad
      </div>
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
          <div class="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
            <AppIcon name="carro" :size="14" />
            Servicio Corporativo y Comercial
          </div>
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
        <div class="mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
          Centro de Ayuda
        </div>
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

  <!-- Sección Síguenos en nuestras Redes Sociales -->
  <section class="section wrap pt-0" aria-labelledby="social-title">
    <div class="social-banner">
      <div class="social-banner__header">
        <span class="social-banner__eyebrow">CANALES OFICIALES DE INFORMACIÓN</span>
        <h2 id="social-title" class="social-banner__title">Síguenos en nuestras redes sociales</h2>
        <p class="social-banner__desc">
          Mantente al día con los nuevos peajes habilitados, estados del tránsito en tiempo real, operativos viales y noticias oficiales de VenVías.
        </p>
      </div>

      <div class="social-cards-grid">
        <!-- Instagram -->
        <a
          href="https://www.instagram.com/mtransportegobve"
          target="_blank"
          rel="noopener noreferrer"
          class="social-card social-card--instagram"
        >
          <div class="social-card__icon social-card__icon--instagram">
            <svg viewBox="0 0 24 24" class="social-svg" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div class="social-card__content">
            <span class="social-card__platform">Instagram</span>
            <span class="social-card__handle">@mtransportegobve</span>
          </div>
          <span class="social-card__arrow" aria-hidden="true">↗</span>
        </a>

        <!-- X (Twitter) -->
        <a
          href="https://twitter.com/TransporteGobVe"
          target="_blank"
          rel="noopener noreferrer"
          class="social-card social-card--x"
        >
          <div class="social-card__icon social-card__icon--x">
            <svg viewBox="0 0 24 24" class="social-svg" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </div>
          <div class="social-card__content">
            <span class="social-card__platform">X / Twitter</span>
            <span class="social-card__handle">@TransporteGobVe</span>
          </div>
          <span class="social-card__arrow" aria-hidden="true">↗</span>
        </a>

        <!-- Telegram -->
        <a
          href="https://t.me/mtransportegobve"
          target="_blank"
          rel="noopener noreferrer"
          class="social-card social-card--telegram"
        >
          <div class="social-card__icon social-card__icon--telegram">
            <svg viewBox="0 0 24 24" class="social-svg" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div class="social-card__content">
            <span class="social-card__platform">Telegram</span>
            <span class="social-card__handle">Canal Oficial MPPT</span>
          </div>
          <span class="social-card__arrow" aria-hidden="true">↗</span>
        </a>

        <!-- Atención Telefónica -->
        <a
          href="tel:08008368427"
          class="social-card social-card--phone"
        >
          <div class="social-card__icon social-card__icon--phone">
            <svg viewBox="0 0 24 24" class="social-svg" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          <div class="social-card__content">
            <span class="social-card__platform">0800-VENVIAS</span>
            <span class="social-card__handle">Línea Gratuita 24/7</span>
          </div>
          <span class="social-card__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ==========================================================================
   TEMA AMBIENTAL DINÁMICO DE AUTOPISTA (DÍA / ATARDECER / NOCHE)
   ========================================================================== */

.hero {
  position: relative;
  overflow: hidden;
  padding-bottom: clamp(36px, 4.5vw, 64px);
  transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- TEMA DÍA (06:00 - 17:59): Luminoso, cielo despejado, azul institucional VenVías --- */
.hero--day {
  background-color: #f1f5f9;
  color: #0f172a;
}
.hero--day .hero__photo-layer.is-active {
  opacity: 0.55;
  filter: contrast(1.05) saturate(1.1);
}
.hero--day .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(241, 245, 249, 0.96) 0%,
    rgba(241, 245, 249, 0.88) 42%,
    rgba(241, 245, 249, 0.50) 72%,
    rgba(241, 245, 249, 0.15) 100%
  );
}
.hero--day .hero__title {
  color: #0f172a;
}
.hero--day .hero__title-accent {
  color: #0038A8;
}
.hero--day .hero__sub {
  color: #475569;
}
.hero--day .hero__stat-card,
.hero--day .hero__feature-card {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  border: 1px solid #cbd5e1;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
}
.hero--day .hero__stat-card:hover,
.hero--day .hero__stat-card:focus-within,
.hero--day .hero__feature-card:hover,
.hero--day .hero__feature-card:focus-within {
  background: #ffffff;
  border-color: #0038A8;
  box-shadow: 0 8px 24px rgba(0, 56, 168, 0.12);
}
.hero--day .hero__stat-val {
  color: #0038A8;
}
.hero--day .hero__stat-lbl {
  color: #64748b;
}
.hero--day .hero__feature-title {
  color: #0f172a;
}
.hero--day .hero__feature-desc {
  color: #475569;
}
.hero--day .hero__feature-icon--cyan {
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
}
.hero--day .hero__feature-icon--emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
}
.hero--day .hero__feature-icon--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #d97706;
}
.hero--day .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(241, 245, 249, 0.9) 65%, #ffffff 100%);
}

/* --- TEMA ATARDECER (18:00 - 19:59): Crepúsculo natural, ámbar y pizarra cálido --- */
.hero--sunset {
  background-color: #1a1224;
  color: #f8fafc;
}
.hero--sunset .hero__photo-layer.is-active {
  opacity: 0.65;
  filter: contrast(1.1) saturate(1.15);
}
.hero--sunset .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(26, 18, 36, 0.96) 0%,
    rgba(26, 18, 36, 0.86) 42%,
    rgba(26, 18, 36, 0.48) 72%,
    rgba(26, 18, 36, 0.15) 100%
  );
}
.hero--sunset .hero__title {
  color: #ffffff;
}
.hero--sunset .hero__title-accent {
  color: #f59e0b;
}
.hero--sunset .hero__sub {
  color: #fed7aa;
}
.hero--sunset .hero__stat-card,
.hero--sunset .hero__feature-card {
  background: rgba(35, 24, 48, 0.82);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
}
.hero--sunset .hero__stat-card:hover,
.hero--sunset .hero__stat-card:focus-within,
.hero--sunset .hero__feature-card:hover,
.hero--sunset .hero__feature-card:focus-within {
  background: rgba(48, 32, 66, 0.95);
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
}
.hero--sunset .hero__stat-val {
  color: #f59e0b;
}
.hero--sunset .hero__stat-lbl {
  color: #e2e8f0;
}
.hero--sunset .hero__feature-title {
  color: #ffffff;
}
.hero--sunset .hero__feature-desc {
  color: #cbd5e1;
}
.hero--sunset .hero__feature-icon--cyan {
  background: rgba(2, 132, 199, 0.18);
  color: #7dd3fc;
}
.hero--sunset .hero__feature-icon--emerald {
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}
.hero--sunset .hero__feature-icon--amber {
  background: rgba(245, 158, 11, 0.18);
  color: #fcd34d;
}
.hero--sunset .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(26, 18, 36, 0.9) 65%, #ffffff 100%);
}

/* --- TEMA NOCHE (20:00 - 05:59): Azul noche profundo institucional, sobrio y elegante --- */
.hero--night {
  background-color: #070d1e;
  color: #f8fafc;
}
.hero--night .hero__photo-layer.is-active {
  opacity: 0.68;
  filter: contrast(1.12) saturate(1.2);
}
.hero--night .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(7, 13, 30, 0.96) 0%,
    rgba(7, 13, 30, 0.88) 42%,
    rgba(7, 13, 30, 0.50) 72%,
    rgba(7, 13, 30, 0.15) 100%
  );
}
.hero--night .hero__title {
  color: #ffffff;
}
.hero--night .hero__title-accent {
  color: #38bdf8;
}
.hero--night .hero__sub {
  color: #cbd5e1;
}
.hero--night .hero__stat-card,
.hero--night .hero__feature-card {
  background: rgba(13, 21, 40, 0.80);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
}
.hero--night .hero__stat-card:hover,
.hero--night .hero__stat-card:focus-within,
.hero--night .hero__feature-card:hover,
.hero--night .hero__feature-card:focus-within {
  background: rgba(18, 29, 56, 0.95);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}
.hero--night .hero__stat-val {
  color: #ffffff;
}
.hero--night .hero__stat-lbl {
  color: #94a3b8;
}
.hero--night .hero__feature-title {
  color: #ffffff;
}
.hero--night .hero__feature-desc {
  color: #94a3b8;
}
.hero--night .hero__feature-icon--cyan {
  background: rgba(56, 189, 248, 0.12);
  color: #7dd3fc;
}
.hero--night .hero__feature-icon--emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
}
.hero--night .hero__feature-icon--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
}
.hero--night .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(7, 13, 30, 0.95) 60%, #ffffff 100%);
}

/* Selector ambiental sobrio (Día / Tarde / Noche) */
.hero__scene-switch {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  margin-bottom: var(--space-4);
}

.hero--day .hero__scene-switch {
  background: rgba(255, 255, 255, 0.85);
  border-color: #cbd5e1;
}

.hero__scene-btn {
  background: transparent;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  padding: 5px 10px;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hero--day .hero__scene-btn {
  color: #64748b;
}

.hero__scene-btn:hover {
  color: #ffffff;
}

.hero--day .hero__scene-btn:hover {
  color: #0f172a;
}

.hero__scene-btn.is-active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-weight: 700;
}

.hero--day .hero__scene-btn.is-active {
  background: #ffffff;
  color: #0038A8;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.hero__scene-btn--auto {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.8;
}

/* Contenedor maestro de fondo multicapa */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

/* Escenario de fondo fotográfico dinámico de autopistas */
.hero__photo-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.hero__photo-layer {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 36%;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

/* Velo atmosférico para garantizar legibilidad */
.hero__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transition: background 0.8s ease;
}

/* Desvanecimiento inferior ultra-suave */
.hero__bg-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  pointer-events: none;
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(24px, 3.5vw, 44px);
  padding-top: clamp(16px, 2.5vw, 32px);
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
  font-size: clamp(28px, 2.6vw + 10px, 46px);
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
  line-height: 1.18;
}

.hero__sub {
  margin: 10px 0 16px;
  max-width: 50ch;
  color: #475569;
  font-size: clamp(14px, 0.85vw + 7px, 16px);
  line-height: 1.5;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both;
}

/* Barra de métricas institucionales en vivo */
.hero__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-block: 4px 16px;
  width: 100%;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}
.hero__stat-card {
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  padding: 8px 12px;
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
  font-size: 19px;
  font-weight: 700;
  color: #0057a3;
  line-height: 1.15;
  transition: color 0.2s;
}
.hero__stat-card:hover .hero__stat-val {
  color: #0284c7;
}
.hero__stat-lbl {
  font-size: 10.5px;
  color: #64748b;
  font-weight: 600;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

/* 3 Pilares clave en el hero izquierdo con hover y acentos */
.hero__features {
  display: grid;
  gap: 8px;
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
  gap: 12px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(10px);
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 2px 10px rgba(18, 33, 66, 0.03);
  text-align: left;
  transition: all 0.25s var(--ease-out);
}
.hero__feature-card:hover,
.hero__feature-card:focus-within {
  transform: translateX(4px);
}
.hero__feature-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.25s var(--ease-out);
}
.hero__feature-card:hover .hero__feature-icon,
.hero__feature-card:focus-within .hero__feature-icon {
  transform: scale(1.1) rotate(5deg);
}
.hero__feature-icon--cyan { background: #ecfeff; color: #0891b2; box-shadow: 0 2px 8px rgba(8, 145, 178, 0.15); }
.hero__feature-icon--emerald { background: #ecfdf5; color: #059669; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.15); }
.hero__feature-icon--amber { background: #fffbeb; color: #d97706; box-shadow: 0 2px 8px rgba(217, 119, 6, 0.15); }

.hero__feature-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #122142;
  margin: 0;
}
.hero__feature-desc {
  font-size: 12px;
  color: #64748b;
  margin: 1px 0 0;
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
  border-radius: 1.25rem;
  padding: clamp(16px, 2vw, 24px);
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
.hero__card-status-text {
  font-size: 11px;
  font-weight: 800;
  color: var(--azul-700);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.hero__card-status-sub {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
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

/* ==========================================================================
   SECCIÓN CANALES OFICIALES Y REDES SOCIALES
   ========================================================================== */
.social-banner {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 24px;
  padding: clamp(24px, 4vw, 36px);
  box-shadow: 0 10px 30px -5px rgba(18, 33, 66, 0.05);
}

.social-banner__header {
  margin-bottom: var(--space-6);
  max-width: 680px;
}

.social-banner__eyebrow {
  display: block;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--azul-700);
  margin-bottom: 6px;
}

.social-banner__title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 30px);
  font-weight: 700;
  color: var(--marino-900);
  letter-spacing: -0.02em;
  margin: 0 0 8px;
}

.social-banner__desc {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
}

.social-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 600px) {
  .social-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .social-cards-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.social-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  text-decoration: none !important;
  color: inherit;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.social-card:hover {
  background: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -6px rgba(18, 33, 66, 0.1);
  text-decoration: none !important;
}

.social-card--instagram:hover { border-color: #e1306c; }
.social-card--x:hover { border-color: #0f172a; }
.social-card--telegram:hover { border-color: #229ed9; }
.social-card--phone:hover { border-color: #10b981; }

.social-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 0.25s ease;
}

.social-card:hover .social-card__icon {
  transform: scale(1.08);
}

.social-card__icon--instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
}

.social-card__icon--x {
  background: #000000;
}

.social-card__icon--telegram {
  background: #229ed9;
}

.social-card__icon--phone {
  background: #059669;
}

.social-svg {
  width: 22px;
  height: 22px;
}

.social-card__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex-grow: 1;
}

.social-card__platform {
  font-size: 13px;
  font-weight: 700;
  color: var(--marino-900);
  line-height: 1.2;
  text-decoration: none !important;
}

.social-card__handle {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none !important;
}

.social-card__arrow {
  font-size: 14px;
  font-weight: 700;
  color: #94a3b8;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.social-card:hover .social-card__arrow {
  color: var(--azul-700);
  transform: translate(2px, -2px);
}

@media (prefers-reduced-motion: reduce) {
  .hero__photo-layer,
  .hero__aurora-orb,
  .hero__flow-path,
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
