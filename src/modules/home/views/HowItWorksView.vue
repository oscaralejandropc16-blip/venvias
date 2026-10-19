<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorksInfographic from '../components/HowItWorksInfographic.vue'

import camaraImg from '@/assets/how-it-works/2-camara.webp'
import porticosImg from '@/assets/how-it-works/3-sin-detenerte.webp'
import deudaImg from '@/assets/how-it-works/4-deuda.webp'
import placaZoomImg from '@/assets/how-it-works/2-camara-placa.webp'
import plateSvg from '@/assets/plate-venezuela.svg'

type SimStep = 'reading' | 'green' | 'debt'

interface StepMeta {
  id: SimStep
  number: string
  title: string
  subtitle: string
  tag: string
}

export default defineComponent({
  name: 'HowItWorksView',
  components: { AppIcon, HowItWorksInfographic, RouterLink },
  data() {
    return {
      rechargeRoute: { name: ROUTE_NAMES.recharge },
      balanceRoute: { name: ROUTE_NAMES.balance },
      debtRoute: { name: ROUTE_NAMES.debt },

      // Assets
      camaraImg,
      porticosImg,
      deudaImg,
      placaZoomImg,
      plateSvg,

      // Steps data
      steps: [
        {
          id: 'reading',
          number: '01',
          title: 'Lectura Óptica ALPR',
          subtitle: 'Detección en < 60 ms',
          tag: 'FASE 1: IDENTIFICACIÓN',
        },
        {
          id: 'green',
          number: '02',
          title: 'Luz Verde & Débito',
          subtitle: 'Tránsito continuo 0 seg',
          tag: 'FASE 2: CONCILIACIÓN',
        },
        {
          id: 'debt',
          number: '03',
          title: 'Paso sin Saldo',
          subtitle: 'Seguridad vial · 72h',
          tag: 'FASE 3: CONTINGENCIA',
        },
      ] as StepMeta[],

      // Simulador interactivo
      currentStep: 'reading' as SimStep,
      isAutoPlaying: true,
      timer: undefined as ReturnType<typeof setInterval> | undefined,
      progress: 0,
      progressTimer: undefined as ReturnType<typeof setInterval> | undefined,
      scrollObserver: undefined as IntersectionObserver | undefined,

      // Comparativa Antes vs Ahora
      activeCompare: 'now' as 'now' | 'before',
    }
  },

  computed: {
    stepIndex(): number {
      const order: SimStep[] = ['reading', 'green', 'debt']
      return order.indexOf(this.currentStep)
    },
    currentStepMeta(): StepMeta {
      return this.steps.find((s) => s.id === this.currentStep) || this.steps[0]
    },
  },

  mounted() {
    this.startAutoPlay()
    this.initScrollReveal()
  },

  beforeUnmount() {
    this.stopAutoPlay()
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
    }
  },

  methods: {
    setStep(step: SimStep, userAction = true): void {
      this.currentStep = step
      this.progress = 0
      if (userAction) {
        this.stopAutoPlay()
      }
    },

    nextStep(): void {
      const steps: SimStep[] = ['reading', 'green', 'debt']
      const nextIdx = (this.stepIndex + 1) % steps.length
      this.currentStep = steps[nextIdx]
      this.progress = 0
    },

    prevStep(): void {
      const steps: SimStep[] = ['reading', 'green', 'debt']
      const prevIdx = (this.stepIndex - 1 + steps.length) % steps.length
      this.currentStep = steps[prevIdx]
      this.progress = 0
    },

    startAutoPlay(): void {
      this.isAutoPlaying = true
      this.progress = 0
      clearInterval(this.timer)
      clearInterval(this.progressTimer)

      const cycleDuration = 4800
      const tick = 40
      this.progressTimer = setInterval(() => {
        this.progress += (tick / cycleDuration) * 100
        if (this.progress >= 100) {
          this.progress = 0
        }
      }, tick)

      this.timer = setInterval(() => {
        this.nextStep()
      }, cycleDuration)
    },

    stopAutoPlay(): void {
      this.isAutoPlaying = false
      clearInterval(this.timer)
      clearInterval(this.progressTimer)
      this.progress = 0
    },

    toggleAutoPlay(): void {
      if (this.isAutoPlaying) {
        this.stopAutoPlay()
      } else {
        this.startAutoPlay()
      }
    },

    initScrollReveal(): void {
      if (typeof IntersectionObserver === 'undefined') return
      this.scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )

      this.$nextTick(() => {
        const elements = this.$el.querySelectorAll('.reveal-on-scroll')
        elements.forEach((el: Element) => this.scrollObserver?.observe(el))
      })
    },
  },
})
</script>

