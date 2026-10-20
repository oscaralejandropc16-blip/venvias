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
      return 2 * Math.PI * 20 // r=20 => ~125.66
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
    aria-label="Volver arriba"
    title="Volver arriba"
    @click="scrollToTop"
  >
    <!-- Micro-tooltip sutil en hover (Solo desktop) -->
    <span class="btt__tooltip" aria-hidden="true">Volver arriba</span>

    <!-- Anillo circular de progreso de lectura sutil -->
    <svg class="btt__ring" viewBox="0 0 46 46" aria-hidden="true">
      <circle cx="23" cy="23" r="20" class="btt__ring-track" />
      <circle
        cx="23"
        cy="23"
        r="20"
        class="btt__ring-progress"
        :style="{
          strokeDasharray: circumference,
          strokeDashoffset: dashOffset,
        }"
      />
    </svg>

    <!-- Flecha sobria y elegante hacia arriba -->
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="btt__arrow" aria-hidden="true">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  </button>
</template>

<style scoped>
.btt {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: none;
  background: #0038A8;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 80;
  padding: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(14px) scale(0.92);
  box-shadow:
    0 8px 24px -2px rgba(0, 56, 168, 0.4),
    0 2px 6px rgba(0, 0, 0, 0.08);
  transition:
    opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.25s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.btt--visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0) scale(1);
}

.btt:hover {
  background: #0284c7;
  transform: translateY(-2px) scale(1.05);
  box-shadow:
    0 12px 28px -2px rgba(0, 56, 168, 0.5),
    0 4px 10px rgba(0, 0, 0, 0.12);
}

.btt:active {
  transform: translateY(0) scale(0.96);
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.3);
}

.btt:focus-visible {
  outline: 3px solid #38bdf8;
  outline-offset: 3px;
}

/* ── Anillo perimetral de progreso ── */
.btt__ring {
  position: absolute;
  inset: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  transform: rotate(-90deg);
  pointer-events: none;
}

.btt__ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 2.2;
}

.btt__ring-progress {
  fill: none;
  stroke: #F9D616;
  stroke-width: 2.2;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.1s linear;
}

/* ── Flecha central ── */
.btt__arrow {
  color: #ffffff;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btt:hover .btt__arrow {
  transform: translateY(-2px);
}

/* ── Tooltip minimalista oscuro (sin pastillas gigantes ni porcentajes amarillos) ── */
.btt__tooltip {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 6px;
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 11.5px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.btt:hover .btt__tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ── Responsive móvil ── */
@media (max-width: 640px) {
  .btt {
    bottom: 18px;
    right: 18px;
    width: 44px;
    height: 44px;
  }
  .btt__tooltip {
    display: none !important;
  }
}

@media (hover: none) {
  .btt__tooltip {
    display: none !important;
  }
}

/* ── Reducción de movimiento ── */
@media (prefers-reduced-motion: reduce) {
  .btt,
  .btt__arrow {
    animation: none !important;
    transition: none !important;
  }
}
</style>
