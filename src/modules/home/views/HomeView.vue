<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import TollsSummaryCard from '@/modules/tolls/components/TollsSummaryCard.vue'
import { TOLLS_TEXT } from '@/modules/tolls/constants/tolls'
import { ACCOUNT_PERKS } from '@/modules/account/constants/account'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HowItWorks from '../components/HowItWorks.vue'
import HomeActionCards from '../components/HomeActionCards.vue'
import {
  FAQS,
  HOME_ACTION_CARDS,
  HOME_HERO_CONTENT,
  SAFETY_ITEMS,
} from '../constants/home.content'
import tagImg from '@/assets/tag-venvias.webp'
import plateImg from '@/assets/plate-venezuela.svg'

export default defineComponent({
  name: 'HomeView',
  components: {
    AppIcon,
    HomeActionCards,
    TollsSummaryCard,
    HowItWorks,
  },
  data() {
    return {
      tagImg,
      plateImg,
      heroContent: HOME_HERO_CONTENT,
      actionCards: HOME_ACTION_CARDS,
      safety: SAFETY_ITEMS,
      faqs: FAQS,
      accountPerks: ACCOUNT_PERKS,
      tollsText: TOLLS_TEXT,
      accountRoute: { name: ROUTE_NAMES.account },
    }
  },
})
</script>

<template>
  <!-- Hero institucional limpio sin formularios directos -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap hero__inner">
      <span class="hero__eyebrow">{{ heroContent.eyebrow }}</span>
      <h1 id="hero-title">
        {{ heroContent.title }}
        <span>{{ heroContent.titleHighlight }}</span>
      </h1>
      <p class="hero__sub">{{ heroContent.subtitle }}</p>

      <!-- Grid responsivo con las 3 tarjetas de navegación -->
      <HomeActionCards :cards="actionCards" class="hero__cards" />
    </div>
  </section>

  <!-- Cómo funciona el pago por placa -->
  <HowItWorks plain />

  <!-- TAG y Placa: Métodos de paso -->
  <section class="section split wrap" aria-labelledby="tag-title">
    <div>
      <h2 id="tag-title">¿Tienes TAG? Sigue con él.</h2>
      <p class="lead">
        El TAG es el método de pago preferido para el paso rápido de peajes. El pago por placa es su alternativa oficial:
        si no tienes TAG, solo necesitas tu placa sin registros obligatorios.
      </p>
    </div>
    <div class="tag__pair" aria-hidden="true">
      <img :src="tagImg" alt="" width="720" height="324" loading="lazy" decoding="async" class="tag__sticker" />
      <span class="tag__or">o</span>
      <img :src="plateImg" alt="" width="404" height="204" loading="lazy" decoding="async" class="tag__plate" />
    </div>
  </section>

  <!-- Peajes habilitados -->
  <section class="tolls section bg-fondo-frio" aria-labelledby="tolls-title">
    <div class="wrap split gap-6">
      <div>
        <h2 id="tolls-title">{{ tollsText.title }}</h2>
        <p class="lead">{{ tollsText.intro }}</p>
      </div>
      <TollsSummaryCard />
    </div>
  </section>

  <!-- Seguridad y privacidad -->
  <section class="section split wrap pb-8 items-stretch min-[900px]:grid-cols-[1fr_1.2fr]" aria-labelledby="safety-title">
    <div>
      <h2 id="safety-title">Seguro, aunque no tengas cuenta</h2>
      <p class="lead max-w-[44ch]">Pagar con tu placa no te obliga a suministrar más datos de los estrictamente necesarios.</p>
    </div>
    <dl class="plain-list divided divided--rows">
      <div v-for="s in safety" :key="s.title">
        <dt class="row-title flex items-center gap-3"><AppIcon :name="s.icon" class="icon-accent" />{{ s.title }}</dt>
        <dd class="m-0 mt-1 ml-9 text-texto-suave">{{ s.text }}</dd>
      </div>
    </dl>
  </section>

  <!-- Flotas y gestión corporativa -->
  <section class="section wrap pt-8" aria-labelledby="account-title">
    <div class="account split min-[900px]:grid-cols-[1.2fr_1fr]">
      <div>
        <h2 id="account-title">¿Varias placas o una flota? Crea tu cuenta cuando quieras.</h2>
        <p class="lead max-w-[44ch] mb-6">La cuenta es opcional. Suma herramientas centralizadas para empresas y conductores frecuentes.</p>
        <RouterLink :to="accountRoute" class="btn btn--secundario bg-superficie">Conoce Mi cuenta</RouterLink>
      </div>
      <ul class="plain-list gap-3">
        <li v-for="p in accountPerks" :key="p" class="flex items-start gap-3 text-marino-900">
          <AppIcon name="check" :size="20" class="icon-accent mt-0.5" />{{ p }}
        </li>
      </ul>
    </div>
  </section>

  <!-- Preguntas frecuentes -->
  <section class="section split wrap pt-0 gap-6 items-start min-[900px]:grid-cols-[1fr_2fr]" aria-labelledby="faq-title">
    <h2 id="faq-title">Preguntas frecuentes</h2>
    <div class="divided">
      <details v-for="f in faqs" :key="f.q">
        <summary class="row-title flex items-center justify-between gap-4 py-4 cursor-pointer list-none">
          {{ f.q }}<AppIcon name="chevron" :size="22" class="icon-accent" />
        </summary>
        <p class="pb-4 max-w-[65ch] text-texto-suave">{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
/* Hero: limpio, institucional, sin formulario directo */
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(40px, 5vw, 64px) clamp(48px, 6vw, 80px);
  background: linear-gradient(180deg, #ffffff 0%, var(--fondo-frio) 100%);
  border-bottom: 1px solid var(--borde);
}

.hero__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 14px;
  border-radius: var(--radius-pill);
  background: var(--azul-100);
  color: var(--azul-700);
  font: 500 12px/1 var(--font-mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.hero h1 {
  font-size: clamp(32px, 2.8vw + 18px, 54px);
  line-height: 1.15;
  font-weight: 600;
  color: var(--marino-900);
  max-width: 18ch;
}

.hero h1 span {
  display: block;
  color: var(--azul-700);
}

.hero__sub {
  margin: var(--space-3) auto var(--space-8);
  max-width: 58ch;
  color: var(--texto-suave);
  font-size: clamp(15px, 1.1vw + 12px, 18px);
  line-height: 28px;
}

.hero__cards {
  width: 100%;
  margin-top: var(--space-4);
}

/* TAG y placa */
.tag__pair {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.tag__sticker {
  display: block;
  width: clamp(132px, 36vw, 220px);
  height: auto;
  flex: none;
  border-radius: var(--radius-sm);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.08);
}

.tag__or {
  font: 500 20px/1 var(--font-display);
  color: var(--texto-suave);
}

.tag__plate {
  width: min(100%, 240px);
  height: auto;
}

@media (min-width: 900px) {
  .tag__pair {
    justify-content: center;
  }
}

/* Peajes habilitados */
.tolls :deep(.empty > p) {
  margin-top: var(--space-3);
  max-width: 52ch;
}

/* Cuenta opcional */
.account {
  background: var(--fondo-frio);
  border: 1px solid var(--borde);
  border-radius: var(--radius-xl);
  padding: clamp(32px, 5vw, 64px) clamp(20px, 5vw, 64px);
}

/* Preguntas frecuentes */
summary::-webkit-details-marker {
  display: none;
}

summary svg {
  transition: transform 0.3s var(--ease-out);
}

details[open] summary svg {
  transform: rotate(180deg);
}
</style>
