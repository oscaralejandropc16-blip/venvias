<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { HOW_IT_WORKS_DIAGRAM, type DiagramStep } from '../constants/howItWorks.diagram'

export default defineComponent({
  name: 'HowItWorksDiagram',
  components: { AppIcon },
  data() {
    return {
      diagram: HOW_IT_WORKS_DIAGRAM,
    }
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
  <div class="how-diagram" role="region" aria-label="Diagrama técnico del flujo operativo">
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
        <AppIcon name="info" :size="20" class="text-azul-700" />
        <span>{{ diagram.printActions.printNote }}</span>
      </div>
      <button
        type="button"
        class="btn btn--primario how-diagram__print-btn"
        @click="printDocument"
      >
        <AppIcon name="recibo" :size="18" />
        <span>{{ diagram.printActions.printButton }}</span>
      </button>
    </div>

    <!-- Flujo operativo estructurado -->
    <div class="diagram-flow">
      <!-- PASO 1: PÓRTICO FREE FLOW -->
      <article class="diagram-card" aria-labelledby="step-gantry-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustración técnica de pórtico Free Flow con vehículo en calzada"
          >
            <!-- Fondo calzada neutro -->
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Calzada de autopista en perspectiva suave -->
            <polygon points="40,240 500,240 460,130 80,130" fill="#E1E8F0" />
            <polygon points="120,240 420,240 380,130 160,130" fill="#CBD5E1" />

            <!-- Líneas de carril segmentadas -->
            <line x1="270" y1="130" x2="270" y2="160" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 6" />
            <line x1="270" y1="175" x2="270" y2="240" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10" />

            <!-- Estructura del Pórtico Metálico Free Flow -->
            <!-- Columna Izquierda -->
            <rect x="50" y="60" width="16" height="180" rx="2" fill="#122142" />
            <line x1="58" y1="70" x2="58" y2="230" stroke="#0057A3" stroke-width="2" />
            <polygon points="42,240 74,240 66,220 50,220" fill="#122142" />

            <!-- Columna Derecha -->
            <rect x="474" y="60" width="16" height="180" rx="2" fill="#122142" />
            <line x1="482" y1="70" x2="482" y2="230" stroke="#0057A3" stroke-width="2" />
            <polygon points="466,240 498,240 490,220 474,220" fill="#122142" />

            <!-- Viga transversal superior en celosía -->
            <rect x="46" y="50" width="448" height="24" rx="3" fill="#122142" />
            <line x1="56" y1="56" x2="484" y2="56" stroke="#5FA8E8" stroke-width="1.5" stroke-dasharray="8 4" />
            <line x1="56" y1="68" x2="484" y2="68" stroke="#0057A3" stroke-width="1.5" />

            <!-- Antenas y Sensores LiDAR de Telepeaje -->
            <rect x="180" y="74" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="194" cy="94" r="3" fill="#5FA8E8" />
            <rect x="256" y="74" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="270" cy="94" r="3" fill="#5FA8E8" />
            <rect x="332" y="74" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="346" cy="94" r="3" fill="#5FA8E8" />

            <!-- Haces de detección óptica y radiofrecuencia (Láser LiDAR) -->
            <polygon points="194,97 120,220 220,220" fill="url(#laserGrad)" opacity="0.45" />
            <polygon points="270,97 210,230 330,230" fill="url(#laserGrad)" opacity="0.65" />
            <polygon points="346,97 320,220 420,220" fill="url(#laserGrad)" opacity="0.45" />

            <!-- Vehículo cruzando el pórtico -->
            <g transform="translate(220, 160)">
              <!-- Sombra del vehículo -->
              <ellipse cx="50" cy="54" rx="46" ry="8" fill="rgba(18,33,66,0.25)" />
              <!-- Chasis y carrocería -->
              <path d="M14 36 L24 16 L76 16 L86 36 L94 40 L94 48 L6 48 L6 40 Z" fill="#122142" />
              <!-- Parabrisas y ventanas -->
              <polygon points="28,34 72,34 66,20 34,20" fill="#5FA8E8" opacity="0.85" />
              <!-- Faros delanteros -->
              <rect x="10" y="40" width="12" height="6" rx="2" fill="#FFFFFF" />
              <rect x="78" y="40" width="12" height="6" rx="2" fill="#FFFFFF" />
              <!-- Matrícula delantera en miniatura -->
              <rect x="35" y="42" width="30" height="9" rx="1.5" fill="#FFFFFF" stroke="#0057A3" stroke-width="1" />
              <line x1="39" y1="46.5" x2="61" y2="46.5" stroke="#122142" stroke-width="2" stroke-dasharray="2 1" />
              <!-- Neumáticos -->
              <rect x="8" y="44" width="14" height="12" rx="2" fill="#0A1122" />
              <rect x="78" y="44" width="14" height="12" rx="2" fill="#0A1122" />
            </g>

            <!-- Señalética institucional y telemetría de paso -->
            <rect x="68" y="24" width="108" height="20" rx="3" fill="#122142" />
            <text x="76" y="38" fill="#5FA8E8" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="600">FREE FLOW · 80 km/h</text>
            <circle cx="166" cy="34" r="3" fill="#00B140" />

            <!-- Definición de degradados -->
            <defs>
              <linearGradient id="laserGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0057A3" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#5FA8E8" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#5FA8E8" stop-opacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('gantry').stepNumber }}</span>
            <span class="diagram-card__tag">ETAPA DE DETECCIÓN</span>
          </div>
          <h2 id="step-gantry-title" class="diagram-card__title">{{ getStep('gantry').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('gantry').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('gantry').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('gantry').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('gantry').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- PASO 2: CÁMARA ALPR -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-alpr-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustración técnica de cámara ALPR reconociendo placa vehicular venezolana"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Brazo mecánico articulado de la cámara -->
            <rect x="40" y="30" width="14" height="90" fill="#122142" rx="2" />
            <line x1="47" y1="30" x2="110" y2="70" stroke="#122142" stroke-width="8" stroke-linecap="round" />
            <circle cx="110" cy="70" r="10" fill="#0057A3" />

            <!-- Cuerpo de Cámara ALPR Profesional -->
            <rect x="110" y="52" width="76" height="38" rx="4" fill="#122142" />
            <!-- Parasol de cámara -->
            <polygon points="106,48 196,48 186,52 110,52" fill="#0A1122" />
            <!-- Lente dual e iluminador IR estroboscópico -->
            <rect x="186" y="56" width="10" height="30" rx="2" fill="#0057A3" />
            <circle cx="191" cy="65" r="4" fill="#5FA8E8" />
            <circle cx="191" cy="77" r="3" fill="#CF142B" />

            <!-- Haz de captura ALPR en abanico hacia la placa -->
            <polygon points="196,65 490,90 490,230 196,80" fill="url(#alprBeamGrad)" opacity="0.4" />

            <!-- Enfoque y Placa Venezolana escaneada -->
            <g transform="translate(240, 110)">
              <!-- Caja de encuadre ALPR / Bounding Box de OCR -->
              <rect x="0" y="0" width="260" height="120" rx="6" fill="#FFFFFF" stroke="#0057A3" stroke-width="2" />

              <!-- Esquinas / Retícula de captura biométrica ALPR -->
              <path d="M-6 10 L-6 -6 L10 -6" stroke="#5FA8E8" stroke-width="3" fill="none" />
              <path d="M266 10 L266 -6 L250 -6" stroke="#5FA8E8" stroke-width="3" fill="none" />
              <path d="M-6 110 L-6 126 L10 126" stroke="#5FA8E8" stroke-width="3" fill="none" />
              <path d="M266 110 L266 126 L250 126" stroke="#5FA8E8" stroke-width="3" fill="none" />

              <!-- Encabezado de la placa (Venezuela) -->
              <rect x="14" y="10" width="232" height="16" fill="#122142" rx="2" />
              <text x="130" y="22" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="3">VENEZUELA</text>

              <!-- Las 7 casillas del formato oficial venezolano (AB 123 CD) -->
              <g transform="translate(18, 36)">
                <!-- Letras 1 y 2 -->
                <rect x="0" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="14" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">A</text>
                <rect x="32" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="46" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">B</text>

                <!-- Números 3, 4 y 5 -->
                <rect x="70" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="84" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">1</text>
                <rect x="102" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="116" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">2</text>
                <rect x="134" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="148" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">3</text>

                <!-- Letras 6 y 7 -->
                <rect x="172" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="186" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">C</text>
                <rect x="204" y="0" width="28" height="42" rx="3" fill="#F2F6FA" stroke="#0057A3" stroke-width="1.5" />
                <text x="218" y="28" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="22" font-weight="700" text-anchor="middle">D</text>
              </g>

              <!-- Barra de validación OCR y telemetría de confianza -->
              <rect x="14" y="88" width="232" height="22" rx="2" fill="#E1E8F0" />
              <text x="24" y="103" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600">OCR VERIFICADO · COINCIDENCIA: 99.8%</text>
              <circle cx="236" cy="99" r="4" fill="#00B140" />
            </g>

            <defs>
              <linearGradient id="alprBeamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0057A3" stop-opacity="0.9" />
                <stop offset="60%" stop-color="#5FA8E8" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#5FA8E8" stop-opacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('alpr').stepNumber }}</span>
            <span class="diagram-card__tag">ETAPA DE RECONOCIMIENTO ÓPTICO</span>
          </div>
          <h2 id="step-alpr-title" class="diagram-card__title">{{ getStep('alpr').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('alpr').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('alpr').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('alpr').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('alpr').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- PASO 3: PESAJE DINÁMICO WIM -->
      <article class="diagram-card" aria-labelledby="step-wim-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustración técnica de balanza de pesaje dinámico WIM en calzada"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Capa de pavimento asfáltico en corte seccional -->
            <rect x="30" y="180" width="480" height="70" rx="4" fill="#E1E8F0" />
            <line x1="30" y1="180" x2="510" y2="180" stroke="#122142" stroke-width="3" />

            <!-- Placas y Sensores Piezoeléctricos WIM integrados en el pavimento -->
            <rect x="90" y="174" width="40" height="14" rx="2" fill="#0057A3" />
            <rect x="150" y="174" width="40" height="14" rx="2" fill="#0057A3" />
            <line x1="90" y1="181" x2="190" y2="181" stroke="#5FA8E8" stroke-width="2" stroke-dasharray="4 2" />

            <!-- Rueda / Neumático vehicular en contacto con sensor WIM -->
            <g transform="translate(100, 70)">
              <!-- Rueda exterior -->
              <circle cx="50" cy="50" r="48" fill="#122142" />
              <!-- Rin / Masa metálica -->
              <circle cx="50" cy="50" r="30" fill="#E1E8F0" stroke="#0057A3" stroke-width="3" />
              <circle cx="50" cy="50" r="10" fill="#122142" />
              <!-- Tornillos de rueda -->
              <circle cx="50" cy="30" r="2.5" fill="#122142" />
              <circle cx="50" cy="70" r="2.5" fill="#122142" />
              <circle cx="30" cy="50" r="2.5" fill="#122142" />
              <circle cx="70" cy="50" r="2.5" fill="#122142" />

              <!-- Vector de Fuerza y Peso Dinámico hacia el sensor -->
              <line x1="50" y1="102" x2="50" y2="124" stroke="#CF142B" stroke-width="3.5" marker-end="url(#arrowRed)" />
              <text x="62" y="118" fill="#CF142B" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700">F = 1.35 t</text>
            </g>

            <!-- Panel de Telemetría Dinámica de Pesaje y Ejes WIM -->
            <g transform="translate(230, 36)">
              <rect x="0" y="0" width="270" height="134" rx="6" fill="#FFFFFF" stroke="#0057A3" stroke-width="2" />

              <!-- Header del panel técnico -->
              <rect x="0" y="0" width="270" height="28" rx="4" fill="#122142" />
              <text x="14" y="18" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="600">MÓDULO WIM · CLASIFICACIÓN</text>
              <rect x="200" y="6" width="58" height="16" rx="2" fill="#0057A3" />
              <text x="229" y="18" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="9" font-weight="600" text-anchor="middle">EN LÍNEA</text>

              <!-- Medición gráfica de carga por eje -->
              <text x="14" y="48" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Carga dinámica detectada:</text>
              <text x="14" y="74" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="20" font-weight="700">2.700 kg</text>
              <text x="120" y="74" fill="#00B140" font-family="'Inter', sans-serif" font-size="11" font-weight="600">✓ Conforme</text>

              <!-- Categoría de tarifa -->
              <rect x="14" y="86" width="242" height="36" rx="3" fill="#F2F6FA" stroke="#E1E8F0" stroke-width="1" />
              <text x="24" y="102" fill="#122142" font-family="'Inter', sans-serif" font-size="11" font-weight="600">Clase asignada: Liviano (Cat. 1)</text>
              <text x="24" y="115" fill="#5D6A80" font-family="'IBM Plex Mono', monospace" font-size="10">2 Ejes / Rodaje Sencillo · Tarifa estándar</text>
            </g>

            <defs>
              <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#CF142B" />
              </marker>
            </defs>
          </svg>
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('wim').stepNumber }}</span>
            <span class="diagram-card__tag">ETAPA DE CLASIFICACIÓN Y PESAJE</span>
          </div>
          <h2 id="step-wim-title" class="diagram-card__title">{{ getStep('wim').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('wim').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('wim').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('wim').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('wim').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>

      <!-- PASO 4: CONCILIACIÓN Y LIQUIDACIÓN FINTECH -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-clearing-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Ilustración técnica de conciliación bancaria y liquidación de saldo"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Servidor central de conciliación VenVías -->
            <rect x="50" y="40" width="130" height="190" rx="6" fill="#122142" />
            <rect x="62" y="52" width="106" height="16" rx="2" fill="#0057A3" />
            <circle cx="72" cy="60" r="3" fill="#5FA8E8" />
            <line x1="82" y1="60" x2="156" y2="60" stroke="#FFFFFF" stroke-width="1.5" stroke-dasharray="4 2" />

            <!-- Racks de servidores -->
            <rect x="62" y="76" width="106" height="34" rx="2" fill="#0A1122" />
            <circle cx="74" cy="93" r="3" fill="#00B140" />
            <line x1="86" y1="93" x2="156" y2="93" stroke="#5FA8E8" stroke-width="2" />

            <rect x="62" y="118" width="106" height="34" rx="2" fill="#0A1122" />
            <circle cx="74" cy="135" r="3" fill="#5FA8E8" />
            <line x1="86" y1="135" x2="156" y2="135" stroke="#0057A3" stroke-width="2" />

            <rect x="62" y="160" width="106" height="34" rx="2" fill="#0A1122" />
            <circle cx="74" cy="177" r="3" fill="#00B140" />
            <line x1="86" y1="177" x2="156" y2="177" stroke="#5FA8E8" stroke-width="2" />

            <text x="115" y="214" fill="#CBD5E1" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600" text-anchor="middle">CORE CLEARING</text>

            <!-- Conectores de flujo hacia las dos resoluciones -->
            <path d="M180 100 L240 100 L240 70 L280 70" stroke="#00B140" stroke-width="2.5" stroke-dasharray="5 3" />
            <path d="M180 160 L240 160 L240 190 L280 190" stroke="#0057A3" stroke-width="2.5" stroke-dasharray="5 3" />

            <!-- Opción A: Débito Inmediato (Saldo disponible / TAG) -->
            <g transform="translate(280, 36)">
              <rect x="0" y="0" width="220" height="74" rx="5" fill="#FFFFFF" stroke="#00B140" stroke-width="2" />
              <rect x="0" y="0" width="220" height="22" rx="3" fill="#00B140" />
              <text x="12" y="15" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="10" font-weight="700">CASO 1: CON SALDO / TAG ACTIVO</text>
              <text x="12" y="42" fill="#122142" font-family="'Inter', sans-serif" font-size="12" font-weight="600">Débito automático al instante</text>
              <text x="12" y="58" fill="#5D6A80" font-family="'IBM Plex Mono', monospace" font-size="10">Comprobante fiscal emitido · OK</text>
              <circle cx="198" cy="48" r="10" fill="#E8F8EE" />
              <path d="M194 48 L197 51 L203 44" stroke="#00B140" stroke-width="2" stroke-linecap="round" />
            </g>

            <!-- Opción B: Saldo Deudor Transitorio (Sin saldo / Sin TAG) -->
            <g transform="translate(280, 150)">
              <rect x="0" y="0" width="220" height="78" rx="5" fill="#FFFFFF" stroke="#0057A3" stroke-width="2" />
              <rect x="0" y="0" width="220" height="22" rx="3" fill="#122142" />
              <text x="12" y="15" fill="#5FA8E8" font-family="'Inter', sans-serif" font-size="10" font-weight="700">CASO 2: SIN SALDO PREPAGADO</text>
              <text x="12" y="42" fill="#122142" font-family="'Inter', sans-serif" font-size="12" font-weight="600">Asiento de Saldo Deudor</text>
              <text x="12" y="58" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="10">Obligación legal exigible en web</text>
              <text x="12" y="70" fill="#0057A3" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600">Pago en línea sin recargos</text>
              <circle cx="198" cy="50" r="10" fill="#E1E8F0" />
              <path d="M198 44 L198 51 M198 56 L198 57" stroke="#122142" stroke-width="2" stroke-linecap="round" />
            </g>
          </svg>
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('clearing').stepNumber }}</span>
            <span class="diagram-card__tag">ETAPA DE LIQUIDACIÓN FINTECH</span>
          </div>
          <h2 id="step-clearing-title" class="diagram-card__title">{{ getStep('clearing').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('clearing').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('clearing').description }}</p>

          <ul class="diagram-card__bullets">
            <li v-for="pt in getStep('clearing').bulletPoints" :key="pt">
              <AppIcon name="check" :size="16" class="text-azul-700 flex-none" />
              <span>{{ pt }}</span>
            </li>
          </ul>

          <div class="diagram-card__specs">
            <div v-for="spec in getStep('clearing').technicalData" :key="spec.label" class="spec-item">
              <span class="spec-item__label">{{ spec.label }}</span>
              <span class="spec-item__val">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Base Legal y Fundamento Normativo -->
    <footer class="diagram-legal">
      <div class="diagram-legal__inner">
        <AppIcon name="info" :size="20" class="text-azul-700 flex-none mt-0.5" />
        <p>{{ diagram.legalSummary }}</p>
      </div>
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
  margin-bottom: var(--space-8);
}

.how-diagram__note {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 14px;
  color: var(--texto-suave);
  max-width: 58ch;
}

.how-diagram__print-btn {
  flex-shrink: 0;
  min-height: 44px;
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
    grid-template-columns: 1.15fr 1fr;
    gap: var(--space-8);
  }

  .diagram-card--reverse {
    grid-template-columns: 1fr 1.15fr;
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
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--elev-1);
}

.diagram-svg {
  width: 100%;
  height: auto;
  display: block;
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

/* Marco legal */
.diagram-legal {
  margin-top: var(--space-8);
  padding: var(--space-4) var(--space-6);
  background: var(--fondo-frio);
  border-left: 3px solid var(--azul-700);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.diagram-legal__inner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.diagram-legal p {
  font-size: 13px;
  line-height: 20px;
  color: var(--texto-suave);
}

/* Estilos exclusivos para pantalla */
.print-only {
  display: none;
}

/* ==========================================================================
   SOPORTE @media print: FORMATO FICHA TÉCNICA A4 / CARTA
   ========================================================================== */
@media print {
  /* Ocultar elementos de navegación y acciones de pantalla */
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

  /* Reset de página para impresión */
  @page {
    size: A4 portrait;
    margin: 12mm 15mm 15mm 15mm;
  }

  body,
  html,
  .how-diagram {
    background: #ffffff !important;
    color: #122142 !important;
    font-size: 10pt !important;
    width: 100% !important;
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .print-header {
    margin-bottom: 6mm;
  }

  .print-header__top {
    display: flex;
    justify-content: space-between;
    font: 600 9pt/1 var(--font-mono);
    color: #0057a3;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 3mm;
  }

  .print-header__title {
    font: 700 16pt/1.2 var(--font-display);
    color: #122142;
    margin-bottom: 2mm;
  }

  .print-header__sub {
    font: 400 9.5pt/1.4 var(--font-body);
    color: #4a5670;
  }

  .print-header__divider {
    height: 1.5pt;
    background: #122142;
    margin-top: 3mm;
  }

  .diagram-flow {
    gap: 6mm;
  }

  .diagram-card {
    page-break-inside: avoid;
    break-inside: avoid;
    box-shadow: none !important;
    border: 1pt solid #cbd5e1 !important;
    padding: 4mm 6mm !important;
    margin-bottom: 4mm;
    grid-template-columns: 140mm 1fr !important;
  }

  .diagram-card__title {
    font-size: 12pt !important;
    color: #122142 !important;
  }

  .diagram-card__sub {
    font-size: 9pt !important;
    color: #0057a3 !important;
  }

  .diagram-card__desc {
    font-size: 8.5pt !important;
    line-height: 1.35 !important;
    color: #2a3242 !important;
  }

  .diagram-card__bullets li {
    font-size: 8.5pt !important;
    line-height: 1.3 !important;
  }

  .diagram-card__specs {
    border-top: 0.5pt solid #cbd5e1 !important;
    padding-top: 2mm !important;
  }

  .spec-item__label {
    font-size: 7.5pt !important;
  }

  .spec-item__val {
    font-size: 8.5pt !important;
    color: #122142 !important;
  }

  .diagram-legal {
    page-break-inside: avoid;
    break-inside: avoid;
    border-left: 2pt solid #0057a3 !important;
    background: #f8fafc !important;
    margin-top: 4mm !important;
    padding: 3mm 4mm !important;
  }

  .diagram-legal p {
    font-size: 8pt !important;
    line-height: 1.3 !important;
    color: #4a5670 !important;
  }
}
</style>
