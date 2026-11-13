<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { PLATE_MAX, plateInputChange } from '../utils/plate'

const GHOST_SLOTS = ['A', 'B', '1', '2', '3', 'C', 'D'] as const

interface SlotItem {
  index: number
  char: string
  placeholder: string
  isFilled: boolean
  isActive: boolean
  isGroupEnd: boolean
}

/**
 * Campo de placa venezolana con 7 ghost slots (AB 123 CD):
 * Dos letras, tres números, dos letras con cursor parpadeante en la casilla activa,
 * halo de foco azul visible y tamaño unificado estándar (max-width: 420px).
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
    autofocus: { type: Boolean, default: false },
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
    slots(): SlotItem[] {
      const val = this.modelValue
      const len = val.length

      return GHOST_SLOTS.map((placeholder, index) => {
        const isFilled = index < len
        const char = isFilled ? val[index] : ''
        const isActive = this.focused && (this.caret === index || (index === 6 && this.caret >= 7))

        return {
          index,
          char,
          placeholder,
          isFilled,
          isActive,
          isGroupEnd: index === 1 || index === 4,
        }
      })
    },
    hintId(): string {
      return `${this.inputId}-ayuda`
    },
    errorId(): string {
      return `${this.inputId}-error`
    },
  },
  mounted() {
    if (this.autofocus) {
      this.focus()
    }
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
      if (el) {
        this.caret = el.selectionStart ?? this.modelValue.length
      }
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
    onBlur(): void {
      this.focused = false
    },
  },
})
</script>

<template>
  <div class="plate-field-wrap">
    <div
      class="plate"
      :class="{
        'is-focused': focused,
        'is-error': !!error,
        'is-valid': isValid,
        'is-swinging': swinging,
      }"
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
        @blur="onBlur"
      />

      <!-- 7 Ghost slots para el formato venezolano A B 1 2 3 C D -->
      <div
        class="plate__slots"
        :class="{ plate__ghost: !modelValue }"
        aria-hidden="true"
      >
        <span
          v-for="s in slots"
          :key="s.index"
          class="plate__slot"
          :class="{
            'is-filled': s.isFilled,
            'is-active': s.isActive,
            'is-group-end': s.isGroupEnd,
            plate__ch: s.isFilled,
          }"
        >
          <!-- Cursor parpadeante si la casilla está activa para escribir -->
          <span v-if="s.isActive" class="plate__caret" />

          <!-- Carácter escrito o placeholder ghost -->
          <span v-if="s.isFilled" class="plate__slot-char">{{ s.char }}</span>
          <span v-else class="plate__slot-ghost">{{ s.placeholder }}</span>
        </span>
      </div>
    </div>

    <!-- Pie, ayuda y error -->
    <label :for="inputId" class="plate__foot">
      <AppIcon v-if="isValid" name="check" :size="16" />
      {{ footText }}
    </label>

    <p :id="hintId" class="plate__hint" aria-live="polite">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="plate__error" role="alert">
      <AppIcon name="alert" :size="18" />{{ error }}
    </p>
  </div>
</template>

<style scoped>
/* Contenedor envolvente estandarizado */
.plate-field-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* La placa física venezolana: tamaño intermedio estandarizado a max-width: 420px */
.plate {
  position: relative;
  aspect-ratio: 404 / 204;
  width: 100%;
  max-width: 420px;
  margin-inline: auto;
  container-type: inline-size;
  background: url('@/assets/plate-venezuela.svg') center / 100% 100% no-repeat;
  border-radius: 4% / 7.8%;
  box-shadow: var(--elev-1);
  cursor: text;
  transform-origin: 50% 0;
  transition:
    box-shadow 0.25s var(--ease-out),
    outline 0.25s var(--ease-out);
}

/* Indicador de foco visible (halo azul) en todo el contenedor */
.plate.is-focused,
.plate:focus-within {
  outline: 3px solid var(--azul-700);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px var(--azul-100), var(--elev-2);
}

.plate.is-error {
  outline: 3px solid var(--alerta);
  outline-offset: 3px;
  box-shadow: 0 0 0 5px rgba(207, 20, 43, 0.18), var(--elev-2);
}

.plate.is-valid {
  box-shadow: 0 0 0 2px var(--azul-700), var(--elev-1);
}

.plate.is-swinging {
  animation: swing 0.8s var(--ease-out);
}

@keyframes swing {
  0% { transform: perspective(900px) rotateX(0); }
  18% { transform: perspective(900px) rotateX(-18deg); }
  42% { transform: perspective(900px) rotateX(9deg); }
  64% { transform: perspective(900px) rotateX(-4deg); }
  82% { transform: perspective(900px) rotateX(1.5deg); }
  100% { transform: perspective(900px) rotateX(0); }
}

.plate__input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font: 500 16px var(--font-mono);
  text-align: center;
  outline: none;
}
.plate__input::selection {
  background: transparent;
}

/* Contenedor de las 7 casillas en el área de matrícula de la placa venezolana */
.plate__slots {
  position: absolute;
  inset: 32% 5% 26%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(3px, 1.2cqi, 6px);
  pointer-events: none;
}

/* Cada casilla individual (ghost slot) */
.plate__slot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(26px, 10.5cqi, 44px);
  height: clamp(36px, 14cqi, 60px);
  background: rgba(255, 255, 255, 0.72);
  border: 1.5px solid rgba(18, 33, 66, 0.16);
  border-radius: 4px;
  font: 600 clamp(22px, 9cqi, 38px) / 1 var(--font-mono);
  color: var(--marino-900);
  transition:
    border-color 0.2s var(--ease-out),
    background-color 0.2s var(--ease-out),
    box-shadow 0.2s var(--ease-out);
}

/* Separación venezolana de grupos: 2 letras - 3 números - 2 letras */
.plate__slot.is-group-end {
  margin-right: clamp(6px, 2.5cqi, 12px);
}

/* Casilla con carácter lleno */
.plate__slot.is-filled {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(18, 33, 66, 0.4);
  color: var(--marino-900);
}

/* Casilla activa con el foco del cursor */
.plate__slot.is-active {
  background: #ffffff;
  border-color: var(--azul-700);
  box-shadow: 0 0 0 2px var(--azul-100);
}

/* Carácter ghost tenue cuando la casilla está vacía */
.plate__slot-ghost {
  color: #7d8ba1;
  opacity: 0.55;
  font-weight: 500;
}

/* Carácter escrito con animación de entrada sutil */
.plate__slot-char {
  animation: drop 0.22s var(--ease-out);
}

@keyframes drop {
  from {
    transform: translateY(-0.3em) scale(0.92);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

/* Cursor parpadeante nativo CSS (@keyframes blink) */
.plate__caret {
  position: absolute;
  width: 2.5px;
  height: 62%;
  top: 19%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--azul-700);
  border-radius: 2px;
  animation: blink 1s steps(1) infinite;
  z-index: 2;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.plate__foot {
  margin-top: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: clamp(12px, 2.8vw, 15px);
  line-height: 1;
  color: var(--texto-suave);
  cursor: text;
}

.plate__hint:empty {
  display: none;
}
.plate__hint {
  margin-top: var(--space-2);
  font-size: 14px;
  color: var(--texto-suave);
  text-align: center;
}
.plate__error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  color: var(--alerta);
  font-size: 15px;
  font-weight: 500;
}
</style>
