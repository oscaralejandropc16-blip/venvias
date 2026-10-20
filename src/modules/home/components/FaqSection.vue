<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import type { IconName } from '@/shared/icons/iconPaths'
import tollBg from '@/assets/hero/highway-night.jpg'

interface FaqItem {
  id: string
  icon: IconName
  q: string
  a: string
  actionLabel?: string
  actionTo?: { name: string } | string
}

export default defineComponent({
  name: 'FaqSection',
  components: { AppIcon },
  data() {
    return {
      tollBg,
      openIndex: 0 as number | null,
      items: [
        {
          id: 'faq-registro',
          icon: 'placa',
          q: '¿Necesito registrarme para recargar?',
          a: 'No. No necesitas crear usuario, contraseñas ni correos obligatorios. Solo ingresas la placa de tu vehículo, seleccionas el monto y cancelas en Bolívares con Pago Móvil o tarjeta. La cuenta es 100% opcional si deseas administrar flotas.',
          actionLabel: 'Recargar una placa ahora',
          actionTo: { name: ROUTE_NAMES.recharge },
        },
        {
          id: 'faq-tag',
          icon: 'rayo',
          q: '¿Necesito un TAG pegado en el parabrisas?',
          a: 'No es indispensable. Si ya tienes un TAG VenVías adherido a tu vehículo, sigue utilizándolo normalmente mediante la antena RFID. Si no tienes TAG, tu matrícula es suficiente: las cámaras digitales de alta velocidad leen tu placa al pasar y descuentan la tarifa de tu saldo.',
        },
        {
          id: 'faq-deuda',
          icon: 'alert',
          q: '¿Qué pasa si paso por un peaje sin saldo?',
          a: 'Tu paso no se interrumpe ni se retiene el vehículo en cabina. La tarifa se registra como un saldo deudor pendiente asociado exclusivamente a esa matrícula, el cual puedes consultar y pagar en línea cuando lo desees.',
          actionLabel: 'Consultar o pagar saldo deudor',
          actionTo: { name: ROUTE_NAMES.debt },
        },
        {
          id: 'faq-error-placa',
          icon: 'check',
          q: '¿Y si cometo un error al escribir la placa?',
          a: 'Antes de realizar cualquier pago, el sistema te muestra una pantalla de confirmación con la matrícula y el monto exacto para que los verifiques con tranquilidad. Si notas algún error tipográfico, puedes corregirlo al instante sin comisiones.',
        },
        {
          id: 'faq-cobertura',
          icon: 'peaje',
          q: '¿Dónde funciona el sistema de pago por placa?',
          a: 'Está operativo en los peajes nacionales automatizados debidamente identificados con tecnología VenVías en las principales arterias viales del país, activo las 24 horas y los 365 días del año.',
          actionLabel: 'Ver peajes habilitados y tarifas',
          actionTo: { name: ROUTE_NAMES.tolls },
        },
        {
          id: 'faq-institucional',
          icon: 'carro',
          q: '¿Quién está detrás de VenVías?',
          a: 'VenVías es el sistema digital oficial de telepeaje y recaudo por matrícula vehicular de Venezuela en Movimiento, con conexión interbancaria directa con el sistema financiero nacional para agilizar el tránsito en todo el territorio.',
        },
      ] as FaqItem[],
    }
  },
  methods: {
    toggle(index: number) {
      this.openIndex = this.openIndex === index ? null : index
    },
    isOpen(index: number): boolean {
      return this.openIndex === index
    },
  },
})
</script>

