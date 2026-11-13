<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import ChoiceCards, { type ChoiceCardOption } from '@/shared/ui/ChoiceCards.vue'
import SegmentedControl from '@/shared/ui/SegmentedControl.vue'
import { IPG_PAYMENT_TEXT, PERSON_TYPES, ipgMethodLogo } from '../constants/ipgPayment'
import type { IpgMethod } from '../types/IpgMethod'
import type { DocumentType, IpgPayerField, PersonType } from '../types/IpgPayer'
import DocumentIdField from './DocumentIdField.vue'
import ProcessorNote from './ProcessorNote.vue'

/**
 * Datos del pagador del Botón de Pago IPG: tipo de persona, documento y método
 * de pago (cuenta de ahorro, corriente o tarjeta). El botón de pagar vive
 * aparte, en `IpgPayBar`, para que el contexto lo fije al pie de la pantalla.
 * Solo presenta: cada cambio sale como evento.
 */
export default defineComponent({
  name: 'IpgPayerForm',
  components: { AppIcon, ChoiceCards, DocumentIdField, ProcessorNote, SegmentedControl },
  props: {
    personType: { type: String as PropType<PersonType>, required: true },
    documentTypes: { type: Array as PropType<{ value: DocumentType; label: string }[]>, required: true },
    documentType: { type: String as PropType<DocumentType>, required: true },
    documentNumber: { type: String, required: true },
    methods: { type: Array as PropType<IpgMethod[]>, required: true },
    /** Método elegido; `null` mientras no se elija. */
    methodId: { type: Number as PropType<number | null>, default: null },
    fieldErrors: { type: Object as PropType<Record<IpgPayerField, string>>, required: true },
    methodsLoading: { type: Boolean, default: false },
    methodsError: { type: String, default: '' },
    /** Falla al pedir el código (o al volver de un código vencido): va arriba del formulario. */
    requestError: { type: String, default: '' },
  },
  emits: {
    'update:personType': (_type: PersonType) => true,
    'update:documentType': (_type: DocumentType) => true,
    'update:documentNumber': (_value: string) => true,
    'update:methodId': (_id: number) => true,
    touch: (_field: IpgPayerField) => true,
    'retry-methods': () => true,
  },
  data() {
    return { text: IPG_PAYMENT_TEXT, personTypes: PERSON_TYPES }
  },
  computed: {
    methodOptions(): ChoiceCardOption[] {
      return this.methods.map((m) => ({
        value: String(m.id),
        title: m.name,
        icon: 'tarjeta',
        image: ipgMethodLogo(m.id),
      }))
    },
    selectedMethod(): string {
      return this.methodId === null ? '' : String(this.methodId)
    },
  },
  methods: {
    /** Lleva la vista al aviso de error y lo anuncia. */
    focusAlert(): void {
      this.$nextTick(() => (this.$refs.alert as HTMLElement | undefined)?.focus())
    },
    focusDocument(): void {
      ;(this.$refs.document as { focus: () => void } | undefined)?.focus()
    },
  },
})
</script>

<template>
  <div class="cpf">
    <p v-if="requestError" ref="alert" class="cpf__alert" role="alert" tabindex="-1">
      <AppIcon name="alert" :size="20" />{{ requestError }}
    </p>

    <SegmentedControl
      :options="personTypes"
      :model-value="personType"
      name="tipo-persona"
      :legend="text.personTypeLegend"
      @update:model-value="$emit('update:personType', $event as PersonType)"
    />

    <DocumentIdField
      ref="document"
      :document-types="documentTypes"
      :document-type="documentType"
      :document-number="documentNumber"
      :error="fieldErrors.documentNumber"
      @update:document-type="$emit('update:documentType', $event)"
      @update:document-number="$emit('update:documentNumber', $event)"
      @blur="$emit('touch', 'documentNumber')"
    />

    <p v-if="methodsLoading" class="cpf__state" role="status">{{ text.methodsLoading }}</p>
    <div v-else-if="methodsError" class="cpf__state">
      <p class="cpf__error" role="alert"><AppIcon name="alert" :size="18" />{{ methodsError }}</p>
      <button type="button" class="btn btn--secundario btn--sm" @click="$emit('retry-methods')">{{ text.retry }}</button>
    </div>
    <div v-else>
      <ChoiceCards
        class="cpf__methods"
        :options="methodOptions"
        :model-value="selectedMethod"
        name="metodo-ipg"
        :legend="text.methodLegend"
        :describedby="fieldErrors.methodId ? 'pagador-metodo-error' : ''"
        @update:model-value="$emit('update:methodId', Number($event))"
      />
      <p v-if="fieldErrors.methodId" id="pagador-metodo-error" class="cpf__error" role="alert">
        <AppIcon name="alert" :size="18" />{{ fieldErrors.methodId }}
      </p>
    </div>

    <ProcessorNote>
      <template #logo><slot name="processor-logo" /></template>
    </ProcessorNote>
  </div>
</template>

<style scoped>
.cpf {
  display: grid; gap: var(--space-6); padding: var(--space-6) var(--space-4) var(--space-4);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  text-align: left;
}
@media (min-width: 440px) { .cpf { padding-inline: var(--space-6); } }
.cpf__methods :deep(.cc__legend) { margin-bottom: var(--space-2); font: 500 15px/22px var(--font-body); }
.cpf__state { display: grid; justify-items: start; gap: var(--space-3); font-size: 15px; color: var(--texto-suave); }
.cpf__error {
  display: flex; align-items: center; gap: var(--space-2);
  margin-top: var(--space-2); color: var(--alerta); font-size: 15px; font-weight: 500;
}
.cpf__error svg { flex: none; }
.cpf__alert {
  display: flex; align-items: flex-start; gap: var(--space-2); padding: var(--space-3) var(--space-4);
  border: 1px solid var(--alerta); border-radius: var(--radius-sm); background: var(--superficie);
  color: var(--alerta); font-size: 15px; line-height: 22px; font-weight: 500; outline: none;
  scroll-margin: 132px 0 160px;
}
.cpf__alert svg { flex: none; margin-top: 1px; }

/* Al enfocar un campo, que no quede tapado por las barras fijas de arriba y de abajo */
.cpf :deep(input), .cpf :deep(select) { scroll-margin: 132px 0 160px; }
</style>
