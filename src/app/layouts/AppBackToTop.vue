<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppBackToTop',
  data() {
    return {
      isVisible: false,
      scrollProgress: 0,
      ticking: false,
    }
  },
  computed: {
    circumference(): number {
      return 2 * Math.PI * 24 // r=24 => ~150.8
    },
    dashOffset(): number {
      const offset = this.circumference * (1 - this.scrollProgress / 100)
      return Math.max(0, Math.min(this.circumference, offset))
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll, { passive: true })
    this.updateScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    onScroll() {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.updateScroll()
          this.ticking = false
        })
        this.ticking = true
      }
    },
    updateScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      this.isVisible = scrollTop > 320

      if (scrollHeight > 0) {
        const rawProgress = (scrollTop / scrollHeight) * 100
        this.scrollProgress = Math.min(100, Math.max(0, rawProgress))
      } else {
        this.scrollProgress = 0
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
})
</script>

<template>
  <button
    type="button"
    class="btt"
    :class="{ 'btt--visible': isVisible }"
    aria-label="Volver al inicio de la página"
    @click="scrollToTop"
  >
    <!-- Tooltip lateral con colores oficiales VenVías -->
    <span class="btt__tooltip" aria-hidden="true">
      <span class="btt__tooltip-text">Subir</span>
      <span class="btt__tooltip-pct">{{ Math.round(scrollProgress) }}%</span>
    </span>

    <!-- Anillo circular de progreso en colores VenVías (Azul a Amarillo) -->
    <svg class="btt__ring" viewBox="0 0 52 52" aria-hidden="true">
      <defs>
        <linearGradient id="btt-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0038A8" />
          <stop offset="100%" stop-color="#F9D616" />
        </linearGradient>
      </defs>
      <circle cx="26" cy="26" r="24" class="btt__ring-bg" />
      <circle
        cx="26"
        cy="26"
        r="24"
        class="btt__ring-progress"
        :style="{
          strokeDasharray: circumference,
          strokeDashoffset: dashOffset,
        }"
      />
    </svg>

    <!-- Icono auténtico de Peaje y Vía (Caseta de Peaje con Barrera Levantada y Vía VenVías) -->
    <svg class="btt__icon" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <!-- 1. Cinta de carretera amarilla del logo de VenVías en la base -->
      <g class="btt__road-group">
        <path d="M4 35.5 C 14 34 28 34 38 35.5" stroke="#F9D616" stroke-width="3" stroke-linecap="round" />
        <!-- Rayas discontinuas blancas de la carretera -->
        <path d="M8 35.5 L12 35.5 M18 35.5 L22 35.5 M28 35.5 L32 35.5" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round" />
      </g>

      <!-- 2. Caseta de Peaje (Cuerpo Azul #0038A8 con Visera Roja #CE1126) -->
      <g class="btt__booth-group">
        <!-- Caseta azul VenVías -->
        <rect x="7" y="18" width="9" height="15" rx="1.5" fill="#0038A8" />
        <!-- Ventanilla -->
        <rect x="9" y="21" width="5" height="5" rx="0.8" fill="#ffffff" />
        <!-- Visera roja VenVías -->
        <path d="M5.5 18 H 17.5" stroke="#CE1126" stroke-width="2.5" stroke-linecap="round" />
        <!-- Luz de cabina amarilla -->
        <circle cx="11.5" cy="15.5" r="1.2" fill="#F9D616" />
      </g>

      <!-- 3. Barrera de Peaje Levantada (Rayas Rojas #CE1126 y Blancas) -->
      <g class="btt__barrier-group">
        <!-- Base de anclaje de la barrera -->
        <circle cx="16" cy="27" r="1.8" fill="#0038A8" stroke="#ffffff" stroke-width="1" />
        <!-- Brazo de barrera abierto hacia arriba -->
        <line x1="16" y1="27" x2="28" y2="13" stroke="#CE1126" stroke-width="2.5" stroke-linecap="round" class="btt__barrier-arm" />
        <!-- Franjas blancas sobre la barrera -->
        <line x1="16" y1="27" x2="28" y2="13" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 3.5" class="btt__barrier-stripes" />
      </g>

      <!-- 4. Flecha Direccional de Subida en el canal de peaje abierto -->
      <g class="btt__arrow-group">
        <path d="M28 11 L33 6 L38 11" stroke="#0038A8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btt__arrow-head" />
        <line x1="33" y1="7" x2="33" y2="23" stroke="#0038A8" stroke-width="2.5" stroke-linecap="round" class="btt__arrow-stem" />
      </g>
    </svg>
  </button>
</template>

<style scoped>
.btt {
  position: fixed;
  bottom: 26px;
  right: 26px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid rgba(0, 56, 168, 0.2);
  background: #ffffff;
  box-shadow:
    0 8px 24px rgba(0, 56, 168, 0.2),
    0 2px 6px rgba(0, 0, 0, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 85;
  padding: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(16px) scale(0.9);
  transition:
    opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.btt--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.btt:hover {
  transform: translateY(-4px) scale(1.06);
  border-color: #0038A8;
  box-shadow:
    0 14px 30px rgba(0, 56, 168, 0.3),
    0 4px 10px rgba(0, 0, 0, 0.12),
    inset 0 1px 1px rgba(255, 255, 255, 1);
}

.btt:active {
  transform: translateY(-1px) scale(0.97);
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.2);
}

.btt:focus-visible {
  outline: 2px solid #0038A8;
  outline-offset: 3px;
}

/* ── Anillo de progreso circular ── */
.btt__ring {
  position: absolute;
  inset: -2px;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  transform: rotate(-90deg);
  pointer-events: none;
}

.btt__ring-bg {
  fill: none;
  stroke: rgba(0, 56, 168, 0.08);
  stroke-width: 2.5;
}

.btt__ring-progress {
  fill: none;
  stroke: url(#btt-ring-gradient);
  stroke-width: 2.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.12s linear;
}

/* ── Icono Peaje & Vía Oficial VenVías ── */
.btt__icon {
  width: 32px;
  height: 32px;
  overflow: visible;
}

/* Animación y micro-interacción en la flecha y barrera */
.btt__arrow-group {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btt:hover .btt__arrow-group {
  transform: translateY(-2px);
}

.btt__barrier-group {
  transform-origin: 16px 27px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btt:hover .btt__barrier-group {
  transform: rotate(-4deg);
}

/* ── Tooltip lateral ── */
.btt__tooltip {
  position: absolute;
  right: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%) translateX(6px);
  background: #0038A8;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 11.5px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 16px rgba(0, 56, 168, 0.35);
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btt__tooltip-pct {
  color: #070e1c;
  font-family: var(--font-mono, monospace);
  font-size: 10.5px;
  font-weight: 800;
  background: #F9D616;
  padding: 1px 6px;
  border-radius: 10px;
}

.btt:hover .btt__tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ── Responsive móvil ── */
@media (max-width: 640px) {
  .btt {
    bottom: 20px;
    right: 20px;
    width: 48px;
    height: 48px;
  }
  .btt__icon {
    width: 28px;
    height: 28px;
  }
  .btt__tooltip {
    display: none;
  }
}

/* ── Accesibilidad: reducción de movimiento ── */
@media (prefers-reduced-motion: reduce) {
  .btt,
  .btt__arrow-group,
  .btt__barrier-group {
    animation: none !important;
    transition: none !important;
  }
}
</style>
