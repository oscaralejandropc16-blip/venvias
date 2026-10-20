<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import venvias from '@/assets/logos/venvias-peajes-positivo.png'
import vem from '@/assets/logos/vem-positivo.png'

export default defineComponent({
  name: 'AppFooter',
  components: { AppIcon },
  data() {
    return {
      venvias,
      vem,
      routes: ROUTE_NAMES,
      currentYear: 2026,
    }
  },
})
</script>

<template>
  <footer class="ft" aria-labelledby="ft-title">
    <!-- ═══ Barra Tricolor Superior ═══ -->
    <div class="ft__tricolor" aria-hidden="true"></div>

    <!-- ═══ Pre-Footer CTA Compacto ═══ -->
    <div class="ft-banner">
      <div class="wrap ft-banner__inner">
        <div class="ft-banner__text">
          <h3 class="ft-banner__title">
            ¿Listo para circular <span class="ft-banner__accent">sin detenerte?</span>
          </h3>
          <p class="ft-banner__sub">
            Recarga saldo a tu placa en minutos o solventa tránsitos pendientes con acreditación instantánea.
          </p>
        </div>

        <div class="ft-banner__actions">
          <RouterLink :to="{ name: routes.recharge }" class="ft-banner__btn-primary">
            <AppIcon name="rayo" :size="16" class="flex-shrink-0" />
            <span>Recargar placa</span>
            <span class="ft-banner__shine" aria-hidden="true"></span>
          </RouterLink>

          <RouterLink :to="{ name: routes.debt }" class="ft-banner__btn-secondary">
            <span>Pagar saldo deudor →</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- ═══ Cuerpo Principal ═══ -->
    <div class="ft__body">
      <h2 id="ft-title" class="visually-hidden">Pie de página institucional de VenVías</h2>

      <div class="wrap ft__main">
        <!-- Col 1: Marca & Respaldo Oficial -->
        <div class="ft__col-brand">
          <div class="ft__brand-card">
            <RouterLink :to="{ name: routes.home }" class="ft__logo-link" aria-label="VenVías Peajes - Inicio">
              <img :src="venvias" alt="VenVías Peajes" width="992" height="527" class="ft__logo-img" loading="lazy" />
            </RouterLink>
            <p class="ft__tagline">
              Sistema Nacional de Peajes · Plataforma digital para el tránsito automatizado y lectura vehicular por placa.
            </p>
            <div class="ft__endorsement">
              <span class="ft__endorsement-lbl">DESARROLLO Y SOPORTE TECNOLÓGICO</span>
              <img :src="vem" alt="Venezuela en Movimiento" width="629" height="227" class="ft__vem-img" loading="lazy" />
            </div>
          </div>
        </div>

        <!-- Col 2: Navegación Rápida -->
        <div class="ft__col-nav">
          <h3 class="ft__col-title">Navegación</h3>
          <ul class="ft__links">
            <li>
              <RouterLink :to="{ name: routes.recharge }" class="ft__link">Recargar saldo de placa</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.debt }" class="ft__link">Pagar saldo deudor</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.howItWorks }" class="ft__link">Cómo funciona</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.tolls }" class="ft__link">Peajes habilitados</RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.account }" class="ft__link">Mi Cuenta</RouterLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Canales de Pago & Garantías Oficiales -->
        <div class="ft__col-payments">
          <h3 class="ft__col-title">Canales de Pago Habilitados</h3>
          <p class="ft__pay-desc">
            Recargas en Bolívares (Bs.) con acreditación digital inmediata en todo el territorio nacional:
          </p>
          <div class="ft__pay-badges">
            <span class="ft__pay-chip">Pago Móvil</span>
            <span class="ft__pay-chip">Botón BDV</span>
            <span class="ft__pay-chip">Botón IPG</span>
            <span class="ft__pay-chip">Banca Nacional</span>
            <span class="ft__pay-chip">Débito / Crédito</span>
          </div>

          <div class="ft__security">
            <AppIcon name="check" :size="15" class="text-emerald-400 flex-shrink-0" />
            <span>Operaciones protegidas bajo normativa interbancaria</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Sub-Footer ═══ -->
    <div class="ft__sub">
      <div class="wrap ft__sub-inner">
        <span class="ft__copy">© {{ currentYear }} VenVías · Todos los derechos reservados</span>
        <span class="ft__country">
          <svg class="ft__flag" viewBox="0 0 900 600" width="22" height="15" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="ft-vzla-clip">
                <rect width="900" height="600" rx="36" ry="36" />
              </clipPath>
              <g id="ft-vzla-star">
                <polygon fill="#ffffff" points="0,-22 5.3,-7.1 20.9,-6.8 8.3,2.8 12.9,17.8 0,8.8 -12.9,17.8 -8.3,2.8 -20.9,-6.8 -5.3,-7.1" />
              </g>
            </defs>
            <g clip-path="url(#ft-vzla-clip)">
              <rect width="900" height="200" fill="#F9D616" />
              <rect y="200" width="900" height="200" fill="#0038A8" />
              <rect y="400" width="900" height="200" fill="#CE1126" />
              <use href="#ft-vzla-star" transform="translate(325, 335)" />
              <use href="#ft-vzla-star" transform="translate(355, 308)" />
              <use href="#ft-vzla-star" transform="translate(390, 288)" />
              <use href="#ft-vzla-star" transform="translate(430, 278)" />
              <use href="#ft-vzla-star" transform="translate(470, 278)" />
              <use href="#ft-vzla-star" transform="translate(510, 288)" />
              <use href="#ft-vzla-star" transform="translate(545, 308)" />
              <use href="#ft-vzla-star" transform="translate(575, 335)" />
            </g>
          </svg>
          República Bolivariana de Venezuela
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ==========================================================================
   FOOTER · VenVías — COMPACT EXECUTIVE DESIGN
   ========================================================================== */

