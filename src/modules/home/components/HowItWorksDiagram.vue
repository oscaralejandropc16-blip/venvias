<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import {
  HOW_IT_WORKS_DIAGRAM,
  type DiagramStep,
} from '../constants/howItWorks.diagram'

// Assets optimizados en formato .webp con fondo transparente para las 3 tarjetas
import carroPaso1 from '@/assets/how-it-works/carro-paso1.webp'
import camaraPaso2 from '@/assets/how-it-works/camara-paso2.webp'
import pagoPaso3 from '@/assets/how-it-works/pago-paso3.webp'

export default defineComponent({
  name: 'HowItWorksDiagram',
  components: { AppIcon },
  data() {
    return {
      diagram: HOW_IT_WORKS_DIAGRAM,
      stepImages: {
        circula: carroPaso1,
        identifica: camaraPaso2,
        cancela: pagoPaso3,
      } as Record<string, string>,
    }
  },
  computed: {
    downloadUrl(): string {
      const base = import.meta.env.BASE_URL ?? '/'
      const cleanBase = base.endsWith('/') ? base : `${base}/`
      const cleanPath = this.diagram.printActions.downloadUrl.replace(/^\//, '')
      return `${cleanBase}${cleanPath}`
    },
  },
  methods: {
    printDocument(): void {
      if (typeof window !== 'undefined') {
        window.print()
      }
    },
    getStep(id: string): DiagramStep {
      return (
        this.diagram.steps.find((s) => s.id === id) ?? this.diagram.steps[0]
      )
    },
  },
})
</script>

<template>
  <div class="how-diagram" role="region" aria-label="Diagrama del flujo de Cobro por Placa">
    <!-- Encabezado formal exclusivo para impresión -->
    <header class="print-only print-header">
      <div class="print-header__top">
        <span class="print-header__org">{{ diagram.printHeader.institution }}</span>
        <span class="print-header__ver">{{ diagram.printHeader.version }}</span>
      </div>
      <h1 class="print-header__title">{{ diagram.printHeader.documentType }}</h1>
      <p class="print-header__sub">{{ diagram.intro }}</p>
      <div class="print-header__divider" />
    </header>

    <!-- Barra de acciones en pantalla (oculta al imprimir) -->
    <div class="how-diagram__actions no-print">
      <div class="how-diagram__note">
        <AppIcon name="info" :size="20" class="text-azul-700 flex-none" />
        <span>{{ diagram.printActions.printNote }}</span>
      </div>
      <div class="how-diagram__buttons">
        <a
          :href="downloadUrl"
          :download="diagram.printActions.downloadFilename"
          class="btn btn--primario how-diagram__download-btn"
          role="button"
          data-testid="diagram-download-btn"
        >
          <AppIcon name="download" :size="18" />
          <span>{{ diagram.printActions.downloadButton }}</span>
        </a>
        <button
          type="button"
          class="btn btn--secundario how-diagram__print-btn"
          data-testid="diagram-print-btn"
          @click="printDocument"
        >
          <AppIcon name="impresora" :size="18" />
          <span>{{ diagram.printActions.printButton }}</span>
        </button>
      </div>
    </div>

    <!-- Estructura híbrida: 3 tarjetas en Grid Horizontal -->
    <div class="diagram-grid" role="list">
      <!-- ====================================================================
           PASO 1: CIRCULA POR EL PEAJE
           ==================================================================== -->
      <article
        class="diagram-card"
        role="listitem"
        aria-labelledby="step-circula-title"
      >
        <header class="diagram-card__header">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">01</span>
            <span class="diagram-card__tag">PASO 1 · FREE FLOW</span>
          </div>
          <h2 id="step-circula-title" class="diagram-card__title">
            {{ getStep('circula').title }}
          </h2>
          <p class="diagram-card__sub">{{ getStep('circula').subtitle }}</p>
        </header>

        <!-- Contenedor visual: Letrero superior + Imagen + Letrero inferior -->
        <div class="diagram-card__visual">
          <!-- Letrero de pórtico vial (HTML + Tailwind) -->
          <div class="toll-sign" aria-hidden="true">
            <div class="toll-sign__top">
              <span class="toll-sign__brand">TELEPEAJE</span>
              <span class="toll-sign__pill">FREE FLOW</span>
            </div>
            <div class="toll-sign__bottom">
              <span class="toll-sign__status">
                <span class="toll-sign__dot"></span>
                CARRIL HABILITADO
              </span>
              <span class="toll-sign__lane">↓ LIBRE</span>
            </div>
          </div>

          <!-- Imagen con loading="lazy" y ancho responsivo w-full max-w-[280px] -->
          <div class="diagram-card__img-box">
            <img
              :src="stepImages.circula"
              :alt="getStep('circula').imageAlt ?? getStep('circula').title"
              loading="lazy"
              class="w-full max-w-[280px] h-auto max-h-[140px] object-contain mx-auto"
            />
          </div>

          <!-- Letrero inferior de circulación continua (HTML + Tailwind) -->
          <div class="traffic-indicator" aria-hidden="true">
            <span class="traffic-indicator__label">
              <AppIcon name="carro" :size="14" class="text-azul-700" />
              VELOCIDAD CONTROLADA:
            </span>
            <span class="traffic-indicator__val">HASTA 80 KM/H</span>
          </div>
        </div>

        <!-- Cuerpo informativo de la tarjeta -->
        <div class="diagram-card__body">
          <p class="diagram-card__desc">{{ getStep('circula').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('circula').bulletPoints" :key="pt">
              <AppIcon name="check" :size="14" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div
              v-for="spec in getStep('circula').technicalData"
              :key="spec.label"
              class="spec-item"
            >
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 2: SE IDENTIFICA LA PLACA
           ==================================================================== -->
      <article
        class="diagram-card"
        role="listitem"
        aria-labelledby="step-identifica-title"
      >
        <header class="diagram-card__header">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">02</span>
            <span class="diagram-card__tag">PASO 2 · LECTURA ALPR</span>
          </div>
          <h2 id="step-identifica-title" class="diagram-card__title">
            {{ getStep('identifica').title }}
          </h2>
          <p class="diagram-card__sub">{{ getStep('identifica').subtitle }}</p>
        </header>

        <!-- Contenedor visual: Sensor ALPR + Imagen + Placa venezolana HTML -->
        <div class="diagram-card__visual">
          <!-- Letrero superior de monitoreo ALPR (HTML + Tailwind) -->
          <div class="alpr-sign" aria-hidden="true">
            <div class="alpr-sign__top">
              <span class="alpr-sign__title">
                <span class="alpr-sign__ping"></span>
                ESCÁNER ALPR 360°
              </span>
              <span class="alpr-sign__tag">LÁSER + OCR</span>
            </div>
            <div class="alpr-sign__bottom">
              <span>DETECCIÓN VEHICULAR</span>
              <span class="alpr-sign__status">ACTIVO diurno/infrarrojo</span>
            </div>
          </div>

          <!-- Imagen con loading="lazy" y ancho responsivo w-full max-w-[280px] -->
          <div class="diagram-card__img-box">
            <img
              :src="stepImages.identifica"
              :alt="getStep('identifica').imageAlt ?? getStep('identifica').title"
              loading="lazy"
              class="w-full max-w-[280px] h-auto max-h-[140px] object-contain mx-auto"
            />
          </div>

          <!-- Placa Venezolana 100% HTML + Tailwind con formato oficial (A B 1 2 3 C D) -->
          <div class="plate-box" aria-label="Placa venezolana identificada: AA 123 BB">
            <div class="ven-plate">
              <div class="ven-plate__header">
                <div class="ven-plate__flag" aria-hidden="true">
                  <span class="flag-yellow"></span>
                  <span class="flag-blue"></span>
                  <span class="flag-red"></span>
                </div>
                <span class="ven-plate__country">VENEZUELA</span>
              </div>
              <div class="ven-plate__number" aria-hidden="true">AA 123 BB</div>
            </div>
            <div class="plate-audit">
              <AppIcon name="check" :size="12" class="text-emerald-600 flex-none" />
              <span>MATRÍCULA AUDITADA · 99.8% CERTEZA</span>
            </div>
          </div>
        </div>

        <!-- Cuerpo informativo de la tarjeta -->
        <div class="diagram-card__body">
          <p class="diagram-card__desc">{{ getStep('identifica').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('identifica').bulletPoints" :key="pt">
              <AppIcon name="check" :size="14" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div
              v-for="spec in getStep('identifica').technicalData"
              :key="spec.label"
              class="spec-item"
            >
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 3: CONCILIACIÓN Y PAGO
           ==================================================================== -->
      <article
        class="diagram-card"
        role="listitem"
        aria-labelledby="step-cancela-title"
      >
        <header class="diagram-card__header">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">03</span>
            <span class="diagram-card__tag">PASO 3 · LIQUIDACIÓN</span>
          </div>
          <h2 id="step-cancela-title" class="diagram-card__title">
            {{ getStep('cancela').title }}
          </h2>
          <p class="diagram-card__sub">{{ getStep('cancela').subtitle }}</p>
        </header>

        <!-- Contenedor visual: Letrero de tarifa + Imagen + Indicador de débito/deuda -->
        <div class="diagram-card__visual">
          <!-- Letrero superior de tarifa (HTML + Tailwind) -->
          <div class="toll-sign" aria-hidden="true">
            <div class="toll-sign__top">
              <span class="toll-sign__brand">LIQUIDACIÓN DE PEAJE</span>
              <span class="toll-sign__pill-green">EN LÍNEA</span>
            </div>
            <div class="toll-sign__bottom">
              <span>TASA OFICIAL VIGENTE</span>
              <span class="font-mono text-cyan-300 font-bold">CONCILIACIÓN INMEDIATA</span>
            </div>
          </div>

          <!-- Imagen con loading="lazy" y ancho responsivo w-full max-w-[280px] -->
          <div class="diagram-card__img-box">
            <img
              :src="stepImages.cancela"
              :alt="getStep('cancela').imageAlt ?? getStep('cancela').title"
              loading="lazy"
              class="w-full max-w-[280px] h-auto max-h-[140px] object-contain mx-auto"
            />
          </div>

          <!-- Indicador dual inferior: Con saldo / Sin saldo (HTML + Tailwind) -->
          <div class="dual-status-grid" aria-hidden="true">
            <div class="status-cell status-cell--paid">
              <span class="status-cell__title">CON SALDO</span>
              <span class="status-cell__desc">Débito automático</span>
            </div>
            <div class="status-cell status-cell--debt">
              <span class="status-cell__title">SIN SALDO</span>
              <span class="status-cell__desc">Saldo deudor web</span>
            </div>
          </div>
        </div>

        <!-- Cuerpo informativo de la tarjeta -->
        <div class="diagram-card__body">
          <p class="diagram-card__desc">{{ getStep('cancela').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('cancela').bulletPoints" :key="pt">
              <AppIcon name="check" :size="14" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div
              v-for="spec in getStep('cancela').technicalData"
              :key="spec.label"
              class="spec-item"
            >
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Tarjetas inferiores informativas (¿Qué incluye? / Obligación) -->
    <footer class="diagram-footer-grid" aria-label="Información complementaria de recaudación">
      <article
        v-for="card in diagram.footerCards"
        :key="card.id"
        class="info-card"
        :class="card.id === 'include-and-pay' ? 'info-card--payment' : 'info-card--legal'"
      >
        <div class="info-card__header">
          <div class="info-card__icon-wrap">
            <AppIcon :name="card.icon as any" :size="24" class="text-azul-700" />
          </div>
          <h3 class="info-card__title">{{ card.title }}</h3>
        </div>

        <div v-if="card.highlight" class="info-card__formula">
          <span class="info-card__formula-badge">REGLA OFICIAL DE COBRO</span>
          <p class="info-card__formula-text">{{ card.highlight }}</p>
        </div>

        <div class="info-card__body">
          <p v-for="(p, i) in card.paragraphs" :key="i" class="info-card__p">
            {{ p }}
          </p>
        </div>
      </article>
    </footer>
  </div>
</template>

<style scoped>
.how-diagram {
  width: 100%;
  max-width: 1140px;
  margin-inline: auto;
}

/* Acciones en pantalla */
.how-diagram__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--fondo-frio);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-8);
}

.how-diagram__note {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 14px;
  color: var(--texto-suave);
  max-width: 52ch;
}

.how-diagram__buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.how-diagram__download-btn,
.how-diagram__print-btn {
  flex-shrink: 0;
  min-height: 44px;
  padding: 11px 22px;
  font-size: 14px;
}

.how-diagram__download-btn {
  text-decoration: none;
}

/* Grid Horizontal de 3 Tarjetas */
.diagram-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 860px) {
  .diagram-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}

/* Tarjeta de Paso */
.diagram-card {
  display: flex;
  flex-direction: column;
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--elev-1);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.diagram-card:hover {
  box-shadow: var(--elev-2);
  border-color: #cbd5e1;
}

.diagram-card__header {
  padding: var(--space-5) var(--space-5) var(--space-3);
}

.diagram-card__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.diagram-card__num {
  font: 700 12px/1 var(--font-mono);
  padding: 3px 7px;
  border-radius: 4px;
  background: var(--marino-900);
  color: #ffffff;
}

.diagram-card__tag {
  font: 700 10px/1 var(--font-mono);
  color: var(--azul-700);
  letter-spacing: 0.08em;
}

.diagram-card__title {
  font: 700 20px / 1.25 var(--font-display);
  color: var(--marino-900);
  margin-bottom: var(--space-1);
}

.diagram-card__sub {
  font: 500 13px / 1.35 var(--font-body);
  color: var(--azul-700);
}

/* Marco Visual */
.diagram-card__visual {
  background: #f8fafc;
  border-block: 1px solid var(--borde);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 250px;
}

.diagram-card__img-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) 0;
}

.diagram-card__img-box img {
  filter: drop-shadow(0 4px 10px rgba(18, 33, 66, 0.08));
  transition: transform 0.3s ease;
}

.diagram-card:hover .diagram-card__img-box img {
  transform: scale(1.04);
}

/* ==========================================================================
   ELEMENTOS TEXTUALES CONSTRUIDOS EN HTML / TAILWIND (Por encima/debajo)
   ========================================================================== */

/* Letrero de Pórtico Vial de Telepeaje */
.toll-sign {
  width: 100%;
  max-width: 280px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid rgba(18, 33, 66, 0.2);
  box-shadow: 0 1px 3px rgba(18, 33, 66, 0.08);
  margin-bottom: var(--space-2);
}

.toll-sign__top {
  background: var(--azul-700);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.toll-sign__brand {
  font: 700 11px/1 var(--font-mono);
  letter-spacing: 0.08em;
}

.toll-sign__pill {
  background: #f59e0b;
  color: #122142;
  font: 800 9px/1 var(--font-mono);
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.06em;
}

.toll-sign__pill-green {
  background: #10b981;
  color: #ffffff;
  font: 800 9px/1 var(--font-mono);
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.06em;
}

.toll-sign__bottom {
  background: var(--marino-900);
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #cbd5e1;
}

.toll-sign__status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.toll-sign__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 6px #34d399;
}

.toll-sign__lane {
  font: 700 10px/1 var(--font-mono);
  color: #34d399;
}

/* Indicador de Velocidad */
.traffic-indicator {
  width: 100%;
  max-width: 280px;
  margin-top: var(--space-2);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
}

.traffic-indicator__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: #1e3a8a;
}

