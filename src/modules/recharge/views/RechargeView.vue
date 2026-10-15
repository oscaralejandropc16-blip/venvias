<script lang="ts">
import { defineComponent, type VNode } from 'vue'
import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateField from '@/modules/plates/components/PlateField.vue'
import PlateImage from '@/modules/plates/components/PlateImage.vue'
import { PLATE_PROMPTS, plateReadyLabel } from '@/modules/plates/constants/plateEntry.messages'
import { formatPlate } from '@/modules/plates/utils/plate'
import { ROUTE_NAMES } from '@/core/constants/routing'
import IpgOtpVerification from '@/modules/payments/components/IpgOtpVerification.vue'
import IpgPayBar from '@/modules/payments/components/IpgPayBar.vue'
import IpgPayerForm from '@/modules/payments/components/IpgPayerForm.vue'
import IpgPaymentOutcome from '@/modules/payments/components/IpgPaymentOutcome.vue'
import { IPG_PAYMENT_TEXT, ipgPaymentSummary } from '@/modules/payments/constants/ipgPayment'
import type { IpgPaymentStage } from '@/modules/payments/types/IpgPaymentStage'
import AmountPicker from '../components/AmountPicker.vue'
import PaymentMethodPicker from '../components/PaymentMethodPicker.vue'
import RechargeContextBar from '../components/RechargeContextBar.vue'
import RechargeContextCard from '../components/RechargeContextCard.vue'
import RechargeProgress from '../components/RechargeProgress.vue'
import RechargeReceiptCard from '../components/RechargeReceiptCard.vue'
import { useRechargeFlow } from '../composables/useRechargeFlow'
import {
  RECHARGE_IPG_STEP_TEXT,
  RECHARGE_GUIDE,
  RECHARGE_STEPS,
  RECHARGE_STEP_TEXT,
  RECHARGE_TEXT,
  customAmountHint,
  rechargePayLabel,
  rechargeStepLabel,
} from '../constants/recharge'
import type { RechargeStep } from '../types/RechargeStep'

const STEP_ORDER: RechargeStep[] = RECHARGE_STEPS.map((s) => s.id)

function queryText(query: LocationQuery, key: string): string {
  const value = query[key]
  return typeof value === 'string' ? value : ''
}

function parseStep(raw: string): RechargeStep | null {
  return STEP_ORDER.includes(raw as RechargeStep) ? (raw as RechargeStep) : null
}

type Focusable = { focus: () => void } | undefined

const IPG_METHOD_ID = 'ipg'
// Alto del encabezado fijo en escritorio (en teléfono mide menos): la ficha «sale» al pasar por debajo.
const HEADER_OFFSET = 76
// Fuera del estado reactivo: crear o cortar un observador no debe redibujar la vista.
type ObserverKey = 'context' | 'ipgForm'
const viewObservers = new WeakMap<object, Map<ObserverKey, IntersectionObserver>>()

/**
 * Recarga en cuatro pasos con el paso en la URL (`?paso=monto&placa=AB123CD&monto=monto-1`).
 * La vista decide la navegación y cuida que no se llegue a un paso sin lo que necesita.
 */
