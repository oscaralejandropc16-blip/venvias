<script lang="ts">
import { defineComponent } from 'vue'
import HowItWorksDiagram from '../components/HowItWorksDiagram.vue'
import { HOW_IT_WORKS_DIAGRAM } from '../constants/howItWorks.diagram'

export default defineComponent({
  name: 'HowItWorksView',
  components: { HowItWorksDiagram },
  data() {
    return { content: HOW_IT_WORKS_DIAGRAM }
  },
})
</script>

<template>
  <section class="section how-page" aria-labelledby="how-page-title">
    <header class="how-page__head no-print">
      <h1 id="how-page-title">{{ content.title }}</h1>
      <p>{{ content.intro }}</p>
    </header>
    <HowItWorksDiagram />
  </section>
</template>

<style scoped>
.how-page {
  padding-block: clamp(24px, 4vw, 48px) var(--space-14);
}

.how-page__head {
  max-width: 1080px;
  margin: 0 auto var(--space-6);
}

.how-page h1 {
  font-size: clamp(30px, 2.5vw + 18px, 44px);
  line-height: 1.15;
  color: var(--marino-900);
}

.how-page__head p {
  max-width: 68ch;
  margin-top: var(--space-3);
  font-size: 16px;
  line-height: 26px;
  color: var(--texto-suave);
}

@media print {
  .how-page {
    padding: 0 !important;
  }
  .no-print {
    display: none !important;
  }
}
</style>
