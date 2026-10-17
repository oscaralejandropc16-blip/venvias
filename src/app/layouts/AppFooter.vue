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
  <footer class="bg-white border-t border-slate-200/80 relative">
    <div class="h-[2px] w-full bg-gradient-to-r from-[#F9D616] via-[#0038A8] to-[#CE1126]" aria-hidden="true"></div>
    <div class="wrap pt-10 pb-8">
      <div class="split gap-8 min-[900px]:grid-cols-[auto_1fr_auto] items-center">
        <div>
          <img :src="venvias" alt="VenVías Peajes" width="992" height="527" class="w-32 max-w-full h-auto transition-transform hover:scale-105 duration-200" />
          <p class="mt-2 font-display font-semibold text-[15px] text-[#122142]">El efectivo es cosa del pasado.</p>
        </div>
        <nav class="flex flex-wrap gap-x-6 gap-y-3 min-[900px]:justify-center" aria-label="Pie de página">
          <RouterLink
            v-for="l in links"
            :key="l.label"
            :to="l.to"
            class="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
          >
            {{ l.label }}
          </RouterLink>
        </nav>
        <div class="grid gap-1.5 justify-items-start min-[900px]:justify-items-end">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Un servicio de</span>
          <img :src="vem" alt="Venezuela en Movimiento" width="629" height="227" class="w-36 h-auto" />
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-4">
        <span>© VenVías · Sistema Nacional de Telepeaje · MPPT · Todos los derechos reservados.</span>
        <span class="font-medium text-slate-600">República Bolivariana de Venezuela</span>
      </div>
    </div>
  </footer>
</template>
