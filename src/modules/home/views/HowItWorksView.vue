<script lang="ts">
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorksInfographic from '../components/HowItWorksInfographic.vue'

interface VehicleCategory {
  id: string
  name: string
  shortDesc: string
  icon: 'carro' | 'camion' | 'rayo' | 'peaje'
  badge: string
  tagRecommendation: string
  readingMethod: string
  points: string[]
  advice: string
}

interface TechnicalPhase {
  step: string
  badge: string
  title: string
  desc: string
  icon: 'placa' | 'rayo' | 'check' | 'recibo'
  specs: { label: string; value: string }[]
}

interface FaqItem {
  q: string
  a: string
}

export default defineComponent({
  name: 'HowItWorksView',
  components: { AppIcon, HowItWorksInfographic, RouterLink },
  data() {
    return {
      rechargeRoute: { name: ROUTE_NAMES.recharge },
      balanceRoute: { name: ROUTE_NAMES.balance },
      debtRoute: { name: ROUTE_NAMES.debt },
      activeCategory: 'livianos',
      activeFaq: null as number | null,

      technicalPhases: [
        {
          step: '01',
          badge: 'DETECCIÓN ÓPTICA',
          title: 'Lectura inteligente de placa (ALPR)',
          desc: 'Cámaras de alta velocidad y sensores infrarrojos capturan la matrícula del vehículo a velocidad de autopista sin que el conductor tenga que detenerse ni bajar la ventanilla.',
          icon: 'placa' as const,
          specs: [
            { label: 'Tiempo de captura', value: '< 60 ms' },
            { label: 'Tecnología', value: 'OCR multiespectral + IR' },
            { label: 'Condiciones', value: 'Día, noche y lluvia intensa' },
          ],
        },
        {
          step: '02',
          badge: 'VALIDACIÓN EN RED',
          title: 'Cruce con la base de datos nacional',
          desc: 'La matrícula detectada se consulta en milisegundos con el padrón vehicular unificado de VenVías para corroborar la categoría del vehículo y calcular la tarifa oficial reglamentaria.',
          icon: 'rayo' as const,
          specs: [
            { label: 'Conexión', value: 'Fibra óptica redundante' },
            { label: 'Identificación', value: 'Placa óptica y antena RFID' },
            { label: 'Interoperabilidad', value: 'Válido en todo el país' },
          ],
        },
        {
          step: '03',
          badge: 'LIQUIDACIÓN INSTANTÁNEA',
          title: 'Débito automático y paso continuo',
          desc: 'Si la placa tiene saldo recargado previamente o está vinculada al TAG de la cuenta, la tarifa se descuenta de inmediato y el semáforo inteligente confirma el paso sin colas.',
          icon: 'check' as const,
          specs: [
            { label: 'Tiempo de cobro', value: 'Inmediato (0 s demora)' },
            { label: 'Confirmación', value: 'Luz verde de cabina' },
            { label: 'Comprobante', value: 'Registro digital en línea' },
          ],
        },
        {
          step: '04',
          badge: 'GESTIÓN DE COBRO',
          title: 'Tratamiento de saldo deudor',
          desc: 'Si pasas sin saldo suficiente, el sistema no bloquea el carril para garantizar la seguridad vial: el tránsito genera un saldo deudor que puedes liquidar desde la web sin multas de inmediato.',
          icon: 'recibo' as const,
          specs: [
            { label: 'Plazo reglamentario', value: '72 horas para pago' },
            { label: 'Monto debitable', value: 'Tarifa oficial + gestión adm.' },
            { label: 'Canal de pago', value: 'Web VenVías / Pago Móvil' },
          ],
        },
      ] as TechnicalPhase[],

      categories: [
        {
          id: 'livianos',
          name: 'Vehículos Livianos',
          shortDesc: 'Automóviles particulares, camionetas y SUV',
          icon: 'carro' as const,
          badge: 'CATEGORÍA 1',
          tagRecommendation: 'TAG Opcional · Tu placa es suficiente',
          readingMethod: 'Cámaras ALPR frontales y traseras',
          points: [
            'Solo necesitas tener tu placa recargada con saldo antes de salir de viaje.',
            'No requieres trámites presenciales ni instalación de stickers obligatorios.',
            'El saldo acreditado no vence y cubre cualquier cantidad de viajes hasta agotarse.',
          ],
          advice: 'Recomendamos recargar un saldo equivalente a ida y vuelta antes de emprender viajes interurbanos.',
        },
        {
          id: 'motos',
          name: 'Motos y Dos Ruedas',
          shortDesc: 'Motocicletas de uso particular y servicios de delivery',
          icon: 'rayo' as const,
          badge: 'CATEGORÍA 0',
          tagRecommendation: 'Lectura exclusiva por placa trasera',
          readingMethod: 'Cámara ALPR trasera de ángulo cenital',
          points: [
            'La placa trasera debe permanecer visible, limpia y libre de accesorios que obstruyan los números.',
            'Tarifas reducidas según el tabulador publicado en Gaceta Oficial.',
            'Carril asignado debidamente señalizado para tránsito seguro de dos ruedas.',
          ],
          advice: 'Asegúrate de que la luz de placa funcione adecuadamente para lecturas nocturnas sin incidentes.',
        },
        {
          id: 'transporte',
          name: 'Transporte de Pasajeros',
          shortDesc: 'Autobuses urbanos, suburbanos, expresos y vans',
          icon: 'peaje' as const,
          badge: 'CATEGORÍA COLECTIVA',
          tagRecommendation: 'TAG Parabrisas Recomendado para Flotas',
          readingMethod: 'Doble lectura: RFID + Cámara de matrícula',
          points: [
            'Carriles expresos para evitar retrasos en el itinerario de pasajeros.',
            'Gestión unificada de múltiples unidades bajo una sola cuenta o cooperativa.',
            'Descarga centralizada de facturas y tránsitos para contabilidad de empresa.',
          ],
          advice: 'Las cooperativas pueden asociar hasta 50 unidades a un mismo fondo de recarga compartida.',
        },
        {
          id: 'carga',
          name: 'Carga Pesada',
          shortDesc: 'Camiones de 2 a 6+ ejes, volteos, gandolas y bateas',
          icon: 'camion' as const,
          badge: 'CATEGORÍA 2 A 6 EJES',
          tagRecommendation: 'TAG RFID Obligatorio / Recomendado',
          readingMethod: 'Pesaje dinámico en carril + Detección de ejes + RFID',
          points: [
            'Tarificación calculada automáticamente de acuerdo con el número de ejes activos.',
            'Pórticos con gálibo industrial adaptados para alturas y dimensiones especiales.',
            'Conciliación inmediata para transportistas de carga interconectados con puertos y aduanas.',
          ],
          advice: 'Verifica la alineación de tus ejes y mantén saldo suficiente para el cobro por eje según la ruta.',
        },
      ] as VehicleCategory[],

      faqs: [
        {
          q: '¿A qué velocidad debo cruzar bajo el pórtico del peaje?',
          a: 'Debes mantener la velocidad reglamentaria señalizada en la aproximación al peaje (habitualmente entre 30 km/h y 40 km/h en carriles canalizados). No es necesario frenar en seco; el sistema óptico ALPR captura la placa de forma instantánea en movimiento.',
        },
        {
          q: '¿Qué sucede si llueve intensamente o la placa está cubierta de barro?',
          a: 'Los pórticos disponen de iluminación infrarroja estroboscópica y algoritmos de mejora óptica multiespectral. Si una lectura resulta dudosa, el fotograma se envía a un centro de verificación técnica donde operadores asisten la lectura antes de generar cualquier cobro o deuda.',
        },
        {
          q: '¿Puedo pagar el saldo deudor de un vehículo que no está registrado a mi nombre?',
          a: 'Sí. El sistema VenVías es abierto y universal: cualquier persona puede consultar una placa, ver el monto adeudado y cancelarlo de inmediato mediante Pago Móvil, tarjeta de débito o BDV en Línea, quedando la placa liberada de deudas al instante.',
        },
        {
          q: '¿El saldo recargado tiene fecha de vencimiento?',
          a: 'No, el saldo a favor de tu placa nunca vence. Permanece seguro en el sistema y se va descontando progresivamente a medida que cruces por los peajes habilitados de cualquier autopista del país.',
        },
        {
          q: '¿Qué diferencia hay entre usar solo la placa o tener instalado el TAG?',
          a: 'Con solo tu placa registrada y con saldo puedes transitar libremente por cualquier carril VenVías. El dispositivo TAG adherido al parabrisas es una ventaja adicional recomendada para usuarios frecuentes y flotas comerciales, ya que agrega redundancia por radiofrecuencia (RFID).',
        },
      ] as FaqItem[],
    }
  },
  methods: {
    toggleFaq(index: number): void {
      this.activeFaq = this.activeFaq === index ? null : index
    },
  },
})
</script>