<template>
  <section class="faq-section wrap" aria-labelledby="faq-title">
    <div class="faq-container">
      <!-- Fondo Fotográfico del Peaje con Velo Cinematográfico -->
      <div class="faq-container__bg" aria-hidden="true">
        <img
          :src="tollBg"
          alt="Peaje Nacional VenVías"
          class="faq-container__photo"
          loading="lazy"
        />
        <div class="faq-container__scrim"></div>
        <div class="faq-container__glow"></div>
      </div>

      <!-- Contenido Principal: 2 Columnas -->
      <div class="faq-content">
        <!-- Columna Izquierda: Información de Cabecera y Tarjeta de Operaciones de Peaje -->
        <div class="faq-sidebar">
          <div class="faq-sidebar__header">
            <span class="faq-sidebar__eyebrow">
              Tecnología Vial & Peajes
            </span>
            <h2 id="faq-title" class="faq-sidebar__title">
              Preguntas frecuentes
            </h2>
            <p class="faq-sidebar__desc">
              Todo lo que necesitas saber sobre el paso continuo, la lectura automática de matrícula y el funcionamiento de los peajes en Venezuela.
            </p>
          </div>

          <!-- Tarjeta de Tecnología y Operación de Peajes (Sin repetir teléfonos) -->
          <div class="faq-toll-card">
            <div class="faq-toll-card__badge">
              <span class="faq-toll-card__pulse" aria-hidden="true"></span>
              <span class="faq-toll-card__badge-text">Operación Digital en Cabina</span>
            </div>

            <h3 class="faq-toll-card__title">¿Cómo pasas por el peaje?</h3>
            <p class="faq-toll-card__subtitle">
              El sistema combina visión artificial y conciliación bancaria instantánea para que nunca tengas que detener tu marcha.
            </p>

            <ul class="faq-toll-features">
              <li class="faq-toll-feature">
                <span class="faq-toll-feature__icon" aria-hidden="true">
                  <AppIcon name="peaje" :size="16" />
                </span>
                <div class="faq-toll-feature__text">
                  <strong>Lectura óptica ALPR</strong>
                  <span>Cámaras de alta definición identifican tu placa en menos de 0.3 segundos.</span>
                </div>
              </li>

              <li class="faq-toll-feature">
                <span class="faq-toll-feature__icon" aria-hidden="true">
                  <AppIcon name="rayo" :size="16" />
                </span>
                <div class="faq-toll-feature__text">
                  <strong>Débito automático en Bolívares</strong>
                  <span>El cobro se descuenta de tu saldo oficial sin trámites en taquilla.</span>
                </div>
              </li>

              <li class="faq-toll-feature">
                <span class="faq-toll-feature__icon" aria-hidden="true">
                  <AppIcon name="check" :size="16" />
                </span>
                <div class="faq-toll-feature__text">
                  <strong>Paso libre garantizado</strong>
                  <span>Sin filas ni efectivo: la barrera se eleva de manera inmediata.</span>
                </div>
              </li>
            </ul>

            <div class="faq-toll-card__action">
              <RouterLink :to="{ name: 'tolls' }" class="faq-toll-btn">
                <span>Ver peajes activos y tarifas</span>
                <AppIcon name="arrow" :size="14" />
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Columna Derecha: Acordeón Interactivo Glassmorphism -->
        <div class="faq-accordion" role="region" aria-label="Preguntas y respuestas sobre el sistema de peajes">
          <div
            v-for="(item, index) in items"
            :key="item.id"
            class="faq-card"
            :class="{ 'is-open': isOpen(index) }"
          >
            <!-- Botón de Pregunta / Trigger -->
            <button
              type="button"
              class="faq-card__trigger"
              :aria-expanded="isOpen(index)"
              :aria-controls="`faq-ans-${item.id}`"
              :id="`faq-btn-${item.id}`"
              @click="toggle(index)"
            >
              <div class="faq-card__question-group">
                <span class="faq-card__icon-box" :class="{ 'is-active': isOpen(index) }" aria-hidden="true">
                  <AppIcon :name="item.icon" :size="18" />
                </span>
                <span class="faq-card__question-text">{{ item.q }}</span>
              </div>

              <span class="faq-card__chevron-box" :class="{ 'is-active': isOpen(index) }" aria-hidden="true">
                <AppIcon name="chevron" :size="15" />
              </span>
            </button>

            <!-- Contenido Colapsable con Grid CSS Fluido -->
            <div
              :id="`faq-ans-${item.id}`"
              class="faq-card__collapse"
              role="region"
              :aria-labelledby="`faq-btn-${item.id}`"
            >
              <div class="faq-card__inner">
                <p class="faq-card__answer">
                  {{ item.a }}
                </p>

                <!-- Enlace de acción contextual si aplica -->
                <div v-if="item.actionLabel && item.actionTo" class="faq-card__action-row">
                  <RouterLink
                    v-if="typeof item.actionTo === 'object'"
                    :to="item.actionTo"
                    class="faq-card__action-btn"
                  >
                    <span>{{ item.actionLabel }}</span>
                    <AppIcon name="arrow" :size="13" />
                  </RouterLink>
                  <a
                    v-else-if="typeof item.actionTo === 'string'"
                    :href="item.actionTo"
                    class="faq-card__action-btn"
                  >
                    <span>{{ item.actionLabel }}</span>
                    <AppIcon name="arrow" :size="13" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-section {
  padding-block: clamp(28px, 4.5vw, 56px);
}

.faq-container {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  background-color: #050e1f;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 25px 50px -12px rgba(2, 6, 23, 0.35);
}

/* Capa de Fondo Fotográfico de Peaje */
.faq-container__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.faq-container__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 55%;
  opacity: 0.32;
  filter: contrast(1.15) saturate(1.25) brightness(0.9);
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-container:hover .faq-container__photo {
  transform: scale(1.02);
}

