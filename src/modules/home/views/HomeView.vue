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

      <!-- Malla degradada viva / Aurora Mesh -->
      <div class="hero__aurora">
        <div class="hero__aurora-orb hero__aurora-orb--primary"></div>
        <div class="hero__aurora-orb hero__aurora-orb--cyan"></div>
        <div class="hero__aurora-orb hero__aurora-orb--amber"></div>
        <div class="hero__aurora-orb hero__aurora-orb--card-glow"></div>
      </div>

      <!-- Cuadrícula arquitectónica de precisión (Linear/Vercel style con fade radial suave) -->
      <div class="hero__grid-pattern"></div>

      <!-- Ondas lumínicas de autopista y telepeaje digital (Flow lines vectoriales) -->
      <svg class="hero__highway-waves" viewBox="0 0 1440 720" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hw-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0057a3" stop-opacity="0" />
            <stop offset="25%" stop-color="#0057a3" stop-opacity="0.12" />
            <stop offset="60%" stop-color="#0284c7" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="hw-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38bdf8" stop-opacity="0" />
            <stop offset="40%" stop-color="#0284c7" stop-opacity="0.14" />
            <stop offset="80%" stop-color="#f59e0b" stop-opacity="0.10" />
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M-80 620 C 320 540, 720 660, 1520 440" stroke="url(#hw-gradient-1)" stroke-width="2" stroke-dasharray="8 14" class="hero__flow-path hero__flow-path--1" />
        <path d="M-80 650 C 360 570, 760 690, 1520 480" stroke="url(#hw-gradient-1)" stroke-width="1.2" stroke-opacity="0.6" />
        <path d="M-80 580 C 420 490, 820 620, 1520 390" stroke="url(#hw-gradient-2)" stroke-width="1.8" stroke-dasharray="10 16" class="hero__flow-path hero__flow-path--2" />
      </svg>

      <!-- Transición sutil al pie del Hero -->
      <div class="hero__bg-bottom-fade"></div>
    </div>

    <div class="wrap hero__grid">
      <!-- Columna Izquierda: Mensaje Institucional, Métricas y Pilares Oficiales -->
      <div class="hero__intro">
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
          <div class="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400"></span>
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
        <div class="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-400"></span>
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
    <div class="social-banner bg-white rounded-3xl p-8 md:p-12 shadow-lg shadow-slate-200/50 border border-slate-200/80 relative overflow-hidden">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div class="max-w-xl text-center lg:text-left">
          <div class="flex items-center justify-center lg:justify-start gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm shadow-blue-400"></span>
            Canales Oficiales
          </div>
          <h2 id="social-title" class="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-3">
            Síguenos en nuestras redes sociales
          </h2>
          <p class="text-slate-600 text-sm md:text-base leading-relaxed">
            Mantente al día con los nuevos peajes habilitados, estados del tránsito en tiempo real, operativos nacionales y actualizaciones del servicio VenVías.
          </p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
          <!-- Instagram -->
          <a
            href="https://www.instagram.com/mtransportegobve"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 transition-all duration-300 group shadow-sm hover:shadow"
          >
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <span class="text-xs font-bold text-slate-900 group-hover:text-pink-600 transition-colors">Instagram</span>
            <span class="text-[11px] text-slate-500 font-medium">@mtransportegobve</span>
          </a>

          <!-- X / Twitter -->
          <a
            href="https://twitter.com/TransporteGobVe"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all duration-300 group shadow-sm hover:shadow"
          >
            <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </div>
            <span class="text-xs font-bold text-slate-900 group-hover:text-slate-800 transition-colors">X / Twitter</span>
            <span class="text-[11px] text-slate-500 font-medium">@TransporteGobVe</span>
          </a>

          <!-- Telegram -->
          <a
            href="https://t.me/mtransportegobve"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 transition-all duration-300 group shadow-sm hover:shadow"
          >
            <div class="w-12 h-12 rounded-xl bg-[#229ED9] flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </div>
            <span class="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">Telegram</span>
            <span class="text-[11px] text-slate-500 font-medium">Canal Oficial</span>
          </a>

          <!-- Atención Telefónica -->
          <a
            href="tel:08008368427"
            class="social-btn flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all duration-300 group shadow-sm hover:shadow"
          >
            <div class="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white mb-2 shadow-md group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <span class="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Atención 24/7</span>
            <span class="text-[11px] text-slate-500 font-medium">0800-VENVIAS</span>
          </a>
        </div>
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
  transition: background-color 1.2s cubic-bezier(0.16, 1, 0.3, 1), color 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* --- TEMA DÍA (06:00 - 17:59): Luminoso, Ávila nítido, azul institucional --- */
.hero--day {
  background-color: #f0f7ff;
  color: #0f172a;
}
.hero--day .hero__photo-layer.is-active {
  opacity: 0.52;
  filter: contrast(1.08) saturate(1.15);
}
.hero--day .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(240, 247, 255, 0.94) 0%,
    rgba(240, 247, 255, 0.82) 36%,
    rgba(240, 247, 255, 0.42) 66%,
    rgba(240, 247, 255, 0.10) 100%
  );
}
.hero--day .hero__title {
  color: #0f172a;
}
.hero--day .hero__title-accent {
  background: linear-gradient(135deg, #0057a3 0%, #0284c7 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero--day .hero__sub {
  color: #334155;
}
.hero--day .hero__stat-card,
.hero--day .hero__feature-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(203, 213, 225, 0.9);
  box-shadow: 0 4px 16px rgba(18, 33, 66, 0.05);
}
.hero--day .hero__stat-card:hover,
.hero--day .hero__stat-card:focus-within {
  background: #ffffff;
  border-color: #93c5fd;
  box-shadow: 0 10px 24px -2px rgba(0, 87, 163, 0.14);
}
.hero--day .hero__feature-card:hover,
.hero--day .hero__feature-card:focus-within {
  background: #ffffff;
  border-color: #0057a3;
  box-shadow: 0 10px 24px rgba(0, 87, 163, 0.12);
}
.hero--day .hero__stat-val {
  color: #0057a3;
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

/* --- TEMA ATARDECER (18:00 - 19:59): Crepúsculo dorado, reflejos ámbar y violeta --- */
.hero--sunset {
  background-color: #1a1026;
  color: #f8fafc;
}
.hero--sunset .hero__photo-layer.is-active {
  opacity: 0.72;
  filter: contrast(1.15) saturate(1.3);
}
.hero--sunset .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(26, 16, 38, 0.95) 0%,
    rgba(26, 16, 38, 0.82) 38%,
    rgba(26, 16, 38, 0.42) 68%,
    rgba(26, 16, 38, 0.10) 100%
  );
}
.hero--sunset .hero__title {
  color: #ffffff;
}
.hero--sunset .hero__title-accent {
  background: linear-gradient(135deg, #fbbf24 0%, #f97316 55%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 14px rgba(249, 115, 22, 0.45));
}
.hero--sunset .hero__sub {
  color: #fde68a;
  opacity: 0.95;
}
.hero--sunset .hero__stat-card,
.hero--sunset .hero__feature-card {
  background: rgba(36, 21, 52, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(251, 191, 36, 0.28);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.4);
}
.hero--sunset .hero__stat-card:hover,
.hero--sunset .hero__stat-card:focus-within {
  background: rgba(55, 30, 80, 0.95);
  border-color: #fbbf24;
  box-shadow: 0 12px 36px rgba(251, 191, 36, 0.35);
}
.hero--sunset .hero__feature-card:hover,
.hero--sunset .hero__feature-card:focus-within {
  background: rgba(55, 30, 80, 0.95);
  border-color: #fbbf24;
  box-shadow: 0 12px 36px rgba(251, 191, 36, 0.35);
}
.hero--sunset .hero__stat-val {
  color: #fbbf24;
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
  background: rgba(8, 145, 178, 0.28);
  color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
}
.hero--sunset .hero__feature-icon--emerald {
  background: rgba(16, 185, 129, 0.28);
  color: #34d399;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.25);
}
.hero--sunset .hero__feature-icon--amber {
  background: rgba(245, 158, 11, 0.28);
  color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.25);
}
.hero--sunset .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(26, 16, 38, 0.88) 60%, #ffffff 100%);
}