<template>
  <div class="how-page">
    <!-- Atmósfera dinámica viva: orbes de gradiente flotante y partículas sutiles -->
    <div class="how-ambient" aria-hidden="true">
      <div class="how-ambient__orb how-ambient__orb--blue"></div>
      <div class="how-ambient__orb how-ambient__orb--cyan"></div>
      <div class="how-ambient__orb how-ambient__orb--amber"></div>
      <div class="how-ambient__grid"></div>
      <div class="how-ambient__beam"></div>
    </div>

    <div class="wrap how-content">
      <!-- HERO PRINCIPAL DE ALTO IMPACTO -->
      <header class="hero-tech">
        <div class="hero-tech__badge animate-in-1">
          <span class="hero-tech__beacon" aria-hidden="true"></span>
          <span>TECNOLOGÍA DE TELEPEAJE POR PLACA</span>
        </div>

        <h1 class="hero-tech__title animate-in-2">
          Tu viaje <span class="gradient-text">sin paradas ni barreras</span>
        </h1>

        <p class="hero-tech__sub animate-in-3">
          Transita a velocidad de autopista. La cámara lee tu placa venezolana en milisegundos y el importe se debita automáticamente de tu saldo. Sin colas, sin efectivo y sin demoras en cabina.
        </p>

        <!-- Métricas ejecutivas en vivo con animación de entrada y brillo de hover -->
        <div class="hero-kpis animate-in-4">
          <div class="hero-kpi">
            <span class="hero-kpi__val">0 seg</span>
            <span class="hero-kpi__lbl">Espera en cabina</span>
          </div>
          <div class="hero-kpi__divider" aria-hidden="true"></div>
          <div class="hero-kpi">
            <span class="hero-kpi__val">&lt; 60 ms</span>
            <span class="hero-kpi__lbl">Lectura óptica ALPR</span>
          </div>
          <div class="hero-kpi__divider" aria-hidden="true"></div>
          <div class="hero-kpi">
            <span class="hero-kpi__val">100%</span>
            <span class="hero-kpi__lbl">Cobertura nacional</span>
          </div>
          <div class="hero-kpi__divider" aria-hidden="true"></div>
          <div class="hero-kpi">
            <span class="hero-kpi__val">24/7</span>
            <span class="hero-kpi__lbl">Recarga al instante</span>
          </div>
        </div>
      </header>

      <!-- SECCIÓN ESTRELLA: SIMULADOR VISUAL DE TRÁNSITO POR PÓRTICO -->
      <section class="sim-section reveal-on-scroll" aria-labelledby="sim-title">
        <div class="sim-header">
          <div class="sim-header__meta">
            <span class="sim-header__tag">
              <span class="live-dot" aria-hidden="true"></span>
              EXPERIENCIA INTERACTIVA EN VIVO
            </span>
            <h2 id="sim-title" class="sim-header__title">Simulador de Paso por Pórtico Inteligente</h2>
          </div>

          <!-- Botón de Auto-Play con indicador radar pulsante -->
          <div class="sim-header__actions">
            <button
              type="button"
              class="sim-autoplay-btn"
              :class="{ 'is-active': isAutoPlaying }"
              :aria-label="isAutoPlaying ? 'Pausar simulación automática' : 'Iniciar simulación automática'"
              @click="toggleAutoPlay"
            >
              <span class="sim-autoplay-radar" aria-hidden="true">
                <span class="sim-autoplay-dot"></span>
                <span v-if="isAutoPlaying" class="sim-autoplay-wave"></span>
              </span>
              <span>{{ isAutoPlaying ? 'Modo Automático' : 'Pausado' }}</span>
            </button>
          </div>
        </div>

        <!-- PIPELINE DE FASES: Stepper interactivo de alta gama con línea de avance -->
        <nav class="sim-pipeline" aria-label="Fases del proceso de telepeaje">
          <div class="sim-pipeline__track" aria-hidden="true">
            <div
              class="sim-pipeline__progress"
              :style="{ width: stepIndex === 0 ? '16%' : stepIndex === 1 ? '50%' : '100%' }"
            ></div>
          </div>

          <div class="sim-pipeline__nodes" role="tablist">
            <button
              v-for="(st, idx) in steps"
              :key="st.id"
              type="button"
              role="tab"
              :aria-selected="currentStep === st.id"
              class="sim-node"
              :class="{
                'is-active': currentStep === st.id,
                'is-passed': stepIndex > idx,
              }"
              @click="setStep(st.id)"
            >
              <div class="sim-node__circle">
                <span v-if="stepIndex > idx" class="sim-node__check">✓</span>
                <span v-else class="sim-node__num">{{ st.number }}</span>
              </div>
              <div class="sim-node__content">
                <span class="sim-node__title">{{ st.title }}</span>
                <span class="sim-node__sub">{{ st.subtitle }}</span>
              </div>
            </button>
          </div>
        </nav>

        <!-- Barra de progreso de ciclo continuo (durante auto-play) -->
        <div v-if="isAutoPlaying" class="sim-progress-track" aria-hidden="true">
          <div class="sim-progress-bar" :style="{ width: `${progress}%` }"></div>
        </div>

        <!-- STAGE PRINCIPAL DE LA SIMULACIÓN -->
        <div class="sim-stage">
          <!-- Columna Izquierda: Escenario Visual con Transición Cinematográfica y HUD -->
          <div class="sim-viewport">
            <Transition name="sim-scene" mode="out-in">
              <div :key="currentStep" class="sim-viewport__scene">
                <!-- Imagen dinámica con zoom cinemático sutil -->
                <img
                  v-if="currentStep === 'reading'"
                  :src="camaraImg"
                  alt="Cámara ALPR enfocando vehículo en carril VenVías"
                  class="sim-viewport__img"
                />
                <img
                  v-else-if="currentStep === 'green'"
                  :src="porticosImg"
                  alt="Vehículo pasando con luz verde continua"
                  class="sim-viewport__img"
                />
                <img
                  v-else
                  :src="deudaImg"
                  alt="Paso seguro sin saldo con cobro posterior"
                  class="sim-viewport__img"
                />

                <!-- Velo de contraste oscuro -->
                <div class="sim-viewport__scrim"></div>

                <!-- OVERLAY HUD 1: Escáner Láser en modo Lectura -->
                <div v-if="currentStep === 'reading'" class="hud-scanner" aria-hidden="true">
                  <div class="hud-scanner__laser">
                    <span class="hud-scanner__laser-flare"></span>
                  </div>
                  <div class="hud-target-box">
                    <span class="hud-target-box__corner hud-target-box__corner--tl"></span>
                    <span class="hud-target-box__corner hud-target-box__corner--tr"></span>
                    <span class="hud-target-box__corner hud-target-box__corner--bl"></span>
                    <span class="hud-target-box__corner hud-target-box__corner--br"></span>
                    <span class="hud-target-box__crosshair"></span>
                    <span class="hud-target-box__badge">OCR TARGET ACQUIRED</span>
                  </div>
                  <div class="hud-plate-preview">
                    <img :src="placaZoomImg" alt="Placa AB123CD en lectura" />
                    <div class="hud-plate-preview__info">
                      <span class="hud-plate-preview__code mono">AB 123 CD</span>
                      <span class="hud-plate-preview__status">99.8% CERTEZA</span>
                    </div>
                  </div>
                </div>

                <!-- OVERLAY HUD 2: Semáforo y Aprobación en modo Luz Verde -->
                <div v-if="currentStep === 'green'" class="hud-green-gate" aria-hidden="true">
                  <div class="hud-signal-light">
                    <span class="hud-signal-beacon hud-signal-beacon--green"></span>
                    <span class="hud-signal-text">PASO LIBRE · FLUJO CONTINUO</span>
                  </div>
                  <div class="hud-ticket-pill">
                    <div class="hud-ticket-pill__icon">
                      <AppIcon name="check" :size="16" />
                    </div>
                    <div>
                      <strong>Débito oficial: 15,00 Bs</strong>
                      <span>Conciliado en tiempo real</span>
                    </div>
                  </div>
                </div>

                <!-- OVERLAY HUD 3: Notificación de Saldo Deudor -->
                <div v-if="currentStep === 'debt'" class="hud-debt-gate" aria-hidden="true">
                  <div class="hud-signal-light hud-signal-light--amber">
                    <span class="hud-signal-beacon hud-signal-beacon--amber"></span>
                    <span class="hud-signal-text">PASO SEGURO · SALDO PENDIENTE</span>
                  </div>
                  <div class="hud-ticket-pill hud-ticket-pill--amber">
                    <div class="hud-ticket-pill__icon hud-ticket-pill__icon--amber">
                      <AppIcon name="info" :size="16" />
                    </div>
                    <div>
                      <strong>Tránsito registrado</strong>
                      <span>Págala en 72h sin recargo de grúa</span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Telemetría HUD persistente en la esquina inferior -->
            <div class="hud-telemetry mono" aria-hidden="true">
              <span class="hud-telemetry__dot"></span>
              <span>ALPR_SYS_V3 // LATENCY: 42ms // GATELANE: 02 // FPS: 60</span>
            </div>
          </div>

          <!-- Columna Derecha: Panel de Telemetría e Información Ejecutiva con Transición Suave -->
          <div class="sim-inspector">
            <!-- Indicador de Fase y Flechas de Navegación -->
            <div class="sim-inspector__header">
              <div class="sim-inspector__phase-tag">
                <span v-if="currentStep === 'reading'" class="status-dot status-dot--cyan"></span>
                <span v-else-if="currentStep === 'green'" class="status-dot status-dot--green"></span>
                <span v-else class="status-dot status-dot--amber"></span>
                <span>{{ currentStepMeta.tag }}</span>
              </div>
              <div class="sim-inspector__nav-arrows">
                <button type="button" class="sim-arrow" aria-label="Fase anterior" @click="prevStep">
                  <AppIcon name="arrow" :size="16" class="flip-h" />
                </button>
                <button type="button" class="sim-arrow" aria-label="Fase siguiente" @click="nextStep">
                  <AppIcon name="arrow" :size="16" />
                </button>
              </div>
            </div>

            <!-- Contenido dinámico con transición suave -->
            <Transition name="inspector-slide" mode="out-in">
              <div :key="currentStep" class="sim-body">
                <div v-if="currentStep === 'reading'">
                  <h3 class="sim-body__title">Detección Óptica y Reconocimiento Instantáneo</h3>
                  <p class="sim-body__desc">
                    Cámaras multiespectrales de alta frecuencia leen la placa delantera y trasera en menos de 60 milisegundos, operando con máxima precisión bajo lluvia, neblina o luz solar directa.
                  </p>
                  <div class="sim-stats-grid">
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Precisión OCR</span>
                      <span class="sim-stat-box__val text-cyan">99.8%</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Velocidad permitida</span>
                      <span class="sim-stat-box__val">Hasta 80 km/h</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Lectura de noche</span>
                      <span class="sim-stat-box__val">Flash Infrarrojo</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Validación</span>
                      <span class="sim-stat-box__val">Placa + TAG RFID</span>
                    </div>
                  </div>
                </div>

                <div v-else-if="currentStep === 'green'">
                  <h3 class="sim-body__title">Débito Automatizado y Tránsito sin Detención</h3>
                  <p class="sim-body__desc">
                    La tarifa oficial se liquida en tiempo real desde el saldo de la placa o la cuenta del propietario. El semáforo digital activa la luz verde y continúas tu camino sin detener el vehículo.
                  </p>
                  <div class="sim-stats-grid">
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Tiempo en cabina</span>
                      <span class="sim-stat-box__val text-emerald">0 segundos</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Confirmación</span>
                      <span class="sim-stat-box__val text-emerald">Semáforo verde</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Comprobante</span>
                      <span class="sim-stat-box__val">Digital en cuenta</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Tarifa</span>
                      <span class="sim-stat-box__val">Oficial MPPT</span>
                    </div>
                  </div>
                </div>

                <div v-else>
                  <h3 class="sim-body__title">Paso sin Saldo: Seguridad Vial y Cobro Posterior</h3>
                  <p class="sim-body__desc">
                    Si no dispones de saldo en el momento del cruce, la barrera no te detendrá para prevenir accidentes. El sistema genera un saldo deudor que puedes liquidar tranquilamente por la web.
                  </p>
                  <div class="sim-stats-grid">
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Detención forzada</span>
                      <span class="sim-stat-box__val text-amber">Ninguna</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Plazo de pago</span>
                      <span class="sim-stat-box__val text-amber">72 horas hábiles</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Medios de pago</span>
                      <span class="sim-stat-box__val">Pago Móvil / BDV</span>
                    </div>
                    <div class="sim-stat-box">
                      <span class="sim-stat-box__label">Recargo</span>
                      <span class="sim-stat-box__val">Tarifa + adm.</span>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Barra de acción directa -->
            <div class="sim-actions">
              <RouterLink :to="rechargeRoute" class="sim-cta-btn">
                <AppIcon name="rayo" :size="16" />
                <span>Recargar placa ahora</span>
                <span class="sim-cta-btn__glow" aria-hidden="true"></span>
              </RouterLink>
              <RouterLink :to="debtRoute" class="sim-cta-link">
                <span>¿Tienes saldo pendiente? Pagar aquí →</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN BENTO GRID: ARQUITECTURA VISUAL DE ALTA GAMA -->
      <section class="bento-section reveal-on-scroll" aria-labelledby="bento-title">
        <div class="bento-header">
          <span class="bento-header__eyebrow">TECNOLOGÍA VIAL NACIONAL</span>
          <h2 id="bento-title" class="bento-header__title">El Ecosistema Inteligente de Autopistas</h2>
          <p class="bento-header__desc">
            Diseñado para transformar la movilidad en Venezuela eliminando las fricciones del peaje tradicional.
          </p>
        </div>

        <div class="bento-grid">
          <!-- Card 1 (Grande / Hero Bento): La Placa como Credencial Digital -->
          <article class="bento-card bento-card--large">
            <div class="bento-card__badge">PATENTE DIGITAL</div>
            <h3 class="bento-card__title">Tu placa venezolana es tu pase de tránsito</h3>
            <p class="bento-card__text">
              No necesitas instalar dispositivos obligatorios ni tramitar tarjetas físicas. La matrícula oficial de tu vehículo funciona como tu identificador seguro de peaje en todo el país.
            </p>

            <!-- Gráfico visual de la placa venezolana con holograma y escáner animado -->
            <div class="bento-plate-display">
              <div class="bento-plate-card">
                <div class="bento-plate-card__hologram" aria-hidden="true"></div>
                <div class="bento-plate-card__scanline" aria-hidden="true"></div>
                <div class="bento-plate-card__flag" aria-hidden="true"></div>
                <div class="bento-plate-card__header">REPÚBLICA BOLIVARIANA DE VENEZUELA</div>
                <div class="bento-plate-card__body">
                  <span class="bento-plate-card__number mono">AB123CD</span>
                </div>
                <div class="bento-plate-card__footer">TRANSPORTE TERRESTRE</div>
              </div>
              <div class="bento-plate-features">
                <div class="bento-feat-pill"><AppIcon name="check" :size="14" /> Reconocimiento ALPR</div>
                <div class="bento-feat-pill"><AppIcon name="check" :size="14" /> Cero trámites presenciales</div>
                <div class="bento-feat-pill"><AppIcon name="check" :size="14" /> Válida en autos, motos y camiones</div>
              </div>
            </div>
          </article>

          <!-- Card 2: Comparativa Interactiva "Antes vs Ahora" con Transición Suave -->
          <article class="bento-card bento-card--compare">
            <div class="bento-card__badge">EVOLUCIÓN VIAL</div>
            <h3 class="bento-card__title">¿Qué cambia en tu viaje?</h3>

            <div class="compare-toggle" role="tablist">
              <button
                type="button"
                role="tab"
                :aria-selected="activeCompare === 'now'"
                class="compare-toggle__btn"
                :class="{ 'is-active': activeCompare === 'now' }"
                @click="activeCompare = 'now'"
              >
                Con VenVías Hoy
              </button>
              <button
                type="button"
                role="tab"
                :aria-selected="activeCompare === 'before'"
                class="compare-toggle__btn compare-toggle__btn--before"
                :class="{ 'is-active': activeCompare === 'before' }"
                @click="activeCompare = 'before'"
              >
                Peaje Antiguo
              </button>
            </div>

            <Transition name="compare-swap" mode="out-in">
              <div v-if="activeCompare === 'now'" key="now" class="compare-content compare-content--now">
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--green"><AppIcon name="check" :size="16" /></span>
                  <div>
                    <strong>0 segundos de espera</strong>
                    <p>Tránsito continuo sin detenerte en cabinas.</p>
                  </div>
                </div>
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--green"><AppIcon name="check" :size="16" /></span>
                  <div>
                    <strong>Pago 100% digital</strong>
                    <p>Pago Móvil y BDV en Línea al instante.</p>
                  </div>
                </div>
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--green"><AppIcon name="check" :size="16" /></span>
                  <div>
                    <strong>Ventanilla cerrada</strong>
                    <p>Mayor seguridad vial y confort en cabina.</p>
                  </div>
                </div>
              </div>

              <div v-else key="before" class="compare-content compare-content--before">
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--red"><AppIcon name="alert" :size="16" /></span>
                  <div>
                    <strong>15 a 30 minutos en cola</strong>
                    <p>Congestionamiento en horas pico y fines de semana.</p>
                  </div>
                </div>
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--red"><AppIcon name="alert" :size="16" /></span>
                  <div>
                    <strong>Búsqueda de efectivo</strong>
                    <p>Preocupación por cambio exacto y billetes deteriorados.</p>
                  </div>
                </div>
                <div class="compare-item">
                  <span class="compare-icon-wrap compare-icon-wrap--red"><AppIcon name="alert" :size="16" /></span>
                  <div>
                    <strong>Ventanilla abierta</strong>
                    <p>Exposición constante al clima e incertidumbre vial.</p>
                  </div>
                </div>
              </div>
            </Transition>
          </article>

          <!-- Card 3: Recargas Multicanal en 3 segundos -->
          <article class="bento-card bento-card--payments">
            <div class="bento-card__badge">ACREDITACIÓN INMEDIATA</div>
            <h3 class="bento-card__title">Recarga desde tu banca nacional</h3>
            <p class="bento-card__text">
              Conexión directa con la red interbancaria venezolana para abonar fondos a tu placa en segundos.
            </p>
            <div class="payment-badges-row">
              <div class="payment-badge-pill">
                <div class="payment-badge-pill__icon"><AppIcon name="rayo" :size="16" /></div>
                <div class="payment-badge-pill__label">
                  <strong>Pago Móvil C2P</strong>
                  <span>Acreditación en 2 segundos</span>
                </div>
              </div>
              <div class="payment-badge-pill">
                <div class="payment-badge-pill__icon"><AppIcon name="tarjeta" :size="16" /></div>
                <div class="payment-badge-pill__label">
                  <strong>BDV en Línea</strong>
                  <span>Débito directo en cuenta</span>
                </div>
              </div>
              <div class="payment-badge-pill">
                <div class="payment-badge-pill__icon"><AppIcon name="check" :size="16" /></div>
                <div class="payment-badge-pill__label">
                  <strong>Botón IPG Débito</strong>
                  <span>Cualquier banco nacional</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Card 4: Seguridad y Normativa Legal -->
          <article class="bento-card bento-card--law">
            <div class="bento-card__badge">RESPALDO LEGAL</div>
            <h3 class="bento-card__title">Ley de Transporte Terrestre (Art. 72)</h3>
            <p class="bento-card__text">
              El cobro por placa está fundamentado en la legislación venezolana: la obligación nace con el uso de la vía y el titular registrado responde solidariamente por el tránsito.
            </p>
            <div class="law-highlight-box">
              <div class="law-highlight-box__icon">
                <AppIcon name="recibo" :size="18" />
              </div>
              <span>Tarifas oficiales reguladas y publicadas en Gaceta Oficial del MPPT.</span>
            </div>
          </article>
        </div>
      </section>

      <!-- SECCIÓN INFOGRAFÍA TÉCNICA OFICIAL -->
      <section class="infographic-section reveal-on-scroll" aria-label="Infografía técnica oficial">
        <HowItWorksInfographic />
      </section>

      <!-- BANNER DE CONVERSIÓN FINAL -->
      <section class="cta-banner reveal-on-scroll" aria-labelledby="cta-banner-title">
        <div class="cta-banner__card">
          <div class="cta-banner__glow" aria-hidden="true"></div>
          <div class="cta-banner__shimmer" aria-hidden="true"></div>
          <div class="cta-banner__content">
            <span class="cta-banner__tag">PREPÁRATE PARA TU VIAJE</span>
            <h2 id="cta-banner-title" class="cta-banner__title">¿Listo para circular sin colas por los peajes?</h2>
            <p class="cta-banner__sub">
              Ingresa tu placa para consultar tu saldo disponible o recargar fondos de inmediato.
            </p>
            <div class="cta-banner__actions">
              <RouterLink :to="rechargeRoute" class="cta-btn cta-btn--primary">
                <AppIcon name="rayo" :size="18" />
                <span>Recargar placa ahora</span>
                <span class="cta-btn__shine" aria-hidden="true"></span>
              </RouterLink>
              <RouterLink :to="balanceRoute" class="cta-btn cta-btn--secondary">
                <AppIcon name="placa" :size="18" />
                <span>Consultar saldo disponible</span>
              </RouterLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   PÁGINA Y ESTRUCTURA GENERAL
   ========================================================================== */
