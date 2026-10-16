<script lang="ts">
import { defineComponent, markRaw } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import RoadRibbon from '@/shared/ui/RoadRibbon.vue'
import { HOW_IT_WORKS_ANCHOR } from '@/core/constants/routing'
import { HOW_IT_WORKS_SLIDES } from '../constants/howItWorks.slides'

export default defineComponent({
  name: 'HowItWorks',
  components: { AppIcon, RoadRibbon },
  props: {
    plain: { type: Boolean, default: false },
  },
  data() {
    return {
      anchorId: HOW_IT_WORKS_ANCHOR,
      slides: HOW_IT_WORKS_SLIDES,
      active: 0,
      // Mientras la pista viaja, las paradas intermedias no deben robarse el paso activo.
      steering: null as number | null,
      settle: undefined as ReturnType<typeof setTimeout> | undefined,
      observer: null as IntersectionObserver | null,
    }
  },
  mounted() {
    const track = this.track()
    if (!track) return

    this.observer = markRaw(
      new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (!en.isIntersecting) return
            const i = Number((en.target as HTMLElement).dataset.i)
            if (this.steering === null || this.steering === i) {
              this.active = i
              if (this.steering === i) this.steering = null
            }
          }),
        { root: track, threshold: 0.6 },
      ),
    )
    Array.from(track.children).forEach((el) => this.observer?.observe(el))
  },

  beforeUnmount() {
    this.observer?.disconnect()
    clearTimeout(this.settle)
  },

  methods: {
    track(): HTMLElement | undefined {
      return this.$refs.track as HTMLElement | undefined
    },
    // Posición real de cada paso dentro de la pista (los anchos pueden ser fraccionarios).
    offsetOf(n: number): number {
      const kids = (this.track() as HTMLElement).children as HTMLCollectionOf<HTMLElement>
      return kids[n].offsetLeft - kids[0].offsetLeft
    },

    go(i: number): void {
      const t = this.track()
      if (!t) return
      const n = Math.max(0, Math.min(this.slides.length - 1, i))
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      this.steering = n
      this.active = n
      t.scrollTo({ left: this.offsetOf(n), behavior: reduce ? 'auto' : 'smooth' })
      // Respaldo para navegadores sin el evento scrollend
      if (!('onscrollend' in window)) {
        clearTimeout(this.settle)
        this.settle = setTimeout(this.onScrollEnd, 900)
      }
    },
    // Al detenerse la pista: alinea al paso exacto (nunca durante el viaje: rompe el snap).
    onScrollEnd(): void {
      const t = this.track()
      if (!t) return
      this.steering = null
      clearTimeout(this.settle)
      // Con el asomo en móvil el último paso no llega al inicio: se elige el más cercano a la posición real.
      const n = this.slides.reduce(
        (best, _, i) =>
          Math.abs(this.offsetOf(i) - t.scrollLeft) < Math.abs(this.offsetOf(best) - t.scrollLeft) ? i : best,
        0,
      )
      this.active = n
      if (Math.abs(t.scrollLeft - this.offsetOf(n)) > 0.5) t.scrollLeft = this.offsetOf(n)
    },
    onScroll(): void {
      if (!('onscrollend' in window)) {
        clearTimeout(this.settle)
        this.settle = setTimeout(this.onScrollEnd, 160)
      }
    },
    onKey(e: KeyboardEvent): void {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        this.go(this.active + 1)
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.go(this.active - 1)
      }
    },
  },
})
</script>

