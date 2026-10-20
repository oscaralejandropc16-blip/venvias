<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'

export default defineComponent({
  name: 'AccountRechargeModal',
  components: { AppIcon },
  props: {
    currentBalance: { type: Number, required: true },
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const presetAmounts = [100, 200, 500, 1000]
    const selectedAmount = ref<number>(200)
    const customAmount = ref<string>('')
    const isCustom = ref(false)

    // Métodos de pago
    const paymentMethod = ref<'debit' | 'pagomovil'>('debit')
    const mobileReference = ref('')
    const copiedFeedback = ref(false)

    // Estados de flujo
    const isProcessing = ref(false)
    const isSuccess = ref(false)
    const generatedReceipt = ref('')
    const transactionDate = ref('')

    const effectiveAmount = computed(() => {
      if (isCustom.value) {
        const parsed = parseFloat(customAmount.value)
        return isNaN(parsed) || parsed <= 0 ? 0 : parsed
      }
      return selectedAmount.value
    })

    const newEstimatedBalance = computed(() => {
      return props.currentBalance + effectiveAmount.value
    })

    const estimatedPasses = computed(() => {
      return Math.max(1, Math.floor(effectiveAmount.value / 16.5))
    })

    const totalAvailablePasses = computed(() => {
      return Math.max(1, Math.floor(newEstimatedBalance.value / 16.5))
    })

    const selectPreset = (amt: number) => {
      isCustom.value = false
      selectedAmount.value = amt
      customAmount.value = ''
    }

    const onCustomInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      customAmount.value = val
      isCustom.value = true
    }

    const copyPagoMovilData = async () => {
      const text = 'Banco: 0102 (BDV)\nTeléfono: 0412-1234567\nRIF: J-40192841-2\nBeneficiario: VenVías Nacional'
      try {
        await navigator.clipboard.writeText(text)
        copiedFeedback.value = true
        setTimeout(() => {
          copiedFeedback.value = false
        }, 2500)
      } catch {
        copiedFeedback.value = true
        setTimeout(() => {
          copiedFeedback.value = false
        }, 2500)
      }
    }

    const canSubmit = computed(() => {
      if (effectiveAmount.value < 10) return false
      if (paymentMethod.value === 'pagomovil' && mobileReference.value.trim().length < 4) {
        return false
      }
      return true
    })

    const formatCurrency = (val: number) => {
      return `Bs. ${val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const executeRecharge = async () => {
      if (!canSubmit.value || isProcessing.value) return

      isProcessing.value = true

      // Simulación de acreditación bancaria inmediata
      await new Promise((resolve) => setTimeout(resolve, 950))

      const randomRef = 'REC-' + Math.floor(100000 + Math.random() * 900000)
      const now = new Date()
      transactionDate.value = now.toLocaleDateString('es-VE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      generatedReceipt.value = randomRef
      isProcessing.value = false
      isSuccess.value = true

      emit('success', {
        amount: effectiveAmount.value,
        receipt: randomRef,
        method: paymentMethod.value === 'debit' ? 'Débito Automático BDV' : 'Pago Móvil Interbancario',
      })
    }

    return {
      presetAmounts,
      selectedAmount,
      customAmount,
      isCustom,
      paymentMethod,
      mobileReference,
      copiedFeedback,
      isProcessing,
      isSuccess,
      generatedReceipt,
      transactionDate,
      effectiveAmount,
      newEstimatedBalance,
      estimatedPasses,
      totalAvailablePasses,
      selectPreset,
      onCustomInput,
      copyPagoMovilData,
      canSubmit,
      formatCurrency,
      executeRecharge,
    }
  },
})
</script>

<template>
  <div class="modal-backdrop" @click.self="!isProcessing && $emit('close')">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-recharge-title">
      <!-- Barra Tricolor Superior VenVías -->
      <div class="modal-tricolor" aria-hidden="true"></div>

      <!-- Cabecera Compacta y Elegante -->
      <header class="modal-header">
        <div class="modal-header__brand">
          <div class="modal-icon-badge">
            <AppIcon name="rayo" :size="18" />
          </div>
          <div>
            <h3 id="modal-recharge-title" class="modal-title">Recargar Saldo de Cuenta</h3>
            <p class="modal-subtitle">Abono instantáneo para garantizar el paso continuo de tu flota.</p>
          </div>
        </div>

        <button
          v-if="!isProcessing"
          type="button"
          class="btn-close"
          aria-label="Cerrar ventana"
          @click="$emit('close')"
        >
          <AppIcon name="close" :size="16" />
        </button>
      </header>

      <!-- Estado 1: Formulario Principal Optimizado -->
      <div v-if="!isProcessing && !isSuccess" class="modal-body">
        <!-- Paso 1: Monto a Recargar -->
        <section class="section-group">
          <div class="section-title-row">
            <span class="step-num">1</span>
            <span class="section-heading">Monto a recargar</span>
          </div>

          <!-- Cuadrícula 4 Botones Preset -->
          <div class="amount-grid">
            <button
              v-for="amt in presetAmounts"
              :key="amt"
              type="button"
              class="amount-card"
              :class="{ 'is-selected': !isCustom && selectedAmount === amt }"
              @click="selectPreset(amt)"
            >
              <span class="amount-card__curr">Bs.</span>
              <strong class="amount-card__val">{{ amt }}</strong>
              <span class="amount-card__tag">~{{ Math.floor(amt / 16.5) }} tránsitos</span>
            </button>
          </div>

          <!-- Monto Libre Compacto -->
          <div class="custom-bar">
            <span class="custom-bar__label">¿Otro monto?</span>
            <div class="custom-bar__input-wrap" :class="{ 'is-active': isCustom }">
              <span class="custom-bar__prefix">Bs.</span>
              <input
                type="number"
                min="10"
                step="10"
                placeholder="Escribe el monto"
                class="custom-bar__input"
                :value="customAmount"
                @input="onCustomInput"
              />
              <button
                v-if="isCustom && customAmount"
                type="button"
                class="custom-bar__clear"
                title="Restablecer"
                @click="selectPreset(200)"
              >
                ✕
              </button>
            </div>
          </div>
        </section>

        <!-- Paso 2: Método de Pago (Horizontal Side-by-Side para ahorrar altura) -->
        <section class="section-group">
          <div class="section-title-row">
            <span class="step-num">2</span>
            <span class="section-heading">Forma de pago</span>
          </div>

          <div class="methods-grid">
            <!-- Opción A: Débito Inmediato BDV -->
            <label
              class="method-pill"
              :class="{ 'is-active': paymentMethod === 'debit' }"
            >
              <input
                v-model="paymentMethod"
                type="radio"
                value="debit"
                class="sr-only"
              />
              <div class="method-pill__radio">
                <span v-if="paymentMethod === 'debit'" class="radio-core"></span>
              </div>
              <div class="method-pill__icon">
                <AppIcon name="tarjeta" :size="16" />
              </div>
              <div class="method-pill__text">
                <div class="method-pill__title">
                  <strong>Débito BDV</strong>
                  <span class="badge-1clic">1 Clic</span>
                </div>
                <div class="method-pill__sub">Cuenta ****4819</div>
              </div>
            </label>

            <!-- Opción B: Pago Móvil -->
            <label
              class="method-pill"
              :class="{ 'is-active': paymentMethod === 'pagomovil' }"
            >
              <input
                v-model="paymentMethod"
                type="radio"
                value="pagomovil"
                class="sr-only"
              />
              <div class="method-pill__radio">
                <span v-if="paymentMethod === 'pagomovil'" class="radio-core"></span>
              </div>
              <div class="method-pill__icon method-pill__icon--pm">
                <AppIcon name="rayo" :size="16" />
              </div>
              <div class="method-pill__text">
                <div class="method-pill__title">
                  <strong>Pago Móvil</strong>
                </div>
                <div class="method-pill__sub">Cualquier banco</div>
              </div>
            </label>
          </div>

          <!-- Si selecciona Pago Móvil, se despliegan datos -->
          <div v-if="paymentMethod === 'pagomovil'" class="pm-box">
            <div class="pm-box__header">
              <span class="pm-box__caption">Datos para transferir:</span>
              <button
                type="button"
                class="btn-copy"
                @click="copyPagoMovilData"
              >
                <AppIcon v-if="copiedFeedback" name="check" :size="12" />
                <span>{{ copiedFeedback ? '¡Copiado!' : 'Copiar datos' }}</span>
              </button>
            </div>

            <div class="pm-data-row">
              <span><strong>0102 (BDV)</strong></span>
              <span>·</span>
              <span>Tel: <strong>0412-1234567</strong></span>
              <span>·</span>
              <span>RIF: <strong>J-40192841-2</strong></span>
            </div>

            <div class="pm-ref-row">
              <label for="pm-ref-field" class="pm-ref-label">Nro. de referencia:</label>
              <input
                id="pm-ref-field"
                v-model="mobileReference"
                type="text"
                maxlength="8"
                placeholder="6 u 8 dígitos del comprobante"
                class="pm-ref-field"
              />
            </div>
          </div>
        </section>

        <!-- Proyección Financiera Compacta (The WOW Strip) -->
        <div class="balance-strip">
          <div class="balance-strip__math">
            <div class="math-col">
              <span class="math-label">Saldo Actual</span>
              <span class="math-val">{{ formatCurrency(currentBalance) }}</span>
            </div>

            <span class="math-sign" aria-hidden="true">+</span>

            <div class="math-col math-col--credit">
              <span class="math-label">Recarga</span>
              <span class="math-val text-emerald-700">+{{ formatCurrency(effectiveAmount) }}</span>
            </div>

            <span class="math-sign" aria-hidden="true">➔</span>

            <div class="math-col math-col--result">
              <span class="math-label">Nuevo Saldo</span>
              <strong class="math-total">{{ formatCurrency(newEstimatedBalance) }}</strong>
            </div>
          </div>

          <div class="balance-strip__note">
            <span class="live-dot" aria-hidden="true"></span>
            <span>Disponibilidad estimada: <strong>~{{ totalAvailablePasses }} tránsitos</strong> en peajes nacionales</span>
          </div>
        </div>

        <!-- Botones de Acción -->
        <footer class="modal-footer">
          <button
            type="button"
            class="btn-back"
            @click="$emit('close')"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="btn-cta"
            :disabled="!canSubmit"
            @click="executeRecharge"
          >
            <AppIcon name="rayo" :size="16" />
            <span>Pagar y Acreditar {{ formatCurrency(effectiveAmount) }}</span>
          </button>
        </footer>
      </div>

      <!-- Estado 2: Procesando -->
      <div v-else-if="isProcessing" class="state-feedback">
        <div class="radar-spinner">
          <div class="radar-dot"></div>
        </div>
        <h4 class="state-heading">Validando transacción con pasarela bancaria</h4>
        <p class="state-caption">
          Confirmando la acreditación inmediata con tu banco...
        </p>
      </div>

      <!-- Estado 3: Éxito y Recibo Fiscal -->
      <div v-else-if="isSuccess" class="state-feedback state-feedback--done">
        <div class="check-hero">
          <AppIcon name="check" :size="30" />
        </div>

        <h4 class="state-heading text-emerald-800">¡Recarga Acreditada Exitosamente!</h4>
        <p class="state-caption">
          Tu saldo empresarial ya está activo en todas las cabinas del país.
        </p>

        <!-- Tarjeta de Comprobante -->
        <div class="receipt-card">
          <div class="receipt-header">
            <span>Comprobante de Pago Electrónico</span>
            <strong>{{ generatedReceipt }}</strong>
          </div>

          <div class="receipt-details">
            <div class="receipt-row">
              <span class="receipt-label">Monto Acreditado:</span>
              <strong class="receipt-value text-emerald-700">{{ formatCurrency(effectiveAmount) }}</strong>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Nuevo Saldo Disponible:</span>
              <strong class="receipt-value text-slate-900">{{ formatCurrency(newEstimatedBalance) }}</strong>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Fecha y Hora:</span>
              <span class="receipt-value">{{ transactionDate }}</span>
            </div>
            <div class="receipt-row">
              <span class="receipt-label">Forma de Pago:</span>
              <span class="receipt-value">{{ paymentMethod === 'debit' ? 'Débito IPG BDV' : 'Pago Móvil' }}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="btn-cta btn-cta--finish"
          @click="$emit('close')"
        >
          <span>Listo, regresar a mi cuenta</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   MODAL DE RECARGA DIRECTA DE CUENTA - REDISEÑO ULTRA COMPACTO & ELEGANTE
   ========================================================================== */

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 8px;
  animation: acctFadeIn 0.2s ease-out;
}

.modal-dialog {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 16px;
  box-shadow:
    0 24px 50px -10px rgba(15, 23, 42, 0.3),
    0 4px 16px rgba(15, 23, 42, 0.08);
  width: min(100%, 500px);
  max-height: 98vh;
  overflow-y: auto;
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Barra Tricolor Venezolana */
.modal-tricolor {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  z-index: 10;
}

/* Cabecera */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px 8px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-icon-badge {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  color: #ffffff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 87, 163, 0.25);
}

.modal-title {
  margin: 0;
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 16.5px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}

.modal-subtitle {
  margin: 1px 0 0;
  font-size: 11.5px;
  color: #64748b;
  line-height: 1.25;
}

.btn-close {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 6px;
  display: grid;
  place-items: center;
  transition: all 0.15s ease;
}

.btn-close:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #cf142b;
}

/* Cuerpo */
.modal-body {
  padding: 10px 18px 12px;
  display: grid;
  gap: 9px;
}

.section-group {
  display: grid;
  gap: 5px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.step-num {
  width: 17px;
  height: 17px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #0057a3;
  font-size: 10.5px;
  font-weight: 800;
  display: grid;
  place-items: center;
  border: 1px solid #e2e8f0;
}

.section-heading {
  font-size: 12.5px;
  font-weight: 700;
  color: #1e293b;
}

/* Cuadrícula de Montos */
.amount-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

@media (max-width: 480px) {
  .amount-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.amount-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6px 3px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
}

.amount-card:hover:not(.is-selected) {
  border-color: #93c5fd;
  background: #f8fafc;
  transform: translateY(-1px);
}

.amount-card.is-selected {
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  border-color: #0057a3;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(0, 87, 163, 0.28);
}

.amount-card__curr {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.8;
}

.amount-card__val {
  font-family: var(--font-display, sans-serif);
  font-size: 17.5px;
  font-weight: 800;
  line-height: 1.1;
  margin: 1px 0;
}

.amount-card__tag {
  font-size: 9px;
  opacity: 0.85;
  font-weight: 500;
}

/* Barra de Monto Libre */
.custom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 3px 8px;
}

.custom-bar__label {
  font-size: 11.5px;
  color: #64748b;
  font-weight: 500;
}

.custom-bar__input-wrap {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 5px;
  padding: 0 6px;
  width: 150px;
  transition: all 0.18s ease;
}

.custom-bar__input-wrap:focus-within,
.custom-bar__input-wrap.is-active {
  border-color: #0057a3;
  box-shadow: 0 0 0 2px rgba(0, 87, 163, 0.12);
}

.custom-bar__prefix {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  margin-right: 3px;
}

.custom-bar__input {
  width: 100%;
  border: none;
  background: transparent;
  padding: 4px 0;
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
  outline: none;
}

.custom-bar__clear {
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  font-size: 10px;
  padding: 2px;
}

.custom-bar__clear:hover {
  color: #cf142b;
}

/* Métodos de Pago Horizontales (2 Columnas) */
.methods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

@media (max-width: 480px) {
  .methods-grid {
    grid-template-columns: 1fr;
  }
}

.method-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.method-pill:hover:not(.is-active) {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.method-pill.is-active {
  background: #f0f7ff;
  border-color: #0057a3;
  box-shadow: 0 2px 6px rgba(0, 87, 163, 0.08);
}

.method-pill__radio {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1.5px solid #94a3b8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.method-pill.is-active .method-pill__radio {
  border-color: #0057a3;
}

.radio-core {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #0057a3;
}

.method-pill__icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #e0f2fe;
  color: #0284c7;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.method-pill__icon--pm {
  background: #fef3c7;
  color: #b45309;
}

.method-pill__text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.method-pill__title {
  font-size: 12.5px;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.badge-1clic {
  font-size: 9.5px;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  padding: 1px 4px;
  border-radius: 3px;
}

.method-pill__sub {
  font-size: 10.5px;
  color: #64748b;
  white-space: nowrap;
}

/* Despliegue de Pago Móvil */
.pm-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 10px;
  display: grid;
  gap: 6px;
  animation: acctFadeIn 0.2s ease-out;
}

.pm-box__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pm-box__caption {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
}

.btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 6px;
  font-size: 10.5px;
  font-weight: 600;
  color: #0057a3;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-copy:hover {
  background: #eff6ff;
  border-color: #0057a3;
}

.pm-data-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 11.5px;
  color: #334155;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 8px;
}

.pm-ref-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pm-ref-label {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.pm-ref-field {
  flex: 1;
  padding: 5px 8px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 12px;
  font-family: var(--font-mono, monospace);
  font-weight: 600;
  outline: none;
}

.pm-ref-field:focus {
  border-color: #0057a3;
}

/* Proyección Financiera (The WOW Strip) */
.balance-strip {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 6px 10px;
  display: grid;
  gap: 3px;
}

.balance-strip__math {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.math-col {
  display: flex;
  flex-direction: column;
}

.math-label {
  font-size: 10px;
  color: #64748b;
  font-weight: 500;
}

.math-val {
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.math-col--credit .math-val {
  color: #15803d;
}

.math-col--result .math-label {
  color: #0057a3;
  font-weight: 700;
}

.math-total {
  font-family: var(--font-display, sans-serif);
  font-size: 14.5px;
  font-weight: 800;
  color: #0057a3;
}

.math-sign {
  color: #94a3b8;
  font-weight: bold;
  font-size: 11px;
}

.balance-strip__note {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  color: #475569;
  border-top: 1px solid #e2e8f0;
  padding-top: 3px;
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

/* Pie del Modal */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 2px;
}

.btn-back {
  padding: 8px 13px;
  font-size: 12.5px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-back:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.btn-cta {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 13.5px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #0057a3 0%, #0a6cc4 100%);
  border: none;
  border-radius: 7px;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(0, 87, 163, 0.25);
  transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-cta:hover:not(:disabled) {
  background: linear-gradient(135deg, #004b8d 0%, #0861b0 100%);
  transform: translateY(-1px);
  box-shadow: 0 5px 16px rgba(0, 87, 163, 0.32);
}

.btn-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-cta--finish {
  margin-top: 10px;
  width: 100%;
}

/* Estados de Procesamiento y Éxito */
.state-feedback {
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.radar-spinner {
  width: 42px;
  height: 42px;
  border: 3px solid #e2e8f0;
  border-top-color: #0057a3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: grid;
  place-items: center;
  margin-bottom: 2px;
}

.radar-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0057a3;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.check-hero {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  display: grid;
  place-items: center;
  margin-bottom: 2px;
  box-shadow: 0 3px 12px rgba(22, 163, 74, 0.18);
}

.state-heading {
  margin: 0;
  font-family: var(--font-display, sans-serif);
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.state-caption {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  max-width: 40ch;
  line-height: 1.4;
}

/* Recibo Digital */
.receipt-card {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 6px;
  text-align: left;
}

.receipt-header {
  background: #f1f5f9;
  padding: 8px 12px;
  font-size: 11.5px;
  font-weight: 700;
  color: #334155;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
}

.receipt-details {
  padding: 10px 12px;
  display: grid;
  gap: 6px;
  font-size: 12.5px;
}

.receipt-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.receipt-label {
  color: #64748b;
}

.receipt-value {
  font-weight: 600;
  color: #0f172a;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