/* --- TEMA NOCHE (20:00 - 05:59): Expreso nocturno cinematográfico, estelas de luz y neón --- */
.hero--night {
  background-color: #060a14;
  color: #f8fafc;
}
.hero--night .hero__photo-layer.is-active {
  opacity: 0.74;
  filter: contrast(1.18) saturate(1.35);
}
.hero--night .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(6, 10, 20, 0.95) 0%,
    rgba(6, 10, 20, 0.84) 40%,
    rgba(6, 10, 20, 0.42) 70%,
    rgba(6, 10, 20, 0.10) 100%
  );
}
.hero--night .hero__title {
  color: #ffffff;
}
.hero--night .hero__title-accent {
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #818cf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 14px rgba(56, 189, 248, 0.45));
}
.hero--night .hero__sub {
  color: #cbd5e1;
}
.hero--night .hero__stat-card,
.hero--night .hero__feature-card {
  background: rgba(15, 23, 42, 0.84);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(56, 189, 248, 0.28);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.55);
}
.hero--night .hero__stat-card:hover,
.hero--night .hero__stat-card:focus-within {
  background: rgba(22, 34, 60, 0.96);
  border-color: #38bdf8;
  box-shadow: 0 12px 36px rgba(56, 189, 248, 0.35);
}
.hero--night .hero__feature-card:hover,
.hero--night .hero__feature-card:focus-within {
  background: rgba(22, 34, 60, 0.96);
  border-color: #38bdf8;
  box-shadow: 0 12px 36px rgba(56, 189, 248, 0.35);
}
.hero--night .hero__stat-val {
  color: #38bdf8;
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
  background: rgba(8, 145, 178, 0.28);
  color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
}
.hero--night .hero__feature-icon--emerald {
  background: rgba(16, 185, 129, 0.28);
  color: #34d399;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.25);
}
.hero--night .hero__feature-icon--amber {
  background: rgba(245, 158, 11, 0.28);
  color: #fbbf24;
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.25);
}
.hero--night .hero__aurora-orb--card-glow {
  background: radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, rgba(0, 87, 163, 0.20) 45%, transparent 75%);
}
.hero--night .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(6, 10, 20, 0.92) 60%, #ffffff 100%);
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
  transform: scale(1.03);
  transition: opacity 1.4s cubic-bezier(0.16, 1, 0.3, 1), transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

