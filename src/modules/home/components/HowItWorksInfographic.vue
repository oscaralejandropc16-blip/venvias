<script lang="ts">
import { defineComponent } from 'vue'
import infographic from '@/assets/how-it-works/cobro-por-placa.png'
import { HOW_IT_WORKS_INFOGRAPHIC } from '../constants/howItWorks.infographic'

export default defineComponent({
  name: 'HowItWorksInfographic',
  data() {
    return { infographic, content: HOW_IT_WORKS_INFOGRAPHIC }
  },
})
</script>

<template>
  <div class="infographic">
    <div class="infographic__actions">
      <a :href="infographic" download="cobro-por-placa.png">{{ content.download }}</a>
    </div>
    <img :src="infographic" :alt="content.alt" width="1024" height="1536" decoding="async" />
  </div>
</template>

<style scoped>
.infographic { max-width: 900px; margin-inline: auto; }
.infographic__actions { display: flex; flex-wrap: wrap; gap: var(--space-2) var(--space-6); margin-bottom: var(--space-4); }
.infographic__actions a { display: inline-flex; align-items: center; min-height: 44px; }
.infographic img { width: 100%; height: auto; }
</style>
