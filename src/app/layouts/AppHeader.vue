<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { accountLink, mainNavLinks, mobileNavLinks } from '@/app/navigation/mainNav'
import { ROUTE_NAMES } from '@/core/constants/routing'
import type { NavLink } from '@/core/types/Nav'
import type { IconName } from '@/shared/icons/iconPaths'
import logo from '@/assets/logos/venvias-positivo.png'

export default defineComponent({
  name: 'AppHeader',
  components: { AppIcon },
  data() {
    return {
      logo,
      links: mainNavLinks,
      mobileLinks: mobileNavLinks,
      accountLink,
      homeRoute: { name: ROUTE_NAMES.home },
      open: false,
      isScrolled: false,
      scrollHandler: null as (() => void) | null,
    }
  },
  watch: {
    '$route.fullPath'() {
      this.open = false
    },
  },
  mounted() {
    this.scrollHandler = () => {
      this.isScrolled = window.scrollY > 20
    }
    window.addEventListener('scroll', this.scrollHandler, { passive: true })
    this.scrollHandler()
  },
  beforeUnmount() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler)
    }
  },
  methods: {
    exactActiveClass(link: NavLink): string {
      const isAnchor = typeof link.to === 'object' && 'hash' in link.to && !!link.to.hash
      return isAnchor ? '' : 'router-link-exact-active'
    },
    getLinkIcon(label: string): IconName {
      const map: Record<string, IconName> = {
        'Inicio': 'carro',
        'Recargar placa': 'rayo',
        'Consultar saldo': 'placa',
        'Pagar deuda': 'alert',
        'Peajes habilitados': 'peaje',
        'Cómo funciona': 'info',
      }
      return map[label] ?? 'arrow'
    },
  },
})
</script>

<template>
  <header class="nav" :class="{ 'is-open': open, 'is-scrolled': isScrolled }">
    <!-- Barra Tricolor Superior Dinámica con Barrido Luminoso -->
    <div class="nav__tricolor" aria-hidden="true"></div>

    <div class="wrap nav__container">
      <!-- Marca Institucional VenVías (Limpia, sin badges ni pastillas) -->
      <div class="nav__brand-group">
        <RouterLink :to="homeRoute" class="nav-brand" aria-label="VenVías - Inicio">
          <img
            :src="logo"
            alt="VenVías"
            width="992"
            height="380"
            class="nav-brand__logo"
            loading="eager"
          />
        </RouterLink>
      </div>

      <!-- Enlaces Centrales de Navegación de Escritorio -->
      <nav class="nav__links" aria-label="Navegación principal">
        <RouterLink
          v-for="l in links"
          :key="l.label"
          :to="l.to"
          class="nav__link"
          :exact-active-class="exactActiveClass(l)"
        >
          <span>{{ l.label }}</span>
        </RouterLink>
      </nav>

      <!-- Acciones en la Cabecera -->
      <div class="nav__actions">
        <!-- Botón Ejecutivo de Acceso al Portal / Mi Cuenta (Rectangular Estándar - Sin Píldoras) -->
        <RouterLink
          :to="accountLink.to"
          class="nav-btn-account"
          aria-label="Portal de gestión y vehículos Mi Cuenta"
        >
          <AppIcon name="carro" :size="16" />
          <span>Mi cuenta</span>
        </RouterLink>

        <!-- Botón Hamburguesa Móvil / Tablet (Solo visible bajo 1080px) -->
        <button
          class="nav__menu-btn"
          type="button"
          :aria-expanded="open"
          aria-controls="menu-movil"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" :size="19" />
          <span>{{ open ? 'Cerrar' : 'Menú' }}</span>
        </button>
      </div>
    </div>

    <!-- Fondo Oscurecido para Menú Móvil -->
    <div
      v-if="open"
      class="nav__backdrop"
      @click="open = false"
      aria-hidden="true"
    ></div>

    <!-- Menú Desplegable Móvil -->
    <div
      id="menu-movil"
      class="nav__sheet"
      :hidden="!open"
    >
      <div class="wrap nav__sheet-container">
        <!-- Acciones Rápidas en Móvil -->
        <div class="nav__sheet-quick-actions">
          <RouterLink
            :to="accountLink.to"
            class="nav-sheet-account-btn"
          >
            <AppIcon name="carro" :size="17" />
            <span>Portal Mi Cuenta</span>
          </RouterLink>

          <a
            href="tel:08008368427"
            class="nav-sheet-call-btn"
          >
            <AppIcon name="audifonos" :size="17" />
            <span>0800-VENVIAS</span>
          </a>
        </div>

        <!-- Lista de Enlaces Móviles -->
        <nav aria-label="Navegación principal móvil" class="nav__sheet-links">
          <RouterLink
            v-for="l in mobileLinks"
            :key="l.label"
            :to="l.to"
            class="nav__sheet-link"
            :exact-active-class="exactActiveClass(l)"
          >
            <div class="nav__sheet-link-left">
              <span class="nav__sheet-link-icon-box">
                <AppIcon :name="getLinkIcon(l.label)" :size="17" />
              </span>
              <span class="nav__sheet-link-label">{{ l.label }}</span>
            </div>
            <AppIcon name="arrow" :size="16" class="nav__sheet-link-arrow" />
          </RouterLink>
        </nav>

        <!-- Estatus Operativo al Fondo del Menú Móvil -->
        <div class="nav__sheet-status">
          <span class="nav__sheet-status-dot" aria-hidden="true"></span>
          <span>Red Nacional Operativa 24/7 · Peajes Interoperables ALPR & RFID</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: #ffffff !important;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px -2px rgba(18, 33, 66, 0.06);
  transition: box-shadow 0.3s ease;
}

