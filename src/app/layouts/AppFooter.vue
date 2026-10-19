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
  <footer class="footer-hub" aria-labelledby="footer-title">
    <!-- Barra Tricolor Superior Dinámica con Barrido Luminoso -->
    <div class="footer-hub__tricolor" aria-hidden="true"></div>

    <div class="wrap footer-hub__container">
      <h2 id="footer-title" class="visually-hidden">Pie de página institucional de VenVías</h2>

      <!-- Cuadrícula Principal de 4 Columnas Ejecutivas -->
      <div class="footer-hub__grid">
        <!-- Columna 1: Identidad Corporativa Oficial (Colores Originales) -->
        <div class="footer-col footer-col--brand">
          <RouterLink :to="{ name: routes.home }" class="footer-brand__link" aria-label="VenVías Peajes - Inicio">
            <img
              :src="venvias"
              alt="VenVías Peajes"
              width="992"
              height="527"
              class="footer-brand__logo"
              loading="lazy"
            />
          </RouterLink>

          <p class="footer-brand__desc">
            Sistema Nacional de Telepeaje y Gestión Digital de Matrículas de Venezuela. Tránsito continuo, recargas inmediatas y tecnología OCR/RFID.
          </p>

          <!-- Tarjeta de Estado Operativo en Vivo (Rectangular Estándar - Sin Píldoras) -->
          <div class="footer-status-card">
            <div class="footer-status-card__header">
              <span class="footer-status-card__pulse" aria-hidden="true"></span>
              <span class="footer-status-card__title">Red Nacional Operativa 24/7</span>
            </div>
            <p class="footer-status-card__detail">
              Conexión interbancaria en línea y lectura digital ALPR activa en estaciones de telepeaje habilitadas.
            </p>
          </div>
        </div>

        <!-- Columna 2: Servicios al Conductor -->
        <div class="footer-col">
          <h3 class="footer-col__title">
            <AppIcon name="rayo" :size="16" class="footer-col__title-icon text-blue-600" />
            Servicios al Conductor
          </h3>
          <ul class="footer-links">
            <li>
              <RouterLink :to="{ name: routes.recharge }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Recargar saldo de placa</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.debt }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Pagar saldo deudor</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.tolls }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Peajes habilitados y mapa</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.debtConditions }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Condiciones de tránsito vial</span>
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Información y Asistencia -->
        <div class="footer-col">
          <h3 class="footer-col__title">
            <AppIcon name="info" :size="16" class="footer-col__title-icon text-amber-600" />
            Gestión y Asistencia
          </h3>
          <ul class="footer-links">
            <li>
              <RouterLink :to="{ name: routes.howItWorks }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Cómo funciona el telepeaje</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: routes.account }" class="footer-link">
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Portal Mi Cuenta (Flotas)</span>
              </RouterLink>
            </li>
            <li>
              <a href="tel:08008368427" class="footer-link">
                <AppIcon name="audifonos" :size="14" class="footer-link__arrow" />
                <span>Línea 0800-VENVIAS (8368427)</span>
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/TransporteGobVe"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Reportes de tránsito en X</span>
              </a>
            </li>
            <li>
              <a
                href="https://t.me/mtransportegobve"
                target="_blank"
                rel="noopener noreferrer"
                class="footer-link"
              >
                <AppIcon name="arrow" :size="14" class="footer-link__arrow" />
                <span>Canal oficial en Telegram</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Columna 4: Respaldo Institucional y Medios de Pago -->
        <div class="footer-col footer-col--backing">
          <h3 class="footer-col__title">
            <AppIcon name="check" :size="16" class="footer-col__title-icon text-emerald-600" />
            Respaldo y Pagos
          </h3>

          <div class="footer-backing__box">
            <span class="footer-backing__label">UN SERVICIO TECNOLÓGICO DE</span>
            <img
              :src="vem"
              alt="Venezuela en Movimiento"
              width="629"
              height="227"
              class="footer-backing__logo"
              loading="lazy"
            />
          </div>

          <!-- Malla de Métodos de Pago Rectangulares -->
          <div class="footer-payments">
            <span class="footer-payments__title">MÉTODOS BANCARIOS OFICIALES</span>
            <div class="footer-payments__grid">
              <div class="pay-chip">
                <AppIcon name="rayo" :size="13" class="text-amber-500" />
                <span>Pago Móvil</span>
              </div>
              <div class="pay-chip">
                <AppIcon name="tarjeta" :size="13" class="text-blue-600" />
                <span>Botón IPG</span>
              </div>
              <div class="pay-chip">
                <AppIcon name="check" :size="13" class="text-emerald-600" />
                <span>Banca Nacional</span>
              </div>
              <div class="pay-chip">
                <AppIcon name="recibo" :size="13" class="text-sky-600" />
                <span>Débito / Crédito</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Barra Inferior de Seguridad y Derechos Reservados -->
      <div class="footer-sub">
        <div class="footer-sub__copyright">
          <span>© {{ currentYear }} VenVías · Sistema Nacional de Peajes. Todos los derechos reservados.</span>
        </div>

        <div class="footer-sub__security">
          <span class="security-indicator">
            <AppIcon name="check" :size="14" class="text-emerald-600" />
            <span>Cifrado SSL de 256 bits · Interoperabilidad ALPR & RFID</span>
          </span>
        </div>

        <div class="footer-sub__country">
          <span class="country-badge">
            <span class="country-tricolor" aria-hidden="true"></span>
            <span>República Bolivariana de Venezuela</span>
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-hub {
  position: relative;
  background-color: #ffffff;
  color: #475569;
  border-top: 1px solid #e2e8f0;
}

