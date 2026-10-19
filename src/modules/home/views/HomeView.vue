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
import SocialChannelsSection from '../components/SocialChannelsSection.vue'
import { FAQS, SAFETY_ITEMS } from '../constants/home.content'
import tagImg from '@/assets/tag-venvias.webp'
import plateImg from '@/assets/plate-venezuela.svg'

import { useHeroTimeOfDay } from '../composables/useHeroTimeOfDay'

export default defineComponent({
  name: 'HomeView',
  components: { AppIcon, PlateForm, TollsSummaryCard, HowItWorks, SocialChannelsSection },
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
          :src="nightImg"
          alt=""
          class="hero__photo-layer"
          :class="{ 'is-active': currentTime === 'night' }"
          loading="eager"
        />

        <!-- Letrero Digital de Peaje VenVías con Transición Animada de Colores en las Letras -->
        <div class="hero__canopy-overlay" :class="{ 'is-active': currentTime === 'day' }" aria-hidden="true">
          <div class="hero__canopy-sign">
            <div class="hero__canopy-sign-inner">
              <span class="canopy-letters-animated">VenVías</span>
              <span class="canopy-sub">PEAJES NACIONALES</span>
            </div>
            <div class="canopy-flag">
              <span class="canopy-flag-stripe bg-[#F9D616]"></span>
              <span class="canopy-flag-stripe bg-[#0038A8]"></span>
              <span class="canopy-flag-stripe bg-[#CE1126]"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Velo de legibilidad y contraste degradado (Atmospheric Scrim) -->
      <div class="hero__scrim"></div>

      <!-- Transición sutil al pie del Hero -->
      <div class="hero__bg-bottom-fade"></div>
    </div>

    <div class="wrap hero__grid">
      <!-- Columna Izquierda: Mensaje Institucional, Métricas y Pilares Oficiales -->
      <div class="hero__intro">

        <h1 id="hero-title" class="hero__title">
          Paga tu peaje <br class="hidden sm:inline" />con tu placa.
          <span class="hero__title-accent">Rápido. Seguro. Sin registrarte.</span>
        </h1>

        <p class="hero__sub">
          Recarga saldo en Bolívares (Bs.) y transita libremente sin demoras por los peajes habilitados de Venezuela. Lectura digital instantánea de tu matrícula vehicular.
        </p>

        <!-- Barra de métricas institucionales en vivo -->
        <div class="hero__stats">
          <div class="hero__stat-card hero__stat-card--blue">
            <div class="hero__stat-val">10+</div>
            <div class="hero__stat-lbl">Peajes Activos</div>
          </div>
          <div class="hero__stat-card hero__stat-card--emerald">
            <div class="hero__stat-val">0 seg</div>
            <div class="hero__stat-lbl">Espera en Cabina</div>
          </div>
          <div class="hero__stat-card hero__stat-card--amber">
            <div class="hero__stat-val">100%</div>
            <div class="hero__stat-lbl">Digital en Bolívares</div>
          </div>
        </div>

        <!-- Fila de garantías y respaldo institucional (discreta, moderna, sin tarjetas repetitivas) -->
        <div class="hero__guarantees">
          <div class="hero__guarantee-item">
            <AppIcon name="rayo" :size="15" class="hero__guarantee-icon text-sky-500" />
            <span>Paso continuo automatizado</span>
          </div>
          <span class="hero__guarantee-dot" aria-hidden="true">·</span>
          <div class="hero__guarantee-item">
            <AppIcon name="tarjeta" :size="15" class="hero__guarantee-icon text-emerald-500" />
            <span>Conexión interbancaria oficial</span>
          </div>
          <span class="hero__guarantee-dot" aria-hidden="true">·</span>
          <div class="hero__guarantee-item">
            <AppIcon name="check" :size="15" class="hero__guarantee-icon text-amber-500" />
            <span>Sin trámites obligatorios</span>
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
      <div class="tag-bento-card tag-bento-card--tag bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
        <div class="tag-bento-card__accent tag-bento-card__accent--emerald" aria-hidden="true"></div>
        <div>
          <div class="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <AppIcon name="peaje" :size="14" />
            Dispositivo Adherido · RFID
          </div>
          <h2 id="tag-title" class="text-2xl font-bold text-slate-900 mb-3">¿Tienes TAG? Sigue con él.</h2>
          <p class="text-slate-600 leading-relaxed text-[15px]">
            El TAG es el método preferido para usuarios frecuentes y flotas comerciales. Adherido al parabrisas, el débito se procesa de inmediato en cada paso.
          </p>
          <ul class="tag-bento-perks mt-4 space-y-2">
            <li class="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Débito instantáneo por antena 915 MHz
            </li>
            <li class="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Recomendado para transporte pesado y flotas
            </li>
          </ul>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[110px] overflow-hidden bg-slate-50/60 rounded-xl p-4">
          <img :src="tagImg" alt="TAG VenVías" width="360" height="162" loading="lazy" class="tag-bento-img max-h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
        </div>
      </div>

      <!-- Tarjeta Pago por Placa -->
      <div class="tag-bento-card tag-bento-card--placa bg-white rounded-2xl p-8 md:p-10 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between relative overflow-hidden group">
        <div class="tag-bento-card__accent tag-bento-card__accent--blue" aria-hidden="true"></div>
        <div>
          <div class="flex items-center gap-1.5 mb-3 text-xs font-bold uppercase tracking-wider text-blue-700">
            <AppIcon name="rayo" :size="14" />
            Sin Trámites ni Instalaciones · ALPR
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-3">¿No tienes TAG? Usa tu Placa.</h2>
          <p class="text-slate-600 leading-relaxed text-[15px]">
            El pago por placa es la alternativa oficial: no requieres comprar ningún dispositivo ni citas previas. Solo necesitas tu matrícula activa con saldo recargado.
          </p>
          <ul class="tag-bento-perks mt-4 space-y-2">
            <li class="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Cero costo de dispositivo o adhesivos
            </li>
            <li class="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Lectura óptica de alta precisión en cabina
            </li>
          </ul>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center min-h-[110px] overflow-hidden bg-slate-50/60 rounded-xl p-4">
          <img :src="plateImg" alt="Placa venezolana" width="240" height="121" loading="lazy" class="plate-bento-img max-h-24 w-auto object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════
       SECCIÓN: PEAJES HABILITADOS — Mapa Interactivo + Tarjeta Premium
       ═══════════════════════════════════════════════════════════════════════ -->
  <section class="tolls-section section" aria-labelledby="tolls-title">
    <div class="wrap">
      <div class="tolls-showcase">
        <!-- Fondo degradado animado -->
        <div class="tolls-showcase__bg" aria-hidden="true">
          <div class="tolls-showcase__orb tolls-showcase__orb--1"></div>
          <div class="tolls-showcase__orb tolls-showcase__orb--2"></div>
        </div>

        <div class="tolls-showcase__content">
          <!-- Columna Izquierda: Texto & CTA -->
          <div class="tolls-showcase__info">
            <div class="tolls-showcase__eyebrow">
              <AppIcon name="peaje" :size="15" />
              <span>Cobertura Nacional</span>
            </div>
            <h2 id="tolls-title" class="tolls-showcase__title">
              {{ tollsText.title }}
            </h2>
            <p class="tolls-showcase__desc">
              {{ tollsText.intro }}
            </p>

            <!-- Métricas de cobertura -->
            <div class="tolls-showcase__metrics">
              <div class="tolls-metric">
                <span class="tolls-metric__val">10+</span>
                <span class="tolls-metric__lbl">Peajes activos</span>
              </div>
              <div class="tolls-metric__divider" aria-hidden="true"></div>
              <div class="tolls-metric">
                <span class="tolls-metric__val">5</span>
                <span class="tolls-metric__lbl">Estados cubiertos</span>
              </div>
              <div class="tolls-metric__divider" aria-hidden="true"></div>
              <div class="tolls-metric">
                <span class="tolls-metric__val">24/7</span>
                <span class="tolls-metric__lbl">Operativo</span>
              </div>
            </div>

            <RouterLink :to="{ name: 'tolls' }" class="tolls-showcase__cta">
              <span>Explorar peajes</span>
              <AppIcon name="arrow" :size="16" />
            </RouterLink>
          </div>

          <!-- Columna Derecha: Mapa mockup visual premium -->
          <div class="tolls-showcase__visual">
            <div class="tolls-map-card">
              <!-- Barra superior del mapa -->
              <div class="tolls-map-card__header">
                <div class="tolls-map-card__dots" aria-hidden="true">
                  <span></span><span></span><span></span>
                </div>
                <span class="tolls-map-card__label">Mapa de Peajes · Venezuela</span>
              </div>
              <!-- Contenido del mapa mockup -->
              <div class="tolls-map-card__body">
                <div class="tolls-map-card__venezuela" aria-hidden="true">
                  <!-- Pines animados con pulso y nombres reales -->
                  <div class="toll-pin toll-pin--1" title="Guacara · Carabobo">
                    <span class="toll-pin__dot"></span>
                    <span class="toll-pin__ring"></span>
                    <span class="toll-pin__name">Guacara</span>
                  </div>
                  <div class="toll-pin toll-pin--2" title="La Entrada · Carabobo">
                    <span class="toll-pin__dot"></span>
                    <span class="toll-pin__ring"></span>
                    <span class="toll-pin__name">La Entrada</span>
                  </div>
                  <div class="toll-pin toll-pin--3" title="Punta Iguana · Zulia">
                    <span class="toll-pin__dot"></span>
                    <span class="toll-pin__ring"></span>
                    <span class="toll-pin__name">Punta Iguana</span>
                  </div>
                  <div class="toll-pin toll-pin--4" title="Taguanes · Cojedes">
                    <span class="toll-pin__dot"></span>
                    <span class="toll-pin__ring"></span>
                    <span class="toll-pin__name">Taguanes</span>
                  </div>
                  <div class="toll-pin toll-pin--5" title="Playa Pintada · Miranda">
                    <span class="toll-pin__dot"></span>
                    <span class="toll-pin__ring"></span>
                    <span class="toll-pin__name">Playa Pintada</span>
                  </div>
                </div>
                <!-- Línea decorativa de ruta conectando los peajes -->
                <svg class="tolls-map-card__route" viewBox="0 0 400 200" fill="none" aria-hidden="true">
                  <path d="M 72 56 C 105 80 125 116 152 116 C 175 116 185 64 200 64 C 230 64 240 104 264 104 C 288 104 308 70 328 70" stroke="url(#routeGrad)" stroke-width="2.5" stroke-dasharray="6 4" stroke-linecap="round" opacity="0.65" />
                  <defs>
                    <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#0038A8" />
                      <stop offset="50%" stop-color="#38bdf8" />
                      <stop offset="100%" stop-color="#0038A8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════════════════════
       SECCIÓN: PROTECCIÓN Y PRIVACIDAD — Bento Grid Premium
       ═══════════════════════════════════════════════════════════════════════ -->
  <section class="trust-section section wrap pb-8" aria-labelledby="safety-title">
    <div class="trust-bento">
      <!-- Tarjeta HERO grande a la izquierda -->
      <div class="trust-hero-card">
        <div class="trust-hero-card__bg" aria-hidden="true">
          <div class="trust-hero-card__glow"></div>
        </div>
        <div class="trust-hero-card__content">
          <div class="trust-hero-card__icon-ring">
            <AppIcon name="check" :size="28" />
          </div>
          <h2 id="safety-title" class="trust-hero-card__title">
            Seguro, aunque no tengas cuenta
          </h2>
          <p class="trust-hero-card__desc">
            Pagar con tu placa no te obliga a dar más datos de los estrictamente necesarios.
          </p>
          <!-- Escudo visual animado -->
          <div class="trust-shield" aria-hidden="true">
            <svg viewBox="0 0 64 72" fill="none" class="trust-shield__svg">
              <path d="M32 2L4 16v20c0 18 12 28 28 32 16-4 28-14 28-32V16L32 2z" fill="url(#shieldGrad)" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
              <path d="M22 36l7 7 13-14" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="trust-shield__check"/>
              <defs>
                <linearGradient id="shieldGrad" x1="4" y1="2" x2="60" y2="70">
                  <stop offset="0%" stop-color="#0038A8"/>
                  <stop offset="100%" stop-color="#0284c7"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <!-- 3 tarjetas compactas a la derecha -->
      <div
        v-for="(s, idx) in safety"
        :key="s.title"
        class="trust-card"
        :class="`trust-card--${idx}`"
      >
        <div class="trust-card__icon-wrap" :class="`trust-card__icon-wrap--${idx}`">
          <AppIcon :name="s.icon" :size="22" />
        </div>
        <div class="trust-card__text">
          <h3 class="trust-card__title">{{ s.title }}</h3>
          <p class="trust-card__desc">{{ s.text }}</p>
        </div>
        <!-- Indicador de confianza numérico -->
        <div class="trust-card__badge" :class="`trust-card__badge--${idx}`">
          {{ ['01', '02', '03'][idx] }}
        </div>
      </div>
    </div>
  </section>

  <!-- Sección Mi Cuenta / Flotas: Banner Ejecutivo de Alto Nivel -->
  <section class="section wrap pt-0" aria-labelledby="account-title">
    <div class="account-card bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-200/80 relative overflow-hidden">
      <!-- Barra Tricolor Superior Sutil -->
      <div class="account-card__tricolor" aria-hidden="true"></div>
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
          <RouterLink :to="accountRoute" class="btn btn--primario !rounded-xl shadow-lg">
            Conoce Mi cuenta
          </RouterLink>
        </div>
        <ul class="plain-list gap-3.5 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
          <li v-for="p in accountPerks" :key="p" class="account-perk-item flex items-start gap-3 text-slate-800 text-sm md:text-base font-medium">
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

  <!-- Sección Síguenos en nuestras Redes Sociales y Asistencia Ciudadana Oficial -->
  <SocialChannelsSection />
</template>

<style scoped>
/* ==========================================================================
   TEMA AMBIENTAL DINÁMICO DE AUTOPISTA (DÍA / ATARDECER / NOCHE)
   ========================================================================== */

.hero {
  position: relative;
  overflow: hidden;
  margin-top: -67px;
  padding-top: clamp(80px, 8vw, 96px);
  padding-bottom: clamp(36px, 4.5vw, 64px);
  transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (min-width: 1080px) {
  .hero {
    margin-top: -77px;
    padding-top: 102px;
  }
}

/* --- TEMA DÍA (06:00 - 18:59): Contraste polarizado de autopista, cielo nítido, sin velo pálido --- */
.hero--day {
  background-color: #071224;
  color: #ffffff;
}
.hero--day .hero__photo-layer.is-active {
  opacity: 1;
  filter: contrast(1.18) saturate(1.35) brightness(0.96);
  object-position: center 46%;
}
.hero--day .hero__scrim {
  background: linear-gradient(
    90deg,
    rgba(6, 16, 36, 0.94) 0%,
    rgba(6, 16, 36, 0.82) 36%,
    rgba(6, 16, 36, 0.35) 65%,
    rgba(6, 16, 36, 0.05) 88%,
    transparent 100%
  );
}
.hero--day .hero__title {
  color: #ffffff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}
.hero--day .hero__title-accent {
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 60%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero--day .hero__sub {
  color: #cbd5e1;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
}
.hero--day .hero__stat-card {
  background: rgba(10, 24, 52, 0.78);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 10px 30px -4px rgba(0, 0, 0, 0.45);
}
.hero--day .hero__stat-card:hover {
  background: rgba(16, 34, 70, 0.92);
  border-color: rgba(255, 255, 255, 0.3);
}
.hero--day .hero__stat-card--blue .hero__stat-val { color: #38bdf8; }
.hero--day .hero__stat-card--emerald .hero__stat-val { color: #34d399; }
.hero--day .hero__stat-card--amber .hero__stat-val { color: #fbbf24; }
.hero--day .hero__stat-card--blue:hover {
  box-shadow: 0 12px 28px -2px rgba(56, 189, 248, 0.25);
}
.hero--day .hero__stat-card--emerald:hover {
  box-shadow: 0 12px 28px -2px rgba(52, 211, 153, 0.25);
}
.hero--day .hero__stat-card--amber:hover {
  box-shadow: 0 12px 28px -2px rgba(251, 191, 36, 0.25);
}
.hero--day .hero__stat-lbl {
  color: #94a3b8;
}
.hero--day .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent 65%, rgba(6, 16, 36, 0.85) 88%, #ffffff 100%);
}
.hero--day .hero__guarantees {
  color: #cbd5e1;
}

/* --- TEMA NOCHE (19:00 - 05:59): Azul noche profundo institucional, sobrio y elegante --- */
.hero--night {
  background-color: #070d1e;
  color: #f8fafc;
}
.hero--night .hero__photo-layer.is-active {
  opacity: 0.65;
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
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 60%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero--night .hero__sub {
  color: #cbd5e1;
}
.hero--night .hero__stat-card {
  background: rgba(13, 21, 40, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.45);
}
.hero--night .hero__stat-card:hover {
  background: rgba(18, 29, 56, 0.98);
  border-color: rgba(255, 255, 255, 0.25);
}
.hero--night .hero__stat-card--blue .hero__stat-val { color: #38bdf8; }
.hero--night .hero__stat-card--emerald .hero__stat-val { color: #34d399; }
.hero--night .hero__stat-card--amber .hero__stat-val { color: #fbbf24; }
.hero--night .hero__stat-card--blue:hover {
  box-shadow: 0 12px 28px -2px rgba(56, 189, 248, 0.25);
}
.hero--night .hero__stat-card--emerald:hover {
  box-shadow: 0 12px 28px -2px rgba(52, 211, 153, 0.25);
}
.hero--night .hero__stat-card--amber:hover {
  box-shadow: 0 12px 28px -2px rgba(251, 191, 36, 0.25);
}
.hero--night .hero__stat-lbl {
  color: #94a3b8;
}
.hero--night .hero__bg-bottom-fade {
  background: linear-gradient(to bottom, transparent, rgba(7, 13, 30, 0.95) 60%, #ffffff 100%);
}
.hero--night .hero__guarantees {
  color: #94a3b8;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-block: 4px 16px;
  width: 100%;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
}
@media (max-width: 520px) {
  .hero__stats {
    gap: 6px;
    margin-block: 2px 14px;
  }
  .hero__stat-card {
    padding: 8px 4px;
    border-radius: 10px;
  }
  .hero__stat-val {
    font-size: clamp(15px, 4vw, 18px);
  }
  .hero__stat-lbl {
    font-size: clamp(8.5px, 2.2vw, 9.5px);
    letter-spacing: 0.02em;
  }
}
.hero__stat-card {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  padding: 10px 12px;
  text-align: center;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s var(--ease-out), border-color 0.25s;
}
.hero__stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 3px 3px 0 0;
}
.hero__stat-card--blue::before { background: linear-gradient(90deg, #0057a3, #38bdf8); }
.hero__stat-card--emerald::before { background: linear-gradient(90deg, #059669, #34d399); }
.hero__stat-card--amber::before { background: linear-gradient(90deg, #d97706, #fbbf24); }

.hero__stat-card:hover {
  transform: translateY(-4px) scale(1.02);
}
.hero__stat-val {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.15;
  transition: color 0.2s;
  letter-spacing: -0.01em;
}
.hero__stat-lbl {
  font-size: 10.5px;
  font-weight: 600;
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Fila de garantías y respaldo institucional en el Hero */
.hero__guarantees {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 14px;
  margin-top: 8px;
  font-size: 12.5px;
  animation: heroFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both;
}
@media (max-width: 959px) {
  .hero__guarantees {
    justify-content: center;
  }
}
.hero__guarantee-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}
.hero__guarantee-icon {
  flex-shrink: 0;
}
.hero__guarantee-dot {
  opacity: 0.35;
  font-size: 14px;
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
.btn {
  border-radius: 10px !important;
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
  border-radius: 10px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 10px;
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

/* ==========================================================================
   LETRERO DIGITAL Y ANIMACIÓN CROMÁTICA VENVÍAS
   ========================================================================== */

@keyframes venviasChromaTransition {
  0% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.7));
  }
  33% {
    background-position: 50% 50%;
    filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.7));
  }
  66% {
    background-position: 100% 50%;
    filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.7));
  }
  100% {
    background-position: 0% 50%;
    filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.7));
  }
}

.animated-chroma-letters {
  display: inline-block;
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(
    90deg,
    #38bdf8 0%,
    #0284c7 20%,
    #fbbf24 45%,
    #f87171 70%,
    #0284c7 85%,
    #38bdf8 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: venviasChromaTransition 5s ease-in-out infinite;
}

.hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(10, 24, 52, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 8px;
  padding: 6px 14px 6px 10px;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  animation: heroFadeInDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hero__kicker-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #38bdf8;
  text-transform: uppercase;
}

.hero__kicker-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.35);
  animation: pulseDot 2s infinite;
}

.hero__kicker-brand {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-size: 14.5px;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 10px;
}

.hero__kicker-road {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #fbbf24;
}

/* Letrero digital sobre la marquesina del peaje */
.hero__canopy-overlay {
  position: absolute;
  top: 48%;
  left: 55%;
  transform: translate(-50%, -50%);
  z-index: 1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 1.2s ease;
  display: none;
}

@media (min-width: 960px) {
  .hero__canopy-overlay.is-active {
    display: block;
    opacity: 1;
  }
}

.hero__canopy-sign {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #09172e;
  border: 1.5px solid #38bdf8;
  border-radius: 6px;
  padding: 4px 10px;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.5), 0 4px 12px rgba(0, 0, 0, 0.6);
}

.hero__canopy-sign-inner {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.canopy-letters-animated {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(
    90deg,
    #38bdf8 0%,
    #60a5fa 25%,
    #fbbf24 50%,
    #f87171 75%,
    #38bdf8 100%
  );
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: venviasChromaTransition 4s ease-in-out infinite;
}

.canopy-sub {
  font-family: var(--font-mono, monospace);
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #94a3b8;
  margin-top: 2px;
}

.canopy-flag {
  display: flex;
  flex-direction: column;
  width: 9px;
  height: 18px;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
}

.canopy-flag-stripe {
  flex: 1;
  width: 100%;
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
  position: relative;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.tag-bento-card__accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}
.tag-bento-card__accent--emerald {
  background: linear-gradient(90deg, #059669, #10b981);
}
.tag-bento-card__accent--blue {
  background: linear-gradient(90deg, #0057a3, #0284c7);
}
.tag-bento-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -10px rgba(18, 33, 66, 0.12);
}
.tag-bento-card--tag:hover { border-color: #6ee7b7; }
.tag-bento-card--placa:hover { border-color: #93c5fd; }

.tag-bento-img {
  animation: tagFloat 4s ease-in-out infinite;
}
@keyframes tagFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.plate-bento-img {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.tag-bento-card--placa:hover .plate-bento-img {
  transform: scale(1.06) rotate(-1.5deg);
}

/* ==========================================================================
   SECCIÓN PEAJES HABILITADOS — Showcase Premium con Mapa Visual
   ========================================================================== */
.tolls-section {
  background: linear-gradient(180deg, #ffffff 0%, #f0f5ff 50%, #ffffff 100%);
}
.tolls-showcase {
  position: relative;
  background: linear-gradient(135deg, #071a3e 0%, #0a2558 40%, #0c306e 100%);
  border-radius: 24px;
  overflow: hidden;
  padding: 48px 32px;
  min-height: 380px;
}
@media (min-width: 768px) {
  .tolls-showcase { padding: 56px 48px; }
}
.tolls-showcase__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.tolls-showcase__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
}
.tolls-showcase__orb--1 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, #0284c7, transparent 70%);
  top: -60px; right: -40px;
  animation: tollsOrb1 8s ease-in-out infinite alternate;
}
.tolls-showcase__orb--2 {
  width: 260px; height: 260px;
  background: radial-gradient(circle, #38bdf8, transparent 70%);
  bottom: -40px; left: 10%;
  animation: tollsOrb2 10s ease-in-out infinite alternate;
}
@keyframes tollsOrb1 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-30px, 20px) scale(1.15); }
}
@keyframes tollsOrb2 {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(20px, -20px) scale(1.1); }
}
.tolls-showcase__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 40px;
  align-items: center;
}
@media (min-width: 900px) {
  .tolls-showcase__content {
    grid-template-columns: 1.1fr 1fr;
    gap: 56px;
  }
}
.tolls-showcase__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  margin-bottom: 16px;
}
.tolls-showcase__title {
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}
.tolls-showcase__desc {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.65;
  max-width: 48ch;
  margin-bottom: 28px;
}

/* Métricas Inline */
.tolls-showcase__metrics {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.tolls-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tolls-metric__val {
  font-size: 28px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.03em;
}
.tolls-metric__lbl {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.tolls-metric__divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.12);
}

/* CTA */
.tolls-showcase__cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 15px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 8px 24px -4px rgba(2, 132, 199, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.tolls-showcase__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -4px rgba(2, 132, 199, 0.5);
}

/* Mapa Visual Mockup Premium */
.tolls-showcase__visual {
  display: flex;
  justify-content: center;
}
.tolls-map-card {
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.3);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}
.tolls-map-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 28px 60px -14px rgba(0, 0, 0, 0.35);
}
.tolls-map-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.tolls-map-card__dots {
  display: flex;
  gap: 6px;
}
.tolls-map-card__dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}
.tolls-map-card__dots span:first-child { background: #ef4444; }
.tolls-map-card__dots span:nth-child(2) { background: #f59e0b; }
.tolls-map-card__dots span:last-child { background: #22c55e; }
.tolls-map-card__label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.03em;
}
.tolls-map-card__body {
  position: relative;
  width: 100%;
  height: 220px;
  background:
    radial-gradient(ellipse 80% 60% at 50% 50%, rgba(14, 165, 233, 0.08), transparent),
    linear-gradient(180deg, rgba(7, 26, 62, 0.4) 0%, rgba(10, 37, 88, 0.6) 100%);
}
.tolls-map-card__venezuela {
  position: absolute;
  inset: 0;
}
.tolls-map-card__route {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Pines de peaje con pulso */
.toll-pin {
  position: absolute;
  width: 14px;
  height: 14px;
}
.toll-pin--3 { top: 28%; left: 18%; } /* Punta Iguana (Zulia) */
.toll-pin--4 { top: 58%; left: 38%; } /* Taguanes (Cojedes) */
.toll-pin--2 { top: 32%; left: 50%; } /* La Entrada (Carabobo) */
.toll-pin--1 { top: 52%; left: 66%; } /* Guacara (Carabobo) */
.toll-pin--5 { top: 35%; left: 82%; } /* Playa Pintada (Miranda) */

.toll-pin__name {
  position: absolute;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
  letter-spacing: 0.02em;
  pointer-events: none;
  text-shadow: 0 2px 4px rgba(7, 26, 62, 0.95);
  transition: color 0.2s ease;
}
.toll-pin:hover .toll-pin__name {
  color: #38bdf8;
}

.toll-pin__dot {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: #38bdf8;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.7);
  z-index: 1;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
}
.toll-pin__ring {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(56, 189, 248, 0.35);
  animation: pinPulse 2.5s ease-out infinite;
}
.toll-pin--2 .toll-pin__ring { animation-delay: 0.5s; }
.toll-pin--4 .toll-pin__ring { animation-delay: 1.0s; }
.toll-pin--1 .toll-pin__ring { animation-delay: 1.5s; }
.toll-pin--5 .toll-pin__ring { animation-delay: 2.0s; }
@keyframes pinPulse {
  0% { transform: translate(-50%, -50%) scale(0.6); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}


/* ==========================================================================
   SECCIÓN PROTECCIÓN Y PRIVACIDAD — Bento Grid Premium
   ========================================================================== */
.trust-bento {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}
@media (min-width: 768px) {
  .trust-bento {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
  }
  .trust-hero-card {
    grid-row: 1 / -1;
  }
}
@media (min-width: 1024px) {
  .trust-bento {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* Hero Card (grande a la izquierda) */
.trust-hero-card {
  position: relative;
  background: linear-gradient(145deg, #071a3e 0%, #0c306e 60%, #0a2558 100%);
  border-radius: 24px;
  padding: 40px 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 340px;
}
@media (min-width: 768px) {
  .trust-hero-card {
    padding: 48px 40px;
    min-height: auto;
  }
}
.trust-hero-card__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.trust-hero-card__glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(2, 132, 199, 0.35), transparent 70%);
  top: -60px;
  right: -40px;
  filter: blur(60px);
  animation: trustGlow 6s ease-in-out infinite alternate;
}
@keyframes trustGlow {
  from { transform: scale(1) translate(0, 0); }
  to   { transform: scale(1.2) translate(-20px, 15px); }
}
.trust-hero-card__content {
  position: relative;
  z-index: 1;
}
.trust-hero-card__icon-ring {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  margin-bottom: 24px;
  backdrop-filter: blur(8px);
}
.trust-hero-card__title {
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  margin-bottom: 14px;
  letter-spacing: -0.02em;
}
.trust-hero-card__desc {
  font-size: 16px;
  color: #94a3b8;
  line-height: 1.6;
  max-width: 38ch;
}

/* Escudo visual */
.trust-shield {
  position: absolute;
  bottom: 24px;
  right: 24px;
  opacity: 0.15;
}
.trust-shield__svg {
  width: 88px;
  height: 100px;
}
.trust-shield__check {
  stroke-dasharray: 34;
  stroke-dashoffset: 34;
  animation: shieldDraw 1.5s ease-out 0.6s forwards;
}
@keyframes shieldDraw {
  to { stroke-dashoffset: 0; }
}

/* Trust Cards Compactas */
.trust-card {
  position: relative;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 24px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: flex-start;
  gap: 18px;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.3s ease;
  box-shadow: 0 4px 16px -2px rgba(18, 33, 66, 0.06);
}
.trust-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px -8px rgba(18, 33, 66, 0.12);
  border-color: #bfdbfe;
}

/* Iconos por card */
.trust-card__icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.trust-card:hover .trust-card__icon-wrap {
  transform: scale(1.1) rotate(-5deg);
}
.trust-card__icon-wrap--0 {
  background: linear-gradient(135deg, #0038A8, #0284c7);
  box-shadow: 0 6px 16px -2px rgba(0, 56, 168, 0.3);
}
.trust-card__icon-wrap--1 {
  background: linear-gradient(135deg, #059669, #10b981);
  box-shadow: 0 6px 16px -2px rgba(16, 185, 129, 0.3);
}
.trust-card__icon-wrap--2 {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  box-shadow: 0 6px 16px -2px rgba(99, 102, 241, 0.3);
}

.trust-card__text {
  flex: 1;
  min-width: 0;
}
.trust-card__title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.trust-card__desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.55;
}

/* Badge numérico decorativo */
.trust-card__badge {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
  opacity: 0.06;
  letter-spacing: -0.04em;
  color: #0f172a;
  pointer-events: none;
  user-select: none;
}


/* Tarjeta Mi Cuenta Corporativa */
.account-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.account-card__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
}
.account-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(18, 33, 66, 0.14);
  border-color: #93c5fd;
}
.account-perk-item {
  transition: transform 0.2s ease, color 0.2s ease;
}
.account-perk-item:hover {
  transform: translateX(4px);
  color: #0038A8;
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
  .hero__guarantees,
  .hero__card,
  .hero__badge-pulse,
  .hero__ocr-indicator::after,
  .hero__card :deep(.plate)::after,
  .hero__card :deep(.pf__go)::after,
  .tag-bento-card,
  .tag-bento-card img,
  .trust-card,
  .trust-card__icon-wrap,
  .trust-hero-card__glow,
  .trust-shield__check,
  .tolls-showcase__orb,
  .toll-pin__ring,
  .tolls-map-card,
  .account-card,
  details[open] p {
    animation: none !important;
    transition: none !important;
  }
}
</style>
