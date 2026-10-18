<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'

export default defineComponent({
  name: 'NotFoundView',
  components: { AppIcon, RouterLink },
  data() {
    return {
      homeRoute: { name: ROUTE_NAMES.home },
      quickLinks: [
        {
          to: { name: ROUTE_NAMES.recharge },
          icon: 'rayo' as const,
          title: 'Recargar saldo',
          desc: 'Pago móvil o BDV en línea',
        },
        {
          to: { name: ROUTE_NAMES.balance },
          icon: 'placa' as const,
          title: 'Consultar saldo',
          desc: 'Verifica tu balance disponible',
        },
        {
          to: { name: ROUTE_NAMES.debt },
          icon: 'recibo' as const,
          title: 'Consultar deuda',
          desc: 'Pasos pendientes por cancelar',
        },
        {
          to: { name: ROUTE_NAMES.tolls },
          icon: 'peaje' as const,
          title: 'Mapa de peajes',
          desc: 'Tarifas y ubicación nacional',
        },
      ],
    }
  },
})
</script>

<template>
  <section class="nf-view wrap">
    <div class="nf-card">
      <div class="nf-tricolor" aria-hidden="true"></div>

      <div class="nf-badge">
        <span class="nf-badge__dot" aria-hidden="true"></span>
        <span>DESVÍO VIAL · CÓDIGO 404</span>
      </div>

      <div class="nf-visual" aria-hidden="true">
        <svg class="nf-illustration" viewBox="0 0 280 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Road surface -->
          <path d="M20 100 L90 30 L190 30 L260 100 Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
          <!-- Road dashes -->
          <line x1="140" y1="35" x2="140" y2="48" stroke="#F9D616" stroke-width="3" stroke-dasharray="4 2" />
          <line x1="140" y1="58" x2="140" y2="74" stroke="#F9D616" stroke-width="4" stroke-dasharray="6 3" />
          <line x1="140" y1="84" x2="140" y2="98" stroke="#F9D616" stroke-width="5" />

          <!-- Detour Barrier / Checkpoint sign -->
          <rect x="75" y="45" width="130" height="24" rx="4" fill="#FFFFFF" stroke="#0038A8" stroke-width="2" />
          <!-- Barrier stripes -->
          <path d="M80 47 L95 67 M105 47 L120 67 M130 47 L145 67 M155 47 L170 67 M180 47 L195 67" stroke="#CE1126" stroke-width="3" stroke-linecap="round" />

          <!-- Support posts -->
          <rect x="90" y="69" width="6" height="35" fill="#64748B" rx="1" />
          <rect x="184" y="69" width="6" height="35" fill="#64748B" rx="1" />

          <!-- Road cone -->
          <path d="M50 100 L62 68 L68 68 L80 100 Z" fill="#F97316" />
          <path d="M55 86 L58 78 L72 78 L75 86 Z" fill="#FFFFFF" />
          <rect x="46" y="99" width="38" height="5" rx="2" fill="#1E293B" />
        </svg>

        <div class="nf-number" aria-hidden="true">404</div>
      </div>

      <h1 class="nf-title">Ruta no encontrada</h1>
      <p class="nf-desc">
        El tramo vial digital o la página que buscas no existe en el sistema VenVías, cambió de trazado o el enlace ingresado es incorrecto.
      </p>

      <div class="nf-cta">
        <RouterLink :to="homeRoute" class="btn btn--primario nf-btn-home">
          <AppIcon name="arrow" :size="18" class="nf-btn-arrow" />
          <span>Volver al portal principal</span>
        </RouterLink>
      </div>

      <div class="nf-quick">
        <p class="nf-quick__title">Accesos directos del sistema:</p>
        <div class="nf-quick__grid">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.title"
            :to="link.to"
            class="nf-link-card"
          >
            <div class="nf-link-icon">
              <AppIcon :name="link.icon" :size="20" />
            </div>
            <div class="nf-link-info">
              <span class="nf-link-title">{{ link.title }}</span>
              <span class="nf-link-desc">{{ link.desc }}</span>
            </div>
            <AppIcon name="chevron" :size="16" class="nf-link-chevron" />
          </RouterLink>
        </div>
      </div>

      <div class="nf-footer-note">
        <AppIcon name="info" :size="16" />
        <span>Ministerio del Poder Popular para el Transporte · VenVías</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nf-view {
  min-height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-block: var(--space-8) var(--space-14);
}