.how-page {
  position: relative;
  background: #060b18;
  color: #f8fafc;
  min-height: 100vh;
  padding-block: var(--space-8) var(--space-20);
  overflow: hidden;
}

.how-content {
  position: relative;
  z-index: 2;
  display: grid;
  gap: clamp(48px, 6vw, 84px);
}

/* ==========================================================================
   SISTEMA DE SCROLL REVEAL SUAVE Y ELEGANTE
   ========================================================================== */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-on-scroll.is-revealed {
  opacity: 1;
  transform: translateY(0);
}

/* ==========================================================================
   ANIMACIONES DE ENTRADA HERO (Staggered Fade-Up)
   ========================================================================== */
.animate-in-1 { animation: heroReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both; }
.animate-in-2 { animation: heroReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.16s both; }
.animate-in-3 { animation: heroReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both; }
.animate-in-4 { animation: heroReveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both; }

@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==========================================================================
   ATMÓSFERA Y FONDOS LUMINOSOS CON DERIVA SUAVE
   ========================================================================== */
.how-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.how-ambient__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.32;
  will-change: transform;
}

.how-ambient__orb--blue {
  top: -120px;
  left: 50%;
  width: 960px;
  height: 540px;
  background: radial-gradient(circle, #0038A8 0%, rgba(0, 56, 168, 0) 70%);
  animation: orbDrift1 14s ease-in-out infinite alternate;
}

.how-ambient__orb--cyan {
  top: 480px;
  left: 6%;
  width: 560px;
  height: 560px;
  background: radial-gradient(circle, #0284c7 0%, rgba(2, 132, 199, 0) 70%);
  opacity: 0.24;
  animation: orbDrift2 18s ease-in-out infinite alternate;
}

.how-ambient__orb--amber {
  top: 1050px;
  right: 6%;
  width: 640px;
  height: 640px;
  background: radial-gradient(circle, #f59e0b 0%, rgba(245, 158, 11, 0) 70%);
  opacity: 0.18;
  animation: orbDrift3 16s ease-in-out infinite alternate;
}

@keyframes orbDrift1 {
  0% { transform: translate(-50%, 0) scale(1); }
  100% { transform: translate(-46%, 40px) scale(1.08); }
}

@keyframes orbDrift2 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(45px, -35px) scale(1.12); }
}

@keyframes orbDrift3 {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-45px, 45px) scale(1.1); }
}

