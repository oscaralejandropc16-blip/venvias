<script lang="ts">
import { defineComponent } from 'vue'
import { footerNavLinks } from '@/app/navigation/mainNav'
import venvias from '@/assets/logos/venvias-peajes-positivo.png'
import vem from '@/assets/logos/vem-positivo.png'

export default defineComponent({
  name: 'AppFooter',
  data() {
    return {
      venvias,
      vem,
      links: footerNavLinks,
    }
  },
})
</script>

<template>
  <footer class="bg-fondo-frio rule-top pt-8 pb-6">
    <div class="wrap split gap-6 min-[900px]:gap-8 min-[900px]:grid-cols-[auto_1fr_auto]">
      <div>
        <img :src="venvias" alt="VenVías Peajes" width="992" height="527" class="w-32 max-w-full h-auto" />
        <p class="mt-2 font-display font-medium text-[16px]/[22px] text-marino-900">El efectivo es cosa del pasado.</p>
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-2 min-[900px]:justify-center" aria-label="Pie de página">
        <RouterLink v-for="l in links" :key="l.label" :to="l.to" class="link-quiet hover:underline">{{ l.label }}</RouterLink>
      </nav>
      <div class="grid gap-1 justify-items-start">
        <span class="text-[13px] text-texto-suave">Un servicio de</span>
        <img :src="vem" alt="Venezuela en Movimiento" width="629" height="227" class="w-40 h-auto" />
      </div>
    </div>
  </footer>
</template>
