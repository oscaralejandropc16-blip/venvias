<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import CodeInput from '@/shared/ui/CodeInput.vue'
import PlateField from '@/modules/plates/components/PlateField.vue'
import { usePlateFromRoute } from '@/modules/plates/composables/usePlateFromRoute'
import { PLATE_PROMPTS, plateReadyLabel } from '@/modules/plates/constants/plateEntry.messages'
import { formatPlate } from '@/modules/plates/utils/plate'
import { ROUTE_NAMES } from '@/core/constants/routing'
import BalanceResult from '../components/BalanceResult.vue'
import { useBalanceInquiry } from '../composables/useBalanceInquiry'
import { BALANCE_TEXT, SECURITY_CODE_LENGTH, codeDigitLabel } from '../constants/balance'

type Focusable = { focus: () => void } | undefined

export default defineComponent({
  name: 'BalanceView',
  components: { AppIcon, CodeInput, PlateField, BalanceResult },
  setup() {
    const inquiry = useBalanceInquiry()
    const fromRoute = usePlateFromRoute()
    if (fromRoute.hasPlate.value) inquiry.setPlate(fromRoute.plate.value)
    return { ...inquiry, routePlate: fromRoute.plate }
  },
  data() {
    return {
      text: BALANCE_TEXT,
      codeLength: SECURITY_CODE_LENGTH,
      digitLabel: codeDigitLabel,
    }
  },
  computed: {
    footText(): string {
      return this.plateValid ? plateReadyLabel(formatPlate(this.plate)) : PLATE_PROMPTS.deuda
    },
    rechargeRoute(): { name: string; query: { placa: string } } | null {
      return this.wallet ? { name: ROUTE_NAMES.recharge, query: { placa: this.wallet.plate } } : null
    },
  },
  watch: {
    // Llegar de nuevo con otra placa (menú, comprobante) arranca una consulta nueva.
    routePlate(next: string) {
      if (next === this.plate && !this.wallet) return
      this.reset()
      if (next) this.setPlate(next)
    },
  },
  mounted() {
    if (this.plateValid) this.focusRef('codeField')
  },
  methods: {
    focusRef(name: 'plateField' | 'codeField' | 'heading'): void {
      this.$nextTick(() => (this.$refs[name] as Focusable)?.focus())
    },
    async onSubmit(): Promise<void> {
      if (await this.submit()) {
        this.focusRef('heading')
        return
      }
      if (this.plateError) this.focusRef('plateField')
      else if (this.codeError) this.focusRef('codeField')
    },
    onAnother(): void {
      this.reset()
      if (this.$route.query.placa) void this.$router.replace({ name: ROUTE_NAMES.balance })
      this.focusRef('plateField')
    },
  },
})
</script>

<template>
  <section class="section wrap">
    <div class="bal">
      <template v-if="wallet">
        <h1 ref="heading" tabindex="-1">{{ text.resultTitle }}</h1>
        <BalanceResult :wallet="wallet" class="bal__result" />
        <div class="bal__actions">
          <RouterLink v-if="rechargeRoute" :to="rechargeRoute" class="btn btn--primario">
            {{ text.rechargeThis }}<AppIcon name="arrow" :size="20" />
          </RouterLink>
          <button type="button" class="btn btn--secundario" @click="onAnother">{{ text.another }}</button>
        </div>
      </template>

      <template v-else>
        <h1 ref="heading" tabindex="-1">{{ text.title }}</h1>
        <p class="bal__intro">{{ text.intro }}</p>

        <form class="bal__form" novalidate @submit.prevent="onSubmit">
          <PlateField
            ref="plateField"
            :model-value="plate"
            :foot-text="footText"
            :hint="plateHint"
            :error="plateError"
            :is-valid="plateValid"
            @typed="setPlate"
          />

          <fieldset class="bal__code">
            <legend>{{ text.codeLegend }}</legend>
            <p id="codigo-ayuda" class="bal__help">{{ text.codeHelp }}</p>
            <CodeInput
              ref="codeField"
              :model-value="code"
              :length="codeLength"
              :digit-label="digitLabel"
              describedby="codigo-ayuda codigo-error"
              :error="!!codeError"
              :disabled="loading"
              @update:model-value="setCode"
            />
            <p v-if="codeError" id="codigo-error" class="bal__error" role="alert">
              <AppIcon name="alert" :size="18" />{{ codeError }}
            </p>
          </fieldset>

          <p v-if="error" class="bal__error" role="alert"><AppIcon name="alert" :size="18" />{{ error }}</p>

          <button type="submit" class="btn btn--primario bal__go" :disabled="!codeComplete || loading">
            {{ loading ? text.submitting : text.submit }}
          </button>
        </form>
      </template>
    </div>
  </section>
</template>

<style scoped>
.bal {
  width: min(100%, 640px); margin-inline: auto; display: flex; flex-direction: column; align-items: center;
  padding: clamp(28px, 5vw, 56px) clamp(16px, 5vw, 56px);
  background: var(--fondo-frio); border: 1px solid var(--borde); border-radius: var(--radius-xl);
  text-align: center;
}
.bal h1 { font-size: clamp(30px, 2vw + 20px, 44px); line-height: 1.15; font-weight: 600; outline: none; }
.bal__intro { margin-top: var(--space-3); max-width: 44ch; }

.bal__form { width: min(100%, 520px); display: flex; flex-direction: column; margin-top: var(--space-8); }
.bal__code { margin: var(--space-8) 0 0; padding: 0; border: 0; min-width: 0; }
.bal__code legend { padding: 0; margin: 0 auto; font: 500 18px/26px var(--font-display); color: var(--marino-900); }
.bal__help { margin: var(--space-1) auto var(--space-4); max-width: 40ch; font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.bal__error {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 15px; font-weight: 500;
}
.bal__error svg { flex: none; }
.bal__go { width: 100%; min-height: 56px; margin-top: var(--space-8); font-size: 16px; }

.bal__result { width: 100%; margin-top: var(--space-6); }
.bal__actions { width: 100%; display: grid; gap: var(--space-3); margin-top: var(--space-6); }
@media (min-width: 560px) { .bal__actions { grid-template-columns: 1fr 1fr; } }
</style>