.traffic-indicator__val {
  font: 700 10.5px/1 var(--font-mono);
  color: var(--azul-700);
  background: #ffffff;
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid #bfdbfe;
  white-space: nowrap;
  flex-shrink: 0;
}

/* Letrero Escáner ALPR */
.alpr-sign {
  width: 100%;
  max-width: 280px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid rgba(18, 33, 66, 0.2);
  box-shadow: 0 1px 3px rgba(18, 33, 66, 0.08);
  margin-bottom: var(--space-2);
}

.alpr-sign__top {
  background: var(--marino-900);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
}

.alpr-sign__title {
  display: flex;
  align-items: center;
  gap: 6px;
  font: 700 11px/1 var(--font-mono);
  letter-spacing: 0.08em;
}

.alpr-sign__ping {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
}

.alpr-sign__tag {
  color: #7dd3fc;
  font: 700 9px/1 var(--font-mono);
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 2px 6px;
  border-radius: 3px;
}

.alpr-sign__bottom {
  background: #1e293b;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #94a3b8;
}

.alpr-sign__status {
  font: 600 10px/1 var(--font-mono);
  color: #34d399;
}

/* Placa Venezolana HTML Oficial */
.plate-box {
  width: 100%;
  max-width: 280px;
  margin-top: var(--space-2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ven-plate {
  width: 100%;
  background: #ffffff;
  border: 2px solid #0f172a;
  border-radius: 6px;
  padding: 4px 10px 5px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.12);
}

.ven-plate__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-bottom: 1px solid rgba(0, 36, 125, 0.2);
  padding-bottom: 2px;
  margin-bottom: 3px;
}