.how-ambient__grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(circle at 50% 30%, black 20%, transparent 80%);
}

.how-ambient__beam {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 500px;
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.5) 0%, rgba(56, 189, 248, 0) 100%);
  opacity: 0.4;
}

/* ==========================================================================
   HERO PRINCIPAL
   ========================================================================== */
.hero-tech {
  text-align: center;
  max-width: 880px;
  margin: 0 auto;
  padding-top: var(--space-4);
}

.hero-tech__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 18px;
  border-radius: 9999px;
  background: rgba(0, 56, 168, 0.22);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #38bdf8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-6);
  box-shadow: 0 0 24px rgba(2, 132, 199, 0.25);
  transition: all 0.3s ease;
}

.hero-tech__badge:hover {
  border-color: #38bdf8;
  box-shadow: 0 0 32px rgba(56, 189, 248, 0.45);
  transform: translateY(-1px);
}

.hero-tech__beacon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 10px #38bdf8;
  animation: beaconPulse 2s ease-in-out infinite;
}

@keyframes beaconPulse {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 10px #38bdf8; }
  50% { opacity: 0.4; transform: scale(1.35); box-shadow: 0 0 20px #38bdf8; }
}

.hero-tech__title {
  font: 800 clamp(36px, 5.2vw, 64px)/1.1 var(--font-display);
  color: #ffffff;
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-6);
}