export default defineComponent({
  name: 'RechargeView',
  components: {
    AppIcon,
    AmountPicker,
    IpgOtpVerification,
    IpgPayBar,
    IpgPayerForm,
    IpgPaymentOutcome,
    PaymentMethodPicker,
    PlateField,
    PlateImage,
    RechargeContextBar,
    RechargeContextCard,
    RechargeProgress,
    RechargeReceiptCard,
  },
  setup() {
    return { ...useRechargeFlow() }
  },
  data() {
    return {
      step: 'plate' as RechargeStep,
      ready: false,
      initialized: false,
      text: RECHARGE_TEXT,
      ipgText: IPG_PAYMENT_TEXT,
      guide: RECHARGE_GUIDE,
      /** El conductor pidió ver todos los métodos (con el Botón de Pago IPG elegido, van plegados). */
      methodsOpen: false,
      contextBarVisible: false,
      payBarVisible: false,
    }
  },
  computed: {
    stepIndex(): number {
      return STEP_ORDER.indexOf(this.step)
    },
    isIpg(): boolean {
      return this.paymentMethod === IPG_METHOD_ID
    },

    ipgStage(): IpgPaymentStage {
      return this.step === 'payment' && this.isIpg ? this.ipgPayment.stage : 'payer'
    },
    ipgDenied(): boolean {
      return this.ipgStage === 'result' && this.ipgPayment.result?.status === 'denied'
    },
    /** El banco no respondió al confirmar: el cargo está en duda. */
    ipgUnknown(): boolean {
      return this.ipgStage === 'result' && this.ipgPayment.result?.status === 'unknown'
    },

    stepText(): { title: string; intro: string } {
      if (this.ipgStage === 'otp') return RECHARGE_IPG_STEP_TEXT.otp
      if (this.ipgDenied) {
        return {
          title: RECHARGE_IPG_STEP_TEXT.denied.title,
          intro: this.ipgPayment.result?.reason || this.ipgText.deniedFallback,
        }
      }
      if (this.ipgUnknown) return RECHARGE_IPG_STEP_TEXT.unknown
      if (this.ipgStage === 'result') return RECHARGE_IPG_STEP_TEXT.approved
      return RECHARGE_STEP_TEXT[this.step]
    },

    methodsCollapsed(): boolean {
      return this.isIpg && !this.methodsOpen
    },
    showContextBar(): boolean {
      return this.step === 'payment' && this.ipgStage === 'payer' && !!this.summary
    },
    payStepLabel(): string {
      const index = STEP_ORDER.indexOf('payment')
      return rechargeStepLabel(index + 1, STEP_ORDER.length, RECHARGE_STEPS[index].label)
    },
    ipgSummary(): string {
      if (!this.summary) return ''
      return ipgPaymentSummary(this.summary.total, this.ipgPayment.methodName, this.ipgPayment.maskedDocument)
    },

    ipgSettlePending(): boolean {
      return this.ipgPayment.result?.status === 'approved' && !this.receipt
    },
    canGoBack(): boolean {
      if (this.ipgSettlePending) return false
      return this.step === 'amount' || this.step === 'payment'
    },
    plateFootText(): string {
      return this.plateValid ? plateReadyLabel(formatPlate(this.plate)) : PLATE_PROMPTS.recargar
    },
    customHint(): string {
      const rules = this.limits
      return rules ? customAmountHint(rules.minLabel, rules.maxLabel, rules.stepLabel) : ''
    },
    payLabel(): string {
      return this.summary ? rechargePayLabel(this.summary.total) : this.text.toPayment
    },
    balanceRoute(): RouteLocationRaw {
      return { name: ROUTE_NAMES.balance, query: { placa: this.receipt?.plate ?? this.plate } }
    },
  },

  async created() {
    await this.loadOptions()
    this.ready = true
    if (this.optionsError) return
    this.syncFromRoute()
    this.$watch(
      () => this.$route.query,
      () => {
        if (this.$route.name === ROUTE_NAMES.recharge) this.syncFromRoute()
      },
    )
  },
  beforeUnmount() {
    this.unobserve('context')
    this.unobserve('ipgForm')
  },

  methods: {
    observe(key: ObserverKey, vnode: VNode, rootMargin: string, onChange: (entry: IntersectionObserverEntry) => void): void {
      this.unobserve(key)
      const el = vnode.el
      if (!(el instanceof Element) || typeof IntersectionObserver === 'undefined') return
      const observer = new IntersectionObserver(([entry]) => onChange(entry), { rootMargin })
      observer.observe(el)
      const map = viewObservers.get(this) ?? new Map<ObserverKey, IntersectionObserver>()
      map.set(key, observer)
      viewObservers.set(this, map)
    },
    unobserve(key: ObserverKey): void {
      viewObservers.get(this)?.get(key)?.disconnect()
      viewObservers.get(this)?.delete(key)
      if (key === 'context') this.contextBarVisible = false
      else this.payBarVisible = false
    },

    /** La ficha sale por debajo del encabezado: aparece la barra de contexto. */
    observeContext(vnode: VNode): void {
      this.observe('context', vnode, `-${HEADER_OFFSET}px 0px 0px 0px`, (entry) => {
        this.contextBarVisible = !entry.isIntersecting && entry.boundingClientRect.top < HEADER_OFFSET
      })
    },
    /** El formulario del Botón de Pago IPG entra en el 60 % superior de la pantalla: aparece la barra de pago. */
    observeIpgForm(vnode: VNode): void {
      this.observe('ipgForm', vnode, '0px 0px -40% 0px', (entry) => {
        this.payBarVisible = entry.isIntersecting || entry.boundingClientRect.top < 0
      })
    },
    onSelectMethod(id: string): void {
      this.selectPaymentMethod(id)
      if (id === IPG_METHOD_ID) this.methodsOpen = false
    },
    onExpandMethods(): void {
      this.methodsOpen = true
      this.$nextTick(() => (this.$refs.methods as Focusable)?.focus())
    },
    async retryOptions(): Promise<void> {
      await this.loadOptions()
      if (!this.optionsError) this.syncFromRoute()
    },
    prefill(query: LocationQuery): void {
      const plate = queryText(query, 'plate')
      const amountId = queryText(query, 'amount')
      if (plate) this.setPlate(plate)
      if (amountId) this.selectAmount(amountId)
    },

    /** Primer paso al llegar sin `?paso`: con placa y un monto fijo, directo a pagar. */
    entryStep(): RechargeStep {
      if (!this.plateValid) return 'plate'
      const preset = this.selectedAmount && !this.selectedAmount.custom
      return preset && this.amountValid ? 'payment' : 'amount'
    },

    /** El paso más avanzado al que se puede llegar con lo que hay hasta ahora. */
    allowedStep(requested: RechargeStep): RechargeStep {
      if (requested === 'ready') return this.receipt ? 'ready' : 'plate'
      if (requested === 'plate' || !this.plateValid) return 'plate'
      if (requested === 'amount') return 'amount'
      return this.amountValid ? 'payment' : 'amount'
    },

    syncFromRoute(): void {
      const query = this.$route.query
      const requested = parseStep(queryText(query, 'step'))

      if (!requested) {
        this.restart()
        this.methodsOpen = false
        this.prefill(query)
        this.initialized = true
        void this.go(this.entryStep(), true)
        return
      }

      if (!this.initialized) {
        this.prefill(query)
        this.initialized = true
      } else if (this.receipt && requested !== 'ready') {
        this.restart()
        this.prefill(query)
      }

      const allowed = this.allowedStep(requested)
      if (allowed !== requested) {
        void this.go(allowed, true)
        return
      }
      this.show(requested)
    },
    show(next: RechargeStep): void {
      if (next !== 'payment' && this.ipgPayment.stage !== 'payer' && !this.ipgSettlePending) this.ipgPayment.backToPayer()
      const changed = next !== this.step
      this.step = next
      if (!changed) return
      this.$nextTick(() => {
        if (next === 'amount' && this.selectedAmount?.custom) this.focusCustomAmount()
        else (this.$refs.heading as HTMLElement | undefined)?.focus()
      })
    },
    focusCustomAmount(): void {
      const picker = this.$refs.amounts as { focusCustom: () => void } | undefined
      picker?.focusCustom()
    },

    go(next: RechargeStep, replace = false) {
      const query: Record<string, string> = { step: next }
      if (this.plateValid) query.placa = this.plate
      if (this.amountId && next !== 'plate') query.monto = this.amountId
      const target = { name: ROUTE_NAMES.recharge, query }
      return replace ? this.$router.replace(target) : this.$router.push(target)
    },

    focusHeading(): void {
      this.$nextTick(() => (this.$refs.heading as HTMLElement | undefined)?.focus())
    },
    back(): void {
      // El código y el resultado son subestados de «Pago»: «Volver» regresa a los datos del pagador.
      if (this.ipgStage !== 'payer') {
        this.ipgPayment.backToPayer()
        this.focusHeading()
        return
      }
      const previous = STEP_ORDER[this.stepIndex - 1]
      if (previous) void this.go(previous)
    },
    onPlateContinue(): void {
      if (this.confirmPlate()) void this.go('amount')
      else (this.$refs.plateField as Focusable)?.focus()
    },
    onAmountContinue(): void {
      if (this.validateAmount()) void this.go('payment')
      else if (this.selectedAmount?.custom) this.focusCustomAmount()
    },
    async onPay(): Promise<void> {
      if (this.isIpg) {
        const form = this.$refs.ipgForm as { focusDocument: () => void; focusAlert: () => void } | undefined
        if (await this.requestIpgOtp()) this.focusHeading()
        else if (this.ipgPayment.requestError) form?.focusAlert()
        else if (this.ipgPayment.fieldErrors.documentNumber) form?.focusDocument()
        return
      }
      // El comprobante reemplaza al paso de pago: «atrás» no vuelve a cobrar.
      if (await this.pay()) void this.go('ready', true)
    },
    async onVerifyIpg(): Promise<void> {
      if (await this.confirmIpgOtp()) void this.go('ready', true)
      else if (this.ipgPayment.stage === 'result') this.focusHeading()
      // Código vencido o bloqueado: de vuelta a los datos, con el aviso arriba del formulario.
      else if (this.ipgPayment.stage === 'payer') {
        this.$nextTick(() => (this.$refs.ipgForm as { focusAlert: () => void } | undefined)?.focusAlert())
      }
      // Código incorrecto: se borró; el foco vuelve a la primera casilla.
      else (this.$refs.otp as Focusable)?.focus()
    },
    async onSettleIpg(): Promise<void> {
      if (await this.settleIpgRecharge()) void this.go('ready', true)
    },
    onRetryIpg(): void {
      this.ipgPayment.backToPayer()
      this.focusHeading()
    },
    onOtherMethod(): void {
      this.ipgPayment.backToPayer()
      this.methodsOpen = true
      this.$nextTick(() => (this.$refs.methods as Focusable)?.focus())
    },
    onAnother(): void {
      void this.$router.push({ name: ROUTE_NAMES.recharge })
    },
  },
})
</script>