/* Barra Tricolor Superior Dinámica con Barrido Luminoso */
.nav__tricolor {
  position: relative;
  height: 3px;
  width: 100%;
  background: var(--tricolor-vzla, linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%));
  overflow: hidden;
}

.nav__tricolor::after {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 32%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent);
  animation: tricolorSweep 5s ease-in-out infinite;
}

@keyframes tricolorSweep {
  0% { left: -50%; }
  35%, 100% { left: 150%; }
}

/* Contenedor Principal de la Barra */
.nav__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  height: 68px;
}

@media (min-width: 1080px) {
  .nav__container {
    height: 72px;
    gap: 24px;
  }
}

/* Grupo de Marca y Distintivo Oficial */
.nav__brand-group {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.nav-brand__logo {
  height: 38px;
  width: auto;
  transition: transform 0.2s ease;
}

@media (min-width: 1080px) {
  .nav-brand__logo {
    height: 42px;
  }
}

.nav-brand:hover .nav-brand__logo {
  transform: scale(1.02);
}

/* Enlaces de Navegación Centrales: Tipografía limpia, sin fondos grises ni pastillas */
.nav__links {
  display: none;
  align-items: center;
  gap: 8px;
  margin-inline: auto;
}

@media (min-width: 1080px) {
  .nav__links {
    display: flex;
  }
}

.nav__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  font-size: 14.5px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  white-space: nowrap;
  background: none !important;
  border-radius: 0 !important;
  transition: color 0.2s ease;
}

@media (min-width: 1240px) {
  .nav__link {
    padding: 10px 16px;
    font-size: 15px;
  }
}

.nav__link:hover {
  color: #0038A8;
  text-decoration: none;
}

/* Indicador de pestaña activa: línea sutil debajo de la opción, sin cajitas */
.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 14px;
  right: 14px;
  height: 2.5px;
  background: #0038A8;
  border-radius: 3px 3px 0 0;
  opacity: 0;
  transform: scaleX(0);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

@media (min-width: 1240px) {
  .nav__link::after {
    left: 16px;
    right: 16px;
  }
}

.nav__link:hover::after {
  opacity: 0.4;
  transform: scaleX(0.7);
}

.nav__link.router-link-exact-active {
  color: #0038A8;
  font-weight: 700;
}

.nav__link.router-link-exact-active::after {
  opacity: 1;
  transform: scaleX(1);
}

/* Área de Acciones Derecha */
.nav__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Botón Ejecutivo de Mi Cuenta en Azul VenVías (Sin negro opaco) */
.nav-btn-account {
  display: none;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0038A8 0%, #0057a3 100%);
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.28);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

@media (min-width: 1080px) {
  .nav-btn-account {
    display: inline-flex;
  }
}

.nav-btn-account:hover {
  background: linear-gradient(135deg, #002f8c 0%, #004b8d 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 56, 168, 0.38);
  color: #ffffff;
  text-decoration: none;
}

/* Botón Hamburguesa Móvil */
.nav__menu-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px 0 10px;
  border: 1px solid var(--borde, #e2e8f0);
  border-radius: 8px;
  background: #ffffff;
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 4px rgba(18, 33, 66, 0.05);
  transition: all 0.2s ease;
}

@media (min-width: 1080px) {
  .nav__menu-btn {
    display: none !important;
  }
}

.nav__menu-btn:hover {
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(18, 33, 66, 0.08);
}

/* Menú Desplegable Móvil */
.nav__backdrop {
  position: fixed;
  inset: 0;
  top: 67px;
  background: rgba(7, 14, 30, 0.4);
  backdrop-filter: blur(4px);
  z-index: 40;
}

.nav__sheet {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
  box-shadow: 0 20px 30px -10px rgba(18, 33, 66, 0.15);
  animation: navSheetIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  z-index: 50;
}

@keyframes navSheetIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 1080px) {
  .nav__backdrop,
  .nav__sheet {
    display: none !important;
  }
}

.nav__sheet-container {
  padding-block: 18px 22px;
}

/* Botones Rápidos en Móvil */
.nav__sheet-quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.nav-sheet-account-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0038A8 0%, #0057a3 100%);
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(0, 56, 168, 0.25);
}

.nav-sheet-call-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 8px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
}

/* Lista de Enlaces en Móvil */
.nav__sheet-links {
  display: flex;
  flex-direction: column;
}

.nav__sheet-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 10px;
  border-radius: 8px;
  color: #1e293b;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.nav__sheet-link:hover,
.nav__sheet-link.router-link-exact-active {
  background: rgba(0, 56, 168, 0.05);
  color: #0038A8;
}

.nav__sheet-link.router-link-exact-active {
  font-weight: 600;
}

.nav__sheet-link-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav__sheet-link-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #0038A8;
}

.nav__sheet-link.router-link-exact-active .nav__sheet-link-icon-box {
  background: #0038A8;
  color: #ffffff;
}

.nav__sheet-link-arrow {
  color: #94a3b8;
  transition: transform 0.15s ease;
}

.nav__sheet-link:hover .nav__sheet-link-arrow {
  transform: translateX(3px);
  color: #0038A8;
}

/* Estado Operativo Móvil */
.nav__sheet-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 14px;
  border-radius: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 11.5px;
  font-weight: 600;
  color: #475569;
  text-align: center;
}

.nav__sheet-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: #10b981;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.7);
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .nav__tricolor::after,
  .nav__sheet,
  .nav__menu-btn {
    animation: none !important;
    transition: none !important;
  }
}
</style>