.gradient-text {
  background: linear-gradient(135deg, #ffffff 20%, #38bdf8 65%, #f59e0b 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShimmer 6s ease-in-out infinite alternate;
}

@keyframes textShimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.hero-tech__sub {
  font-size: clamp(16px, 1.8vw, 19px);
  line-height: 1.6;
  color: #94a3b8;
  max-width: 740px;
  margin: 0 auto var(--space-8);
}

/* KPIS TICKER CON EFECTO GLASSMORPHIC */
.hero-kpis {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--space-4) var(--space-8);
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 16px 32px;
  border-radius: 22px;
  box-shadow: 0 16px 45px -10px rgba(0, 0, 0, 0.6);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.hero-kpis:hover {
  border-color: rgba(56, 189, 248, 0.35);
  box-shadow: 0 20px 50px -10px rgba(0, 56, 168, 0.25);
}

.hero-kpi {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  transition: transform 0.2s ease;
}

.hero-kpi:hover {
  transform: translateY(-2px);
}

.hero-kpi__val {
  font: 800 clamp(20px, 2.5vw, 26px)/1 var(--font-display);
  color: #ffffff;
  letter-spacing: -0.02em;
}

.hero-kpi__lbl {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-kpi__divider {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.12);
}

@media (max-width: 640px) {
  .hero-kpi__divider { display: none; }
  .hero-kpis { gap: var(--space-4); width: 100%; justify-content: space-around; }
}

/* ==========================================================================
   SECCIÓN SIMULADOR INTERACTIVO
   ========================================================================== */
.sim-section {
  background: #0b132b;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 28px;
  padding: clamp(24px, 4vw, 44px);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.sim-section:hover {
  border-color: rgba(56, 189, 248, 0.25);
}

.sim-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

@media (min-width: 900px) {
  .sim-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.sim-header__tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;
  animation: beaconPulse 1.8s infinite;
}

.sim-header__title {
  font: 700 clamp(22px, 3vw, 32px)/1.2 var(--font-display);
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
}

.sim-autoplay-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #c9d4ea;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.sim-autoplay-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.sim-autoplay-btn:active {
  transform: scale(0.96);
}

.sim-autoplay-btn.is-active {
  border-color: #10b981;
  color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  box-shadow: 0 0 18px rgba(16, 185, 129, 0.28);
}

.sim-autoplay-radar {
  position: relative;
  width: 10px;
  height: 10px;
  display: grid;
  place-items: center;
}

.sim-autoplay-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.sim-autoplay-wave {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1px solid currentColor;
  animation: radarWave 1.8s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes radarWave {
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

/* ==========================================================================
   PIPELINE DE FASES (STEPPER INTERACTIVO)
   ========================================================================== */
.sim-pipeline {
  position: relative;
  margin-bottom: var(--space-6);
}

.sim-pipeline__track {
  position: absolute;
  top: 24px;
  left: 40px;
  right: 40px;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  z-index: 1;
}

.sim-pipeline__progress {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #10b981);
  transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}

.sim-pipeline__nodes {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.sim-node {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 10px 14px;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: #94a3b8;
}

.sim-node:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.sim-node.is-active {
  background: rgba(0, 56, 168, 0.35);
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(56, 189, 248, 0.25);
  transform: translateY(-2px);
}

.sim-node.is-passed {
  border-color: rgba(16, 185, 129, 0.4);
}

.sim-node__circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.sim-node.is-active .sim-node__circle {
  background: #38bdf8;
  color: #060b18;
  box-shadow: 0 0 14px #38bdf8;
}

.sim-node.is-passed .sim-node__circle {
  background: #10b981;
  color: #060b18;
}

.sim-node__content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sim-node__title {
  font-size: 13px;
  font-weight: 700;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sim-node__sub {
  font-size: 11px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sim-node.is-active .sim-node__sub {
  color: #93c5fd;
}

@media (max-width: 768px) {
  .sim-pipeline__track { display: none; }
  .sim-pipeline__nodes { grid-template-columns: 1fr; }
}

/* Barra de progreso de ciclo continuo */
.sim-progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.sim-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #10b981);
  transition: width 0.04s linear;
}

/* ==========================================================================
   STAGE DE LA SIMULACIÓN
   ========================================================================== */
.sim-stage {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  overflow: hidden;
}

@media (min-width: 960px) {
  .sim-stage {
    grid-template-columns: 1.25fr 1fr;
  }
}

/* VIEWPORT VISUAL */
.sim-viewport {
  position: relative;
  min-height: 340px;
  aspect-ratio: 16 / 10;
  background: #040812;
  overflow: hidden;
}

@media (min-width: 960px) {
  .sim-viewport {
    height: 100%;
    min-height: 440px;
    aspect-ratio: auto;
  }
}

.sim-viewport__scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.sim-viewport__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  animation: sceneBreathe 12s ease-in-out infinite alternate;
}

@keyframes sceneBreathe {
  0% { transform: scale(1); }
  100% { transform: scale(1.04); }
}

.sim-viewport__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(6, 11, 24, 0.2) 0%, rgba(6, 11, 24, 0.78) 100%);
  pointer-events: none;
}

/* TRANSICIÓN DE ESCENA VISUAL (Cinemática y Suave) */
.sim-scene-enter-active,
.sim-scene-leave-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease;
}
.sim-scene-enter-from {
  opacity: 0;
  transform: scale(0.96);
  filter: blur(4px) brightness(1.2);
}
.sim-scene-leave-to {
  opacity: 0;
  transform: scale(1.04);
  filter: blur(4px);
}

/* HUD 1: Escáner de Placa */
.hud-scanner {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hud-scanner__laser {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #38bdf8;
  box-shadow: 0 0 16px #38bdf8, 0 0 32px #38bdf8;
  animation: laserSweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.hud-scanner__laser-flare {
  position: absolute;
  top: -12px;
  left: 0;
  right: 0;
  height: 26px;
  background: linear-gradient(180deg, rgba(56, 189, 248, 0) 0%, rgba(56, 189, 248, 0.3) 100%);
}

@keyframes laserSweep {
  0% { top: 25%; opacity: 0; }
  15% { opacity: 1; }
  85% { opacity: 1; }
  100% { top: 75%; opacity: 0; }
}

.hud-target-box {
  position: absolute;
  left: 20%;
  top: 55%;
  width: 28%;
  height: 22%;
  border: 1px dashed rgba(56, 189, 248, 0.6);
  border-radius: 8px;
  animation: reticleBreathe 2.4s ease-in-out infinite;
}

@keyframes reticleBreathe {
  0%, 100% { transform: scale(1); border-color: rgba(56, 189, 248, 0.6); }
  50% { transform: scale(1.03); border-color: #38bdf8; }
}

.hud-target-box__corner {
  position: absolute;
  width: 12px;
  height: 12px;
  border-color: #38bdf8;
  border-style: solid;
}
.hud-target-box__corner--tl { top: -2px; left: -2px; border-width: 3px 0 0 3px; }
.hud-target-box__corner--tr { top: -2px; right: -2px; border-width: 3px 3px 0 0; }
.hud-target-box__corner--bl { bottom: -2px; left: -2px; border-width: 0 0 3px 3px; }
.hud-target-box__corner--br { bottom: -2px; right: -2px; border-width: 0 3px 3px 0; }

.hud-target-box__crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 14px;
  border-left: 1px solid rgba(56, 189, 248, 0.8);
  border-right: 1px solid rgba(56, 189, 248, 0.8);
  border-top: 1px solid rgba(56, 189, 248, 0.8);
  border-bottom: 1px solid rgba(56, 189, 248, 0.8);
  border-radius: 50%;
}

.hud-target-box__badge {
  position: absolute;
  top: -24px;
  left: 0;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  background: #38bdf8;
  color: #040812;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.08em;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.6);
}

.hud-plate-preview {
  position: absolute;
  right: 18px;
  top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(14px);
  padding: 8px 16px;
  border-radius: 14px;
  border: 1px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  animation: floatMini 4s ease-in-out infinite;
}

@keyframes floatMini {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.hud-plate-preview img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #38bdf8;
  object-fit: cover;
}

.hud-plate-preview__info {
  display: flex;
  flex-direction: column;
}

.hud-plate-preview__code {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.1em;
}

.hud-plate-preview__status {
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  color: #38bdf8;
  font-weight: 700;
}

/* HUD 2 & 3: Semáforo y Notificaciones */
.hud-green-gate,
.hud-debt-gate {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  pointer-events: none;
}

.hud-signal-light {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(14px);
  padding: 8px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(16, 185, 129, 0.4);
  box-shadow: 0 0 24px rgba(16, 185, 129, 0.25);
  animation: badgeSlideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hud-signal-light--amber {
  border-color: rgba(245, 158, 11, 0.4);
  box-shadow: 0 0 24px rgba(245, 158, 11, 0.25);
}

@keyframes badgeSlideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

.hud-signal-beacon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.hud-signal-beacon--green {
  background: #10b981;
  box-shadow: 0 0 16px #10b981;
  animation: beaconGreenPulse 1.8s ease-in-out infinite;
}
.hud-signal-beacon--amber {
  background: #f59e0b;
  box-shadow: 0 0 16px #f59e0b;
  animation: beaconAmberPulse 1.8s ease-in-out infinite;
}

@keyframes beaconGreenPulse {
  0%, 100% { box-shadow: 0 0 12px #10b981, 0 0 24px rgba(16, 185, 129, 0.4); }
  50% { box-shadow: 0 0 24px #10b981, 0 0 44px rgba(16, 185, 129, 0.7); }
}

@keyframes beaconAmberPulse {
  0%, 100% { box-shadow: 0 0 12px #f59e0b, 0 0 24px rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 0 24px #f59e0b, 0 0 44px rgba(245, 158, 11, 0.7); }
}

.hud-signal-text {
  font-family: var(--font-mono, monospace);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #ffffff;
}

.hud-ticket-pill {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(16, 185, 129, 0.95);
  color: #042f1d;
  padding: 10px 18px;
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(16, 185, 129, 0.45);
  animation: badgeSlideUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hud-ticket-pill strong {
  display: block;
  font-size: 14px;
  line-height: 1.2;
}

.hud-ticket-pill span {
  font-size: 11px;
  opacity: 0.9;
}

.hud-ticket-pill__icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(4, 47, 29, 0.15);
  display: grid;
  place-items: center;
}

.hud-ticket-pill--amber {
  background: rgba(245, 158, 11, 0.95);
  color: #451a03;
  box-shadow: 0 12px 32px rgba(245, 158, 11, 0.45);
}

.hud-ticket-pill__icon--amber {
  background: rgba(69, 26, 3, 0.15);
}

@keyframes badgeSlideUp {
  from { opacity: 0; transform: translateY(18px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.hud-telemetry {
  position: absolute;
  left: 16px;
  bottom: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-telemetry__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: beaconPulse 1.5s infinite;
}

/* ==========================================================================
   INSPECTOR COLUMNA DERECHA
   ========================================================================== */
.sim-inspector {
  padding: clamp(24px, 4vw, 36px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-6);
}

.sim-inspector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sim-inspector__phase-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.status-dot--cyan { background: #38bdf8; box-shadow: 0 0 10px #38bdf8; }
.status-dot--green { background: #10b981; box-shadow: 0 0 10px #10b981; }
.status-dot--amber { background: #f59e0b; box-shadow: 0 0 10px #f59e0b; }

.sim-inspector__nav-arrows {
  display: flex;
  gap: 6px;
}

.sim-arrow {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.sim-arrow:hover {
  background: rgba(255, 255, 255, 0.18);
  border-color: #ffffff;
  transform: translateY(-1px);
}

.sim-arrow:active {
  transform: scale(0.92);
}

.flip-h {
  transform: scaleX(-1);
}

/* TRANSICIÓN SUAVE DEL INSPECTOR */
.inspector-slide-enter-active,
.inspector-slide-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.inspector-slide-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.inspector-slide-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

.sim-body__title {
  font: 700 clamp(20px, 2.4vw, 26px)/1.2 var(--font-display);
  color: #ffffff;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.02em;
}

.sim-body__desc {
  font-size: 15px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 var(--space-6);
}

.sim-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sim-stat-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all 0.25s ease;
}

.sim-stat-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(56, 189, 248, 0.3);
  transform: translateY(-2px);
}

.sim-stat-box__label {
  font-size: 11px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.sim-stat-box__val {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

.text-cyan { color: #38bdf8 !important; }
.text-emerald { color: #10b981 !important; }
.text-amber { color: #f59e0b !important; }

.sim-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: var(--space-4);
}

.sim-cta-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 12px;
  background: #0038A8;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 4px 18px rgba(0, 56, 168, 0.4);
}

.sim-cta-btn:hover {
  background: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 8px 26px rgba(2, 132, 199, 0.55);
}

.sim-cta-btn:active {
  transform: scale(0.98);
}

.sim-cta-btn__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transform: translateX(-100%);
  animation: btnShimmer 3.5s ease-in-out infinite;
}

@keyframes btnShimmer {
  0% { transform: translateX(-100%); }
  40%, 100% { transform: translateX(100%); }
}

.sim-cta-link {
  font-size: 13px;
  font-weight: 600;
  color: #f59e0b;
  text-decoration: none;
  text-align: center;
  transition: color 0.2s ease;
}
.sim-cta-link:hover {
  color: #fbbf24;
  text-decoration: underline;
}

/* ==========================================================================
   SECCIÓN BENTO GRID
   ========================================================================== */
.bento-section {
  display: grid;
  gap: var(--space-8);
}

.bento-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.bento-header__eyebrow {
  display: inline-block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #0284c7;
  letter-spacing: 0.14em;
  margin-bottom: var(--space-2);
}

.bento-header__title {
  font: 700 clamp(26px, 3.5vw, 40px)/1.2 var(--font-display);
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
}

.bento-header__desc {
  font-size: 16px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0;
}

.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .bento-card--large {
    grid-column: span 2;
  }
}

.bento-card {
  background: #0b132b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: clamp(24px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
}

.bento-card:hover {
  transform: translateY(-6px);
  border-color: rgba(56, 189, 248, 0.45);
  box-shadow: 0 24px 50px -15px rgba(0, 56, 168, 0.4);
}

.bento-card__badge {
  align-self: flex-start;
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-3);
}

.bento-card__title {
  font: 700 20px/1.3 var(--font-display);
  color: #ffffff;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.01em;
}

.bento-card__text {
  font-size: 14px;
  line-height: 1.6;
  color: #94a3b8;
  margin: 0 0 var(--space-6);
  flex-grow: 1;
}

/* Placa venezolana estilizada con holograma y escáner animado */
.bento-plate-display {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: rgba(0, 0, 0, 0.35);
  border-radius: 16px;
  padding: var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.bento-plate-card {
  position: relative;
  background: #ffffff;
  color: #0f172a;
  border-radius: 12px;
  padding: 10px 16px;
  text-align: center;
  border: 2px solid #cbd5e1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 280px;
  margin: 0 auto;
  overflow: hidden;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease;
}

.bento-plate-card:hover {
  transform: perspective(600px) rotateX(4deg) translateY(-4px) scale(1.03);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.6);
}

.bento-plate-card__hologram {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 35%, rgba(56, 189, 248, 0.25) 45%, rgba(245, 158, 11, 0.25) 55%, transparent 65%);
  background-size: 250% 250%;
  animation: holoSweep 5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes holoSweep {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

.bento-plate-card__scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.25) 50%, transparent 100%);
  animation: plateScan 3.2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes plateScan {
  0%, 100% { transform: translateY(-100%); }
  50% { transform: translateY(100%); }
}

.bento-plate-card__flag {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b 0% 33%, #0038A8 33% 66%, #dc2626 66% 100%);
}

.bento-plate-card__header {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #475569;
  margin-top: 2px;
}

.bento-plate-card__number {
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.12em;
  color: #0f172a;
  display: block;
  line-height: 1.1;
  margin: 2px 0;
}

.bento-plate-card__footer {
  font-size: 8px;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.1em;
}

.bento-plate-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.bento-feat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.06);
  padding: 5px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.bento-feat-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  transform: translateY(-1px);
}

.bento-feat-pill svg {
  color: #10b981;
}

/* Card de Comparativa con Transición */
.compare-toggle {
  display: flex;
  background: rgba(0, 0, 0, 0.35);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: var(--space-4);
}

.compare-toggle__btn {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #94a3b8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.compare-toggle__btn.is-active {
  background: rgba(0, 56, 168, 0.85);
  color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 56, 168, 0.5);
}

.compare-toggle__btn--before.is-active {
  background: rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
}

.compare-swap-enter-active,
.compare-swap-leave-active {
  transition: opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
.compare-swap-enter-from {
  opacity: 0;
  transform: translateX(12px) scale(0.98);
}
.compare-swap-leave-to {
  opacity: 0;
  transform: translateX(-12px) scale(0.98);
}

.compare-content {
  display: grid;
  gap: var(--space-3);
}

.compare-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(255, 255, 255, 0.035);
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.25s ease;
}

.compare-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.14);
  transform: translateX(3px);
}

.compare-item strong {
  display: block;
  font-size: 13px;
  color: #ffffff;
  margin-bottom: 2px;
}

.compare-item p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.compare-icon-wrap {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 2px;
}
.compare-icon-wrap--green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}
.compare-icon-wrap--red {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

/* Card Pagos */
.payment-badges-row {
  display: grid;
  gap: 8px;
}

.payment-badge-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 14px;
  border-radius: 14px;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.payment-badge-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(56, 189, 248, 0.35);
  transform: translateX(4px);
}

.payment-badge-pill__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.payment-badge-pill__label strong {
  display: block;
  font-size: 13px;
  color: #ffffff;
}

.payment-badge-pill__label span {
  font-size: 11px;
  color: #94a3b8;
}

/* Card Ley */
.law-highlight-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 12px 14px;
  border-radius: 14px;
  color: #f59e0b;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  transition: all 0.25s ease;
}

.law-highlight-box:hover {
  background: rgba(245, 158, 11, 0.14);
  border-color: #f59e0b;
  transform: translateY(-2px);
}

.law-highlight-box__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.15);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

/* ==========================================================================
   SECCIÓN INFOGRAFÍA
   ========================================================================== */
.infographic-section {
  background: #0b132b;
  border-radius: 28px;
  padding: clamp(20px, 4vw, 40px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.5);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.infographic-section:hover {
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 26px 70px -15px rgba(0, 56, 168, 0.3);
}

/* ==========================================================================
   BANNER FINAL CTA
   ========================================================================== */
.cta-banner__card {
  position: relative;
  background: linear-gradient(135deg, #0038A8 0%, #0c2360 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 28px;
  padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px);
  text-align: center;
  overflow: hidden;
  box-shadow: 0 30px 70px -15px rgba(0, 56, 168, 0.55);
}

.cta-banner__glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%);
  pointer-events: none;
}

.cta-banner__shimmer {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.15) 0%, transparent 50%);
  pointer-events: none;
}

