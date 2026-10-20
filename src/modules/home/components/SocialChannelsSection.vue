<script lang="ts">
import { defineComponent, ref } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'

export default defineComponent({
  name: 'SocialChannelsSection',
  components: { AppIcon },
  setup() {
    const copiedPhone = ref(false)
    let copyTimeout: ReturnType<typeof setTimeout> | null = null

    const copyPhoneNumber = async (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
      copiedPhone.value = true
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText('08008368427')
        }
      } catch {
        // Fallback
      }
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copiedPhone.value = false
      }, 2200)
    }

    return {
      copiedPhone,
      copyPhoneNumber,
    }
  },
})
</script>

<template>
  <section class="section wrap pt-0 pb-16" aria-labelledby="social-hub-title">
    <div class="social-hub">
      <!-- Barra Tricolor Superior Dinámica con destello de luz -->
      <div class="social-hub__tricolor" aria-hidden="true">
        <div class="social-hub__tricolor-shine"></div>
      </div>

      <!-- Cabecera Ejecutiva -->
      <div class="social-hub__header">
        <h2 id="social-hub-title" class="social-hub__title">
          Síguenos y viaja <span class="social-hub__title-accent">conectado</span>
        </h2>
        <p class="social-hub__subtitle">
          Estado del tránsito en autopistas, alertas de peajes en tiempo real y asistencia vial inmediata en todo el país.
        </p>
      </div>

      <!-- Bento Grid: Línea Telefónica Destacada + 3 Redes Sociales -->
      <div class="social-hub__bento">
        <!-- Columna Izquierda: Tarjeta Hero de Asistencia Vial 0800-VENVIAS con Autopista en Movimiento -->
        <div class="social-hero-card">
          <!-- Fondo Cinematográfico: Autopista Nocturna con Estelas de Tráfico en Movimiento -->
          <div class="social-hero-card__highway-backdrop" aria-hidden="true">
            <div class="social-hero-card__highway-img"></div>
            <div class="social-hero-card__scrim"></div>
            <svg class="social-hero-card__traffic-stream" viewBox="0 0 600 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="streamRed1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ef4444" stop-opacity="0" />
                  <stop offset="50%" stop-color="#ef4444" stop-opacity="0.9" />
                  <stop offset="100%" stop-color="#f87171" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="streamRed2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#dc2626" stop-opacity="0" />
                  <stop offset="60%" stop-color="#fb7185" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="streamCyan1" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#0284c7" stop-opacity="0" />
                  <stop offset="50%" stop-color="#38bdf8" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                </linearGradient>
                <linearGradient id="streamAmber1" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stop-color="#d97706" stop-opacity="0" />
                  <stop offset="50%" stop-color="#fbbf24" stop-opacity="0.95" />
                  <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
                </linearGradient>
                <filter id="streamGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              <!-- Estelas rojas (tráfico hacia adelante) -->
              <path class="stream-line stream-line--red-1" d="M -40 430 Q 220 320 560 90" />
              <path class="stream-line stream-line--red-2" d="M -10 450 Q 250 330 580 110" />
              <path class="stream-line stream-line--red-3" d="M 30 460 Q 280 340 600 130" />

              <!-- Estelas blancas / cyan (luces delanteras) -->
              <path class="stream-line stream-line--cyan-1" d="M 590 70 Q 320 230 -50 370" />
              <path class="stream-line stream-line--cyan-2" d="M 620 90 Q 350 240 -20 390" />
              <path class="stream-line stream-line--amber-1" d="M 640 105 Q 370 255 10 410" />
            </svg>
            <div class="social-hero-card__radar-beam"></div>
          </div>

          <div class="social-hero-card__content">
            <!-- Kicker de Línea 24/7 con radar pulsante -->
            <div class="social-hero-card__kicker">
              <span class="live-status-dot" aria-hidden="true"></span>
              <span>Línea Gratuita Nacional · Atención 24/7</span>
            </div>

            <div class="social-hero-card__body">
              <h3 class="social-hero-card__title">Centro de Asistencia Vial</h3>
              <p class="social-hero-card__desc">
                ¿Incidencias en vía o dudas de peaje? Comunícate directamente con nuestro equipo de atención en cualquier momento.
              </p>
            </div>

            <!-- Caja destacada del número de teléfono con efectos interactivos -->
            <div class="social-hero-card__phone-box">
              <div class="social-hero-card__phone-meta">
                <span class="social-hero-card__phone-lbl">Marcación gratuita</span>
                <a href="tel:08008368427" class="social-hero-card__phone-val" title="Llamar a 0800-VENVIAS">
                  <span class="phone-shimmer">0800-VENVIAS</span>
                  <span class="social-hero-card__phone-digits">(0800-8368427)</span>
                </a>
              </div>

              <!-- Acciones: Llamar y Copiar -->
              <div class="social-hero-card__actions">
                <a href="tel:08008368427" class="btn-call" title="Llamar directamente">
                  <svg viewBox="0 0 24 24" class="btn-call__icon w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>Llamar</span>
                </a>

                <button
                  type="button"
                  class="btn-copy"
                  :class="{ 'is-copied': copiedPhone }"
                  @click="copyPhoneNumber"
                  :title="copiedPhone ? '¡Copiado!' : 'Copiar número'"
                  :aria-label="copiedPhone ? 'Número copiado' : 'Copiar número 0800-8368427'"
                >
                  <template v-if="copiedPhone">
                    <svg viewBox="0 0 20 20" class="w-4 h-4 text-emerald-400 copy-bounce" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span>¡Copiado!</span>
                  </template>
                  <template v-else>
                    <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                    <span>Copiar</span>
                  </template>
                </button>
              </div>
            </div>

            <!-- Respaldo de operadoras -->
            <div class="social-hero-card__carriers">
              <span class="carrier-check-badge">
                <svg viewBox="0 0 20 20" class="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <span>Sin costo desde Cantv, Movilnet, Movistar y Digitel</span>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: 3 Redes Sociales Oficiales en Stack Ejecutivo con Efectos -->
        <div class="social-channels-stack">
          <!-- 1. Telegram -->
          <a
            href="https://t.me/VenViasOficial"
            target="_blank"
            rel="noopener noreferrer"
            class="social-network-card social-network-card--telegram"
            aria-label="Canal Oficial en Telegram"
          >
            <div class="social-network-card__icon social-network-card__icon--telegram">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-white icon-telegram" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <div class="social-network-card__content">
              <div class="social-network-card__top">
                <span class="social-network-card__name">Telegram</span>
                <span class="social-network-card__handle">@VenViasOficial</span>
                <svg viewBox="0 0 20 20" class="social-network-card__check" fill="currentColor" title="Oficial Verificado">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="social-network-card__desc">
                Alertas inmediatas de paso, canales abiertos y estado de peajes.
              </p>
            </div>
            <div class="social-network-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" class="w-4 h-4" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </a>

          <!-- 2. Instagram -->
          <a
            href="https://www.instagram.com/VenViasOficial"
            target="_blank"
            rel="noopener noreferrer"
            class="social-network-card social-network-card--instagram"
            aria-label="Seguir en Instagram"
          >
            <div class="social-network-card__icon social-network-card__icon--instagram">
              <svg viewBox="0 0 24 24" class="w-5 h-5 text-white icon-instagram" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div class="social-network-card__content">
              <div class="social-network-card__top">
                <span class="social-network-card__name">Instagram</span>
                <span class="social-network-card__handle">@VenViasOficial</span>
                <svg viewBox="0 0 20 20" class="social-network-card__check" fill="currentColor" title="Oficial Verificado">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="social-network-card__desc">
                Guías de recarga, tutoriales de placa y nuevas rutas habilitadas.
              </p>
            </div>
            <div class="social-network-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" class="w-4 h-4" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </a>

          <!-- 3. X (Twitter) -->
          <a
            href="https://twitter.com/VenViasOficial"
            target="_blank"
            rel="noopener noreferrer"
            class="social-network-card social-network-card--x"
            aria-label="Ver publicaciones en X"
          >
            <div class="social-network-card__icon social-network-card__icon--x">
              <svg viewBox="0 0 24 24" class="w-4 h-4 text-white icon-x" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </div>
            <div class="social-network-card__content">
              <div class="social-network-card__top">
                <span class="social-network-card__name">X</span>
                <span class="social-network-card__handle">@VenViasOficial</span>
                <svg viewBox="0 0 20 20" class="social-network-card__check" fill="currentColor" title="Oficial Verificado">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <p class="social-network-card__desc">
                Reportes viales minuto a minuto, operativos especiales y soporte.
              </p>
            </div>
            <div class="social-network-card__arrow" aria-hidden="true">
              <svg viewBox="0 0 20 20" class="w-4 h-4" fill="currentColor">
                <path fill-rule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clip-rule="evenodd" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ==========================================================================
   HUB DE ASISTENCIA Y CANALES OFICIALES — Modern Tech & Micro-animaciones
   ========================================================================== */