<template>
  <section :id="anchorId" class="how" :class="{ 'how--plain': plain }" aria-labelledby="how-title">
    <div class="wrap how__panel">
      <header class="how__head">
        <div>
          <h2 id="how-title">Tu placa paga. Tú no te detienes.</h2>
          <p>Así funciona el pago por placa.</p>
        </div>
        <div class="how__arrows">
          <button type="button" class="how__arrow" :disabled="active === 0" aria-label="Paso anterior" @click="go(active - 1)">
            <AppIcon name="arrow" :size="22" class="how__flip" />
          </button>
          <button type="button" class="how__arrow" :disabled="active === slides.length - 1" aria-label="Paso siguiente" @click="go(active + 1)">
            <AppIcon name="arrow" :size="22" />
          </button>
        </div>
      </header>

      <div
        ref="track"
        class="how__track"
        tabindex="0"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Cómo funciona, paso a paso"
        @keydown="onKey"
        @scrollend="onScrollEnd"
        @scroll="onScroll"
      >
        <article
          v-for="(s, i) in slides"
          :key="s.title"
          class="how__slide"
          :class="{ 'is-active': i === active }"
          :data-i="i"
          role="group"
          aria-roledescription="paso"
          :aria-label="`${i + 1} de ${slides.length}: ${s.title}`"
        >
          <figure class="how__media">
            <img
              :src="s.img"
              :srcset="`${s.imgSm} 900w, ${s.img} 1536w`"
              sizes="(min-width: 1260px) 740px, (min-width: 900px) 60vw, 88vw"
              :alt="s.alt"
              width="1536" height="1024"
              :loading="i === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />

            <template v-if="s.zoom">
              <svg class="how__zoom-line" viewBox="0 0 1536 1024" preserveAspectRatio="none" aria-hidden="true">
                <line x1="461" y1="664" x2="338" y2="428" />
              </svg>
              <span class="how__frame" aria-hidden="true"><i /><i /><i /><i /></span>
              <span class="how__zoom">
                <img :src="s.zoom.img" :alt="s.zoom.alt" width="480" height="480" loading="lazy" decoding="async" />
              </span>
            </template>

            <div v-if="s.invoice" class="how__invoice">
              <p class="how__invoice-head"><AppIcon name="recibo" :size="18" />Saldo deudor</p>
              <dl>
                <div><dt>Placa</dt><dd class="mono">{{ s.invoice.plate }}</dd></div>
                <div><dt>Estado</dt><dd class="how__invoice-status">{{ s.invoice.status }}</dd></div>
              </dl>
            </div>
          </figure>

          <div class="how__text">
            <h3>{{ s.title }}</h3>
            <p v-if="s.text" class="how__lead">{{ s.text }}</p>
            <ul v-if="s.points" class="how__points">
              <li v-for="pt in s.points" :key="pt"><AppIcon name="check" :size="18" />{{ pt }}</li>
            </ul>
            <p v-if="s.stat" class="how__stat">
              <strong>{{ s.stat.value }}</strong>
              <span>{{ s.stat.label }}</span>
            </p>
            <p v-if="s.note" class="how__note">
              <AppIcon name="info" :size="18" />
              <span>
                <strong>{{ s.note.strong }}</strong>
              </span>
            </p>
            <p v-if="s.cta" class="how__actions">
              Págala en
              <RouterLink :to="s.cta.to" :tabindex="i === active ? 0 : -1" class="how__more">{{ s.cta.label }}</RouterLink>
              <span aria-hidden="true">·</span>
              <RouterLink v-if="s.more" :to="s.more.to" :tabindex="i === active ? 0 : -1" class="how__more">{{ s.more.label }}</RouterLink>
            </p>
          </div>
        </article>
      </div>

      <nav class="how__route" aria-label="Pasos">
        <div class="how__road"><RoadRibbon /></div>
        <ol class="how__pins">
          <li v-for="(s, i) in slides" :key="s.title">
            <button
              type="button"
              class="how__pin"
              :class="{ 'is-active': i === active, 'is-done': i < active }"
              :aria-current="i === active ? 'step' : undefined"
              :aria-label="`Paso ${i + 1}: ${s.title}`"
              @click="go(i)"
            >{{ i + 1 }}</button>
            <span class="how__stop" :class="{ 'is-active': i === active }" aria-hidden="true">{{ s.stop }}</span>
          </li>
        </ol>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.how { padding-block: 0 var(--space-14); }