.cta-banner__content {
  position: relative;
  z-index: 2;
  max-width: 680px;
  margin: 0 auto;
}

.cta-banner__tag {
  display: inline-block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.16);
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 4px 12px;
  border-radius: 9999px;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-4);
}

.cta-banner__title {
  font: 800 clamp(28px, 4vw, 44px)/1.15 var(--font-display);
  color: #ffffff;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.02em;
}

.cta-banner__sub {
  font-size: clamp(15px, 1.6vw, 18px);
  color: #e0f2fe;
  line-height: 1.6;
  margin: 0 0 var(--space-8);
}

.cta-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: center;
}

.cta-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 26px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.cta-btn--primary {
  background: #ffffff;
  color: #0038A8;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.cta-btn--primary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.cta-btn--primary:active {
  transform: scale(0.98);
}

.cta-btn__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: skewX(-20deg);
  transition: left 0.75s ease;
}

.cta-btn--primary:hover .cta-btn__shine {
  left: 150%;
}

.cta-btn--secondary {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.cta-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: #ffffff;
  transform: translateY(-2px);
}

.cta-btn--secondary:active {
  transform: scale(0.98);
}

/* ==========================================================================
   REDUCED MOTION
   ========================================================================== */
@media (prefers-reduced-motion: reduce) {
  .reveal-on-scroll {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .how-ambient__orb,
  .hero-tech__beacon,
  .gradient-text,
  .hud-scanner__laser,
  .hud-target-box,
  .hud-signal-beacon--green,
  .hud-signal-beacon--amber,
  .hud-telemetry__dot,
  .bento-plate-card__scanline,
  .bento-plate-card__hologram,
  .hud-plate-preview,
  .sim-viewport__img {
    animation: none !important;
  }
  .sim-scene-enter-active,
  .sim-scene-leave-active,
  .inspector-slide-enter-active,
  .inspector-slide-leave-active,
  .compare-swap-enter-active,
  .compare-swap-leave-active {
    transition: none !important;
  }
}
</style>