.social-hub {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 28px;
  padding: clamp(32px, 4vw, 44px) clamp(20px, 3.5vw, 40px);
  box-shadow:
    0 20px 40px -15px rgba(18, 33, 66, 0.08),
    0 0 0 1px rgba(18, 33, 66, 0.02);
  overflow: hidden;
  transition: box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
}

.social-hub:hover {
  box-shadow: 0 28px 56px -12px rgba(18, 33, 66, 0.13);
  border-color: #cbd5e1;
}

/* Sutil barra superior con los colores de Venezuela y destello dinámico */
.social-hub__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4.5px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  overflow: hidden;
}

.social-hub__tricolor-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  animation: tricolorShimmer 5s ease-in-out infinite;
}

@keyframes tricolorShimmer {
  0% { left: -100%; }
  35%, 100% { left: 200%; }
}

/* Cabecera Limpia (Sin píldoras) */
.social-hub__header {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 680px;
  margin: 0 auto clamp(28px, 3.5vw, 40px);
}

.social-hub__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #0038A8;
  margin-bottom: 12px;
  transition: transform 0.25s ease;
}

.social-hub:hover .social-hub__eyebrow {
  transform: translateY(-1px);
}

.social-hub__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(26px, 3.2vw, 36px);
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.2;
  margin: 0 0 12px;
}