<template>
  <div class="how-view wrap">
    <!-- Hero Header Unificado -->
    <header class="how-hero">
      <div class="how-hero__kicker">
        <span class="how-hero__kicker-line" aria-hidden="true"></span>
        <span>GUÍA OFICIAL · SISTEMA DE COBRO POR PLACA</span>
      </div>
      <h1 class="how-hero__title">Guía Integral del Telepeaje en Venezuela</h1>
      <p class="how-hero__sub">
        Conoce el funcionamiento técnico de los pórticos inteligentes, los requisitos según la categoría de tu vehículo y la normativa vial aplicable para transitar sin demoras ni colas en cabina.
      </p>

      <!-- Anclas de navegación rápida -->
      <nav class="how-quicknav" aria-label="Navegación de la guía">
        <a href="#arquitectura" class="how-quicknav__item">
          <AppIcon name="rayo" :size="16" />
          <span>Arquitectura técnica</span>
        </a>
        <a href="#categorias" class="how-quicknav__item">
          <AppIcon name="carro" :size="16" />
          <span>Por tipo de vehículo</span>
        </a>
        <a href="#normativa" class="how-quicknav__item">
          <AppIcon name="recibo" :size="16" />
          <span>Marco legal</span>
        </a>
        <a href="#infografia" class="how-quicknav__item">
          <AppIcon name="peaje" :size="16" />
          <span>Diagrama oficial</span>
        </a>
        <a href="#faqs" class="how-quicknav__item">
          <AppIcon name="info" :size="16" />
          <span>Preguntas frecuentes</span>
        </a>
      </nav>
    </header>

    <!-- SECCIÓN 1: Arquitectura y Funcionamiento Técnico (4 Fases) -->
    <section id="arquitectura" class="how-section" aria-labelledby="arch-title">
      <div class="how-section__header">
        <span class="how-section__eyebrow">TECNOLOGÍA EN PÓRTICOS</span>
        <h2 id="arch-title" class="how-section__title">¿Cómo funciona la captura y el débito automatizado?</h2>
        <p class="how-section__desc">
          El sistema integra visión artificial de alta precisión y bases de datos centralizadas para validar el tránsito en menos de un segundo.
        </p>
      </div>

      <div class="arch-grid">
        <article v-for="phase in technicalPhases" :key="phase.step" class="arch-card">
          <div class="arch-card__top">
            <span class="arch-card__step">{{ phase.step }}</span>
            <span class="arch-card__badge">{{ phase.badge }}</span>
          </div>

          <h3 class="arch-card__title">{{ phase.title }}</h3>
          <p class="arch-card__desc">{{ phase.desc }}</p>

          <dl class="arch-card__specs">
            <div v-for="spec in phase.specs" :key="spec.label" class="arch-card__spec-item">
              <dt>{{ spec.label }}</dt>
              <dd>{{ spec.value }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>

    <!-- SECCIÓN 2: Requisitos y Modalidades por Categoría de Vehículo -->
    <section id="categorias" class="how-section" aria-labelledby="cat-title">
      <div class="how-section__header">
        <span class="how-section__eyebrow">CLASIFICACIÓN VEHICULAR</span>
        <h2 id="cat-title" class="how-section__title">Requisitos y modalidades según tu vehículo</h2>
        <p class="how-section__desc">
          Cada tipo de unidad cuenta con especificaciones de tránsito y modalidades de pago adaptadas a sus necesidades.
        </p>
      </div>

      <!-- Selector de categoría -->
      <div class="cat-tabs" role="tablist" aria-label="Categorías vehiculares">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          role="tab"
          :aria-selected="activeCategory === cat.id"
          class="cat-tab"
          :class="{ 'is-active': activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <AppIcon :name="cat.icon" :size="20" />
          <span>{{ cat.name }}</span>
        </button>
      </div>

      <!-- Panel de detalles de la categoría activa -->
      <div
        v-for="cat in categories"
        v-show="activeCategory === cat.id"
        :key="cat.id"
        class="cat-panel"
        role="tabpanel"
      >
        <div class="cat-panel__header">
          <div>
            <span class="cat-panel__badge">{{ cat.badge }}</span>
            <h3 class="cat-panel__title">{{ cat.name }}</h3>
            <p class="cat-panel__sub">{{ cat.shortDesc }}</p>
          </div>
          <div class="cat-panel__tag-badge">
            <AppIcon name="placa" :size="18" />
            <span>{{ cat.tagRecommendation }}</span>
          </div>
        </div>

        <div class="cat-panel__body">
          <div class="cat-panel__checklist">
            <h4>Puntos clave para el tránsito:</h4>
            <ul>
              <li v-for="pt in cat.points" :key="pt">
                <AppIcon name="check" :size="18" />
                <span>{{ pt }}</span>
              </li>
            </ul>
          </div>

          <div class="cat-panel__side">
            <div class="cat-panel__reading">
              <span class="cat-panel__side-label">Método de detección:</span>
              <p class="cat-panel__side-val">{{ cat.readingMethod }}</p>
            </div>
            <div class="cat-panel__advice">
              <AppIcon name="info" :size="18" />
              <p>{{ cat.advice }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN 3: Marco Legal y Normativa Vial -->
    <section id="normativa" class="how-section" aria-labelledby="law-title">
      <div class="how-section__header">
        <span class="how-section__eyebrow">MARCO REGULATORIO</span>
        <h2 id="law-title" class="how-section__title">Fundamentos jurídicos y derechos del conductor</h2>
        <p class="how-section__desc">
          El telepeaje se rige por la legislación venezolana de transporte terrestre y resoluciones ministeriales vigentes.
        </p>
      </div>

      <div class="law-grid">
        <article class="law-card">
          <div class="law-card__icon" aria-hidden="true">
            <AppIcon name="recibo" :size="22" />
          </div>
          <h3 class="law-card__title">Ley de Transporte Terrestre (Art. 72)</h3>
          <p class="law-card__desc">
            La obligación de pago del peaje nace con la utilización efectiva de la infraestructura vial. La responsabilidad de cancelación se atribuye inicialmente al propietario registrado del vehículo en el padrón nacional.
          </p>
        </article>

        <article class="law-card">
          <div class="law-card__icon" aria-hidden="true">
            <AppIcon name="peaje" :size="22" />
          </div>
          <h3 class="law-card__title">Tarifas Oficiales en Gaceta Nacional</h3>
          <p class="law-card__desc">
            Los montos aplicables corresponden con exactitud al tabulador emitido por el Ministerio del Poder Popular para el Transporte (MPPT). El sistema no aplica comisiones ocultas ni sobretasas arbitrarias por uso de carril.
          </p>
        </article>

        <article class="law-card">
          <div class="law-card__icon" aria-hidden="true">
            <AppIcon name="rayo" :size="22" />
          </div>
          <h3 class="law-card__title">Cero Bloqueos Físicos de Emergencia</h3>
          <p class="law-card__desc">
            Para resguardar la seguridad vial de los usuarios en autopista, ningún vehículo será retenido violentamente en carril si carece de saldo. El sistema permite el paso seguro y genera un saldo deudor pendiente de liquidación.
          </p>
        </article>

        <article class="law-card">
          <div class="law-card__icon" aria-hidden="true">
            <AppIcon name="info" :size="22" />
          </div>
          <h3 class="law-card__title">Derecho de Conciliación y Consulta</h3>
          <p class="law-card__desc">
            Los conductores tienen derecho a consultar en cualquier momento el historial de sus tránsitos, revisar la fotografía de lectura y solicitar la aclaratoria o corrección de tránsitos en caso de venta o transferencia de dominio.
          </p>
        </article>
      </div>
    </section>

    <!-- SECCIÓN 4: Infografía Oficial Técnica Descargable -->
    <section id="infografia" class="how-section" aria-label="Infografía técnica del cobro por placa">
      <HowItWorksInfographic />
    </section>

    <!-- SECCIÓN 5: Preguntas Frecuentes Técnicas de Autopista -->
    <section id="faqs" class="how-section" aria-labelledby="faqs-title">
      <div class="how-section__header">
        <span class="how-section__eyebrow">DUDAS COMUNES</span>
        <h2 id="faqs-title" class="how-section__title">Preguntas frecuentes sobre el paso por peaje</h2>
        <p class="how-section__desc">
          Respuestas claras a las situaciones operativas que pueden presentarse durante tu viaje.
        </p>
      </div>

      <div class="faq-list">
        <div
          v-for="(faq, idx) in faqs"
          :key="faq.q"
          class="faq-item"
          :class="{ 'is-open': activeFaq === idx }"
        >
          <button
            type="button"
            class="faq-btn"
            :aria-expanded="activeFaq === idx"
            @click="toggleFaq(idx)"
          >
            <span class="faq-btn__q">{{ faq.q }}</span>
            <span class="faq-btn__icon" aria-hidden="true">
              <AppIcon name="chevron" :size="20" />
            </span>
          </button>
          <div v-show="activeFaq === idx" class="faq-answer">
            <p>{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Call-To-Action Kiosk -->
    <section class="how-cta" aria-labelledby="cta-title">
      <div class="how-cta__card">
        <div class="how-cta__tricolor" aria-hidden="true"></div>
        <div class="how-cta__content">
          <span class="how-cta__tag">CIRCULA SEGURO</span>
          <h2 id="cta-title" class="how-cta__title">¿Listo para transitar por las autopistas de Venezuela?</h2>
          <p class="how-cta__desc">
            Recarga tu saldo con anticipación o verifica el estado de tu matrícula ingresando tu número de placa.
          </p>
          <div class="how-cta__actions">
            <RouterLink :to="rechargeRoute" class="btn btn--primario how-cta__btn">
              <AppIcon name="rayo" :size="18" />
              <span>Recargar saldo ahora</span>
            </RouterLink>
            <RouterLink :to="balanceRoute" class="btn btn--secundario how-cta__btn-sec">
              <AppIcon name="placa" :size="18" />
              <span>Consultar saldo disponible</span>
            </RouterLink>
            <RouterLink :to="debtRoute" class="btn btn--fantasma how-cta__btn-ghost">
              <AppIcon name="recibo" :size="18" />
              <span>Pagar saldo deudor</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.how-view {
  padding-block: var(--space-8) var(--space-16);
  display: grid;
  gap: var(--space-12);
}

@media (min-width: 900px) {
  .how-view {
    padding-block: var(--space-12) var(--space-20);
    gap: var(--space-16);
  }
}

/* Hero Header */
.how-hero {
  text-align: center;
  max-width: 820px;
  margin: 0 auto;
}

.how-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #0038A8;
  margin-bottom: var(--space-4);
}

.how-hero__kicker-line {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, #0038A8, #0284c7);
  border-radius: 2px;
}

.how-hero__title {
  font: 800 clamp(32px, 4.5vw, 50px)/1.15 var(--font-display);
  color: #122142;
  letter-spacing: -0.03em;
  margin: 0 0 var(--space-4);
}

.how-hero__sub {
  font-size: clamp(16px, 1.8vw, 18px);
  line-height: 1.6;
  color: var(--texto-suave);
  margin: 0 0 var(--space-6);
}

/* Quick Navigation Anchor Bar */
.how-quicknav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: var(--space-4);
}

.how-quicknav__item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 9999px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.how-quicknav__item:hover {
  background: #ffffff;
  border-color: #0038A8;
  color: #0038A8;
  box-shadow: 0 4px 12px rgba(0, 56, 168, 0.08);
  transform: translateY(-1px);
}

/* Common Section Layout */
.how-section {
  display: grid;
  gap: var(--space-8);
  scroll-margin-top: 100px;
}

.how-section__header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.how-section__eyebrow {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #0038A8;
  margin-bottom: var(--space-2);
}

.how-section__title {
  font: 700 clamp(24px, 3.2vw, 36px)/1.2 var(--font-display);
  color: #122142;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
}

.how-section__desc {
  font-size: 15px;
  line-height: 1.6;
  color: var(--texto-suave);
  margin: 0;
}

/* SECCIÓN 1: Arquitectura Técnica en 4 Fases */
.arch-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .arch-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.arch-card {
  background: #ffffff;
  border-radius: 18px;
  padding: var(--space-6) var(--space-8);
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -4px rgba(18, 33, 66, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.arch-card:hover {
  transform: translateY(-3px);
  border-color: #cbd5e1;
  box-shadow: 0 12px 30px -6px rgba(18, 33, 66, 0.1);
}

.arch-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.arch-card__step {
  font-family: var(--font-mono, monospace);
  font-size: 14px;
  font-weight: 800;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.12);
  padding: 4px 10px;
  border-radius: 8px;
}

.arch-card__badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
}

.arch-card__title {
  font-size: 19px;
  font-weight: 700;
  color: #122142;
  margin: 0 0 var(--space-3);
  line-height: 1.3;
}

.arch-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0 0 var(--space-6);
  flex-grow: 1;
}

