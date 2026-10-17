<script lang="ts">
import { defineComponent, type PropType } from 'vue'

/**
 * Código numérico en casillas de un dígito: avanza solo al escribir, Backspace
 * en una casilla vacía vuelve a la anterior y pegar el código completo lo
 * reparte. `v-model` es la cadena de dígitos, siempre de corrido desde la
 * primera casilla. Solo presentación: las etiquetas llegan por props.
 */

export default defineComponent({
  name: 'CodeInput',
  props: {
    modelValue: { type: String, required: true },
    length: { type: Number, default: 6 },
    digitLabel: { type: Function as PropType<(position: number, total: number) => string>, required: true },
    describedby: { type: String, default: '' },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: {
    'update:modelValue': (_value: string) => true,
  },
  computed: {
    digits(): string[] {
      return Array.from({ length: this.length }, (_, i) => this.modelValue[i] ?? '')
    },
  },
  methods: {
    inputs(): HTMLInputElement[] {
      return (this.$refs.digit as HTMLInputElement[] | undefined) ?? []
    },
    /** Enfoca una casilla; sin índice, la primera libre. */
    focus(index?: number): void {
      const at = index ?? Math.min(this.modelValue.length, this.length - 1)
      this.$nextTick(() => this.inputs()[at]?.focus())
    },
    commit(next: string, focusAt: number): void {
      const value = next.replace(/\D/g, '').slice(0, this.length)
      this.$emit('update:modelValue', value)
      this.focus(Math.min(focusAt, this.length - 1))
    },
    onInput(index: number, e: Event): void {
      const el = e.target as HTMLInputElement
      const raw = el.value
      const typed = raw.replace(/\D/g, '')
      const current = this.modelValue
      // La casilla vuelve a su valor: lo que entra pasa por `v-model`.
      el.value = this.digits[index]
      if (!raw) {
        if (this.digits[index]) this.commit(current.slice(0, index) + current.slice(index + 1), index)
        return
      }
      if (!typed) return
      // Nadie deja huecos: escribir más allá de lo escrito sigue desde la primera casilla libre.
      const at = Math.min(index, current.length)
      const next = current.slice(0, at) + typed + current.slice(at + typed.length)
      this.commit(next, at + typed.length)
    },
    onKeydown(index: number, e: KeyboardEvent): void {
      if (e.key === 'Backspace' && !this.digits[index] && index > 0) {
        e.preventDefault()
        const current = this.modelValue
        this.commit(current.slice(0, index - 1) + current.slice(index), index - 1)
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault()
        this.focus(index - 1)
      } else if (e.key === 'ArrowRight' && index < Math.min(this.modelValue.length, this.length - 1)) {
        e.preventDefault()
        this.focus(index + 1)
      }
    },
    onPaste(e: ClipboardEvent): void {
      e.preventDefault()
      const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
      if (pasted) this.commit(pasted, pasted.length)
    },
    onFocus(e: FocusEvent): void {
      // Escribir sobre una casilla llena la reemplaza.
      const el = e.target as HTMLInputElement
      el.select()
    },
  },
})
</script>

<template>
  <div class="code" :class="{ 'is-error': error, 'code--long': length >= 7 }" @paste="onPaste">
    <input
      v-for="(d, i) in digits"
      :key="i"
      ref="digit"
      class="code__digit"
      :value="d"
      type="password"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :autocomplete="i === 0 ? 'one-time-code' : 'off'"
      :aria-label="digitLabel(i + 1, length)"
      :aria-describedby="describedby || undefined"
      :aria-invalid="error ? 'true' : 'false'"
      :disabled="disabled"
      @input="onInput(i, $event)"
      @keydown="onKeydown(i, $event)"
      @focus="onFocus"
    />
  </div>
</template>

<style scoped>
.code {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
}
/* Siete casillas o más: el hueco se encoge para caber en 320px. */
.code--long {
  gap: var(--space-1);
}
.code__digit {
  width: 50px;
  height: 58px;
  padding: 0;
  flex: 0 1 50px;
  min-width: 0;
  border: 1.5px solid #cbd5e1;
  border-radius: 0.75rem;
  background: #ffffff;
  font: 600 24px/1 var(--font-mono);
  color: #122142;
  text-align: center;
  box-shadow: 0 2px 4px rgba(18, 33, 66, 0.04);
  transition: border-color 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out), transform 0.2s var(--ease-out), background-color 0.2s;
}
.code__digit:hover:not(:disabled) {
  border-color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 56, 168, 0.06);
}
.code__digit:focus {
  outline: none;
  border-color: #0038A8;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(0, 56, 168, 0.12), 0 4px 10px rgba(0, 56, 168, 0.08);
  transform: translateY(-2px);
}
.code.is-error .code__digit {
  border-color: #ef4444;
  background: #fef2f2;
}
.code.is-error .code__digit:focus {
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.15);
}
.code__digit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8fafc;
}

@media (prefers-reduced-motion: reduce) {
  .code__digit {
    transition: none !important;
    transform: none !important;
  }
}
</style>