.social-hub__title-accent {
  background: linear-gradient(135deg, #0038A8 0%, #0284c7 60%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.social-hub__subtitle {
  font-size: clamp(14px, 0.9vw + 4px, 16px);
  line-height: 1.55;
  color: #64748b;
  margin: 0 auto;
}

/* Bento Grid */
.social-hub__bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 960px) {
  .social-hub__bento {
    grid-template-columns: 1.15fr 1fr;
    gap: 28px;
    align-items: stretch;
  }
}

/* ==========================================================================
   TARJETA HERO 0800-VENVIAS (Lado Izquierdo) con Orbes y Radar
   ========================================================================== */

.social-hero-card {
  position: relative;
  background: #071738;
  border-radius: 22px;
  padding: clamp(28px, 3vw, 36px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 16px 36px -8px rgba(7, 26, 62, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s ease;
}

.social-hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 28px 60px -12px rgba(7, 26, 62, 0.55);
  border-color: rgba(56, 189, 248, 0.4);
}

/* Fondo Dinámico: Autopista y Estelas de Tráfico en Movimiento */
.social-hero-card__highway-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: inherit;
  z-index: 0;
}

.social-hero-card__highway-img {
  position: absolute;
  inset: -18px;
  background-image: url('@/assets/hero/highway-night.jpg');
  background-size: cover;
  background-position: center 62%;
  opacity: 0.38;
  filter: contrast(1.15) saturate(1.25);
  animation: highwayCinematicFloat 18s ease-in-out infinite alternate;
}

