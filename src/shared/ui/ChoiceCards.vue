<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { IconName } from '@/shared/icons/iconPaths'

export interface ChoiceCardOption {
  value: string
  title: string
  description?: string
  icon?: IconName
  /** URL de un logo (p. ej. una marca de pago); tiene prioridad sobre `icon`. Es decorativo: el título lo nombra. */
  image?: string
}

/**
 * Opciones como tarjetas de radio (icono o logo, título y detalle). Solo presentación:
 * emite `update:modelValue` con el valor elegido. `columns` aplica desde 560px;
 * en teléfono siempre van apiladas.
 */
export default defineComponent({
  name: 'ChoiceCards',
  components: { AppIcon },
  props: {
    options: { type: Array as PropType<ChoiceCardOption[]>, required: true },
    modelValue: { type: String, required: true },
    name: { type: String, required: true },
    legend: { type: String, required: true },
    columns: { type: Number, default: 1 },
    /** Ids de ayuda o error que describen al grupo. */
    describedby: { type: String, default: '' },
  },
  emits: {
    'update:modelValue': (_value: string) => true,
  },
  computed: {
    /** Con algún logo, iconos y logos comparten una columna fija para que los títulos queden alineados. */
    hasImages(): boolean {
      return this.options.some((o) => o.image)
    },
  },
})
</script>

<template>
  <fieldset
    class="cc"
    :class="{ 'cc--cols': columns > 1 }"
    :style="{ '--cc-cols': String(columns) }"
    :aria-describedby="describedby || undefined"
  >
    <legend class="cc__legend">{{ legend }}</legend>
    <div class="cc__grid">
      <label v-for="o in options" :key="o.value" class="cc__opt" :class="{ on: modelValue === o.value }">
        <span v-if="hasImages" class="cc__media" aria-hidden="true">
          <img v-if="o.image" :src="o.image" alt="" class="cc__logo" />
          <AppIcon v-else-if="o.icon" :name="o.icon" class="cc__icon" />
        </span>
        <AppIcon v-else-if="o.icon" :name="o.icon" class="cc__icon" />
        <span class="cc__text">
          <strong>{{ o.title }}</strong>
          <small v-if="o.description">{{ o.description }}</small>
        </span>
        <input
          type="radio"
          :name="name"
          :value="o.value"
          :checked="modelValue === o.value"
          @change="$emit('update:modelValue', o.value)"
        />
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.cc { border: 0; margin: 0; padding: 0; min-width: 0; }
.cc__legend { padding: 0; margin-bottom: var(--space-3); font: 500 18px/26px var(--font-display); color: var(--marino-900); }
.cc__grid { display: grid; gap: var(--space-2); }
@media (min-width: 560px) {
  .cc--cols .cc__grid { grid-template-columns: repeat(var(--cc-cols), minmax(0, 1fr)); }
  /* En columnas angostas: icono y radio arriba, el título a lo ancho debajo. */
  .cc--cols .cc__opt { display: grid; grid-template-columns: 1fr auto; align-content: center; gap: var(--space-2); }
  .cc--cols .cc__text { grid-column: 1 / -1; grid-row: 2; }
}
.cc__opt {
  display: flex; align-items: center; gap: var(--space-3); min-height: 56px; padding: var(--space-3) var(--space-4);
  border: 1px solid var(--borde); border-radius: var(--radius-sm); background: var(--superficie);
  cursor: pointer; transition: border-color .2s, background-color .2s;
}
.cc__opt:hover { border-color: var(--azul-700); }
.cc__opt.on { border-color: var(--azul-700); background: var(--azul-100); }
.cc__opt:has(input:focus-visible) { outline: 3px solid var(--accion); outline-offset: 3px; }
.cc__icon { flex: none; color: var(--azul-700); }
/* Logos de marca: caja fija; el archivo no se recorta ni se recolorea (lo piden las guías de cada marca) */
.cc__media { flex: none; display: grid; place-items: center; width: 48px; height: 32px; }
.cc__logo { display: block; width: 48px; height: 32px; object-fit: contain; }
.cc__text { flex: 1; min-width: 0; display: grid; gap: 2px; text-align: left; }
.cc__text strong { font-weight: 500; color: var(--marino-900); overflow-wrap: break-word; }
.cc__text small { font-size: 14px; line-height: 20px; color: var(--texto-suave); }
.cc__opt input { flex: none; width: 20px; height: 20px; margin: 0; accent-color: var(--azul-700); cursor: pointer; }
.cc__opt input:focus-visible { outline: none; }
</style>
