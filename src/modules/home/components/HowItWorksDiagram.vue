<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import {
  HOW_IT_WORKS_DIAGRAM,
  type DiagramStep,
} from '../constants/howItWorks.diagram'

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
  <div class="how-diagram" role="region" aria-label="Diagrama técnico del flujo de Cobro por Placa">
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
      <button
        type="button"
        class="btn btn--primario how-diagram__print-btn"
        @click="printDocument"
      >
        <AppIcon name="recibo" :size="18" />
        <span>{{ diagram.printActions.printButton }}</span>
      </button>
    </div>

    <!-- Flujo operativo estructurado en 6 etapas -->
    <div class="diagram-flow">
      <!-- ====================================================================
           PASO 1: CIRCULA POR EL PEAJE
           ==================================================================== -->
      <article class="diagram-card" aria-labelledby="step-circula-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Pórtico Free Flow con vehículo circulando sin detenerse"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Calzada de autopista -->
            <polygon points="40,240 500,240 460,130 80,130" fill="#E1E8F0" />
            <polygon points="120,240 420,240 380,130 160,130" fill="#CBD5E1" />

            <!-- Líneas de carril segmentadas -->
            <line x1="270" y1="130" x2="270" y2="160" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 6" />
            <line x1="270" y1="175" x2="270" y2="240" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="14 10" />

            <!-- Estructura del Pórtico Metálico Free Flow -->
            <!-- Columna Izquierda -->
            <rect x="50" y="50" width="16" height="190" rx="2" fill="#122142" />
            <line x1="58" y1="60" x2="58" y2="230" stroke="#0057A3" stroke-width="2" />
            <polygon points="42,240 74,240 66,220 50,220" fill="#122142" />

            <!-- Columna Derecha -->
            <rect x="474" y="50" width="16" height="190" rx="2" fill="#122142" />
            <line x1="482" y1="60" x2="482" y2="230" stroke="#0057A3" stroke-width="2" />
            <polygon points="466,240 498,240 490,220 474,220" fill="#122142" />

            <!-- Viga transversal superior del pórtico -->
            <rect x="46" y="40" width="448" height="26" rx="3" fill="#122142" />
            <line x1="56" y1="47" x2="484" y2="47" stroke="#5FA8E8" stroke-width="1.5" stroke-dasharray="8 4" />
            <line x1="56" y1="59" x2="484" y2="59" stroke="#0057A3" stroke-width="1.5" />

            <!-- Semáforos con flechas verdes de paso libre (como en la infografía) -->
            <!-- Carril 1 -->
            <rect x="135" y="16" width="30" height="24" rx="3" fill="#0A1122" stroke="#122142" stroke-width="1" />
            <polygon points="150,34 142,24 146,24 146,20 154,20 154,24 158,24" fill="#00D26A" />

            <!-- Carril 2 -->
            <rect x="255" y="16" width="30" height="24" rx="3" fill="#0A1122" stroke="#122142" stroke-width="1" />
            <polygon points="270,34 262,24 266,24 266,20 274,20 274,24 278,24" fill="#00D26A" />

            <!-- Carril 3 -->
            <rect x="375" y="16" width="30" height="24" rx="3" fill="#0A1122" stroke="#122142" stroke-width="1" />
            <polygon points="390,34 382,24 386,24 386,20 394,20 394,24 398,24" fill="#00D26A" />

            <!-- Antenas y Sensores ópticos montados en la viga -->
            <rect x="180" y="66" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="194" cy="86" r="3" fill="#5FA8E8" />
            <rect x="256" y="66" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="270" cy="86" r="3" fill="#5FA8E8" />
            <rect x="332" y="66" width="28" height="14" rx="2" fill="#0057A3" />
            <circle cx="346" cy="86" r="3" fill="#5FA8E8" />

            <!-- Haces de detección -->
            <polygon points="194,89 120,220 220,220" fill="url(#step1LaserGrad)" opacity="0.35" />
            <polygon points="270,89 210,230 330,230" fill="url(#step1LaserGrad)" opacity="0.55" />
            <polygon points="346,89 320,220 420,220" fill="url(#step1LaserGrad)" opacity="0.35" />

            <!-- Vehículo cruzando el pórtico sin detenerse (vista posterior) -->
            <g transform="translate(220, 155)">
              <ellipse cx="50" cy="56" rx="46" ry="8" fill="rgba(18,33,66,0.25)" />
              <path d="M14 36 L24 16 L76 16 L86 36 L94 40 L94 48 L6 48 L6 40 Z" fill="#122142" />
              <polygon points="28,34 72,34 66,20 34,20" fill="#5FA8E8" opacity="0.85" />
              <rect x="10" y="40" width="12" height="6" rx="2" fill="#CF142B" />
              <rect x="78" y="40" width="12" height="6" rx="2" fill="#CF142B" />
              <!-- Placa vehicular trasera -->
              <rect x="35" y="41" width="30" height="10" rx="1.5" fill="#FFFFFF" stroke="#0057A3" stroke-width="1" />
              <text x="50" y="49" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="7" font-weight="700" text-anchor="middle">AB123CD</text>
              <rect x="8" y="44" width="14" height="14" rx="2" fill="#0A1122" />
              <rect x="78" y="44" width="14" height="14" rx="2" fill="#0A1122" />
            </g>

            <!-- Telemetría de paso -->
            <rect x="68" y="18" width="120" height="18" rx="3" fill="#122142" />
            <text x="76" y="30.5" fill="#5FA8E8" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600">FREE FLOW · PASO LIBRE</text>
            <circle cx="178" cy="27" r="3" fill="#00B140" />

            <defs>
              <linearGradient id="step1LaserGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0057A3" stop-opacity="0.8" />
                <stop offset="50%" stop-color="#5FA8E8" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#5FA8E8" stop-opacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
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
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Cámara ALPR reconociendo automáticamente la placa vehicular venezolana"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Brazo mecánico articulado de la cámara -->
            <rect x="36" y="30" width="14" height="90" fill="#122142" rx="2" />
            <line x1="43" y1="30" x2="100" y2="70" stroke="#122142" stroke-width="8" stroke-linecap="round" />
            <circle cx="100" cy="70" r="10" fill="#0057A3" />

            <!-- Cuerpo de Cámara ALPR Profesional -->
            <rect x="100" y="52" width="76" height="38" rx="4" fill="#122142" />
            <polygon points="96,48 186,48 176,52 100,52" fill="#0A1122" />
            <rect x="176" y="56" width="10" height="30" rx="2" fill="#0057A3" />
            <circle cx="181" cy="65" r="4" fill="#5FA8E8" />
            <circle cx="181" cy="77" r="3" fill="#CF142B" />
            <circle cx="112" cy="62" r="2.5" fill="#00D26A" />
            <text x="120" y="65" fill="#5FA8E8" font-family="'IBM Plex Mono', monospace" font-size="7.5" font-weight="600">ALPR-850nm</text>

            <!-- Haz de captura ALPR hacia la placa -->
            <polygon points="186,66 498,34 498,198 186,76" fill="url(#step2BeamGrad)" />

            <!-- Retícula / Brackets de encuadre ALPR -->
            <path d="M222,54 L222,36 L240,36" stroke="#0057A3" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M478,36 L496,36 L496,54" stroke="#0057A3" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M222,164 L222,182 L240,182" stroke="#0057A3" stroke-width="2.5" stroke-linecap="round" fill="none" />
            <path d="M478,182 L496,182 L496,164" stroke="#0057A3" stroke-width="2.5" stroke-linecap="round" fill="none" />

            <!-- Placa Oficial Venezolana (Vector institucional idéntico a plate-venezuela.svg) -->
            <g transform="translate(230, 44) scale(0.64)">
              <rect x="0" y="0" width="404" height="204" rx="16" fill="rgba(18, 33, 66, 0.15)" />
              <rect x="2" y="2" width="400" height="200" rx="16" fill="#0D0F14" stroke="#4A5568" stroke-width="1.5" />
              <rect x="7" y="7" width="390" height="190" rx="12" fill="#FFFFFF" />

              <g clip-path="url(#vv-step2-face)">
                <!-- Franja Amarilla -->
                <path fill="#F6CE1C" d="M7,86 C 90,70 150,102 200,86 C 260,68 330,102 397,84 L397,197 L7,197 Z" />
                <!-- Franja Azul -->
                <path fill="#98A0E4" d="M7,118 C 90,102 150,134 200,118 C 260,100 330,134 397,116 L397,197 L7,197 Z" />
                <!-- Franja Roja -->
                <path fill="#E0401C" d="M7,150 C 90,136 150,166 200,150 C 260,134 330,166 397,148 L397,197 L7,197 Z" />

                <!-- 8 estrellas blancas en arco oficial -->
                <g fill="#FFFFFF">
                  <use href="#vv-step2-star" transform="translate(122,133) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(154,128) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(186,132) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(218,127) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(250,132) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(282,128) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(90,138) scale(.55)" />
                  <use href="#vv-step2-star" transform="translate(314,134) scale(.55)" />
                </g>
              </g>

              <!-- Orificios de montaje -->
              <g fill="#CBD5E1" stroke="#94A3B8" stroke-width="1">
                <rect x="150" y="9" width="30" height="12" rx="4" />
                <rect x="224" y="9" width="30" height="12" rx="4" />
                <rect x="55" y="183" width="30" height="12" rx="4" />
                <rect x="319" y="183" width="30" height="12" rx="4" />
              </g>

              <!-- Encabezado y Pie oficial venezolano -->
              <text x="202" y="60" text-anchor="middle" font-family="'Arial Narrow', Arial, sans-serif" font-weight="700" font-size="21" fill="#2431BE" textLength="360" lengthAdjust="spacingAndGlyphs">REPÚBLICA BOLIVARIANA DE VENEZUELA</text>
              <text x="202" y="192" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="17" fill="#15205C" letter-spacing="3">CARACAS</text>

              <!-- Caracteres troquelados en relieve: AB123CD -->
              <text x="204" y="132" text-anchor="middle" font-family="'IBM Plex Mono', 'Arial Black', sans-serif" font-weight="900" font-size="64" fill="#94A3B8" letter-spacing="10">AB123CD</text>
              <text x="202" y="130" text-anchor="middle" font-family="'IBM Plex Mono', 'Arial Black', sans-serif" font-weight="900" font-size="64" fill="#0D131F" letter-spacing="10">AB123CD</text>
            </g>

            <!-- Línea de escaneo láser ALPR -->
            <line x1="224" y1="127" x2="494" y2="127" stroke="#00D26A" stroke-width="1.8" stroke-dasharray="6 3" opacity="0.9" />
            <circle cx="360" cy="127" r="3" fill="#00D26A" />

            <!-- Barra de telemetría ALPR -->
            <g transform="translate(230, 196)">
              <rect x="0" y="0" width="258" height="34" rx="4" fill="#122142" />
              <circle cx="16" cy="17" r="4.5" fill="#00D26A" />
              <text x="28" y="15" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="700">OCR: AB123CD · FORMATO OFICIAL</text>
              <text x="28" y="27" fill="#5FA8E8" font-family="'IBM Plex Mono', monospace" font-size="8.5">7 CARACTERES · COINCIDENCIA 99.8%</text>
              <rect x="204" y="8" width="46" height="18" rx="2" fill="#0057A3" />
              <text x="227" y="20.5" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="8" font-weight="700" text-anchor="middle">VÁLIDA</text>
            </g>

            <defs>
              <clipPath id="vv-step2-face">
                <rect x="7" y="7" width="390" height="190" rx="12" />
              </clipPath>
              <path
                id="vv-step2-star"
                d="M0,-9 2.12,-2.91 8.56,-2.78 3.42,1.11 5.29,7.28 0,3.6 -5.29,7.28 -3.42,1.11 -8.56,-2.78 -2.12,-2.91Z"
              />
              <linearGradient id="step2BeamGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#0057A3" stop-opacity="0.8" />
                <stop offset="60%" stop-color="#5FA8E8" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#5FA8E8" stop-opacity="0.04" />
              </linearGradient>
            </defs>
          </svg>
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
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Cálculo automático de tarifa de peaje según categoría y tránsito"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Documento técnico / Boleta oficial de TARIFA DE PEAJE -->
            <g transform="translate(130, 24)">
              <!-- Sombra del documento -->
              <rect x="0" y="0" width="280" height="232" rx="8" fill="rgba(18, 33, 66, 0.12)" />
              <!-- Cuerpo blanco del documento -->
              <rect x="0" y="0" width="280" height="232" rx="8" fill="#FFFFFF" stroke="#0057A3" stroke-width="1.5" />

              <!-- Cabecera del documento (Azul Marino) -->
              <rect x="0" y="0" width="280" height="42" rx="8" fill="#122142" />
              <rect x="0" y="30" width="280" height="12" fill="#122142" />
              <text x="140" y="26" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">TARIFA DE PEAJE</text>

              <!-- Icono de tasa oficial -->
              <circle cx="140" cy="74" r="22" fill="#F2F6FA" stroke="#0057A3" stroke-width="2" />
              <text x="140" y="82" fill="#0057A3" font-family="'Inter', sans-serif" font-size="24" font-weight="800" text-anchor="middle">$</text>

              <!-- Filas de datos técnicos del tránsito -->
              <g transform="translate(24, 110)">
                <!-- Fila 1: Categoría vehicular -->
                <text x="0" y="0" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Categoría asignada:</text>
                <text x="232" y="0" fill="#122142" font-family="'Inter', sans-serif" font-size="11" font-weight="700" text-anchor="end">Liviano (Cat. 1)</text>
                <line x1="0" y1="8" x2="232" y2="8" stroke="#E1E8F0" stroke-width="1" />

                <!-- Fila 2: Punto de control -->
                <text x="0" y="26" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Estación de peaje:</text>
                <text x="232" y="26" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="10.5" font-weight="600" text-anchor="end">Peaje Principal</text>
                <line x1="0" y1="34" x2="232" y2="34" stroke="#E1E8F0" stroke-width="1" />

                <!-- Fila 3: Matrícula validada -->
                <text x="0" y="52" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Placa registrada:</text>
                <text x="232" y="52" fill="#0057A3" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700" text-anchor="end">AB123CD</text>
              </g>

              <!-- Cuadro de tasa oficial determinada -->
              <rect x="24" y="176" width="232" height="38" rx="4" fill="#F2F6FA" stroke="#CBD5E1" stroke-width="1" />
              <text x="36" y="194" fill="#122142" font-family="'Inter', sans-serif" font-size="11" font-weight="700">TASA DETERMINADA</text>
              <text x="36" y="206" fill="#00B140" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600">✓ Cómputo automatizado</text>
              <text x="244" y="202" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="16" font-weight="800" text-anchor="end">Bs. 15,00</text>
            </g>
          </svg>
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
           PASO 4: SE VERIFICA EL PAGO (BIFURCACIÓN DE LA INFOGRAFÍA)
           ==================================================================== -->
      <article class="diagram-card diagram-card--reverse" aria-labelledby="step-verifica-title">
        <div class="diagram-card__media">
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Verificación de método de pago: TAG o saldo suficiente con bifurcación de cobro o deuda"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Métodos de pago verificados (TAG, Billetera, Tarjeta) -->
            <g transform="translate(30, 60)">
              <!-- Tarjeta / TAG VenVías (Verde) -->
              <rect x="0" y="0" width="130" height="80" rx="6" fill="#00B140" stroke="#008F34" stroke-width="1.5" />
              <rect x="14" y="16" width="22" height="18" rx="2" fill="#E8F8EE" />
              <text x="14" y="60" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="12" font-weight="700">TAG</text>
              <text x="14" y="70" fill="#E8F8EE" font-family="'Inter', sans-serif" font-size="8">VENVÍAS RFID</text>

              <!-- Tarjeta bancaria / Saldo placa (Azul Marino) -->
              <rect x="25" y="45" width="130" height="80" rx="6" fill="#122142" stroke="#0057A3" stroke-width="1.5" />
              <rect x="39" y="60" width="20" height="15" rx="2" fill="#5FA8E8" />
              <line x1="25" y1="84" x2="155" y2="84" stroke="#0057A3" stroke-width="3" />
              <text x="39" y="112" fill="#FFFFFF" font-family="'IBM Plex Mono', monospace" font-size="10" font-weight="600">SALDO PLACA</text>

              <!-- Sello de comprobación con check verde -->
              <circle cx="145" cy="115" r="18" fill="#00D26A" stroke="#FFFFFF" stroke-width="3" />
              <path d="M138 115 L143 120 L152 110" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </g>

            <!-- Conectores de flujo en bifurcación -->
            <!-- Conector hacia Pago Válido (Arriba, Verde) -->
            <path d="M220 100 C 250 100, 260 70, 290 70" stroke="#00B140" stroke-width="3" stroke-linecap="round" fill="none" />
            <polygon points="296,70 286,65 288,70 286,75" fill="#00B140" />

            <!-- Conector hacia Sin Pago Válido (Abajo, Naranja) -->
            <path d="M220 140 C 250 140, 260 190, 290 190" stroke="#D97706" stroke-width="3" stroke-linecap="round" fill="none" />
            <polygon points="296,190 286,185 288,190 286,195" fill="#D97706" />

            <!-- Opción 1: Con pago válido -> Cobro realizado -->
            <g transform="translate(300, 36)">
              <rect x="0" y="0" width="210" height="68" rx="6" fill="#FFFFFF" stroke="#00B140" stroke-width="2" />
              <rect x="0" y="0" width="210" height="24" rx="4" fill="#00B140" />
              <text x="12" y="16.5" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="10.5" font-weight="700">✓ CON PAGO VÁLIDO</text>
              <text x="12" y="42" fill="#122142" font-family="'Inter', sans-serif" font-size="12" font-weight="700">Cobro realizado</text>
              <text x="12" y="56" fill="#5D6A80" font-family="'IBM Plex Mono', monospace" font-size="9.5">Débito inmediato · Tránsito OK</text>
            </g>

            <!-- Opción 2: Sin pago válido -> Se genera una deuda -->
            <g transform="translate(300, 156)">
              <rect x="0" y="0" width="210" height="74" rx="6" fill="#FFFFFF" stroke="#D97706" stroke-width="2" />
              <rect x="0" y="0" width="210" height="24" rx="4" fill="#D97706" />
              <text x="12" y="16.5" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="10.5" font-weight="700">! SIN PAGO VÁLIDO</text>
              <text x="12" y="44" fill="#122142" font-family="'Inter', sans-serif" font-size="12" font-weight="700">Se genera una deuda</text>
              <text x="12" y="60" fill="#B45309" font-family="'Inter', sans-serif" font-size="9.5">Obligación pendiente (Paso 5)</text>
            </g>
          </svg>
        </div>

        <div class="diagram-card__content">
          <div class="diagram-card__badge">
            <span class="diagram-card__num">{{ getStep('verifica').stepNumber }}</span>
            <span class="diagram-card__tag">{{ getStep('verifica').tagLabel }}</span>
          </div>
          <h2 id="step-verifica-title" class="diagram-card__title">{{ getStep('verifica').title }}</h2>
          <p class="diagram-card__sub">{{ getStep('verifica').subtitle }}</p>
          <p class="diagram-card__desc">{{ getStep('verifica').description }}</p>

          <!-- Bifurcación visual en el contenido -->
          <div class="route-cards">
            <div class="route-card route-card--valid">
              <div class="route-card__header">
                <AppIcon name="check" :size="16" class="text-verde-600 flex-none" />
                <span class="route-card__title">Con pago válido → Cobro realizado</span>
              </div>
              <p class="route-card__desc">Débito automático al instante de la billetera o TAG del vehículo.</p>
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
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Generación de obligación de deuda pendiente asociada a la placa"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Documento oficial de DEUDA PENDIENTE (idéntico a la infografía) -->
            <g transform="translate(130, 24)">
              <rect x="0" y="0" width="280" height="232" rx="8" fill="rgba(18, 33, 66, 0.12)" />
              <rect x="0" y="0" width="280" height="232" rx="8" fill="#FFFFFF" stroke="#D97706" stroke-width="2" />

              <!-- Cabecera ámbar -->
              <rect x="0" y="0" width="280" height="42" rx="8" fill="#D97706" />
              <rect x="0" y="30" width="280" height="12" fill="#D97706" />
              <text x="140" y="26" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="13" font-weight="700" text-anchor="middle" letter-spacing="1">DEUDA PENDIENTE</text>

              <!-- Icono de advertencia oficial -->
              <circle cx="140" cy="74" r="22" fill="#FEF3C7" stroke="#D97706" stroke-width="2" />
              <text x="140" y="82" fill="#B45309" font-family="'Inter', sans-serif" font-size="24" font-weight="800" text-anchor="middle">!</text>

              <!-- Desglose de la deuda oficial -->
              <g transform="translate(24, 110)">
                <text x="0" y="0" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Placa asociada:</text>
                <text x="232" y="0" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="11" font-weight="700" text-anchor="end">AB123CD</text>
                <line x1="0" y1="8" x2="232" y2="8" stroke="#E1E8F0" stroke-width="1" />

                <text x="0" y="26" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Tasa de peaje:</text>
                <text x="232" y="26" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="11" text-anchor="end">Bs. 15,00</text>
                <line x1="0" y1="34" x2="232" y2="34" stroke="#E1E8F0" stroke-width="1" />

                <text x="0" y="52" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="11">Cargos administrativos:</text>
                <text x="232" y="52" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="11" text-anchor="end">Bs. 5,00</text>
              </g>

              <!-- Total de la obligación pendiente -->
              <rect x="24" y="176" width="232" height="38" rx="4" fill="#FFFBEB" stroke="#FDE68A" stroke-width="1" />
              <text x="36" y="194" fill="#B45309" font-family="'Inter', sans-serif" font-size="10.5" font-weight="700">TOTAL OBLIGACIÓN</text>
              <text x="36" y="206" fill="#5D6A80" font-family="'Inter', sans-serif" font-size="9.5">Pendiente de cancelación</text>
              <text x="244" y="202" fill="#D97706" font-family="'IBM Plex Mono', monospace" font-size="16" font-weight="800" text-anchor="end">Bs. 20,00</text>
            </g>
          </svg>
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
          <svg
            class="diagram-svg"
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Cancelación de la deuda pendiente en estaciones de peaje o en línea"
          >
            <rect width="540" height="280" rx="8" fill="#F2F6FA" />

            <!-- Opción A: Estación de peaje física (exacto a la caseta de la infografía) -->
            <g transform="translate(40, 40)">
              <rect x="0" y="0" width="200" height="200" rx="6" fill="#FFFFFF" stroke="#0057A3" stroke-width="1.5" />
              <rect x="0" y="0" width="200" height="30" rx="4" fill="#122142" />
              <text x="100" y="20" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="11" font-weight="700" text-anchor="middle">ESTACIÓN DE PEAJE</text>

              <!-- Caseta de peaje -->
              <rect x="110" y="60" width="45" height="110" fill="#CBD5E1" stroke="#122142" stroke-width="2" />
              <rect x="118" y="75" width="28" height="35" rx="2" fill="#5FA8E8" stroke="#122142" stroke-width="1.5" />
              <polygon points="104,54 162,54 155,60 110,60" fill="#122142" />

              <!-- Barrera rayada levantada / abierta -->
              <rect x="80" y="115" width="30" height="8" fill="#CF142B" />
              <rect x="90" y="115" width="10" height="8" fill="#FFFFFF" />

              <!-- Vehículo cancelando en peaje -->
              <g transform="translate(20, 110)">
                <path d="M8 26 L16 12 L50 12 L58 26 L64 30 L64 36 L4 36 L4 30 Z" fill="#122142" />
                <polygon points="18,24 48,24 44,15 22,15" fill="#5FA8E8" opacity="0.85" />
                <rect x="22" y="30" width="22" height="7" rx="1" fill="#FFFFFF" stroke="#0057A3" stroke-width="0.75" />
                <text x="33" y="35.5" fill="#122142" font-family="'IBM Plex Mono', monospace" font-size="5.5" font-weight="700" text-anchor="middle">AB123CD</text>
                <circle cx="12" cy="38" r="6" fill="#0A1122" />
                <circle cx="56" cy="38" r="6" fill="#0A1122" />
              </g>

              <rect x="14" y="174" width="172" height="18" rx="3" fill="#E8F8EE" />
              <text x="100" y="186.5" fill="#00B140" font-family="'Inter', sans-serif" font-size="9" font-weight="700" text-anchor="middle">PAGO PRESENCIAL DISPONIBLE</text>
            </g>

            <!-- Opción B: Portal Web en Línea VenVías -->
            <g transform="translate(280, 40)">
              <rect x="0" y="0" width="220" height="200" rx="6" fill="#FFFFFF" stroke="#00B140" stroke-width="2" />
              <rect x="0" y="0" width="220" height="30" rx="4" fill="#00B140" />
              <text x="110" y="20" fill="#FFFFFF" font-family="'Inter', sans-serif" font-size="11" font-weight="700" text-anchor="middle">PORTAL WEB VENVÍAS</text>

              <!-- Pantalla de pago digital exitoso -->
              <circle cx="110" cy="74" r="24" fill="#E8F8EE" stroke="#00B140" stroke-width="2" />
              <path d="M100 74 L107 81 L120 67" stroke="#00B140" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

              <text x="110" y="116" fill="#122142" font-family="'Inter', sans-serif" font-size="12" font-weight="700" text-anchor="middle">¡Deuda Cancelada!</text>
              <text x="110" y="132" fill="#5D6A80" font-family="'IBM Plex Mono', monospace" font-size="10" text-anchor="middle">Placa AB123CD sin deudas</text>

              <!-- Comprobante emitido -->
              <rect x="20" y="148" width="180" height="36" rx="4" fill="#F2F6FA" stroke="#CBD5E1" stroke-width="1" />
              <text x="32" y="164" fill="#122142" font-family="'Inter', sans-serif" font-size="10" font-weight="600">Comprobante Fiscal Emitido</text>
              <text x="32" y="176" fill="#0057A3" font-family="'IBM Plex Mono', monospace" font-size="9">Recibo digital descargable · OK</text>
            </g>
          </svg>
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
    grid-template-columns: 110mm 1fr !important;
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
