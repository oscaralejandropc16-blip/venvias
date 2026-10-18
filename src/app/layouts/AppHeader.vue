<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { useHeroStore } from '@/app/stores/hero.store'
import { accountLink, mainNavLinks, mobileNavLinks, navCtaLink } from '@/app/navigation/mainNav'
import { ROUTE_NAMES } from '@/core/constants/routing'
import type { NavLink } from '@/core/types/Nav'
import logo from '@/assets/logos/venvias-positivo.png'

export default defineComponent({
  name: 'AppHeader',
  components: { AppIcon },
  data() {
    return {
      hero: useHeroStore(),
      logo,
      links: mainNavLinks,
      mobileLinks: mobileNavLinks,
      ctaLink: navCtaLink,
      accountLink,
      homeRoute: { name: ROUTE_NAMES.home },
      open: false,
    }
  },
  computed: {
    // En el móvil el «Recargar» de la nav cede su lugar mientras la placa del hero está a la vista.
    heroPlateVisible(): boolean {
      return this.$route.name === ROUTE_NAMES.home && this.hero.plateInView !== false
    },
  },
  watch: {
    '$route.fullPath'() {
      this.open = false
    },
  },
  methods: {
    // Los enlaces a una sección de inicio no se marcan como página actual.
    exactActiveClass(link: NavLink): string {
      const isAnchor = typeof link.to === 'object' && 'hash' in link.to && !!link.to.hash
      return isAnchor ? '' : 'router-link-exact-active'
    },
  },
})
</script>

<template>
  <header class="nav" :class="{ 'is-open': open }">
    <div class="nav__tricolor" aria-hidden="true"></div>
    <div class="wrap flex items-center gap-6 h-16 min-[1080px]:h-[76px]">
      <RouterLink :to="homeRoute" class="flex items-center gap-3" aria-label="VenVías, inicio">
        <img :src="logo" alt="VenVías" width="992" height="380" class="h-[34px] w-auto min-[1080px]:h-10 transition-transform duration-200 hover:scale-[1.02]" />
      </RouterLink>

      <nav class="nav__links hidden gap-8 mx-auto min-[1080px]:flex" aria-label="Principal">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="nav__link link-quiet"
          :exact-active-class="exactActiveClass(l)"
        >
          {{ l.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-3 ml-auto min-[1080px]:ml-0">
        <RouterLink :to="ctaLink.to" class="btn btn--primario btn--sm" :class="{ 'max-[1079px]:hidden': heroPlateVisible }">
          <AppIcon name="rayo" :size="16" />
          {{ ctaLink.label }}
        </RouterLink>
        <RouterLink :to="accountLink.to" class="btn btn--secundario btn--sm hidden min-[1080px]:inline-flex">
          <AppIcon name="carro" :size="16" />
          {{ accountLink.label }}
        </RouterLink>
        <button class="nav__menu" type="button" :aria-expanded="open" aria-controls="menu-movil" @click="open = !open">
          <AppIcon :name="open ? 'close' : 'menu'" />
          <span>{{ open ? 'Cerrar' : 'Menú' }}</span>
        </button>
      </div>
    </div>

    <div id="menu-movil" class="nav__sheet rule-top pt-3 pb-6 min-[1080px]:hidden" :hidden="!open">
      <nav aria-label="Principal móvil" class="wrap flex flex-col">
        <RouterLink v-for="l in mobileLinks" :key="l.label" :to="l.to">
          {{ l.label }}<AppIcon name="arrow" :size="20" />
        </RouterLink>
        <RouterLink :to="accountLink.to" class="btn btn--secundario mt-6 self-start">
          <AppIcon name="carro" :size="16" />
          {{ accountLink.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 20px -2px rgba(18, 33, 66, 0.08);
}
.nav__tricolor {
  height: 3px;
  width: 100%;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
  position: relative;
  overflow: hidden;
}
.nav__tricolor::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 30%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
  animation: tricolorSweep 4.5s ease-in-out infinite;
}
@keyframes tricolorSweep {
  0% { left: -50%; }
  35%, 100% { left: 150%; }
}
@media (prefers-reduced-motion: reduce) {
  .nav__tricolor::after {
    animation: none;
  }
}
.nav__links a.nav__link {
  position: relative;
  padding-block: 8px;
  font-size: 15px;
  font-weight: 500;
  color: var(--texto);
  transition: color 0.2s var(--ease-out);
}
.nav__links a.nav__link:hover {
  color: #0038A8;
}
.nav__links a.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  right: 50%;
  height: 2.5px;
  background: #0038A8;
  border-radius: 2px;
  transition: left 0.25s var(--ease-out), right 0.25s var(--ease-out), opacity 0.2s;
  opacity: 0;
}
.nav__links a.nav__link:hover::after {
  left: 25%;
  right: 25%;
  opacity: 0.4;
}
.nav__links a.router-link-exact-active {
  color: #0038A8;
  font-weight: 600;
}
.nav__links a.router-link-exact-active::after {
  left: 0;
  right: 0;
  opacity: 1;
}

.nav__menu {
  display: inline-flex; align-items: center; gap: 6px; min-height: 40px; padding: 0 14px 0 10px;
  border: 1px solid var(--borde); border-radius: var(--radius-pill); background: #fff;
  color: var(--marino-900); font-size: 14px; font-weight: 500; cursor: pointer;
  box-shadow: 0 2px 6px rgba(18, 33, 66, 0.05);
  transition: all 0.2s var(--ease-out);
}
.nav__menu:hover {
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(18, 33, 66, 0.08);
}

.nav__sheet {
  animation: navSheetIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}
@keyframes navSheetIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav__sheet a:not(.btn) {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 0; border-bottom: 1px solid var(--borde);
  color: #122142; text-decoration: none; font: 500 18px/24px var(--font-display);
  transition: color 0.2s, padding-left 0.2s;
}
.nav__sheet a:not(.btn):hover {
  color: #0038A8;
  padding-left: 6px;
}

@media (min-width: 1080px) {
  .nav__menu { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .nav__links a.nav__link::after,
  .nav__sheet,
  .nav__menu {
    animation: none !important;
    transition: none !important;
  }
}
</style>