.nf-card {
  position: relative;
  width: 100%;
  max-width: 620px;
  background: #ffffff;
  border-radius: var(--radius-2xl, 24px);
  border: 1px solid rgba(226, 232, 240, 0.85);
  box-shadow: 0 20px 45px -12px rgba(18, 33, 66, 0.08), 0 1px 3px rgba(18, 33, 66, 0.04);
  padding: var(--space-10) var(--space-6) var(--space-8);
  text-align: center;
  overflow: hidden;
  animation: nfFadeIn 0.4s var(--ease-out);
}

@media (min-width: 600px) {
  .nf-card {
    padding: var(--space-12) var(--space-8) var(--space-10);
  }
}

.nf-tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
}

.nf-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ea580c;
  margin-top: var(--space-1);
  margin-bottom: var(--space-4);
}

.nf-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
  animation: nfBadgePulse 2s infinite ease-in-out;
}
@keyframes nfBadgePulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.25);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(249, 115, 22, 0.05);
  }
}

.nf-visual {
  position: relative;
  margin-bottom: var(--space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nf-illustration {
  width: 100%;
  max-width: 280px;
  height: auto;
  margin: 0 auto;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nf-card:hover .nf-illustration {
  transform: translateY(-4px) scale(1.02);
}

.nf-number {
  font: 800 clamp(48px, 6vw, 68px)/1 var(--font-display);
  letter-spacing: -0.04em;
  color: #122142;
  margin-top: -12px;
  margin-bottom: var(--space-2);
  background: linear-gradient(180deg, #122142 40%, #0038A8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nf-title {
  font: 700 clamp(24px, 3vw, 30px)/1.2 var(--font-display);
  color: #122142;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.02em;
}

.nf-desc {
  font-size: 15px;
  line-height: 22px;
  color: var(--texto-suave);
  max-width: 48ch;
  margin: 0 auto var(--space-6);
}

.nf-cta {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-8);
}

.nf-btn-home {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 var(--space-6);
  font-size: 15px;
  font-weight: 600;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.25);
  transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out);
}

.nf-btn-home:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 56, 168, 0.35);
}

.nf-btn-arrow {
  transform: rotate(180deg);
}

.nf-btn-home::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
  transform: skewX(-20deg);
  pointer-events: none;
}

.nf-btn-home:hover::after {
  animation: nfShimmer 1s ease infinite;
}

.nf-quick {
  text-align: left;
  border-top: 1px solid var(--borde);
  padding-top: var(--space-6);
  margin-bottom: var(--space-6);
}

.nf-quick__title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--texto-suave);
  margin: 0 0 var(--space-3);
}

.nf-quick__grid {
  display: grid;
  gap: var(--space-2);
}

@media (min-width: 500px) {
  .nf-quick__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.nf-link-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: #F8FAFC;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all 0.2s var(--ease-out);
}

.nf-link-card:hover {
  background: #ffffff;
  border-color: #0038A8;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px -4px rgba(0, 56, 168, 0.12);
}

.nf-link-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--azul-100);
  color: #0038A8;
  display: grid;
  place-items: center;
  flex: none;
  transition: background-color 0.2s, color 0.2s;
}

.nf-link-card:hover .nf-link-icon {
  background: #0038A8;
  color: #ffffff;
}

.nf-link-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.nf-link-title {
  font: 600 14px/1.2 var(--font-body);
  color: #122142;
}

.nf-link-desc {
  font-size: 12px;
  line-height: 16px;
  color: var(--texto-suave);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nf-link-chevron {
  color: #94A3B8;
  transform: rotate(-90deg);
  transition: transform 0.2s, color 0.2s;
  flex: none;
}

.nf-link-card:hover .nf-link-chevron {
  color: #0038A8;
  transform: rotate(-90deg) translateX(-2px);
}

.nf-footer-note {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--texto-suave);
}

.nf-footer-note svg {
  color: #0038A8;
  flex: none;
}

@keyframes nfFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes nfShimmer {
  from {
    left: -100%;
  }
  to {
    left: 200%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-card,
  .nf-badge__dot {
    animation: none !important;
  }
  .nf-btn-home::after {
    display: none;
  }
  .nf-btn-home:hover,
  .nf-link-card:hover,
  .nf-card:hover .nf-illustration {
    transform: none !important;
    transition: none !important;
  }
}
</style>
