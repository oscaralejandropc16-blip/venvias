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
        freeFlow: carroPaso1,
        alpr: camaraPaso2,
        payment: pagoPaso3,
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

    <!-- Grid Horizontal de 3 Tarjetas (Estructura Limpia) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 diagram-print-grid">
      <!-- Tarjeta 1: Free Flow -->
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col diagram-print-card">
        <div class="p-6 bg-slate-50 flex justify-center items-center min-h-[200px]">
          <img
            :src="stepImages.freeFlow"
            alt="Circula por el peaje"
            loading="lazy"
            class="w-full max-w-[280px] h-auto object-contain drop-shadow-md"
          />
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-marino-900 mb-2">Circula por el peaje</h3>
          <p class="text-slate-600 mb-4">Tránsito libre y continuo por pórtico Free Flow sin detener la marcha.</p>
          <ul class="space-y-2 text-sm text-slate-700">
            <li v-for="pt in getStep('circula').bulletPoints" :key="pt" class="flex items-start gap-2">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>
        </div>
      </article>

      <!-- Tarjeta 2: ALPR -->
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col diagram-print-card">
        <div class="p-6 bg-slate-50 flex justify-center items-center min-h-[200px]">
          <img
            :src="stepImages.alpr"
            alt="Se identifica la placa"
            loading="lazy"
            class="w-full max-w-[280px] h-auto object-contain drop-shadow-md"
          />
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-marino-900 mb-2">Se identifica la placa</h3>
          <p class="text-slate-600 mb-4">Reconocimiento óptico instantáneo mediante cámaras de alta velocidad.</p>
          <ul class="space-y-2 text-sm text-slate-700">
            <li v-for="pt in getStep('identifica').bulletPoints" :key="pt" class="flex items-start gap-2">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>
        </div>
      </article>

      <!-- Tarjeta 3: Liquidación -->
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col diagram-print-card">
        <div class="p-6 bg-slate-50 flex justify-center items-center min-h-[200px]">
          <img
            :src="stepImages.payment"
            alt="Conciliación y pago"
            loading="lazy"
            class="w-full max-w-[280px] h-auto object-contain drop-shadow-md"
          />
        </div>
        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-xl font-bold text-marino-900 mb-2">Conciliación y pago</h3>
          <p class="text-slate-600 mb-4">Débito automático del saldo de tu placa o registro de saldo deudor.</p>
          <ul class="space-y-2 text-sm text-slate-700">
            <li v-for="pt in getStep('cancela').bulletPoints" :key="pt" class="flex items-start gap-2">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none mt-0.5" />
              <span>{{ pt }}</span>
            </li>
          </ul>
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
    max-height: 90px !important;
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
