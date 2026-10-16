<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateField from '@/modules/plates/components/PlateField.vue'
import { usePlateFromRoute } from '@/modules/plates/composables/usePlateFromRoute'
import { PLATE_PROMPTS, plateReadyLabel } from '@/modules/plates/constants/plateEntry.messages'
import { formatPlate } from '@/modules/plates/utils/plate'
import { ROUTE_NAMES } from '@/core/constants/routing'
import DebtSummaryCard from '../components/DebtSummaryCard.vue'
import DebtTransitsList from '../components/DebtTransitsList.vue'
import { useDebtInquiry } from '../composables/useDebtInquiry'
import { DEBT_TEXT } from '../constants/debt'

type Focusable = { focus: () => void } | undefined

export default defineComponent({
  name: 'DebtView',
  components: { AppIcon, PlateField, DebtSummaryCard, DebtTransitsList },
  setup() {
    const inquiry = useDebtInquiry()
    const fromRoute = usePlateFromRoute()
    if (fromRoute.hasPlate.value) {
      inquiry.setPlate(fromRoute.plate.value)
    }
    return { ...inquiry, routePlate: fromRoute.plate, hasRoutePlate: fromRoute.hasPlate }
  },
  data() {
    return {
      text: DEBT_TEXT,
      conditionsRoute: { name: ROUTE_NAMES.debtConditions },
    }
  },
  computed: {
    formattedPlate(): string {
      return formatPlate(this.plate)
    },
    footText(): string {
      return this.plateValid ? plateReadyLabel(this.formattedPlate) : PLATE_PROMPTS.deuda
    },
    rechargeRoute(): { name: string; query: { placa: string } } {
      return {
        name: ROUTE_NAMES.recharge,
        query: { placa: this.plate },
      }
    },
  },
  watch: {
    routePlate(next: string) {
      if (next === this.plate && this.debt) return
      this.reset()
      if (next) {
        this.setPlate(next)
        void this.onSubmit()
      }
    },
  },
  mounted() {
    if (this.hasRoutePlate) {
      void this.onSubmit()
    } else {
      this.focusPlateField()
    }
  },
  methods: {
    focusPlateField(): void {
      this.$nextTick(() => (this.$refs.plateField as Focusable)?.focus())
    },
    async onSubmit(): Promise<void> {
      const ok = await this.submit()
      if (!ok && this.plateError) {
        this.focusPlateField()
      }
    },
    async onPay(): Promise<void> {
      await this.payDebt()
    },
    onAnother(): void {
      this.reset()
      if (this.$route.query.placa) {
        void this.$router.replace({ name: ROUTE_NAMES.debt })
      }
      this.focusPlateField()
    },
  },
})
</script>

