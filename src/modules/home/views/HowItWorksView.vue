<script lang="ts">
import { defineComponent } from 'vue'
import HowItWorksInfographic from '../components/HowItWorksInfographic.vue'
import { HOW_IT_WORKS_INFOGRAPHIC } from '../constants/howItWorks.infographic'

export default defineComponent({
  name: 'HowItWorksView',
  components: { HowItWorksInfographic },
  data() {
    return { content: HOW_IT_WORKS_INFOGRAPHIC }
  },
})
</script>

<template>
  <section class="section how-page" aria-labelledby="how-page-title">
    <header class="how-page__head">
      <h1 id="how-page-title">{{ content.title }}</h1>
      <p>{{ content.intro }}</p>
    </header>
    <HowItWorksInfographic />
  </section>
</template>

<style scoped>
.how-page__head { max-width: 900px; margin: 0 auto var(--space-6); }
.how-page h1 { font-size: clamp(32px, 4vw, 48px); line-height: 1.15; }
.how-page__head p { max-width: 65ch; margin-top: var(--space-3); color: var(--texto-suave); }
</style>
