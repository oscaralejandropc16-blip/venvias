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
    <!-- ═══ Barra Tricolor ═══ -->
    <div class="ft__tricolor" aria-hidden="true"></div>

    <!-- ═══ Cuerpo Principal ═══ -->
    <div class="ft__body">
      <!-- Malla decorativa -->
      <div class="ft__mesh" aria-hidden="true"></div>

      <div class="wrap ft__container">
        <!-- ═══ CTA Card Rediseñado ═══ -->
        <section class="ft-cta" aria-labelledby="ft-cta-title">
          <div class="ft-cta__ambient-glow" aria-hidden="true"></div>
          <div class="ft-cta__ambient-gold" aria-hidden="true"></div>

          <!-- Silueta sutil de carretera / autopista en perspectiva -->
          <svg class="ft-cta__road-ribbon" viewBox="0 0 600 200" fill="none" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 200 C 200 180 400 120 600 40 L 600 200 Z" fill="rgba(249, 214, 22, 0.04)" />
            <path d="M50 200 C 220 185 410 135 600 75" stroke="#F9D616" stroke-width="1.5" stroke-dasharray="16 14" opacity="0.3" />
          </svg>

          <div class="ft-cta__content">
            <div class="ft-cta__text">
              <h3 id="ft-cta-title" class="ft-cta__title">
                ¿Listo para circular <span class="ft-cta__gradient">sin detenerte?</span>
              </h3>
              <p class="ft-cta__sub">
                Recarga el saldo de tu placa en menos de 2 minutos. Transita a velocidad continua en todos los peajes del país con Pago Móvil, BDV e IPG.
              </p>
              <div class="ft-cta__perks">
                <span class="ft-cta__perk">
                  <span class="ft-cta__perk-dot ft-cta__perk-dot--amber"></span>
                  Sin registro previo
                </span>
                <span class="ft-cta__perk">
                  <span class="ft-cta__perk-dot ft-cta__perk-dot--cyan"></span>
                  Acreditación al instante
                </span>
                <span class="ft-cta__perk">
                  <span class="ft-cta__perk-dot ft-cta__perk-dot--green"></span>
                  Disponible 24/7
                </span>
              </div>
            </div>

            <div class="ft-cta__actions">
              <RouterLink :to="{ name: routes.recharge }" class="ft-cta__btn-primary">
                <AppIcon name="rayo" :size="18" class="ft-cta__btn-ico" />
                <span>Recargar placa ahora</span>
                <span class="ft-cta__btn-shine" aria-hidden="true"></span>
              </RouterLink>

              <RouterLink :to="{ name: routes.debt }" class="ft-cta__debt-link">
                <span>¿Tránsito pendiente?</span>
                <strong class="ft-cta__debt-accent">Pagar saldo aquí →</strong>
              </RouterLink>
            </div>
          </div>
        </section>

        <h2 id="ft-title" class="visually-hidden">Pie de página institucional de VenVías</h2>

        <div class="ft__grid">
          <!-- Col 1: Marca -->
          <div class="ft__brand">
            <RouterLink :to="{ name: routes.home }" class="ft__logo-card" aria-label="VenVías Peajes - Inicio">
              <img :src="venvias" alt="VenVías Peajes" width="992" height="527" class="ft__logo" loading="lazy" />
            </RouterLink>
            <p class="ft__tagline">Plataforma oficial para el pago y consulta de peajes nacionales.</p>

            <!-- Contacto directo -->
            <a href="tel:08008368427" class="ft__phone">
              <AppIcon name="audifonos" :size="16" class="ft__phone-icon" />
              <span class="ft__phone-num">0800-VENVIAS</span>
              <span class="ft__phone-sub">(8368427)</span>
            </a>
          </div>

          <!-- Col 2: Navegación -->
          <nav class="ft__nav" aria-label="Navegación del footer">
            <h3 class="ft__nav-title">Navegación</h3>
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
          </nav>

          <!-- Col 3: Respaldo Institucional -->
          <div class="ft__inst">
            <h3 class="ft__nav-title">Respaldo institucional</h3>

            <div class="ft__inst-card">
              <span class="ft__inst-label">UN SERVICIO TECNOLÓGICO DE</span>
              <img :src="vem" alt="Venezuela en Movimiento" width="629" height="227" class="ft__inst-logo" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ Sub-Footer ═══ -->
    <div class="ft__sub">
      <div class="wrap ft__sub-inner">
        <span class="ft__copy">© {{ currentYear }} VenVías · Sistema Nacional de Peajes</span>
        <span class="ft__country">
          <span class="ft__flag" aria-hidden="true"></span>
          República Bolivariana de Venezuela
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ═══════════════════════════════════════════════
   FOOTER · VenVías — PREMIUM MINIMAL
   ═══════════════════════════════════════════════ */