.faq-container__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(4, 11, 26, 0.95) 0%,
    rgba(5, 14, 34, 0.90) 42%,
    rgba(3, 9, 22, 0.96) 100%
  );
}

.faq-container__glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 56, 168, 0.35) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

/* Contenido sobre el fondo */
.faq-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(28px, 3.8vw, 48px);
  padding: clamp(24px, 4vw, 48px);
}

@media (min-width: 960px) {
  .faq-content {
    grid-template-columns: 1fr 1.55fr;
    align-items: start;
    gap: 48px;
  }
}

/* Columna Izquierda: Sidebar */
.faq-sidebar {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.faq-sidebar__header {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-sidebar__eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  display: flex;
  align-items: center;
  gap: 8px;
}

.faq-sidebar__eyebrow::before {
  content: '';
  display: inline-block;
  width: 18px;
  height: 2px;
  background-color: #38bdf8;
  border-radius: 2px;
}

.faq-sidebar__title {
  margin: 0;
  font-size: clamp(28px, 3.2vw, 38px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
}

.faq-sidebar__desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #cbd5e1;
}

/* Tarjeta de Tecnología y Operación de Peaje */
.faq-toll-card {
  background: rgba(15, 23, 42, 0.68);
  border: 1px solid rgba(56, 189, 248, 0.22);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.faq-toll-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #0038A8 0%, #38bdf8 50%, #0038A8 100%);
}

.faq-toll-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.faq-toll-card__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
  animation: faqPulse 2s infinite;
}

@keyframes faqPulse {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.35);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(16, 185, 129, 0.05);
  }
}

.faq-toll-card__badge-text {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #38bdf8;
}

.faq-toll-card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.25;
}

.faq-toll-card__subtitle {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #94a3b8;
}

.faq-toll-features {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-toll-feature {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.faq-toll-feature__icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: rgba(0, 56, 168, 0.35);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.faq-toll-feature__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.faq-toll-feature__text strong {
  font-size: 13.5px;
  font-weight: 700;
  color: #e2e8f0;
}

.faq-toll-feature__text span {
  font-size: 12px;
  line-height: 1.45;
  color: #94a3b8;
}

.faq-toll-card__action {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.faq-toll-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 16px;
  background: rgba(0, 56, 168, 0.45);
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 12px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
}

.faq-toll-btn:hover {
  background: #0038A8;
  border-color: #38bdf8;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 56, 168, 0.4);
}

/* Columna Derecha: Acordeón Glassmorphism */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-card {
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.faq-card:hover {
  background: rgba(15, 23, 42, 0.78);
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

.faq-card.is-open {
  background: rgba(15, 23, 42, 0.88);
  border-color: rgba(56, 189, 248, 0.55);
  box-shadow: 0 10px 30px -5px rgba(0, 56, 168, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.faq-card.is-open::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3.5px;
  background: linear-gradient(180deg, #38bdf8 0%, #0038A8 100%);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
}

/* Botón Trigger */
.faq-card__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background-color 0.15s ease;
}

.faq-card__trigger:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: -2px;
}

.faq-card__question-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.faq-card__icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.faq-card__icon-box.is-active,
.faq-card:hover .faq-card__icon-box {
  background: rgba(0, 56, 168, 0.35);
  border-color: rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}

.faq-card__question-text {
  font-size: 15.5px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1.35;
  transition: color 0.2s ease;
}

.faq-card.is-open .faq-card__question-text {
  color: #ffffff;
}

.faq-card__chevron-box {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-card__chevron-box.is-active {
  transform: rotate(180deg);
  background: #0038A8;
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

/* Colapso suave usando Grid CSS */
.faq-card__collapse {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  opacity: 0;
}

.faq-card.is-open .faq-card__collapse {
  grid-template-rows: 1fr;
  opacity: 1;
}

.faq-card__inner {
  overflow: hidden;
  padding: 0 20px 20px 70px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 640px) {
  .faq-card__inner {
    padding: 0 16px 16px 16px;
  }
}

.faq-card__answer {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.65;
  color: #cbd5e1;
}

.faq-card__action-row {
  display: flex;
  align-items: center;
  padding-top: 4px;
}

.faq-card__action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  background: rgba(0, 56, 168, 0.35);
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-size: 12.5px;
  font-weight: 700;
  color: #e0f2fe;
  text-decoration: none;
  transition: all 0.2s ease;
}

.faq-card__action-btn:hover {
  background: #0038A8;
  border-color: #38bdf8;
  color: #ffffff;
  transform: translateX(2px);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.3);
}
</style>