.ven-plate__flag {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 14px;
}

.flag-yellow { height: 2px; background: #ffcc00; }
.flag-blue   { height: 2px; background: #00247d; }
.flag-red    { height: 2px; background: #cf142b; }

.ven-plate__country {
  font: 800 8px/1 var(--font-sans, system-ui);
  letter-spacing: 0.15em;
  color: #00247d;
  text-transform: uppercase;
}

.ven-plate__number {
  font: 900 19px/1 var(--font-mono);
  letter-spacing: 0.24em;
  color: #0f172a;
}

.plate-audit {
  display: flex;
  align-items: center;
  gap: 4px;
  font: 600 10px/1 var(--font-mono);
  color: #065f46;
}

/* Celdas Duales de Liquidación */
.dual-status-grid {
  width: 100%;
  max-width: 280px;
  margin-top: var(--space-2);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.status-cell {
  padding: 5px 8px;
  border-radius: var(--radius-sm);
  text-align: center;
  border: 1px solid transparent;
}

.status-cell--paid {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.status-cell--paid .status-cell__title {
  color: #065f46;
}

.status-cell--paid .status-cell__desc {
  color: #047857;
}

.status-cell--debt {
  background: #fffbeb;
  border-color: #fde68a;
}

.status-cell--debt .status-cell__title {
  color: #92400e;
}

.status-cell--debt .status-cell__desc {
  color: #b45309;
}

.status-cell__title {
  display: block;
  font: 700 10px/1.2 var(--font-mono);
}

.status-cell__desc {
  display: block;
  font-size: 9px;
  margin-top: 2px;
}

/* Cuerpo de la Tarjeta */
.diagram-card__body {
  padding: var(--space-4) var(--space-5) var(--space-5);
  display: flex;
  flex-direction: column;
  flex: 1;
}

.diagram-card__desc {
  font-size: 13.5px;
  line-height: 20px;
  color: var(--texto-suave);
  margin-bottom: var(--space-4);
}

.diagram-card__bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-4);
  display: grid;
  gap: var(--space-2);
}

.diagram-card__bullets li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12.5px;
  line-height: 18px;
  color: var(--marino-900);
}

.diagram-card__specs {
  margin-top: auto;
  padding-top: var(--space-3);
  border-top: 1px solid var(--borde);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-item__label {
  font: 600 9.5px/1.3 var(--font-body);
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.spec-item__val {
  font: 700 11px/1.3 var(--font-mono);
  color: var(--marino-900);
  word-break: break-word;
}

/* Tarjetas Inferiores */
.diagram-footer-grid {
  display: grid;
  gap: var(--space-6);
  margin-top: var(--space-8);
}

@media (min-width: 768px) {
  .diagram-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

.info-card {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-lg);
  padding: clamp(18px, 2.5vw, 26px);
  box-shadow: var(--elev-1);
}

.info-card--payment {
  border-top: 4px solid var(--azul-700);
}

.info-card--legal {
  border-top: 4px solid var(--marino-900);
}

.info-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.info-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--fondo-frio);
  flex-shrink: 0;
}

.info-card__title {
  font: 700 14px / 1.3 var(--font-display);
  color: var(--marino-900);
  letter-spacing: 0.04em;
  margin: 0;
}

.info-card__formula {
  background: var(--fondo-frio);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-3);
}

.info-card__formula-badge {
  display: inline-block;
  font: 700 9px / 1 var(--font-mono);
  color: var(--azul-700);
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.info-card__formula-text {
  font: 700 15px / 1.35 var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.info-card__body {
  display: grid;
  gap: var(--space-2);
}

.info-card__p {
  font-size: 13px;
  line-height: 19px;
  color: var(--texto-suave);
  margin: 0;
}

/* Estilos exclusivos para pantalla */
.print-only {
  display: none;
}

/* ==========================================================================
   SOPORTE @media print: FORMATO FICHA TÉCNICA A4 / CARTA
   ========================================================================== */
@media print {
  .no-print,
  :deep(.nav),
  :deep(.footer),
  :deep(header.nav),
  :deep(footer) {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }

  body,
  html,
  .how-diagram {
    background: #ffffff !important;
    color: #122142 !important;
    font-size: 9pt !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-header {
    margin-bottom: 4mm;
  }

  .print-header__top {
    display: flex;
    justify-content: space-between;
    font: 600 8pt/1 var(--font-mono);
    color: #0057a3;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2mm;
  }

  .print-header__title {
    font: 700 14pt/1.2 var(--font-display);
    color: #122142;
    margin-bottom: 1.5mm;
  }

  .print-header__sub {
    font: 400 8.5pt/1.3 var(--font-body);
    color: #4a5670;
  }

  .print-header__divider {
    height: 1.5pt;
    background: #122142;
    margin-top: 2mm;
  }

  .diagram-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 3mm !important;
  }

  .diagram-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    border: 1pt solid #94a3b8 !important;
    padding: 2mm !important;
    border-radius: 4px !important;
  }

  .diagram-card__header {
    padding: 2mm 2mm 1mm !important;
  }

  .diagram-card__title {
    font-size: 10pt !important;
    color: #122142 !important;
  }

  .diagram-card__sub {
    font-size: 8pt !important;
    color: #0057a3 !important;
  }

  .diagram-card__visual {
    background: #f8fafc !important;
    border: 0.5pt solid #cbd5e1 !important;
    padding: 2mm !important;
    min-height: auto !important;
  }

  .toll-sign,
  .alpr-sign,
  .traffic-indicator,
  .plate-box,
  .dual-status-grid {
    max-width: 100% !important;
  }

  .diagram-card__img-box img {
    max-height: 80px !important;
  }

  .diagram-card__body {
    padding: 2mm !important;
  }

  .diagram-card__desc {
    font-size: 7.5pt !important;
    line-height: 1.25 !important;
    margin-bottom: 2mm !important;
  }

  .diagram-card__bullets {
    gap: 1mm !important;
    margin-bottom: 2mm !important;
  }

  .diagram-card__bullets li {
    font-size: 7.5pt !important;
    line-height: 1.2 !important;
  }

  .diagram-card__specs {
    border-top: 0.5pt solid #cbd5e1 !important;
    padding-top: 1.5mm !important;
  }

  .spec-item__label {
    font-size: 6.5pt !important;
  }

  .spec-item__val {
    font-size: 7.5pt !important;
    color: #122142 !important;
  }

  .diagram-footer-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 3mm !important;
    margin-top: 3mm !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .info-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    border: 1pt solid #94a3b8 !important;
    padding: 2.5mm !important;
  }

  .info-card__title {
    font-size: 9pt !important;
  }

  .info-card__formula-text {
    font-size: 9pt !important;
  }

  .info-card__p {
    font-size: 7.5pt !important;
    line-height: 1.2 !important;
  }
}
</style>