/* Velo atmosférico para garantizar legibilidad */
.hero__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transition: background 1.2s ease;
}

/* Malla ambiental viva estilo Aurora UI / Gov-Tech de última generación */
.hero__aurora {
  position: absolute;
  inset: 0;
  opacity: 0.9;
  will-change: transform;
}

.hero__aurora-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

/* Orbe azul imperial VenVías superior izquierdo */
.hero__aurora-orb--primary {
  top: -140px;
  left: -100px;
  width: 680px;
  height: 680px;
  background: radial-gradient(circle, rgba(0, 87, 163, 0.14) 0%, rgba(2, 132, 199, 0.08) 35%, transparent 68%);
  filter: blur(40px);
  animation: auroraFloatPrimary 18s ease-in-out infinite alternate;
}

/* Orbe celeste y cian dinámico */
.hero__aurora-orb--cyan {
  top: -40px;
  right: 20%;
  width: 580px;
  height: 580px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(14, 165, 233, 0.08) 35%, transparent 68%);
  filter: blur(45px);
  animation: auroraFloatCyan 22s ease-in-out infinite alternate-reverse;
}

/* Orbe cálido ámbar/dorado nacional */
.hero__aurora-orb--amber {
  top: 140px;
  left: 22%;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.07) 0%, rgba(251, 191, 36, 0.03) 35%, transparent 68%);
  filter: blur(40px);
  animation: auroraFloatAmber 20s ease-in-out infinite alternate;
}

/* Halo lumínico centrado detrás del Kiosco Digital */
.hero__aurora-orb--card-glow {
  top: 30px;
  right: -80px;
  width: 640px;
  height: 640px;
  background: radial-gradient(circle, rgba(0, 87, 163, 0.12) 0%, rgba(56, 189, 248, 0.09) 35%, rgba(245, 158, 11, 0.03) 50%, transparent 68%);
  filter: blur(45px);
  animation: auroraFloatCard 16s ease-in-out infinite alternate;
}

@keyframes auroraFloatPrimary {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(40px, 30px, 0) scale(1.08); }
  100% { transform: translate3d(-25px, 45px, 0) scale(0.96); }
}

@keyframes auroraFloatCyan {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-35px, -25px, 0) scale(1.1); }
  100% { transform: translate3d(30px, 20px, 0) scale(0.94); }
}

@keyframes auroraFloatAmber {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(-30px, 35px, 0) scale(1.12); }
  100% { transform: translate3d(25px, -20px, 0) scale(0.92); }
}

@keyframes auroraFloatCard {
  0% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(20px, -25px, 0) scale(1.06); }
  100% { transform: translate3d(-20px, 20px, 0) scale(0.98); }
}

/* Cuadrícula arquitectónica de precisión (Linear/Vercel design system) */
.hero__grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(to right, rgba(0, 87, 163, 0.035) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 87, 163, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 75% 65% at 50% 35%, #000 25%, transparent 85%);
  opacity: 0.85;
}

/* Ondas vectoriales de flujo de autopista y telepeaje */
.hero__highway-waves {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.55;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 75%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 75%, transparent 100%);
}

.hero__flow-path {
  animation: flowPulse 20s linear infinite;
}
.hero__flow-path--1 {
  animation-duration: 24s;
}
.hero__flow-path--2 {
  animation-duration: 18s;
  animation-direction: reverse;
}
@keyframes flowPulse {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: -200; }
}

/* Desvanecimiento inferior ultra-suave */
.hero__bg-bottom-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9) 65%, #ffffff 100%);
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
