<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { PLATE_MAX, plateChars, plateInputChange } from '../utils/plate'
import type { PlateChar } from '../types/Plate'

/**
 * Campo de placa con el dibujo de la placa venezolana: normaliza lo escrito,
 * pinta los caracteres con su cursor y muestra pie, ayuda y error. Emite
 * `update:modelValue` con la placa normalizada y `typed` con lo escrito tal
 * cual, para que las reglas (avisos, errores) vivan en el composable del padre.
 */
export default defineComponent({
  name: 'PlateField',
  components: { AppIcon },
  props: {
    modelValue: { type: String, required: true },
    inputId: { type: String, default: 'placa' },
    footText: { type: String, required: true },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    isValid: { type: Boolean, default: false },
    swinging: { type: Boolean, default: false },
  },
  emits: {
    'update:modelValue': (_value: string) => true,
    typed: (_raw: string) => true,
    'swing-end': () => true,
  },
  data() {
    return {
      maxLength: PLATE_MAX + 4,
      caret: 0,
      focused: false,
    }
  },
  computed: {
    chars(): PlateChar[] {
      return plateChars(this.modelValue)
    },
    hintId(): string {
      return `${this.inputId}-ayuda`
    },
    errorId(): string {
      return `${this.inputId}-error`
    },
  },
  methods: {
    inputEl(): HTMLInputElement | undefined {
      return this.$refs.input as HTMLInputElement | undefined
    },
    focus(): void {
      this.$nextTick(() => this.inputEl()?.focus())
    },
    syncCaret(): void {
      const el = this.inputEl()
      if (el) this.caret = el.selectionStart ?? this.modelValue.length
    },
    onInput(e: Event): void {
      const el = e.target as HTMLInputElement
      const typed = el.value
      const change = plateInputChange(typed, el.selectionStart ?? typed.length)
      el.value = change.value
      el.setSelectionRange(change.caret, change.caret)
      this.caret = change.caret
      this.$emit('update:modelValue', change.value)
      this.$emit('typed', typed)
    },
    onFocus(): void {
      this.focused = true
      this.syncCaret()
    },
  },
})
</script>

<template>
  <div
    class="plate"
    :class="{ 'is-focused': focused, 'is-error': error, 'is-valid': isValid, 'is-swinging': swinging }"
    @click="focus"
    @animationend.self="$emit('swing-end')"
  >
    <input
      :id="inputId"
      ref="input"
      class="plate__input"
      :value="modelValue"
      :maxlength="maxLength"
      type="text"
      inputmode="text"
      autocomplete="off"
      autocapitalize="characters"
      spellcheck="false"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="`${hintId} ${errorId}`"
      @input="onInput"
      @keyup="syncCaret"
      @click="syncCaret"
      @select="syncCaret"
      @focus="onFocus"
      @blur="focused = false"
    />

    <div class="plate__chars" aria-hidden="true">
      <span v-if="!modelValue" class="plate__ghost">
        <span v-if="focused" class="plate__caret" /><span class="plate__ghost-a">AB123CD</span>
      </span>
      <template v-else>
        <span v-for="(c, i) in chars" :key="c.key" class="plate__ch"
          ><span v-if="focused && caret === i" class="plate__caret" />{{ c.ch }}</span
        >
        <span v-if="focused && caret >= modelValue.length" class="plate__caret plate__caret--end" />
      </template>
    </div>
  </div>

  <!-- La ayuda va bajo la placa: el pie del dibujo es la franja tricolor y «CARACAS» -->
  <label :for="inputId" class="plate__foot">
    <AppIcon v-if="isValid" name="check" :size="16" />
    {{ footText }}
  </label>

  <p :id="hintId" class="plate__hint" aria-live="polite">{{ hint }}</p>
  <p v-if="error" :id="errorId" class="plate__error" role="alert">
    <AppIcon name="alert" :size="18" />{{ error }}
  </p>
</template>

<style scoped>
/* La placa: el dibujo de la placa venezolana es el fondo (marco, pestañas, leyenda y franja tricolor).
   El radio sigue al marco del SVG (16 de 404×204) para que el halo de foco calce con su borde. */
.plate {
  position: relative; aspect-ratio: 404 / 204; width: 100%;
  container-type: inline-size;
  background: url('@/assets/plate-venezuela.svg') center / 100% 100% no-repeat;
  border-radius: 4% / 7.8%;
  box-shadow: var(--elev-2);
  cursor: text; transform-origin: 50% 0;
  transition: box-shadow .3s var(--ease-out);
}
.plate.is-focused { box-shadow: 0 0 0 4px var(--azul-100), var(--elev-2); }
.plate.is-error { box-shadow: 0 0 0 4px var(--alerta), var(--elev-2); }
.plate.is-swinging { animation: swing .8s var(--ease-out); }
@keyframes swing {
  0% { transform: perspective(900px) rotateX(0); }
  18% { transform: perspective(900px) rotateX(-18deg); }
  42% { transform: perspective(900px) rotateX(9deg); }
  64% { transform: perspective(900px) rotateX(-4deg); }
  82% { transform: perspective(900px) rotateX(1.5deg); }
  100% { transform: perspective(900px) rotateX(0); }
}

.plate__input {
  position: absolute; inset: 0; width: 100%; height: 100%;
  border: 0; background: transparent; color: transparent; caret-color: transparent;
  font: 500 16px var(--font-mono); text-align: center; outline: none;
}
.plate__input::selection { background: transparent; }

/* La matrícula escala con la placa (no con la pantalla) para caber en paneles más angostos que el hero */
.plate__chars {
  position: absolute; inset: 33% 6% 28%; display: flex; align-items: center; justify-content: center;
  font: 500 clamp(32px, 15cqi, 78px)/1 var(--font-mono); letter-spacing: .08em; color: var(--marino-900);
  pointer-events: none; white-space: nowrap;
}
.plate__ghost { color: #4a5670; display: inline-flex; align-items: center; }
/* El ejemplo se distingue de lo escrito por las ranuras punteadas, no por perder contraste */
.plate__ghost > span:not(.plate__caret), .plate__ghost-a {
  text-decoration: underline dashed 2px rgba(18, 33, 66, .45); text-underline-offset: .18em;
}
.plate__ch { position: relative; display: inline-block; animation: drop .28s var(--ease-out); }
@keyframes drop {
  from { transform: translateY(-.45em) scale(.92); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.plate__caret {
  display: inline-block; width: 3px; height: .9em; margin-right: 2px; vertical-align: -.08em;
  background: var(--azul-700); border-radius: 2px; animation: blink 1.1s steps(1) infinite;
}
.plate__ch .plate__caret { position: absolute; left: -4px; top: .05em; margin: 0; }
.plate__caret--end { margin-left: 2px; }
@keyframes blink { 50% { opacity: 0; } }

.plate__foot {
  margin-top: var(--space-3);
  display: flex; align-items: center; justify-content: center; gap: 6px;
  font-size: clamp(12px, 2.8vw, 15px); line-height: 1; color: var(--texto-suave); cursor: text;
}

.plate__hint:empty { display: none; }
.plate__hint { margin-top: var(--space-2); font-size: 14px; color: var(--texto-suave); text-align: center; }
.plate__error {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin-top: var(--space-3); color: var(--alerta); font-size: 15px; font-weight: 500;
}
</style>
