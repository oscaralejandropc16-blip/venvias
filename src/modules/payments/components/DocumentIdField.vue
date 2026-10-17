<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import { IPG_PAYMENT_TEXT, DOCUMENT_NUMBER_LABELS } from '../constants/ipgPayment'
import type { DocumentType } from '../types/IpgPayer'
import { isAlphanumericDocument } from '../utils/document'

/**
 * Documento de identidad: tipo (select nativo) y número, con su ayuda y su
 * error. Emite cada cambio y `blur` al salir del número; no valida.
 */
export default defineComponent({
  name: 'DocumentIdField',
  components: { AppIcon },
  props: {
    documentTypes: { type: Array as PropType<{ value: DocumentType; label: string }[]>, required: true },
    documentType: { type: String as PropType<DocumentType>, required: true },
    documentNumber: { type: String, required: true },
    error: { type: String, default: '' },
    /** Prefijo de los ids internos; único por página. */
    idPrefix: { type: String, default: 'pagador' },
  },
  emits: {
    'update:documentType': (_type: DocumentType) => true,
    'update:documentNumber': (_value: string) => true,
    blur: () => true,
  },
  data() {
    return { text: IPG_PAYMENT_TEXT }
  },
  computed: {
    alphanumeric(): boolean {
      return isAlphanumericDocument(this.documentType)
    },
    numberLabel(): string {
      return DOCUMENT_NUMBER_LABELS[this.documentType]
    },
    help(): string {
      return this.alphanumeric ? this.text.documentHelpPassport : this.text.documentHelpDigits
    },
    ids(): { type: string; number: string; help: string; error: string } {
      const p = this.idPrefix
      return { type: `${p}-doc-tipo`, number: `${p}-doc-numero`, help: `${p}-doc-ayuda`, error: `${p}-doc-error` }
    },
    describedby(): string {
      return this.error ? `${this.ids.help} ${this.ids.error}` : this.ids.help
    },
  },
  methods: {
    onNumberInput(e: Event): void {
      const el = e.target as HTMLInputElement
      this.$emit('update:documentNumber', el.value)
      // El valor limpio vuelve por la prop; el campo no se queda con lo descartado.
      this.$nextTick(() => {
        if (el.value !== this.documentNumber) el.value = this.documentNumber
      })
    },
    focus(): void {
      ;(this.$refs.number as HTMLInputElement | undefined)?.focus()
    },
  },
})
</script>

<template>
  <fieldset class="doc">
    <legend class="doc__legend">{{ text.documentLegend }}</legend>
    <div class="doc__row">
      <div class="doc__col">
        <label :for="ids.type" class="doc__label">{{ text.documentTypeLabel }}</label>
        <div class="doc__select">
          <select
            :id="ids.type"
            :value="documentType"
            @change="$emit('update:documentType', ($event.target as HTMLSelectElement).value as DocumentType)"
          >
            <option v-for="d in documentTypes" :key="d.value" :value="d.value">{{ d.label }}</option>
          </select>
          <AppIcon name="chevron" :size="18" class="doc__chevron" />
        </div>
      </div>
      <div class="doc__col">
        <label :for="ids.number" class="doc__label">{{ numberLabel }}</label>
        <input
          :id="ids.number"
          ref="number"
          class="doc__input"
          :class="{ 'is-error': error }"
          :value="documentNumber"
          type="text"
          :inputmode="alphanumeric ? 'text' : 'numeric'"
          :autocapitalize="alphanumeric ? 'characters' : 'off'"
          autocomplete="off"
          spellcheck="false"
          :aria-invalid="error ? 'true' : 'false'"
          :aria-describedby="describedby"
          @input="onNumberInput"
          @blur="$emit('blur')"
        />
      </div>
    </div>
    <p :id="ids.help" class="doc__help">{{ help }}</p>
    <p v-if="error" :id="ids.error" class="doc__error" role="alert"><AppIcon name="alert" :size="18" />{{ error }}</p>
  </fieldset>
</template>

<style scoped>
.doc { border: 0; margin: 0; padding: 0; min-width: 0; }
.doc__legend { padding: 0; margin-bottom: var(--space-2); font-size: 15px; font-weight: 600; color: #122142; }
.doc__row { display: grid; gap: var(--space-3); }
@media (min-width: 440px) { .doc__row { grid-template-columns: 11rem minmax(0, 1fr); } }
.doc__col { display: grid; gap: var(--space-1); min-width: 0; }
.doc__label { font-size: 13px; line-height: 20px; font-weight: 500; color: var(--texto-suave); }

.doc__select { position: relative; }
.doc__select select, .doc__input {
  width: 100%; min-height: 56px; padding: 0 var(--space-4);
  border: 1.5px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-md, 12px);
  background: #ffffff;
  font: 600 16px/1 var(--font-body);
  color: #122142;
  transition: border-color .2s var(--ease-out), box-shadow .2s var(--ease-out);
}
.doc__select select { appearance: none; padding-right: 40px; cursor: pointer; }
.doc__chevron { position: absolute; right: var(--space-3); top: 50%; translate: 0 -50%; color: #0038A8; pointer-events: none; }
.doc__input { font-family: var(--font-mono); font-weight: 700; letter-spacing: .04em; text-align: center; }
.doc__select select:hover, .doc__input:hover { border-color: #0038A8; }
.doc__select select:focus, .doc__input:focus { outline: none; border-color: #0038A8; box-shadow: 0 0 0 4px rgba(0, 56, 168, 0.12); }
.doc__input.is-error { border-color: var(--alerta); }

.doc__help { margin-top: var(--space-2); font-size: 13px; line-height: 18px; color: var(--texto-suave); }
.doc__error {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-2); color: var(--alerta); font-size: 14px; font-weight: 500;
}
.doc__error svg { flex: none; }
</style>