<template>
  <main class="debt-view section wrap" aria-labelledby="debt-heading">
    <header class="debt-view__hero">
      <span class="debt-view__badge">
        <AppIcon name="info" :size="14" />
        {{ text.badge }}
      </span>
      <h1 id="debt-heading" class="debt-view__title">{{ text.title }}</h1>
      <p class="debt-view__lead">{{ text.subtitle }}</p>
    </header>

    <!-- Formulario de búsqueda rápida si no hay deuda cargada -->
    <section v-if="!debt || !debt.plate" class="debt-search" aria-label="Búsqueda de placa">
      <form class="debt-search__form" @submit.prevent="onSubmit">
        <label for="plate-input" class="debt-search__label">{{ text.searchPrompt }}</label>
        <div class="debt-search__row">
          <PlateField
            ref="plateField"
            input-id="plate-input"
            :model-value="plate"
            :foot-text="footText"
            :error="plateError"
            :hint="plateHint"
            :is-valid="plateValid"
            @update:model-value="setPlate"
          />
          <button
            type="submit"
            class="btn btn--primario debt-search__submit"
            :disabled="loading || !plateValid"
          >
            <AppIcon v-if="loading" name="rayo" :size="18" class="animate-spin" />
            <AppIcon v-else name="arrow" :size="18" />
            {{ loading ? 'Consultando...' : 'Consultar deuda' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Mensaje de error si falla la consulta -->
    <div v-if="error" class="debt-alert debt-alert--error" role="alert">
      <AppIcon name="alert" :size="20" />
      <span>{{ error }}</span>
    </div>

    <!-- Alerta de pago exitoso -->
    <div v-if="paidSuccess" class="debt-alert debt-alert--success" role="status">
      <AppIcon name="check" :size="20" />
      <div>
        <strong>{{ text.paidSuccessTitle }}</strong>
        <p>{{ text.paidSuccessDesc }}</p>
      </div>
    </div>

    <!-- Estado cargando -->
    <div v-if="loading" class="debt-loading" aria-live="polite">
      <AppIcon name="rayo" :size="32" class="animate-spin text-azul-700" />
      <p>{{ text.searching }}</p>
    </div>

    <!-- Resultados de la consulta -->
    <div v-else-if="debt" class="debt-results">
      <!-- Caso 1: Placa al día (sin deudas) -->
      <section v-if="debt.totalDebt === 0" class="debt-clear" aria-labelledby="clear-title">
        <div class="debt-clear__icon">
          <AppIcon name="check" :size="32" />
        </div>
        <h2 id="clear-title" class="debt-clear__title">{{ text.noDebtTitle }}</h2>
        <p class="debt-clear__plate">Placa: <strong>{{ formattedPlate }}</strong></p>
        <p class="debt-clear__desc">{{ text.noDebtDesc }}</p>

        <div class="debt-clear__actions">
          <RouterLink :to="rechargeRoute" class="btn btn--primario">
            <AppIcon name="rayo" :size="18" />
            Recargar saldo preventivo
          </RouterLink>
          <button type="button" class="btn btn--secundario btn--sm" @click="onAnother">
            Consultar otra placa
          </button>
        </div>
      </section>

      <!-- Caso 2: Registra tránsitos pendientes de pago -->
      <section v-else class="debt-split" aria-label="Detalle de deudas">
        <div class="debt-split__main">
          <DebtTransitsList :transits="debt.transits" />
        </div>

        <aside class="debt-split__side">
          <DebtSummaryCard :debt="debt" :paying="paying" @pay="onPay" @another="onAnother" />
        </aside>
      </section>
    </div>

    <!-- Pie institucional con enlace a términos legales -->
    <footer class="debt-view__foot">
      <RouterLink :to="conditionsRoute" class="debt-view__conditions-link">
        <AppIcon name="info" :size="16" />
        {{ text.viewConditions }}
      </RouterLink>
    </footer>
  </main>
</template>

<style scoped>
.debt-view {
  display: grid;
  gap: var(--space-8);
  max-width: 980px;
}

.debt-view__hero {
  display: grid;
  gap: var(--space-2);
  text-align: center;
  justify-items: center;
}

.debt-view__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--azul-100);
  color: var(--azul-700);
  font-size: 13px;
  font-weight: 600;
  padding: 4px 14px;
  border-radius: var(--radius-pill);
}

.debt-view__title {
  font: 600 clamp(28px, 2.5vw + 18px, 40px)/1.15 var(--font-display);
  color: var(--marino-900);
}

.debt-view__lead {
  font-size: 16px;
  color: var(--texto-suave);
  max-width: 56ch;
  margin-inline: auto;
}

.debt-search {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--elev-1);
}

.debt-search__form {
  display: grid;
  gap: var(--space-3);
}

.debt-search__label {
  font-size: 14px;
  font-weight: 500;
  color: var(--texto);
}

.debt-search__row {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  flex-wrap: wrap;
}

.debt-search__submit {
  align-self: flex-start;
  min-height: 48px;
}

.debt-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  border-radius: var(--radius-sm);
  font-size: 14px;
}

.debt-alert--error {
  background: #fdf2f2;
  color: var(--rojo-sistema);
  border: 1px solid rgba(207, 20, 43, 0.2);
}

.debt-alert--success {
  background: #f0fdf4;
  color: #14532d;
  border: 1px solid rgba(0, 177, 64, 0.3);
}

.debt-loading {
  display: grid;
  gap: var(--space-3);
  justify-items: center;
  padding: var(--space-14) 0;
  color: var(--texto-suave);
}

.debt-clear {
  display: grid;
  gap: var(--space-4);
  justify-items: center;
  text-align: center;
  padding: var(--space-14) var(--space-6);
  background: var(--superficie);
  border: 1px solid rgba(0, 177, 64, 0.25);
  border-radius: var(--radius-md);
  box-shadow: var(--elev-1);
}

.debt-clear__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-pill);
  background: #f0fdf4;
  color: var(--exito);
}

.debt-clear__title {
  font: 600 24px/30px var(--font-display);
  color: var(--marino-900);
}

.debt-clear__plate {
  font-size: 15px;
  color: var(--texto);
}

.debt-clear__plate strong {
  font-family: var(--font-mono);
  color: var(--azul-700);
  letter-spacing: 0.05em;
}

.debt-clear__desc {
  color: var(--texto-suave);
  max-width: 48ch;
}

.debt-clear__actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-2);
}

.debt-split {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-6);
  align-items: flex-start;
}

@media (min-width: 840px) {
  .debt-split {
    grid-template-columns: 1.5fr 1fr;
  }
}

.debt-view__foot {
  text-align: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--borde);
}

.debt-view__conditions-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--texto-suave);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.15s;
}

.debt-view__conditions-link:hover {
  color: var(--azul-700);
}
</style>