<template>
  <section class="section wrap">
    <div class="rv">
      <div class="rv__panel">
        <RechargeContextBar
          v-if="showContextBar && summary"
          class="rv__ctx"
          :plate="plate"
          :total="summary.total"
          :step-label="payStepLabel"
          :visible="contextBarVisible"
        />
        <RechargeProgress :step="step" class="rv__progress" />

        <p v-if="!ready || optionsLoading" class="rv__state" role="status">{{ text.loading }}</p>

        <div v-else-if="optionsError" class="rv__state">
          <p class="rv__error" role="alert"><AppIcon name="alert" :size="18" />{{ optionsError }}</p>
          <button type="button" class="btn btn--secundario" @click="retryOptions">{{ text.retry }}</button>
        </div>

        <template v-else>
          <button v-if="canGoBack" type="button" class="rv__back link-quiet" @click="back">
            <AppIcon name="chevron" :size="20" class="rv__back-icon" />{{ text.back }}
          </button>
          <span v-if="step === 'ready' || ipgSettlePending" class="rv__done" aria-hidden="true"><AppIcon name="check" :size="28" /></span>
          <span v-else-if="ipgDenied" class="rv__done rv__done--alert" aria-hidden="true"><AppIcon name="alert" :size="28" /></span>
          <span v-else-if="ipgUnknown" class="rv__done rv__done--pending" aria-hidden="true"><AppIcon name="info" :size="28" /></span>
          <h1 ref="heading" tabindex="-1">{{ stepText.title }}</h1>
          <p class="rv__intro">{{ stepText.intro }}</p>

          <form v-if="step === 'plate'" class="rv__body" novalidate @submit.prevent="onPlateContinue">
            <PlateField
              ref="plateField"
              :model-value="plate"
              :foot-text="plateFootText"
              :hint="plateHint"
              :error="plateError"
              :is-valid="plateValid"
              @typed="setPlate"
            />
            <button type="submit" class="btn btn--primario rv__go">
              {{ text.continue }}<AppIcon name="arrow" :size="20" />
            </button>
            <p class="rv__note">{{ text.noSignup }}</p>
          </form>

          <form v-else-if="step === 'amount'" class="rv__body" novalidate @submit.prevent="onAmountContinue">
            <div class="rv__plate">
              <PlateImage :value="plate" />
              <button type="button" class="link-quiet rv__link" @click="go('plate')">{{ text.changePlate }}</button>
            </div>
            <AmountPicker
              ref="amounts"
              class="rv__picker"
              :options="amountOptions"
              :model-value="amountId"
              :custom-amount="customAmount"
              :currency="limits?.currency ?? ''"
              :custom-hint="customHint"
              :error="amountError"
              @select="selectAmount"
              @custom="setCustomAmount"
            />
            <button type="submit" class="btn btn--primario rv__go">
              {{ text.toPayment }}<AppIcon name="arrow" :size="20" />
            </button>
          </form>

          <form v-else-if="step === 'payment' && ipgStage === 'payer'" class="rv__body" novalidate @submit.prevent="onPay">
            <RechargeContextCard
              v-if="summary"
              :plate="plate"
              :summary="summary"
              @vue:mounted="observeContext"
              @vue:unmounted="unobserve('context')"
              @change-plate="go('plate')"
            />
            <template v-else>
              <div class="rv__plate">
                <PlateImage :value="plate" />
                <button type="button" class="link-quiet rv__link" @click="go('plate')">{{ text.changePlate }}</button>
              </div>
              <p class="rv__notice"><AppIcon name="info" :size="20" />{{ text.plateNotice }}</p>
            </template>
            <PaymentMethodPicker
              ref="methods"
              class="rv__picker"
              :methods="paymentMethods"
              :model-value="paymentMethod"
              :collapsed="methodsCollapsed"
              @select="onSelectMethod"
              @expand="onExpandMethods"
            />
            <Transition name="card">
              <IpgPayerForm
                v-if="isIpg"
                ref="ipgForm"
                class="rv__card"
                :person-type="ipgPayment.personType"
                :document-types="ipgPayment.documentTypes"
                :document-type="ipgPayment.documentType"
                :document-number="ipgPayment.documentNumber"
                :methods="ipgPayment.methods"
                :method-id="ipgPayment.methodId"
                :field-errors="ipgPayment.fieldErrors"
                :methods-loading="ipgPayment.methodsLoading"
                :methods-error="ipgPayment.methodsError"
                :request-error="ipgPayment.requestError || payError"
                @update:person-type="ipgPayment.setPersonType"
                @update:document-type="ipgPayment.setDocumentType"
                @update:document-number="ipgPayment.setDocumentNumber"
                @update:method-id="ipgPayment.selectMethod"
                @touch="ipgPayment.touch"
                @retry-methods="ipgPayment.loadMethods"
                @vue:mounted="observeIpgForm"
                @vue:unmounted="unobserve('ipgForm')"
              />
            </Transition>
            <!-- Último hijo del formulario: se queda fijo al pie mientras el paso está a la vista -->
            <IpgPayBar
              v-if="isIpg"
              class="rv__paybar"
              :visible="payBarVisible"
              :total="summary?.total ?? ''"
              :payer-valid="ipgPayment.payerValid"
              :missing="ipgPayment.missingFields"
              :requesting="ipgPayment.requesting"
              @submit="onPay"
            />
            <template v-if="!isIpg">
              <p v-if="payError" class="rv__error" role="alert"><AppIcon name="alert" :size="18" />{{ payError }}</p>
              <button type="submit" class="btn btn--primario rv__go" :disabled="paying">
                {{ paying ? text.paying : payLabel }}
              </button>
            </template>
          </form>

          <div v-else-if="step === 'payment' && ipgStage === 'otp' && ipgPayment.challenge" class="rv__body">
            <div class="rv__plate"><PlateImage :value="plate" /></div>
            <IpgOtpVerification
              ref="otp"
              class="rv__card-step"
              :otp="ipgPayment.otp"
              :length="ipgPayment.challenge.otpLength"
              :summary="ipgSummary"
              :complete="ipgPayment.otpComplete"
              :confirming="ipgPayment.confirming || paying"
              :error="ipgPayment.otpError"
              @update:otp="ipgPayment.setOtp"
              @verify="onVerifyIpg"
              @edit="onRetryIpg"
            />
          </div>

          <div v-else-if="step === 'payment' && ipgStage === 'result' && ipgPayment.result" class="rv__body">
            <div class="rv__plate"><PlateImage :value="plate" /></div>
            <IpgPaymentOutcome class="rv__card-step" :result="ipgPayment.result" hide-header>
              <template #actions>
                <template v-if="ipgDenied">
                  <button type="button" class="btn btn--primario" @click="onRetryIpg">{{ ipgText.retryPayment }}</button>
                  <button type="button" class="btn btn--secundario" @click="onOtherMethod">{{ ipgText.otherMethod }}</button>
                </template>
                <!-- En duda: primero revisar la app BDV; el reintento lo pide con todas las letras -->
                <template v-else-if="ipgUnknown">
                  <button type="button" class="btn btn--secundario" @click="onRetryIpg">{{ ipgText.checkedRetry }}</button>
                  <button type="button" class="btn btn--secundario" @click="onOtherMethod">{{ ipgText.otherMethod }}</button>
                </template>
                <template v-else>
                  <p v-if="payError" class="rv__error rv__error--wide" role="alert">
                    <AppIcon name="alert" :size="18" />{{ payError }}
                  </p>
                  <button type="button" class="btn btn--primario rv__wide" :disabled="paying" @click="onSettleIpg">
                    {{ paying ? text.paying : text.retrySettle }}
                  </button>
                </template>
              </template>
            </IpgPaymentOutcome>
          </div>

          <div v-else-if="step === 'ready' && receipt" class="rv__body">
            <RechargeReceiptCard :receipt="receipt" />
            <div class="rv__actions">
              <RouterLink :to="balanceRoute" class="btn btn--primario">{{ text.checkBalance }}</RouterLink>
              <button type="button" class="btn btn--secundario" @click="onAnother">{{ text.another }}</button>
            </div>
          </div>
        </template>
      </div>

      <aside class="rv__guide" aria-labelledby="guia-recarga">
        <p class="rv__eyebrow">{{ guide.eyebrow }}</p>
        <h2 id="guia-recarga">{{ guide.title }}</h2>
        <ol class="rv__guide-list">
          <li
            v-for="(g, i) in guide.items"
            :key="g.title"
            :class="{ 'is-current': i === stepIndex, 'is-done': i < stepIndex }"
          >
            <span class="rv__guide-dot" aria-hidden="true">
              <AppIcon v-if="i < stepIndex" name="check" :size="14" />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <div>
              <p class="rv__guide-title">{{ g.title }}</p>
              <p class="rv__guide-text">{{ g.description }}</p>
            </div>
          </li>
        </ol>
        <p class="rv__guide-note">{{ guide.note }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.rv { display: grid; gap: var(--space-8); align-items: start; }
@media (min-width: 900px) { .rv { grid-template-columns: 1.4fr 1fr; } }

.rv__panel {
  display: flex; flex-direction: column; align-items: center; min-width: 0;
  padding: clamp(24px, 4vw, 48px) clamp(16px, 4vw, 48px) clamp(28px, 4vw, 48px);
  background: var(--fondo-frio); border: 1px solid var(--borde); border-radius: var(--radius-xl);
  text-align: center;
}
.rv__progress { width: min(100%, 440px); margin-bottom: var(--space-8); }
.rv__state { display: grid; justify-items: center; gap: var(--space-4); padding-block: var(--space-8); color: var(--texto-suave); }

.rv__back {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 2px; min-height: 44px;
  margin: calc(-1 * var(--space-4)) 0 var(--space-2); padding: 0 8px 0 0; border: 0; background: none; cursor: pointer;
}
.rv__back-icon { transform: rotate(90deg); }
.rv__done {
  display: grid; place-items: center; width: 56px; height: 56px; margin-bottom: var(--space-4);
  border-radius: 50%; background: var(--exito); color: #fff;
}
.rv__panel h1 { font-size: clamp(28px, 2vw + 18px, 40px); line-height: 1.15; font-weight: 600; outline: none; }
.rv__intro { margin-top: var(--space-2); max-width: 44ch; }

.rv__body { width: min(100%, 520px); display: flex; flex-direction: column; margin-top: var(--space-8); }
.rv__plate { display: grid; justify-items: center; gap: var(--space-2); }
.rv__link { min-height: 44px; padding: 0 var(--space-2); border: 0; background: none; cursor: pointer; text-decoration: underline; }
.rv__picker { margin-top: var(--space-6); text-align: left; }

/* Barra de contexto: se pega bajo el encabezado y flota sobre el panel (no ocupa sitio) */
.rv__ctx {
  position: sticky; top: 64px; z-index: 6; align-self: stretch;
  margin: calc(-1 * clamp(24px, 4vw, 48px)) calc(-1 * clamp(16px, 4vw, 48px)) calc(clamp(24px, 4vw, 48px) - 52px);
  border-radius: var(--radius-sm);
}
@media (min-width: 1080px) { .rv__ctx { top: 76px; } }
/* En teléfono angosto, la barra de contexto deja solo placa y total */
@media (max-width: 399px) { .rv__ctx :deep(.rcb__step) { display: none; } }
.rv__paybar { margin-top: var(--space-6); }
.rv__notice {
  display: flex; align-items: flex-start; gap: var(--space-2); margin: var(--space-4) 0 var(--space-4);
  padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm);
  background: var(--azul-100); color: var(--marino-900); font-size: 15px; line-height: 22px; text-align: left;
}
.rv__notice svg { flex: none; margin-top: 1px; }
.rv__error {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-4); color: var(--alerta); font-size: 15px; font-weight: 500;
}
.rv__error svg { flex: none; }
.rv__go { width: 100%; min-height: 56px; margin-top: var(--space-6); font-size: 16px; }
.rv__note { margin-top: var(--space-3); font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.rv__actions { display: grid; gap: var(--space-3); margin-top: var(--space-6); }
@media (min-width: 560px) { .rv__actions { grid-template-columns: 1fr 1fr; } }
.rv__done--alert { background: var(--alerta); }
.rv__done--pending { background: var(--azul-700); }

/* Botón de Pago IPG: el formulario baja bajo los métodos; código y resultado ocupan el paso */
.rv__card { margin-top: var(--space-4); }
.rv__card-step { margin-top: var(--space-6); }
.rv__wide, .rv__error--wide { grid-column: 1 / -1; }
.rv__error--wide { margin-top: 0; }
.card-enter-active { transition: opacity .35s var(--ease-out), transform .35s var(--ease-out); }
.card-enter-from { opacity: 0; transform: translateY(-8px); }

/* Guía lateral: solo cuando hay sitio para dos columnas */
.rv__guide { display: none; }
@media (min-width: 900px) {
  .rv__guide { display: block; position: sticky; top: calc(76px + var(--space-6)); padding-top: var(--space-6); }
}
.rv__eyebrow { font-size: 14px; font-weight: 500; color: var(--azul-700); }
.rv__guide h2 { margin-top: var(--space-1); }
.rv__guide-list { list-style: none; margin: var(--space-6) 0 0; padding: 0; display: grid; gap: var(--space-4); }
.rv__guide-list li { display: flex; gap: var(--space-3); align-items: flex-start; }
.rv__guide-dot {
  flex: none; display: grid; place-items: center; width: 28px; height: 28px; margin-top: 1px;
  border: 2px solid var(--borde); border-radius: 50%; background: var(--superficie);
  font: 500 13px/1 var(--font-mono); color: var(--texto-suave);
}
.is-current .rv__guide-dot, .is-done .rv__guide-dot { background: var(--azul-700); border-color: var(--azul-700); color: #fff; }
.rv__guide-title { font: 500 17px/24px var(--font-display); color: var(--marino-900); }
.rv__guide-list li:not(.is-current) .rv__guide-title { color: var(--texto); }
.rv__guide-text { margin-top: 2px; font-size: 15px; line-height: 22px; color: var(--texto-suave); }
.rv__guide-note { margin-top: var(--space-6); padding-top: var(--space-4); border-top: 1px solid var(--borde); font-size: 15px; color: var(--texto-suave); }
</style>