.ft { position: relative; overflow: hidden; }

/* ── Tricolor ── */
.ft__tricolor {
  position: relative;
  height: 3.5px;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
  overflow: hidden;
}
.ft__tricolor::after {
  content: '';
  position: absolute;
  top: 0; left: -50%;
  width: 35%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent);
  animation: sweep 5s ease-in-out infinite;
}
@keyframes sweep {
  0%        { left: -50%; }
  35%, 100% { left: 150%; }
}

/* ═══════════════════════════════════════════════
   CTA BANNER — Tarjeta Flotante Ejecutiva
   ═══════════════════════════════════════════════ */

.ft-cta {
  position: relative;
  background: radial-gradient(130% 130% at 15% 0%, #0d2860 0%, #081635 55%, #050d22 100%);
  border: 1px solid rgba(56, 189, 248, 0.22);
  border-radius: 20px;
  padding: clamp(28px, 4vw, 40px) clamp(24px, 4vw, 44px);
  margin-bottom: clamp(40px, 5vw, 60px);
  overflow: hidden;
  box-shadow:
    0 24px 60px -15px rgba(0, 30, 90, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
}

.ft-cta:hover {
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow:
    0 30px 75px -15px rgba(0, 56, 168, 0.6),
    0 0 0 1px rgba(56, 189, 248, 0.2),
    inset 0 1px 2px rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.ft-cta__ambient-glow {
  position: absolute;
  top: -80px;
  left: 5%;
  width: 480px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.ft-cta__ambient-gold {
  position: absolute;
  bottom: -60px;
  right: 5%;
  width: 360px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(249, 214, 22, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.ft-cta__road-ribbon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 45%;
  height: 100%;
  pointer-events: none;
  opacity: 0.7;
}

.ft-cta__content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.ft-cta__text {
  max-width: 620px;
}

.ft-cta__title {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.5vw, 28px);
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.ft-cta__gradient {
  background: linear-gradient(135deg, #38bdf8 0%, #60a5fa 50%, #93c5fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.ft-cta__sub {
  font-size: 14.5px;
  color: #94a3c4;
  line-height: 1.55;
  margin: 0 0 16px;
}

.ft-cta__perks {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  font-size: 12.5px;
  font-weight: 500;
  color: #cbd5e1;
}

.ft-cta__perk {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ft-cta__perk-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ft-cta__perk-dot--amber { background: #f9d616; box-shadow: 0 0 6px rgba(249, 214, 22, 0.6); }
.ft-cta__perk-dot--cyan  { background: #38bdf8; box-shadow: 0 0 6px rgba(56, 189, 248, 0.6); }
.ft-cta__perk-dot--green { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.6); }

.ft-cta__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex-shrink: 0;
}

@media (min-width: 900px) {
  .ft-cta__actions {
    align-items: flex-end;
  }
}

.ft-cta__btn-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #ffffff;
  color: #0038A8;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 700;
  padding: 13px 26px;
  border-radius: 12px;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, background 0.2s ease;
}

.ft-cta__btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(56, 189, 248, 0.4), 0 0 20px rgba(255, 255, 255, 0.25);
  background: #f8fafc;
}

.ft-cta__btn-primary:active {
  transform: scale(0.98);
}

.ft-cta__btn-ico {
  color: #0038A8;
  flex-shrink: 0;
}

.ft-cta__btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transform: skewX(-20deg);
  transition: left 0.75s ease;
}

.ft-cta__btn-primary:hover .ft-cta__btn-shine {
  left: 150%;
}

.ft-cta__debt-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3c4;
  text-decoration: none;
  padding: 4px 6px;
  transition: color 0.2s ease;
}

.ft-cta__debt-link:hover {
  color: #f1f5f9;
}

.ft-cta__debt-accent {
  color: #38bdf8;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s ease;
}

.ft-cta__debt-link:hover .ft-cta__debt-accent {
  color: #7dd3fc;
}

/* ═══════════════════════════════════════════════
   CUERPO — Fondo oscuro ejecutivo
   ═══════════════════════════════════════════════ */

.ft__body {
  position: relative;
  background: linear-gradient(175deg, #0d1a32 0%, #122142 50%, #0a1528 100%);
  color: #94a3c4;
}

/* Malla geométrica decorativa */
.ft__mesh {
  position: absolute;
  inset: 0;
  opacity: 0.03;
  background-image:
    linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
}

.ft__container {
  position: relative;
  padding: clamp(36px, 4vw, 52px) 0 clamp(36px, 4vw, 52px);
}

/* Grid: 3 columnas limpias */
.ft__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(32px, 4vw, 48px);
}

@media (min-width: 640px) {
  .ft__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 960px) {
  .ft__grid {
    grid-template-columns: 1.4fr 0.9fr 1.2fr;
    gap: 56px;
  }
}

/* ── Columna: Marca ── */
.ft__brand {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.ft__logo-card {
  display: inline-flex;
  align-self: flex-start;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s ease;
  cursor: pointer;
}

.ft__logo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
}

.ft__logo {
  width: 120px;
  height: auto;
  display: block;
}

.ft__tagline {
  font-size: 13.5px;
  line-height: 1.65;
  color: #7a90b4;
  max-width: 34ch;
  margin: 0;
}

/* Teléfono */
.ft__phone {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px 16px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.ft__phone:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(96,165,250,0.3);
  transform: translateY(-1px);
}

.ft__phone-icon { color: #60a5fa; flex-shrink: 0; }

.ft__phone-num {
  font-family: var(--font-mono, monospace);
  font-size: 13.5px;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: 0.02em;
}

.ft__phone-sub {
  font-size: 12px;
  color: #5a6d8a;
}

/* ── Columna: Navegación ── */
.ft__nav-title {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  color: #5a7099;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0 0 20px;
}

.ft__links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ft__link {
  font-size: 14px;
  color: #94a3c4;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  display: inline-block;
  transition: color 0.2s ease, transform 0.2s var(--ease-out);
}

.ft__link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1.5px;
  background: #60a5fa;
  border-radius: 1px;
  transition: width 0.3s var(--ease-out);
}

.ft__link:hover {
  color: #ffffff;
  transform: translateX(3px);
}

.ft__link:hover::after {
  width: 100%;
}

/* ── Columna: Institucional ── */
.ft__inst {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ft__inst-card {
  background: #ffffff;
  border-radius: 10px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ft__inst-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.ft__inst-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #64748b;
  text-transform: uppercase;
}

.ft__inst-logo {
  width: 140px;
  height: auto;
  display: block;
}

/* ═══════════════════════════════════════════════
   SUB-FOOTER
   ═══════════════════════════════════════════════ */

.ft__sub {
  background: #070e1c;
  border-top: 1px solid rgba(255,255,255,0.04);
  padding: 16px 0;
}

.ft__sub-inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  text-align: center;
  font-size: 11.5px;
  color: #4a5a78;
}

@media (min-width: 900px) {
  .ft__sub-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.ft__copy { color: #4a5a78; }


.ft__country {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #5a6d8a;
  font-weight: 500;
}

.ft__flag {
  width: 15px;
  height: 10px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #F9D616 33.3%, #0038A8 33.3% 66.6%, #CE1126 66.6%);
  box-shadow: 0 0 3px rgba(0,0,0,0.3);
  flex-shrink: 0;
}

/* ═══ Accesibilidad ═══ */
@media (prefers-reduced-motion: reduce) {
  .ft__tricolor::after { animation: none !important; }
}
</style>