/* Barra Tricolor Superior con Barrido Luminoso */
.footer-hub__tricolor {
  position: relative;
  height: 3.5px;
  width: 100%;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
  overflow: hidden;
}

.footer-hub__tricolor::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 35%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  animation: tricolorSweep 5s ease-in-out infinite;
}

@keyframes tricolorSweep {
  0% { left: -50%; }
  35%, 100% { left: 150%; }
}

.footer-hub__container {
  position: relative;
  padding-top: clamp(40px, 5vw, 60px);
  padding-bottom: clamp(24px, 3.5vw, 36px);
}

/* Cuadrícula Principal */
.footer-hub__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 4vw, 48px);
}

@media (min-width: 640px) {
  .footer-hub__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1040px) {
  .footer-hub__grid {
    grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
    gap: 40px;
  }
}

/* Columna de Marca */
.footer-col--brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-brand__link {
  display: inline-block;
  transition: transform 0.2s ease;
}

.footer-brand__link:hover {
  transform: translateY(-1px);
}

.footer-brand__logo {
  width: 150px;
  height: auto;
  max-width: 100%;
  display: block;
}

.footer-brand__desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: #475569;
  max-width: 38ch;
  margin: 0;
}

/* Tarjeta de Estado Operativo (Rectangular Estándar - Sin Píldoras) */
.footer-status-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;
}

.footer-status-card:hover {
  border-color: #93c5fd;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.06);
}

.footer-status-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-status-card__pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
  animation: footerDotPulse 2s infinite ease-in-out;
}

@keyframes footerDotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.25); opacity: 0.7; }
}

.footer-status-card__title {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.02em;
}

.footer-status-card__detail {
  font-size: 11.5px;
  line-height: 1.45;
  color: #64748b;
  margin: 0;
}

/* Títulos de Columnas */
.footer-col__title {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
}

.footer-col__title-icon {
  flex-shrink: 0;
}

/* Enlaces del Footer */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #475569;
  text-decoration: none !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 2px 0;
}

.footer-link__arrow {
  color: #94a3b8;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #0038A8;
  transform: translateX(3px);
}

.footer-link:hover .footer-link__arrow {
  color: #0038A8;
}

/* Columna de Respaldo */
.footer-col--backing {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.footer-backing__box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-backing__label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #64748b;
  text-transform: uppercase;
}

.footer-backing__logo {
  width: 140px;
  height: auto;
  max-width: 100%;
  display: block;
}

/* Red de Pagos */
.footer-payments {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-payments__title {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #64748b;
  text-transform: uppercase;
}

.footer-payments__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.pay-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 6px 8px;
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.pay-chip:hover {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #0038A8;
  transform: translateY(-1px);
}

/* Barra Inferior (Sub-Footer) */
.footer-sub {
  margin-top: clamp(36px, 4vw, 48px);
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  font-size: 12px;
  color: #64748b;
}

@media (min-width: 900px) {
  .footer-sub {
    flex-direction: row;
    text-align: left;
  }
}

.footer-sub__copyright {
  color: #64748b;
}

.security-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 11.5px;
}

.country-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-weight: 500;
  font-size: 11.5px;
}

.country-tricolor {
  width: 14px;
  height: 9px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #F9D616 33.3%, #0038A8 33.3% 66.6%, #CE1126 66.6%);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .footer-hub__tricolor::after,
  .footer-status-card__pulse {
    animation: none !important;
  }
}
</style>
