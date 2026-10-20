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
    open(isOpen: boolean) {
      if (typeof document !== 'undefined') {
        if (isOpen) {
          document.body.style.overflow = 'hidden'
          document.documentElement.style.overflow = 'hidden'
          document.body.style.touchAction = 'none'
        } else {
          document.body.style.overflow = ''
          document.documentElement.style.overflow = ''
          document.body.style.touchAction = ''
        }
      }
    },
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
    if (typeof document !== 'undefined') {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.touchAction = ''
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
        'Recargar una placa': 'rayo',
        'Pagar saldo deudor': 'alert',
        'Cómo funciona': 'info',
        'Peajes habilitados': 'peaje',
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
          aria-label="Abrir menú de navegación"
          @click="open = !open"
        >
          <AppIcon :name="open ? 'close' : 'menu'" :size="19" />
          <span>{{ open ? 'Cerrar' : 'Menú' }}</span>
        </button>
      </div>
    </div>

    <!-- Menú Móvil Fullscreen / Drawer en Teleport a body -->
    <Teleport to="body">
      <div
        v-if="open"
        id="menu-movil"
        class="nav-mobile-root"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
      >
        <!-- Backdrop con Desenfoque Suave y Cierre al Tocar -->
        <div
          class="nav-mobile-backdrop"
          aria-hidden="true"
          @click="open = false"
        ></div>

        <!-- Panel del Menú Móvil con scroll independiente -->
        <div class="nav-mobile-drawer">
          <!-- Cabecera del Menú Móvil con Logo y Botón Cerrar -->
          <div class="nav-mobile-header">
            <RouterLink
              :to="homeRoute"
              class="nav-mobile-brand"
              aria-label="VenVías - Inicio"
              @click="open = false"
            >
              <img
                :src="logo"
                alt="VenVías"
                width="992"
                height="380"
                class="nav-mobile-logo"
              />
            </RouterLink>

            <button
              type="button"
              class="nav-mobile-close-btn"
              aria-label="Cerrar menú"
              @click="open = false"
            >
              <AppIcon name="close" :size="20" />
            </button>
          </div>

          <!-- Línea Tricolor decorativa institucional -->
          <div class="nav-mobile-tricolor" aria-hidden="true"></div>

          <!-- Contenido del Menú con Scroll Independiente -->
          <div class="nav-mobile-content">
            <!-- Lista de Enlaces Principales -->
            <nav aria-label="Navegación principal móvil" class="nav-mobile-nav">
              <RouterLink
                v-for="l in mobileLinks"
                :key="l.label"
                :to="l.to"
                class="nav-mobile-link"
                :exact-active-class="exactActiveClass(l)"
                @click="open = false"
              >
                <div class="nav-mobile-link-left">
                  <span class="nav-mobile-icon-box" aria-hidden="true">
                    <AppIcon :name="getLinkIcon(l.label)" :size="18" />
                  </span>
                  <span class="nav-mobile-link-title">{{ l.label }}</span>
                </div>
                <AppIcon name="arrow" :size="16" class="nav-mobile-link-arrow" aria-hidden="true" />
              </RouterLink>
            </nav>

            <!-- Acciones al pie del menú móvil -->
            <div class="nav-mobile-footer">
              <RouterLink
                :to="accountLink.to"
                class="nav-mobile-account-btn"
                @click="open = false"
              >
                <AppIcon name="carro" :size="18" />
                <span>Acceder a Mi cuenta</span>
              </RouterLink>

              <a
                href="tel:08008368427"
                class="nav-mobile-call-btn"
              >
                <AppIcon name="audifonos" :size="17" />
                <span>Línea de Asistencia: 0800-VENVIAS</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
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

/* ==========================================================================
   MENÚ MÓVIL FULLSCREEN / DRAWER CON TELEPORT
   ========================================================================== */
.nav-mobile-root {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  justify-content: flex-end;
  pointer-events: auto;
}

@media (min-width: 1080px) {
  .nav-mobile-root {
    display: none !important;
  }
}

/* Backdrop */
.nav-mobile-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: mobileBackdropFade 0.25s ease both;
}

@keyframes mobileBackdropFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Drawer del Menú Móvil */
.nav-mobile-drawer {
  position: relative;
  z-index: 100000;
  width: 100%;
  max-width: 100%;
  height: 100dvh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 35px rgba(0, 0, 0, 0.25);
  animation: mobileDrawerSlide 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (min-width: 600px) {
  .nav-mobile-drawer {
    max-width: 380px;
  }
}

@keyframes mobileDrawerSlide {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Cabecera del Drawer */
.nav-mobile-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 20px;
  background: #ffffff;
  flex-shrink: 0;
}

.nav-mobile-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.nav-mobile-logo {
  height: 36px;
  width: auto;
}

.nav-mobile-close-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-mobile-close-btn:hover {
  background: #e2e8f0;
  color: #0038A8;
}

.nav-mobile-close-btn:active {
  transform: scale(0.94);
}

/* Línea tricolor en la parte superior del drawer */
.nav-mobile-tricolor {
  height: 3px;
  width: 100%;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  flex-shrink: 0;
}

/* Contenido del Drawer con scroll interno independiente */
.nav-mobile-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 18px 20px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
}

/* Lista de navegación */
.nav-mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #1e293b;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.nav-mobile-link:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
  transform: translateX(2px);
}

.nav-mobile-link.router-link-exact-active {
  background: rgba(0, 56, 168, 0.06);
  border-color: rgba(0, 56, 168, 0.15);
  color: #0038A8;
}

.nav-mobile-link-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-mobile-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #0038A8;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.nav-mobile-link:hover .nav-mobile-icon-box,
.nav-mobile-link.router-link-exact-active .nav-mobile-icon-box {
  background: #0038A8;
  color: #ffffff;
}

.nav-mobile-link-title {
  font-family: var(--font-body, system-ui, sans-serif);
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.3;
}

.nav-mobile-link-arrow {
  color: #94a3b8;
  transition: transform 0.2s ease, color 0.2s ease;
}

.nav-mobile-link:hover .nav-mobile-link-arrow,
.nav-mobile-link.router-link-exact-active .nav-mobile-link-arrow {
  color: #0038A8;
  transform: translateX(3px);
}

/* Pie del menú móvil */
.nav-mobile-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.nav-mobile-account-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  border-radius: 12px;
  background: #0038A8;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 56, 168, 0.3);
  transition: all 0.2s ease;
}

.nav-mobile-account-btn:hover {
  background: #0284c7;
  transform: translateY(-1px);
}

.nav-mobile-call-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #0f172a;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-mobile-call-btn:hover {
  background: #eff6ff;
  border-color: #0038A8;
  color: #0038A8;
}

@media (prefers-reduced-motion: reduce) {
  .nav__tricolor::after,
  .nav-mobile-backdrop,
  .nav-mobile-drawer,
  .nav__menu-btn {
    animation: none !important;
    transition: none !important;
  }
}
</style>