.arch-card__specs {
  border-top: 1px solid #f1f5f9;
  padding-top: var(--space-4);
  display: grid;
  gap: 8px;
  margin: 0;
}

.arch-card__spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.arch-card__spec-item dt {
  color: #64748b;
}

.arch-card__spec-item dd {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

/* SECCIÓN 2: Categorías Vehiculares */
.cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.cat-tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cat-tab:hover {
  border-color: #cbd5e1;
  color: #122142;
}

.cat-tab.is-active {
  background: #122142;
  border-color: #122142;
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(18, 33, 66, 0.15);
}

.cat-panel {
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding: clamp(24px, 4vw, 36px);
  box-shadow: 0 8px 30px -6px rgba(18, 33, 66, 0.06);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.cat-panel__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-6);
}

@media (min-width: 768px) {
  .cat-panel__header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.cat-panel__badge {
  display: inline-block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #0038A8;
  background: rgba(0, 56, 168, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: var(--space-2);
}

.cat-panel__title {
  font-size: 24px;
  font-weight: 700;
  color: #122142;
  margin: 0 0 4px;
}

.cat-panel__sub {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.cat-panel__tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  font-weight: 600;
  color: #0038A8;
}

.cat-panel__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-8);
}

@media (min-width: 840px) {
  .cat-panel__body {
    grid-template-columns: 1.4fr 1fr;
  }
}