.ft {
  position: relative;
  overflow: hidden;
  background: #070e1c;
}

/* ── Tricolor ── */
.ft__tricolor {
  height: 3px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  width: 100%;
}

/* ── Pre-Footer Banner (Compacto & Elegante) ── */
.ft-banner {
  background: linear-gradient(135deg, #091734 0%, #0c2048 50%, #0a1b3c 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: clamp(20px, 2.5vw, 28px) 0;
  position: relative;
}

.ft-banner__inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

@media (min-width: 860px) {
  .ft-banner__inner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
  }
}

.ft-banner__text {
  max-width: 580px;
}

.ft-banner__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: clamp(19px, 2.2vw, 24px);
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
  letter-spacing: -0.02em;
  line-height: 1.25;
}

.ft-banner__accent {
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ft-banner__sub {
  font-size: clamp(13px, 1vw + 1px, 14px);
  color: #94a3c4;
  margin: 0;
  line-height: 1.45;
}

.ft-banner__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.ft-banner__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0057a3 0%, #0284c7 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 13.5px;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  position: relative;
  overflow: hidden;
}

.ft-banner__btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(2, 132, 199, 0.45);
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%);
}

.ft-banner__shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  transform: skewX(-20deg);
  transition: left 0.7s ease;
}

.ft-banner__btn-primary:hover .ft-banner__shine {
  left: 150%;
}

.ft-banner__btn-secondary {
  font-size: 13px;
  font-weight: 600;
  color: #38bdf8;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.ft-banner__btn-secondary:hover {
  color: #7dd3fc;
  background-color: rgba(56, 189, 248, 0.08);
}

/* ── Cuerpo Principal del Footer ── */
.ft__body {
  padding: clamp(28px, 3.5vw, 42px) 0 clamp(24px, 3vw, 36px);
}

.ft__main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

@media (min-width: 768px) {
  .ft__main {
    grid-template-columns: 1.2fr 0.9fr 1.1fr;
    gap: 36px;
  }
}

@media (min-width: 1024px) {
  .ft__main {
    grid-template-columns: 1.35fr 0.95fr 1.2fr;
    gap: 48px;
  }
}

/* Col 1: Marca & Respaldo */
.ft__col-brand {
  display: flex;
  flex-direction: column;
}

.ft__brand-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ft__logo-link {
  display: inline-flex;
  align-self: flex-start;
  background: #ffffff;
  border-radius: 10px;
  padding: 8px 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ft__logo-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
}

.ft__logo-img {
  width: 110px;
  height: auto;
  display: block;
}

.ft__tagline {
  font-size: 13px;
  line-height: 1.55;
  color: #8395b2;
  margin: 0;
  max-width: 38ch;
}

.ft__endorsement {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 4px;
}

.ft__endorsement-lbl {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #586e90;
}

.ft__vem-img {
  width: 124px;
  height: auto;
  display: block;
  background: #ffffff;
  border-radius: 8px;
  padding: 6px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  align-self: flex-start;
}

/* Col 2 & 3: Encabezados */
.ft__col-title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 11.5px;
  font-weight: 700;
  color: #647fa8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0 0 14px;
}

/* Navegación (en móvil: 2 columnas compactas) */
.ft__links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 16px;
}

@media (min-width: 768px) {
  .ft__links {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }
}

.ft__link {
  font-size: 13.5px;
  color: #9ab0d0;
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
  line-height: 1.35;
}

.ft__link:hover {
  color: #ffffff;
  transform: translateX(2px);
}

/* Col 3: Métodos de Pago */
.ft__col-payments {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ft__pay-desc {
  font-size: 12.5px;
  line-height: 1.5;
  color: #7b8ea9;
  margin: 0;
}

.ft__pay-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ft__pay-chip {
  font-size: 11px;
  font-weight: 600;
  color: #cbd5e1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 6px;
  padding: 4px 9px;
  letter-spacing: 0.01em;
}

.ft__security {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #6a82a6;
  margin-top: 4px;
}

/* ── Sub-Footer ── */
.ft__sub {
  background: #040913;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 14px 0;
}

.ft__sub-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
  font-size: 11.5px;
  color: #516483;
}

@media (min-width: 640px) {
  .ft__sub-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.ft__copy {
  color: #516483;
}

.ft__country {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #697e9f;
  font-weight: 500;
}

.ft__flag {
  width: 22px;
  height: 15px;
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}

/* ═══ Accesibilidad ═══ */
@media (prefers-reduced-motion: reduce) {
  .ft-banner__btn-primary,
  .ft__logo-link,
  .ft__link {
    transition: none !important;
    transform: none !important;
  }
  .ft-banner__shine {
    display: none !important;
  }
}
</style>
