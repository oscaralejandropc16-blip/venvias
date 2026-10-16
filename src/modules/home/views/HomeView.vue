<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import RoadRibbon from '@/shared/ui/RoadRibbon.vue'
import PlateForm from '@/modules/plates/components/PlateForm.vue'
import type { PlateSubmission } from '@/modules/plates/types/Plate'
import { useRechargeAmounts } from '@/modules/recharge/composables/useRechargeAmounts'
import TollsSummaryCard from '@/modules/tolls/components/TollsSummaryCard.vue'
import { TOLLS_TEXT } from '@/modules/tolls/constants/tolls'
import { ACCOUNT_PERKS } from '@/modules/account/constants/account'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorks from '../components/HowItWorks.vue'
import { FAQS, SAFETY_ITEMS } from '../constants/home.content'
import tagImg from '@/assets/tag-venvias.webp'
import plateImg from '@/assets/plate-venezuela.svg'

export default defineComponent({
  name: 'HomeView',
  components: { AppIcon, RoadRibbon, PlateForm, TollsSummaryCard, HowItWorks },
  setup() {
    return { ...useRechargeAmounts() }
  },
  data() {
    return {
      tagImg,
      plateImg,
      safety: SAFETY_ITEMS,
      faqs: FAQS,
      accountPerks: ACCOUNT_PERKS,
      tollsText: TOLLS_TEXT,
      accountRoute: { name: ROUTE_NAMES.account },
    }
  },
  mounted() {
    void this.fetchAmountOptions()
  },
  methods: {
    onPlateSubmit(submission: PlateSubmission): void {
      const query: Record<string, string> = { placa: submission.plate }
      if (submission.amountId) query.monto = submission.amountId
      const name = submission.intent === 'recargar' ? ROUTE_NAMES.recharge : ROUTE_NAMES.debt
      void this.$router.push({ name, query })
    },
  },
})
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__inner">
      <span class="hero__badge">
        <AppIcon name="info" :size="14" />
        República Bolivariana de Venezuela · MPPT
      </span>
      <h1 id="hero-title">Paga tus peajes con tu placa. <span>Sin registrarte.</span></h1>
      <p class="hero__sub">Recarga saldo y se descuenta solo al pasar por los peajes habilitados.</p>
      <PlateForm :amount-options="amountOptions" @submit="onPlateSubmit" />
    </div>
    <div class="hero__road"><RoadRibbon /></div>
  </section>

  <HowItWorks plain />

  <section class="section split wrap" aria-labelledby="tag-title">
    <div>
      <h2 id="tag-title">¿Tienes TAG? Sigue con él.</h2>
      <p class="lead">
        El TAG es el método de pago preferido para el pago de peajes. El pago por placa es su alternativa:
        si no tienes TAG, solo necesitas tu placa.
      </p>
    </div>
    <div class="tag__pair" aria-hidden="true">
      <img :src="tagImg" alt="" width="720" height="324" loading="lazy" decoding="async" class="tag__sticker" />
      <span class="tag__or">o</span>
      <img :src="plateImg" alt="" width="404" height="204" loading="lazy" decoding="async" class="tag__plate" />
    </div>
  </section>

  <section class="tolls section bg-fondo-frio" aria-labelledby="tolls-title">
    <div class="wrap split gap-6">
      <div>
        <h2 id="tolls-title">{{ tollsText.title }}</h2>
        <p class="lead">{{ tollsText.intro }}</p>
      </div>
      <TollsSummaryCard />
    </div>
  </section>

  <section class="section split wrap pb-8 items-stretch min-[900px]:grid-cols-[1fr_1.2fr]" aria-labelledby="safety-title">
    <div>
      <h2 id="safety-title">Seguro, aunque no tengas cuenta</h2>
      <p class="lead max-w-[44ch]">Pagar con tu placa no te obliga a dar más datos de los necesarios.</p>
    </div>
    <dl class="plain-list divided divided--rows">
      <div v-for="s in safety" :key="s.title">
        <dt class="row-title flex items-center gap-3"><AppIcon :name="s.icon" class="icon-accent" />{{ s.title }}</dt>
        <dd class="m-0 mt-1 ml-9 text-texto-suave">{{ s.text }}</dd>
      </div>
    </dl>
  </section>

  <section class="section wrap pt-8" aria-labelledby="account-title">
    <div class="account split min-[900px]:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 id="account-title">¿Varias placas o una flota? Crea tu cuenta cuando quieras.</h2>
        <p class="lead max-w-[44ch] mb-6">La cuenta es opcional. Suma herramientas para quien maneja más de un vehículo.</p>
        <RouterLink :to="accountRoute" class="btn btn--secundario bg-superficie">Conoce Mi cuenta</RouterLink>
      </div>
      <ul class="plain-list gap-3">
        <li v-for="p in accountPerks" :key="p" class="flex items-start gap-3 text-marino-900"><AppIcon name="check" :size="20" class="icon-accent mt-0.5" />{{ p }}</li>
      </ul>
    </div>
  </section>

  <section class="section split wrap pt-0 gap-6 items-start min-[900px]:grid-cols-[1fr_2fr]" aria-labelledby="faq-title">
    <h2 id="faq-title">Preguntas frecuentes</h2>
    <div class="divided">
      <details v-for="f in faqs" :key="f.q">
        <summary class="row-title flex items-center justify-between gap-4 py-4 cursor-pointer list-none">{{ f.q }}<AppIcon name="chevron" :size="22" class="icon-accent" /></summary>
        <p class="pb-4 max-w-[65ch]">{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
/* Hero: la placa es el formulario */
.hero { position: relative; overflow: hidden; padding-bottom: clamp(72px, 9vw, 150px); }
.hero__inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: clamp(16px, 3vw, 44px); }
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  color: var(--azul-700);
  font-size: 13px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: var(--radius-pill);
  box-shadow: 0 4px 14px rgba(18, 33, 66, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.9);
  margin-bottom: var(--space-4);
}
.hero h1 {
  font-size: clamp(32px, 2.6vw + 20px, 60px); line-height: 1.1; font-weight: 600;
  max-width: 17ch;
}
.hero h1 span { display: block; }
.hero__sub { margin: var(--space-2) 0 var(--space-4); max-width: 44ch; color: var(--texto); }
@media (min-width: 768px) { .hero__sub { margin: var(--space-3) 0 var(--space-6); font-size: 18px; line-height: 28px; } }
.hero__road { position: absolute; left: 0; right: 0; bottom: 0; height: clamp(60px, 9vw, 150px); }

/* TAG y placa: alternativa, nunca rival */
.tag__pair { display: flex; align-items: center; gap: var(--space-4); }
.tag__sticker {
  display: block; width: clamp(132px, 36vw, 220px); height: auto; flex: none;
  border-radius: var(--radius-sm); box-shadow: 0 1px 2px rgb(0 0 0 / .08);
}
.tag__or { font: 500 20px/1 var(--font-display); color: var(--texto-suave); }
.tag__plate { width: min(100%, 240px); height: auto; }
@media (min-width: 900px) { .tag__pair { justify-content: center; } }

/* Peajes habilitados */
.tolls :deep(.empty > p) { margin-top: var(--space-3); max-width: 52ch; }

/* Cuenta opcional */
.account {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-xl);
  padding: clamp(32px, 5vw, 64px) clamp(20px, 5vw, 64px);
  box-shadow: var(--elev-1);
}

/* Preguntas frecuentes */
summary::-webkit-details-marker { display: none; }
summary svg { transition: transform .3s var(--ease-out); }
details[open] summary svg { transform: rotate(180deg); }
</style>
