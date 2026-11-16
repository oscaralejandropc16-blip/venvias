<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import {
  HOW_IT_WORKS_DIAGRAM,
  type DiagramStep,
} from '../constants/howItWorks.diagram'

// Ilustraciones de alta fidelidad para las 6 etapas del flujo oficial
import step1Img from '@/assets/how-it-works/step-1-circula.webp'
import step2Img from '@/assets/how-it-works/step-2-identifica.webp'
import step3Img from '@/assets/how-it-works/step-3-calcula.webp'
import step4Img from '@/assets/how-it-works/step-4-verifica.webp'
import step5Img from '@/assets/how-it-works/step-5-deuda.webp'
import step6Img from '@/assets/how-it-works/step-6-cancela.webp'

export default defineComponent({
  name: 'HowItWorksDiagram',
  components: { AppIcon, RouterLink },
  data() {
    return {
      diagram: HOW_IT_WORKS_DIAGRAM,
      routeNames: ROUTE_NAMES,
      stepImages: {
        circula: step1Img,
        identifica: step2Img,
        calcula: step3Img,
        verifica: step4Img,
        deuda: step5Img,
        cancela: step6Img,
        // Alias de compatibilidad
        freeFlow: step1Img,
        alpr: step2Img,
        payment: step4Img,
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

    <!-- Grid con las 6 Etapas Oficiales del Flujo de Cobro por Placa -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 diagram-print-grid">
      <article
        v-for="step in diagram.steps"
        :key="step.id"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col diagram-print-card"
        :class="{ 'border-amber-300 ring-1 ring-amber-200': step.id === 'deuda' }"
      >
        <!-- Marco de ilustración optimizado con loading="lazy" -->
        <div class="p-6 bg-slate-50 flex justify-center items-center min-h-[200px]">
          <img
            :src="stepImages[step.id]"
            :alt="step.imageAlt ?? step.title"
            loading="lazy"
            class="w-full max-w-[280px] h-auto object-contain drop-shadow-md"
          />
        </div>

        <!-- Contenido textual estructurado y limpio -->
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-center gap-2 mb-2">
            <span
              class="font-mono text-xs font-bold px-2 py-0.5 rounded text-white"
              :class="step.id === 'deuda' ? 'bg-amber-600' : 'bg-marino-900'"
            >
              {{ step.stepNumber }}
            </span>
            <span
              class="font-mono text-[11px] font-semibold tracking-wider uppercase"
              :class="step.id === 'deuda' ? 'text-amber-800' : 'text-azul-700'"
            >
              {{ step.tagLabel }}
            </span>
          </div>

          <h3 class="text-xl font-bold text-marino-900 mb-2">{{ step.title }}</h3>
          <p class="text-slate-600 text-sm mb-4 leading-relaxed">{{ step.subtitle }}</p>

          <ul class="space-y-2 text-sm text-slate-700 mb-4">
            <li v-for="pt in step.bulletPoints" :key="pt" class="flex items-start gap-2">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <!-- Acciones directas para agilizar la gestión del usuario -->
          <div v-if="step.id === 'verifica'" class="mt-auto pt-3 no-print">
            <RouterLink
              :to="{ name: routeNames.recharge }"
              class="btn btn--primario btn--sm inline-flex items-center gap-1.5"
            >
              <AppIcon name="rayo" :size="14" />
              <span>Recargar placa</span>
            </RouterLink>
          </div>

          <div v-else-if="step.id === 'deuda'" class="mt-auto pt-3 no-print">
            <RouterLink
              :to="{ name: routeNames.debt }"
              class="btn btn--secundario btn--sm inline-flex items-center gap-1.5 border-amber-300 text-amber-900 hover:bg-amber-50"
            >
              <AppIcon name="recibo" :size="14" />
              <span>Consultar / Pagar deuda</span>
            </RouterLink>
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
    font-size: 8.5pt !important;
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
    font: 600 7.5pt/1 var(--font-mono);
    color: #0057a3;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 2mm;
  }

  .print-header__title {
    font: 700 13pt/1.2 var(--font-display);
    color: #122142;
    margin-bottom: 1.5mm;
  }

  .print-header__sub {
    font: 400 8pt/1.3 var(--font-body);
    color: #4a5670;
  }

  .print-header__divider {
    height: 1.5pt;
    background: #122142;
    margin-top: 2mm;
  }

  .diagram-print-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 3mm !important;
  }

  .diagram-print-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    box-shadow: none !important;
    border: 1pt solid #94a3b8 !important;
  }

  .diagram-print-card img {
    max-height: 80px !important;
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
}
</style>
