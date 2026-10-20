<script lang="ts">
import { defineComponent } from 'vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import venvias from '@/assets/logos/venvias-peajes-positivo.png'
import vem from '@/assets/logos/vem-positivo.png'

export default defineComponent({
  name: 'AppFooter',
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
    <!-- Barra Tricolor Superior Sutil -->
    <div class="ft__tricolor" aria-hidden="true"></div>

    <h2 id="ft-title" class="visually-hidden">Pie de página oficial de VenVías</h2>

    <!-- Contenedor Principal: Logo + Slogan | Menú | Respaldo VEM -->
    <div class="wrap ft__wrap">
      <div class="ft__content">
        <!-- Bloque Izquierdo: Logo y Slogan -->
        <div class="ft__brand">
          <RouterLink :to="{ name: routes.home }" class="ft__logo-link" aria-label="VenVías Peajes - Inicio">
            <img :src="venvias" alt="VenVías Peajes" width="992" height="527" class="ft__logo" loading="lazy" />
          </RouterLink>
          <p class="ft__slogan">El efectivo es cosa del pasado.</p>
        </div>

        <!-- Bloque Central: Menú de Enlaces Oficiales -->
        <nav class="ft__nav" aria-label="Enlaces del pie de página">
          <ul class="ft__menu">
            <li><RouterLink :to="{ name: routes.home }" class="ft__menu-link">Inicio</RouterLink></li>
            <li><RouterLink :to="{ name: routes.recharge }" class="ft__menu-link">Recargar una placa</RouterLink></li>
            <li><RouterLink :to="{ name: routes.debt }" class="ft__menu-link">Pagar saldo deudor</RouterLink></li>
            <li><RouterLink :to="{ name: routes.howItWorks }" class="ft__menu-link">Cómo funciona</RouterLink></li>
            <li><RouterLink :to="{ name: routes.tolls }" class="ft__menu-link">Peajes habilitados</RouterLink></li>
            <li><RouterLink :to="{ name: routes.account }" class="ft__menu-link">Mi cuenta</RouterLink></li>
            <li><RouterLink :to="{ name: routes.debtConditions }" class="ft__menu-link">Términos y condiciones</RouterLink></li>
          </ul>
        </nav>

        <!-- Bloque Derecho: Respaldo Venezuela en Movimiento -->
        <div class="ft__endorsement">
          <span class="ft__endorsement-label">Un servicio de</span>
          <img :src="vem" alt="Venezuela en Movimiento" width="629" height="227" class="ft__vem-logo" loading="lazy" />
        </div>
      </div>
    </div>

    <!-- Sub-footer Limpio con Derechos, Términos y Bandera Oficial de Venezuela -->
    <div class="ft__sub">
      <div class="wrap ft__sub-inner">
        <div class="ft__sub-left">
          <span class="ft__copy">© {{ currentYear }} VenVías · Todos los derechos reservados</span>
          <span class="ft__sub-sep" aria-hidden="true">·</span>
          <RouterLink :to="{ name: routes.debtConditions }" class="ft__legal-link">Términos y condiciones</RouterLink>
        </div>
        <span class="ft__country">
          <svg class="ft__flag" viewBox="0 0 900 600" width="20" height="13.3" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="ft-vzla-clip">
                <rect width="900" height="600" rx="36" ry="36" />
              </clipPath>
              <g id="ft-vzla-star">
                <polygon fill="#ffffff" points="0,-22 5.3,-7.1 20.9,-6.8 8.3,2.8 12.9,17.8 0,8.8 -12.9,17.8 -8.3,2.8 -20.9,-6.8 -5.3,-7.1" />
              </g>
            </defs>
            <g clip-path="url(#ft-vzla-clip)">
              <!-- Franja 1: Amarillo -->
              <rect width="900" height="200" fill="#F9D616" />
              <!-- Franja 2: Azul con arco de 8 estrellas -->
              <rect y="200" width="900" height="200" fill="#0038A8" />
              <!-- Franja 3: Rojo -->
              <rect y="400" width="900" height="200" fill="#CE1126" />
              <!-- 8 Estrellas Blancas en Arco Oficial -->
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
   FOOTER MINIMALISTA Y ELEGANTE · VenVías
   ========================================================================== */

.ft {
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  position: relative;
  color: #334155;
}

/* ── Sutil Barra Tricolor ── */
.ft__tricolor {
  height: 3px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  width: 100%;
}

/* ── Contenedor Principal ── */
.ft__wrap {
  padding: 32px 0 28px;
}

.ft__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
}

@media (min-width: 900px) {
  .ft__content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    gap: 32px;
  }
}

/* ── Bloque 1: Marca y Slogan ── */
.ft__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (min-width: 900px) {
  .ft__brand {
    align-items: flex-start;
  }
}

.ft__logo-link {
  display: inline-block;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ft__logo-link:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.ft__logo {
  width: 120px;
  height: auto;
  display: block;
}

.ft__slogan {
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  letter-spacing: -0.01em;
}

/* ── Bloque 2: Menú Central ── */
.ft__nav {
  display: flex;
  justify-content: center;
}

.ft__menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 22px;
  max-width: 580px;
}

@media (min-width: 900px) {
  .ft__menu {
    gap: 8px 24px;
  }
}

.ft__menu-link {
  font-size: 13.5px;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
  transition: color 0.18s ease;
  padding: 4px 0;
  display: inline-block;
}

.ft__menu-link:hover {
  color: #0038A8;
}

/* ── Bloque 3: Respaldo Institucional ── */
.ft__endorsement {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

@media (min-width: 900px) {
  .ft__endorsement {
    align-items: flex-end;
  }
}

.ft__endorsement-label {
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.ft__vem-logo {
  width: 130px;
  height: auto;
  display: block;
}

/* ── Sub-Footer ── */
.ft__sub {
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  padding: 12px 0;
}

.ft__sub-inner {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

@media (min-width: 640px) {
  .ft__sub-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.ft__sub-left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ft__copy {
  color: #64748b;
}

.ft__sub-sep {
  color: #cbd5e1;
}

.ft__legal-link {
  color: #64748b;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.18s ease;
}

.ft__legal-link:hover {
  color: #0038A8;
}

.ft__country {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #475569;
  font-weight: 500;
}

.ft__flag {
  width: 20px;
  height: 13.3px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  display: inline-block;
  vertical-align: middle;
}
</style>