.how--plain { padding-block: clamp(32px, 5vw, 64px) clamp(48px, 6vw, 80px); overflow-x: clip; }
.how__panel {
  background: var(--marino-900); color: #fff; border-radius: var(--radius-xl);
  padding: clamp(28px, 5vw, 64px) clamp(16px, 5vw, 64px) clamp(20px, 3vw, 40px); overflow: hidden;
  box-shadow: 0 20px 45px -10px rgba(18, 33, 66, 0.25), 0 10px 20px -5px rgba(18, 33, 66, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.how__panel :focus-visible { outline-color: var(--azul-300); }

.how__head { display: flex; justify-content: space-between; align-items: end; gap: var(--space-6); }
.how__head h2 { color: #fff; max-width: 18ch; }
.how__head p { margin-top: var(--space-2); color: #c9d4ea; }
.how__arrows { display: flex; gap: var(--space-2); flex: none; }
.how__arrow {
  width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; cursor: pointer;
  background: transparent; color: #fff; border: 1px solid rgba(255, 255, 255, .28);
  transition: background-color .2s var(--ease-out), border-color .2s var(--ease-out), opacity .2s;
}
.how__arrow:hover:not(:disabled) { background: rgba(255, 255, 255, .08); border-color: #fff; }
.how__arrow:disabled { opacity: .3; cursor: default; }
.how__flip { transform: scaleX(-1); }

/* Pista: deslizamiento nativo con scroll-snap */
.how__track {
  /* La pista desborda 8px por lado para no recortar anillos de foco ni el borde de las letras */
  display: flex; margin: var(--space-8) -8px 0; overflow-x: auto; scroll-snap-type: x mandatory;
  scrollbar-width: none; overscroll-behavior-x: contain; border-radius: var(--radius-md);
}
.how__track::-webkit-scrollbar { display: none; }
/* Hueco final del asomo: el último paso también se alinea al inicio */
.how__track::after { content: ''; flex: 0 0 12%; }
.how__slide {
  flex: 0 0 88%; scroll-snap-align: start; display: grid; gap: var(--space-6); align-content: start;
  padding: 0 8px 8px;
}

.how__media { position: relative; margin: 0; aspect-ratio: 3 / 2; border-radius: var(--radius-md); overflow: hidden; background: #1c2d55; }
.how__media img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.04); transition: transform 1.4s var(--ease-out); }
.is-active .how__media img { transform: scale(1); }

/* Lupa sobre la placa: marco en la foto, línea y círculo ampliado. Todo en % de la foto 3:2. */
.how__frame { position: absolute; left: 27.5%; top: 64.8%; width: 5.1%; height: 4.6%; }
.how__frame i { position: absolute; width: 34%; height: 40%; border: 0 solid #fff; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .5)); }
.how__frame i:nth-child(1) { left: 0; top: 0; border-width: 2px 0 0 2px; }
.how__frame i:nth-child(2) { right: 0; top: 0; border-width: 2px 2px 0 0; }
.how__frame i:nth-child(3) { left: 0; bottom: 0; border-width: 0 0 2px 2px; }
.how__frame i:nth-child(4) { right: 0; bottom: 0; border-width: 0 2px 2px 0; }
.how__zoom-line { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.how__zoom-line line { stroke: #fff; stroke-width: 2; vector-effect: non-scaling-stroke; filter: drop-shadow(0 1px 2px rgba(0, 0, 0, .5)); }
.how__zoom {
  position: absolute; left: 3%; top: 5%; width: 26%; aspect-ratio: 1; border-radius: 50%; overflow: hidden;
  border: 3px solid #fff; box-shadow: var(--elev-2); background: #fff;
}
.how__media .how__zoom img { width: 100%; height: 100%; object-fit: cover; transform: none; }
.how__zoom, .how__zoom-line, .how__frame { opacity: 0; transition: opacity .5s var(--ease-out) .3s, transform .6s var(--ease-out) .3s; }
.how__zoom { transform: scale(.85); transform-origin: 75% 100%; }
.is-active .how__zoom, .is-active .how__zoom-line, .is-active .how__frame { opacity: 1; }
.is-active .how__zoom { transform: none; }

/* Tarjeta de saldo deudor sobre la foto del paso de deuda */
.how__invoice {
  position: absolute; left: clamp(10px, 2.4vw, 20px); bottom: clamp(10px, 2.4vw, 20px);
  min-width: min(220px, 60%); background: #fff; color: var(--marino-900); border-radius: var(--radius-sm);
  padding: 10px 14px 12px; box-shadow: var(--elev-2); font-size: 13px; line-height: 18px;
  opacity: 0; transform: translateY(10px); transition: opacity .5s var(--ease-out) .3s, transform .5s var(--ease-out) .3s;
}
.is-active .how__invoice { opacity: 1; transform: none; }
.how__invoice-head { display: flex; align-items: center; gap: 6px; font: 500 14px/20px var(--font-display); padding-bottom: 8px; border-bottom: 1px dashed var(--borde); }
.how__invoice-head svg { color: var(--azul-700); flex: none; }
.how__invoice dl { margin: 8px 0 0; display: grid; gap: 4px; }
.how__invoice dl > div { display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-4); }
.how__invoice dt { color: var(--texto-suave); }
.how__invoice dd { margin: 0; }
.how__invoice .mono { font: 500 13px/1.2 var(--font-mono); letter-spacing: .06em; white-space: nowrap; }
.how__invoice .how__invoice-status { font-weight: 500; color: var(--marino-900); }

.how__text h3 { color: #fff; font-size: clamp(24px, 1.4vw + 16px, 34px); line-height: 1.18; font-weight: 500; }
.how__text p { margin-top: var(--space-3); color: #c9d4ea; max-width: 44ch; font-size: 17px; line-height: 26px; }
.how__points { list-style: none; margin: var(--space-4) 0 0; padding: 0; display: grid; gap: var(--space-2); max-width: 44ch; }
.how__points li { display: flex; gap: 10px; align-items: start; color: #fff; font-size: 16px; line-height: 24px; }
.how__points svg { flex: none; margin-top: 3px; color: var(--amarillo-carretera); }
/* Cifra destacada: número grande y su alcance al lado */
.how__text .how__stat {
  display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 12px; margin-top: var(--space-6);
  padding-top: var(--space-4); border-top: 1px solid rgba(255, 255, 255, .16);
}
.how__stat strong { font: 600 clamp(30px, 1.6vw + 20px, 40px)/1.1 var(--font-display); color: var(--amarillo-carretera); white-space: nowrap; }
.how__stat span { flex: 1 1 18ch; color: #fff; font-size: 15px; line-height: 22px; }
/* Salvedad legal: letra menor y filete a la izquierda, se lee como letra chica sin esconderse */
.how__text .how__note {
  display: flex; gap: 10px; margin-top: var(--space-4); padding: 2px 0 2px var(--space-3);
  border-left: 2px solid rgba(255, 255, 255, .28); font-size: 14px; line-height: 21px; max-width: 58ch;
}
.how__note svg { flex: none; margin-top: 2px; color: var(--azul-300); }
.how__note strong { color: #fff; font-weight: 500; }
.how__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin-top: var(--space-3); }
.how__more { color: #fff; font-weight: 500; text-underline-offset: 4px; }

/* La carretera como barra de avance */
.how__route { position: relative; margin: var(--space-8) calc(-1 * clamp(16px, 5vw, 64px)) 0; height: 104px; }
.how__road { position: absolute; inset: 0 0 32px; }
.how__pins li { position: relative; display: grid; justify-items: center; }
/* Nombre de cada parada bajo la carretera: los cuatro pasos se leen de un vistazo */
.how__stop {
  position: absolute; top: calc(100% + 10px); white-space: nowrap;
  font: 500 13px/16px var(--font-body); color: #c9d4ea; transition: color .3s var(--ease-out);
}
.how__pins li:first-child .how__stop { left: 0; }
.how__pins li:last-child .how__stop { right: 0; }
.how__stop.is-active { color: #fff; }
.how__pins {
  position: relative; list-style: none; margin: 0; padding: 0 clamp(16px, 5vw, 64px);
  height: calc(100% - 32px); display: flex; justify-content: space-between; align-items: center;
}
.how__pin {
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: grid; place-items: center;
  background: var(--marino-900); color: #c9d4ea; border: 3px solid #4a5a80;
  font: 500 16px/1 var(--font-mono);
  transition: border-color .3s var(--ease-out), color .3s var(--ease-out), box-shadow .3s var(--ease-out), transform .3s var(--ease-out);
}
.how__pin:hover { transform: scale(1.08); border-color: #c9d4ea; }
/* Recorrido hecho: parada en amarillo de carretera. Parada actual: anillo blanco extra. */
.how__pin.is-done, .how__pin.is-active { border-color: var(--amarillo-carretera); color: var(--amarillo-carretera); }
.how__pin.is-active { transform: scale(1.2); box-shadow: 0 0 0 3px #fff; }
.how__pin:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

/* Variante plain: sin panel, a todo el ancho; colores de texto sobre fondo claro */
.how--plain .how__panel {
  background: none;
  color: var(--texto);
  border-radius: 0;
  padding: 0;
  overflow: visible;
  box-shadow: none;
  border: none;
}
.how--plain .how__panel :focus-visible { outline-color: var(--azul-700); }
.how--plain .how__head h2, .how--plain .how__text h3 { color: var(--marino-900); }
.how--plain .how__head p, .how--plain .how__text p { color: var(--texto-suave); }
.how--plain .how__arrow { color: var(--marino-900); border-color: var(--texto-suave); }
.how--plain .how__arrow:hover:not(:disabled) { background: var(--fondo-frio); border-color: var(--marino-900); }
.how--plain .how__more { color: var(--azul-700); }
.how--plain .how__points li, .how--plain .how__stat span, .how--plain .how__note strong { color: var(--texto); }
/* El amarillo no contrasta sobre blanco: chulos y cifra en azul de acción */
.how--plain .how__points svg, .how--plain .how__stat strong { color: var(--azul-700); }
.how--plain .how__text .how__stat { border-top-color: var(--borde); }
.how--plain .how__text .how__note { border-left-color: var(--borde); }
.how--plain .how__note svg { color: var(--azul-700); }
.how--plain .how__route { margin-inline: calc(50% - 50vw); }
.how--plain .how__pins { width: min(100% - 2 * var(--page-pad), var(--page-max)); margin-inline: auto; padding-inline: 0; }
.how--plain .how__stop { color: var(--texto-suave); }
.how--plain .how__stop.is-active { color: var(--marino-900); }
/* Próxima: disco blanco · hecha: anillo marino · actual: disco marino lleno */
.how--plain .how__pin { background: #fff; color: var(--texto-suave); border-color: var(--texto-suave); }
.how--plain .how__pin:hover { border-color: var(--marino-900); }
.how--plain .how__pin.is-done { border-color: var(--marino-900); color: var(--marino-900); }
.how--plain .how__pin.is-active { background: var(--marino-900); border-color: var(--marino-900); color: #fff; box-shadow: 0 0 0 3px #fff; }
.how--plain .how__pin:focus-visible { outline-color: var(--azul-700); }

/* Factura compacta en móvil: la foto sigue a la vista */
@media (max-width: 599px) {
  .how__invoice { min-width: 0; padding: 6px 10px 8px; font-size: 12px; line-height: 16px; }
  .how__invoice-head { font-size: 13px; padding-bottom: 4px; }
  .how__invoice dl { margin-top: 4px; gap: 2px; }
}

@media (min-width: 900px) {
  .how__track::after { display: none; }
  /* Columna de texto más ancha: los pasos ya traen párrafo, puntos y salvedades */
  /* El paso más largo fija la altura de la pista: los demás se centran en ella */
  .how__slide { flex-basis: 100%; grid-template-columns: 1.2fr 1fr; gap: clamp(32px, 4vw, 56px); align-items: center; align-content: center; }
  .how__text { padding-right: var(--space-4); }
  .how__route { height: 128px; }
}

@media (prefers-reduced-motion: reduce) {
  .how__media img, .how__pin, .how__stop, .how__zoom, .how__zoom-line, .how__frame, .how__invoice { transition: none; }
  .how__media img { transform: none; }
}
</style>