@keyframes highwayCinematicFloat {
  0% {
    transform: scale(1) translate3d(0, 0, 0);
  }
  100% {
    transform: scale(1.12) translate3d(-14px, -7px, 0);
  }
}

.social-hero-card__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(6, 18, 44, 0.94) 0%,
    rgba(7, 24, 58, 0.85) 50%,
    rgba(9, 32, 76, 0.78) 100%
  );
}

.social-hero-card__traffic-stream {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.88;
}

.stream-line {
  fill: none;
  stroke-linecap: round;
  filter: url(#streamGlow);
}

.stream-line--red-1 {
  stroke: url(#streamRed1);
  stroke-width: 3.5;
  stroke-dasharray: 85 260;
  animation: trafficForward 3.6s linear infinite;
}

.stream-line--red-2 {
  stroke: url(#streamRed2);
  stroke-width: 2.5;
  stroke-dasharray: 65 220;
  animation: trafficForward 2.9s linear infinite 0.7s;
}

.stream-line--red-3 {
  stroke: url(#streamRed1);
  stroke-width: 2;
  stroke-dasharray: 55 190;
  animation: trafficForward 4.2s linear infinite 1.4s;
}

.stream-line--cyan-1 {
  stroke: url(#streamCyan1);
  stroke-width: 3.5;
  stroke-dasharray: 95 240;
  animation: trafficBackward 3.2s linear infinite;
}

.stream-line--cyan-2 {
  stroke: url(#streamCyan1);
  stroke-width: 2;
  stroke-dasharray: 70 210;
  animation: trafficBackward 3.8s linear infinite 0.9s;
}

.stream-line--amber-1 {
  stroke: url(#streamAmber1);
  stroke-width: 2.5;
  stroke-dasharray: 75 230;
  animation: trafficBackward 3.5s linear infinite 1.6s;
}

@keyframes trafficForward {
  0% {
    stroke-dashoffset: 350;
  }
  100% {
    stroke-dashoffset: -350;
  }
}

@keyframes trafficBackward {
  0% {
    stroke-dashoffset: -350;
  }
  100% {
    stroke-dashoffset: 350;
  }
}

.social-hero-card__radar-beam {
  position: absolute;
  top: -60%;
  left: -70%;
  width: 45%;
  height: 220%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(56, 189, 248, 0.06) 45%,
    rgba(255, 255, 255, 0.12) 50%,
    rgba(56, 189, 248, 0.04) 55%,
    transparent 100%
  );
  transform: rotate(26deg);
  animation: radarBeamSweep 6.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes radarBeamSweep {
  0% {
    left: -70%;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  35% {
    left: 140%;
    opacity: 0;
  }
  100% {
    left: 140%;
    opacity: 0;
  }
}

.live-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8);
  animation: liveStatusPulse 2s infinite;
  margin-right: 7px;
}

@keyframes liveStatusPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.85);
  }
  70% {
    box-shadow: 0 0 0 7px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.social-hero-card__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.social-hero-card__kicker {
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  margin-bottom: 12px;
}

.social-hero-card__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(22px, 2.5vw, 26px);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.social-hero-card__desc {
  font-size: 14.5px;
  line-height: 1.55;
  color: #94a3b8;
  margin: 0 0 24px;
  max-width: 44ch;
}

/* Caja de Marcación con Glassmorphism */
.social-hero-card__phone-box {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 18px 20px;
  backdrop-filter: blur(12px);
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.social-hero-card:hover .social-hero-card__phone-box {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.2);
}

@media (min-width: 500px) {
  .social-hero-card__phone-box {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.social-hero-card__phone-meta {
  display: flex;
  flex-direction: column;
}

.social-hero-card__phone-lbl {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  margin-bottom: 2px;
}

.social-hero-card__phone-val {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(20px, 2.2vw, 24px);
  font-weight: 800;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: -0.02em;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px;
  position: relative;
}

.phone-shimmer {
  background: linear-gradient(90deg, #ffffff 0%, #38bdf8 50%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: background-position 0.5s ease;
}

.social-hero-card:hover .phone-shimmer {
  animation: shineText 2.5s linear infinite;
}

@keyframes shineText {
  to { background-position: 200% center; }
}

.social-hero-card__phone-digits {
  font-size: 13px;
  font-weight: 600;
  color: #38bdf8;
  letter-spacing: normal;
}

.social-hero-card__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-call {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

.btn-call:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.55);
  text-decoration: none;
}

.btn-call:hover .btn-call__icon {
  animation: ringShake 0.6s ease-in-out infinite alternate;
}

@keyframes ringShake {
  0%   { transform: rotate(0deg); }
  25%  { transform: rotate(-15deg); }
  75%  { transform: rotate(15deg); }
  100% { transform: rotate(0deg); }
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-copy:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.btn-copy.is-copied {
  background: rgba(16, 185, 129, 0.25);
  border-color: rgba(52, 211, 153, 0.6);
  color: #34d399;
}

.copy-bounce {
  animation: bounceIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes bounceIn {
  from { transform: scale(0.4); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.social-hero-card__carriers {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: #94a3b8;
  margin-top: auto;
}

.carrier-check-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(52, 211, 153, 0.15);
}

/* ==========================================================================
   STACK DE REDES SOCIALES (Lado Derecho) con Micro-Animaciones
   ========================================================================== */

.social-channels-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: space-between;
}

.social-network-card {
  position: relative;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition:
    transform 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.32s ease,
    border-color 0.3s ease,
    background-color 0.25s ease;
}

.social-network-card:hover {
  transform: translateY(-4px) scale(1.008);
  background: #ffffff;
  text-decoration: none;
}

/* Bordes y resplandores temáticos al hover */
.social-network-card--telegram:hover {
  border-color: #38bdf8;
  box-shadow: 0 16px 36px -8px rgba(2, 132, 199, 0.22);
}

.social-network-card--instagram:hover {
  border-color: #f472b6;
  box-shadow: 0 16px 36px -8px rgba(225, 48, 108, 0.22);
}

.social-network-card--x:hover {
  border-color: #94a3b8;
  box-shadow: 0 16px 36px -8px rgba(15, 23, 42, 0.18);
}

/* Iconos de Marca con Efecto 3D Dinámico */
.social-network-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.32s ease;
}

.social-network-card__icon--telegram {
  background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
  box-shadow: 0 8px 18px -4px rgba(2, 132, 199, 0.35);
}

.social-network-card:hover .social-network-card__icon--telegram {
  transform: scale(1.1) rotate(-6deg);
  box-shadow: 0 12px 24px -4px rgba(2, 132, 199, 0.5);
}

.social-network-card:hover .icon-telegram {
  animation: planeTakeoff 0.8s ease-in-out infinite alternate;
}

@keyframes planeTakeoff {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(2px, -2px); }
}

.social-network-card__icon--instagram {
  background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
  box-shadow: 0 8px 18px -4px rgba(225, 48, 108, 0.35);
}

.social-network-card:hover .social-network-card__icon--instagram {
  transform: scale(1.1) rotate(6deg);
  box-shadow: 0 12px 24px -4px rgba(225, 48, 108, 0.5);
}

.social-network-card:hover .icon-instagram {
  animation: cameraPulse 1s ease-in-out infinite alternate;
}

@keyframes cameraPulse {
  0%   { transform: scale(1); }
  100% { transform: scale(1.08); }
}

.social-network-card__icon--x {
  background: #0f172a;
  box-shadow: 0 8px 18px -4px rgba(15, 23, 42, 0.3);
}

.social-network-card:hover .social-network-card__icon--x {
  transform: scale(1.1) rotate(-4deg);
  box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.45);
}

.social-network-card__content {
  flex: 1;
  min-width: 0;
}

.social-network-card__top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.social-network-card__name {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 15.5px;
  font-weight: 700;
  color: #0f172a;
  transition: color 0.2s ease;
}

.social-network-card--telegram:hover .social-network-card__name { color: #0284c7; }
.social-network-card--instagram:hover .social-network-card__name { color: #d6249f; }
.social-network-card--x:hover .social-network-card__name { color: #0f172a; }

.social-network-card__handle {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.social-network-card__check {
  width: 14px;
  height: 14px;
  color: #0038A8;
  flex-shrink: 0;
}

.social-network-card__desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.45;
  margin: 0;
}

/* Botón flecha interactivo que se activa al hover */
.social-network-card__arrow {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: grid;
  place-items: center;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.25s ease, background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.social-network-card--telegram:hover .social-network-card__arrow {
  color: #ffffff;
  border-color: #0284c7;
  background: #0284c7;
  transform: translate(3px, -3px);
}

.social-network-card--instagram:hover .social-network-card__arrow {
  color: #ffffff;
  border-color: #d6249f;
  background: linear-gradient(135deg, #d6249f, #fd5949);
  transform: translate(3px, -3px);
}

.social-network-card--x:hover .social-network-card__arrow {
  color: #ffffff;
  border-color: #0f172a;
  background: #0f172a;
  transform: translate(3px, -3px);
}

/* ==========================================================================
   OPTIMIZACIONES MÓVIL (PANTALLAS PEQUEÑAS)
   ========================================================================== */
@media (max-width: 640px) {
  .social-hub {
    padding: 24px 16px;
    border-radius: 20px;
  }
  .social-hub__header {
    margin-bottom: 22px;
  }
  .social-hub__title {
    font-size: 26px;
    margin-bottom: 8px;
  }
  .social-hub__subtitle {
    font-size: 14.5px;
  }
  .social-hub__bento {
    gap: 16px;
  }
  .social-hero-card {
    padding: 20px 18px;
    border-radius: 18px;
  }
  .social-hero-card__title {
    font-size: 20px;
  }
  .social-hero-card__desc {
    font-size: 13.5px;
    margin-bottom: 16px;
  }
  .social-hero-card__phone-box {
    padding: 14px 16px;
    border-radius: 14px;
    margin-bottom: 14px;
    gap: 12px;
  }
  .social-hero-card__phone-val {
    font-size: 22px;
  }
  .social-hero-card__phone-digits {
    font-size: 12px;
  }
  .social-hero-card__actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .btn-call,
  .btn-copy {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 13px;
  }
  .social-hero-card__carriers {
    font-size: 11.5px;
    gap: 6px;
  }
  .social-channels-stack {
    gap: 10px;
  }
  .social-network-card {
    padding: 14px 16px;
    border-radius: 16px;
    gap: 14px;
  }
  .social-network-card__icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }
  .social-network-card__name {
    font-size: 15px;
  }
  .social-network-card__desc {
    font-size: 12.5px;
  }
  .social-network-card__arrow {
    width: 32px;
    height: 32px;
  }
}

/* Accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .social-hub__tricolor-shine,
  .social-hero-card__highway-img,
  .stream-line,
  .social-hero-card__radar-beam,
  .live-status-dot,
  .radar-ring,
  .social-hero-card,
  .phone-shimmer,
  .btn-call:hover .btn-call__icon,
  .social-network-card,
  .social-network-card__icon,
  .social-network-card__arrow,
  .icon-telegram,
  .icon-instagram {
    animation: none !important;
    transition: none !important;
  }
}
</style>