.cat-panel__checklist h4 {
  font-size: 15px;
  font-weight: 700;
  color: #122142;
  margin: 0 0 var(--space-4);
}

.cat-panel__checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-3);
}

.cat-panel__checklist li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  color: #334155;
}

.cat-panel__checklist li svg {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.cat-panel__side {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.cat-panel__reading {
  background: #f8fafc;
  border-radius: 14px;
  padding: var(--space-4);
  border: 1px solid #f1f5f9;
}

.cat-panel__side-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.cat-panel__side-val {
  font-size: 14px;
  font-weight: 700;
  color: #122142;
  margin: 0;
}

.cat-panel__advice {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 14px;
  padding: var(--space-4);
  display: flex;
  gap: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #92400e;
}

.cat-panel__advice svg {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 2px;
}

.cat-panel__advice p {
  margin: 0;
}

/* SECCIÓN 3: Marco Legal */
.law-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
}

@media (min-width: 768px) {
  .law-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.law-card {
  background: #ffffff;
  border-radius: 18px;
  padding: var(--space-6);
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 16px -4px rgba(18, 33, 66, 0.04);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.law-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(0, 56, 168, 0.08);
  color: #0038A8;
  display: grid;
  place-items: center;
}

.law-card__title {
  font-size: 17px;
  font-weight: 700;
  color: #122142;
  margin: 0;
}

.law-card__desc {
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

/* SECCIÓN 5: Acordeón de FAQs */
.faq-list {
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  gap: var(--space-3);
  width: 100%;
}

.faq-item {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.faq-item.is-open {
  border-color: #0038A8;
  box-shadow: 0 4px 16px -2px rgba(0, 56, 168, 0.08);
}

.faq-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 16px 20px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.faq-btn__q {
  font-size: 15px;
  font-weight: 600;
  color: #122142;
  line-height: 1.4;
}

.faq-btn__icon {
  color: #64748b;
  display: grid;
  place-items: center;
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

.faq-item.is-open .faq-btn__icon {
  transform: rotate(180deg);
  color: #0038A8;
}

.faq-answer {
  padding: 0 20px 18px;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 14px;
}

.faq-answer p {
  margin: 0;
}

/* Call to Action Footer */
.how-cta__card {
  position: relative;
  border-radius: 24px;
  background: #0038A8;
  color: #ffffff;
  overflow: hidden;
  padding: clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px);
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(0, 56, 168, 0.35);
}

.how-cta__tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b 0% 33%, #0038A8 33% 66%, #dc2626 66% 100%);
}

.how-cta__content {
  max-width: 680px;
  margin: 0 auto;
}

.how-cta__tag {
  display: inline-block;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 3px 10px;
  border-radius: 9999px;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-4);
}

.how-cta__title {
  font: 800 clamp(26px, 3.8vw, 40px)/1.2 var(--font-display);
  color: #ffffff;
  margin: 0 0 var(--space-3);
  letter-spacing: -0.02em;
}

.how-cta__desc {
  font-size: clamp(15px, 1.6vw, 17px);
  line-height: 1.6;
  color: #e0f2fe;
  margin: 0 0 var(--space-8);
}

.how-cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}

.how-cta__btn {
  background: #ffffff;
  color: #0038A8;
  border-color: #ffffff;
  font-weight: 700;
}

.how-cta__btn:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.how-cta__btn-sec {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.how-cta__btn-sec:hover {
  background: rgba(255, 255, 255, 0.22);
  border-color: #ffffff;
}

.how-cta__btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 12px;
  background: transparent;
  color: #fef08a;
  border: 1px solid rgba(254, 240, 138, 0.4);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.how-cta__btn-ghost:hover {
  background: rgba(254, 240, 138, 0.1);
  border-color: #fef08a;
  color: #ffffff;
}
</style>
