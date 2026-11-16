<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import {
  HOW_IT_WORKS_DIAGRAM,
  type DiagramStep,
} from '../constants/howItWorks.diagram'

// Ilustraciones 3D de alta fidelidad extraídas de la infografía oficial
import heroPlaza from '@/assets/how-it-works/hero-toll-plaza.webp'
import step1Img from '@/assets/how-it-works/step-1-circula.webp'
import step2Img from '@/assets/how-it-works/step-2-identifica.webp'
import step3Img from '@/assets/how-it-works/step-3-calcula.webp'
import step4Img from '@/assets/how-it-works/step-4-verifica.webp'
import step5Img from '@/assets/how-it-works/step-5-deuda.webp'
import step6Img from '@/assets/how-it-works/step-6-cancela.webp'

export default defineComponent({
  name: 'HowItWorksDiagram',
  components: { AppIcon },
  data() {
    return {
      diagram: HOW_IT_WORKS_DIAGRAM,
      heroPlaza,
      stepImages: {
        circula: step1Img,
        identifica: step2Img,
        calcula: step3Img,
        verifica: step4Img,
        deuda: step5Img,
        cancela: step6Img,
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

    <!-- Gran Banner Ilustrado: Pórtico y Autopista Free Flow (Arte oficial de la infografía) -->
    <div class="diagram-hero-banner">
      <img
        :src="heroPlaza"
        alt="Pórtico Free Flow de telepeaje VenVías con vehículos circulando en autopista"
        class="diagram-hero-banner__img"
      />
      <div class="diagram-hero-banner__caption">
        <span class="diagram-hero-banner__tag">TECNOLOGÍA FREE FLOW</span>
        <span class="diagram-hero-banner__title">Pórtico Automatizado · Tránsito Continuo sin Detención</span>
      </div>
    </div>

    <!-- Flujo operativo estructurado en 6 etapas -->
    <div class="diagram-flow">
      <!-- ====================================================================
           PASO 1: CIRCULA POR EL PEAJE
           ==================================================================== -->
      <article class="diagram-card" aria-labelledby="step-circula-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.circula"
            :alt="getStep('circula').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('circula').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('circula').tagLabel }}</span>
          </div>
          <h2 id="step-circula-title" class="diagram-card__title">{{ getStep('circula').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('circula').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('circula').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('circula').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('circula').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 2: SE IDENTIFICA LA PLACA
           ==================================================================== -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-identifica-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.identifica"
            :alt="getStep('identifica').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('identifica').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('identifica').tagLabel }}</span>
          </div>
          <h2 id="step-identifica-title" class="diagram-card__title">{{ getStep('identifica').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('identifica').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('identifica').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('identifica').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('identifica').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 3: SE CALCULA LA TARIFA
           ==================================================================== -->
      <article class="diagram-card" aria-labelledby="step-calcula-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.calcula"
            :alt="getStep('calcula').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('calcula').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('calcula').tagLabel }}</span>
          </div>
          <h2 id="step-calcula-title" class="diagram-card__title">{{ getStep('calcula').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('calcula').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('calcula').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('calcula').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('calcula').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 4: SE VERIFICA EL PAGO
           ==================================================================== -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-verifica-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.verifica"
            :alt="getStep('verifica').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('verifica').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('verifica').tagLabel }}</span>
          </div>
          <h2 id="step-verifica-title" class="diagram-card__title">{{ getStep('verifica').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('verifica').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('verifica').description }}</p>

          <!-- Bifurcación visual -->
          <div class="route-cards">
            <div class="route-card route-card--valid">
              <div class="route-card__header">
                <AppIcon name="check" :size="16" class="text-verde-600 flex-none" />
                <span class="route-card__title">Con pago válido → Cobro realizado</span>
              </div>
              <p class="route-card__desc">Débito automático al instante de la billetera o TAG del vehículo con comprobante digital.</p>
            </div>

            <div class="route-card route-card--debt">
              <div class="route-card__header">
                <AppIcon name="alert" :size="16" class="text-amber-600 flex-none" />
                <span class="route-card__title">Sin pago válido → Se genera una deuda</span>
              </div>
              <p class="route-card__desc">Si el saldo es insuficiente o no hay TAG, se asienta una obligación pendiente.</p>
            </div>
          </div>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('verifica').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 5: SIN PAGO VÁLIDO · SE GENERA UNA DEUDA
           ==================================================================== -->
      <article class="diagram-card" aria-labelledby="step-deuda-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.deuda"
            :alt="getStep('deuda').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num diagram-card__num--debt">{{ getStep('deuda').stepNumber }}</span>
            <span class="diagram-card__tag text-amber-700">{{ getStep('deuda').tagLabel }}</span>
          </div>
          <h2 id="step-deuda-title" class="diagram-card__title">{{ getStep('deuda').title }}</h2>
          <p class="diagram-card__sub text-amber-700">{{ getStep('deuda').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('deuda').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('deuda').bulletPoints" :key="pt">
              <AppIcon name="alert" :size="16" class="text-amber-600 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('deuda').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- ====================================================================
           PASO 6: SE CANCELA EL PENDIENTE
           ==================================================================== -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-cancela-title">
        <div class="diagram-card__media">
          <img
            :src="stepImages.cancela"
            :alt="getStep('cancela').description"
            class="diagram-img"
            loading="lazy"
          />
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('cancela').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('cancela').tagLabel }}</span>
          </div>
          <h2 id="step-cancela-title" class="diagram-card__title">{{ getStep('cancela').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('cancela').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('cancela').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('cancela').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('cancela').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- ====================================================================
         SECCIONES INFORMATIVAS INFERIORES (EXACTAS DE LA INFOGRAFÍA)
         ==================================================================== -->
    <footer class="diagram-footer-grid">
      <!-- Tarjeta 1: ¿Qué incluye y dónde se paga? -->
      <article class="info-card info-card--payment" aria-labelledby="info-payment-title">
        <div class="info-card__header">
          <div class="info-card__icon-wrap">
            <AppIcon name="billetera" :size="24" class="text-azul-700" />
          </div>
          <h3 id="info-payment-title" class="info-card__title">
            {{ diagram.footerCards[0].title }}
          </h3>
        </div>

        <div v-if="diagram.footerCards[0].highlight" class="info-card__formula">
          <span class="info-card__formula-badge">FÓRMULA OFICIAL</span>
          <p class="info-card__formula-text">{{ diagram.footerCards[0].highlight }}</p>
        </div>

        <p
          v-for="p in diagram.footerCards[0].paragraphs"
          :key="p"
          class="info-card__body"
        >
          {{ p }}
        </p>
      </article>

      <!-- Tarjeta 2: Sobre la obligación de pago -->
      <article class="info-card info-card--legal" aria-labelledby="info-legal-title">
        <div class="info-card__header">
          <div class="info-card__icon-wrap">
            <AppIcon name="recibo" :size="24" class="text-azul-700" />
          </div>
          <h3 id="info-legal-title" class="info-card__title">
            {{ diagram.footerCards[1].title }}
          </h3>
        </div>

        <div class="info-card__legal-body">
          <p
            v-for="p in diagram.footerCards[1].paragraphs"
            :key="p"
            class="info-card__body"
          >
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
  max-width: 1080px;
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
  margin-bottom: var(--space-6);
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

/* Gran Banner Ilustrado de la Autopista */
.diagram-hero-banner {
  position: relative;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--borde);
  box-shadow: var(--elev-1);
  margin-bottom: var(--space-8);
  background: #ffffff;
}

.diagram-hero-banner__img {
  width: 100%;
  height: auto;
  max-height: 280px;
  object-fit: cover;
  display: block;
}

.diagram-hero-banner__caption {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--marino-900);
  color: #ffffff;
}

.diagram-hero-banner__tag {
  font: 700 11px / 1 var(--font-mono);
  color: var(--celeste-400);
  letter-spacing: 0.08em;
}

.diagram-hero-banner__title {
  font: 500 13px / 1.4 var(--font-body);
  color: #cbd5e1;
}

/* Flujo de tarjetas operativas */
.diagram-flow {
  display: grid;
  gap: var(--space-8);
}

.diagram-card {
  display: grid;
  gap: var(--space-6);
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 3vw, 36px);
  box-shadow: var(--elev-1);
  align-items: center;
}

@media (min-width: 900px) {
  .diagram-card {
    grid-template-columns: 1fr 1.15fr;
    gap: var(--space-8);
  }

  .diagram-card--reverse {
    grid-template-columns: 1.15fr 1fr;
  }

  .diagram-card--reverse .diagram-card__media {
    order: 2;
  }

  .diagram-card--reverse .diagram-card__content {
    order: 1;
  }
}

.diagram-card__media {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: var(--radius-md);
  padding: clamp(16px, 2.5vw, 24px);
  min-height: 220px;
  border: 1px solid var(--borde);
  box-shadow: inset 0 1px 3px rgba(18, 33, 66, 0.04);
}

.diagram-img {
  max-width: 100%;
  max-height: 210px;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 4px 14px rgba(18, 33, 66, 0.08));
  transition: transform 0.25s ease;
}

.diagram-card:hover .diagram-img {
  transform: scale(1.02);
}

.diagram-card__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

.diagram-card__num {
  font: 700 13px/1 var(--font-mono);
  padding: 4px 8px;
  border-radius: 4px;
  background: var(--marino-900);
  color: #ffffff;
}

.diagram-card__num--debt {
  background: #d97706;
}

.diagram-card__tag {
  font: 600 11px/1 var(--font-mono);
  color: var(--azul-700);
  letter-spacing: 0.06em;
}

.diagram-card__title {
  font: 600 clamp(20px, 1.4vw + 16px, 26px) / 1.25 var(--font-display);
  color: var(--marino-900);
  margin-bottom: var(--space-1);
}

.diagram-card__sub {
  font: 500 15px / 22px var(--font-body);
  color: var(--azul-700);
  margin-bottom: var(--space-3);
}

.diagram-card__desc {
  font: 400 15px / 24px var(--font-body);
  color: var(--texto-suave);
  margin-bottom: var(--space-4);
}

.diagram-card__bullets {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
  display: grid;
  gap: var(--space-2);
}

.diagram-card__bullets li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 20px;
  color: var(--marino-900);
}

.diagram-card__specs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: var(--space-2) var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--borde);
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-item__label {
  font: 500 11px/1.4 var(--font-body);
  color: var(--texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.spec-item__val {
  font: 600 13px/1.4 var(--font-mono);
  color: var(--marino-900);
}

/* Bifurcación en Paso 4 */
.route-cards {
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.route-card {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--borde);
}

.route-card--valid {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.route-card--debt {
  background: #fffbeb;
  border-color: #fde68a;
}

.route-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-1);
}

.route-card__title {
  font: 700 13px / 1.3 var(--font-body);
  color: var(--marino-900);
}

.route-card__desc {
  font-size: 13px;
  line-height: 18px;
  color: var(--texto-suave);
  margin: 0;
}

/* Tarjetas inferiores informativas (¿Qué incluye? / Obligación) */
.diagram-footer-grid {
  display: grid;
  gap: var(--space-6);
  margin-top: var(--space-10);
}

@media (min-width: 768px) {
  .diagram-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }
}

.info-card {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 2.5vw, 32px);
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
  margin-bottom: var(--space-4);
}

.info-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: var(--fondo-frio);
  flex-shrink: 0;
}

.info-card__title {
  font: 700 15px / 1.3 var(--font-display);
  color: var(--marino-900);
  letter-spacing: 0.04em;
  margin: 0;
}

.info-card__formula {
  background: var(--fondo-frio);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.info-card__formula-badge {
  display: inline-block;
  font: 700 10px / 1 var(--font-mono);
  color: var(--azul-700);
  letter-spacing: 0.08em;
  margin-bottom: var(--space-2);
}

.info-card__formula-text {
  font: 700 clamp(15px, 1.2vw + 12px, 18px) / 1.35 var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.info-card__body {
  font-size: 14px;
  line-height: 22px;
  color: var(--texto-suave);
  margin: 0 0 var(--space-3);
}

.info-card__body:last-child {
  margin-bottom: 0;
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
    margin: 10mm 12mm 12mm 12mm;
  }

  body,
  html,
  .how-diagram {
    background: #ffffff !important;
    color: #122142 !important;
    font-size: 9.5pt !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-header {
    margin-bottom: 5mm;
  }

  .print-header__top {
    display: flex;
    justify-content: space-between;
    font: 600 8.5pt/1 var(--font-mono);
    color: #0057a3;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2.5mm;
  }

  .print-header__title {
    font: 700 15pt/1.2 var(--font-display);
    color: #122142;
    margin-bottom: 1.5mm;
  }

  .print-header__sub {
    font: 400 9pt/1.35 var(--font-body);
    color: #4a5670;
  }

  .print-header__divider {
    height: 1.5pt;
    background: #122142;
    margin-top: 2.5mm;
  }

  .diagram-hero-banner {
    border: 1pt solid #cbd5e1 !important;
    margin-bottom: 3.5mm !important;
  }

  .diagram-flow {
    gap: 4mm;
  }

  .diagram-card {
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: none !important;
    border: 1pt solid #cbd5e1 !important;
    padding: 3.5mm 5mm !important;
    margin-bottom: 3.5mm;
    grid-template-columns: 80mm 1fr !important;
  }

  .diagram-card__title {
    font-size: 11.5pt !important;
    color: #122142 !important;
  }

  .diagram-card__sub {
    font-size: 8.5pt !important;
    color: #0057a3 !important;
  }

  .diagram-card__desc {
    font-size: 8pt !important;
    line-height: 1.3 !important;
    color: #2a3242 !important;
  }

  .diagram-card__bullets li {
    font-size: 8pt !important;
    line-height: 1.25 !important;
  }

  .diagram-card__specs {
    border-top: 0.5pt solid #cbd5e1 !important;
    padding-top: 1.5mm !important;
  }

  .spec-item__label {
    font-size: 7pt !important;
  }

  .spec-item__val {
    font-size: 8pt !important;
    color: #122142 !important;
  }

  .diagram-footer-grid {
    page-break-inside: avoid;
    break-inside: avoid;
    margin-top: 4mm !important;
    gap: 4mm !important;
  }

  .info-card {
    box-shadow: none !important;
    border: 1pt solid #cbd5e1 !important;
    padding: 3mm 4mm !important;
  }

  .info-card__title {
    font-size: 9pt !important;
  }

  .info-card__formula-text {
    font-size: 10pt !important;
  }

  .info-card__body {
    font-size: 7.5pt !important;
    line-height: 1.25 !important;
  }
}
</style>
