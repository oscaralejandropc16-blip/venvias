<script lang="ts">
import { defineComponent } from 'vue'
import { IPG_PROCESSOR_TEXT } from '../constants/ipgPayment'

/** Quién procesa el cobro. El slot `logo` queda para el logo oficial del BDV. */
export default defineComponent({
  name: 'ProcessorNote',
  data() {
    return { text: IPG_PROCESSOR_TEXT }
  },
})
</script>

<template>
  <p class="proc">
    <slot name="logo" />
    <span>{{ text }}</span>
  </p>
</template>

<style scoped>
.proc {
  display: flex; align-items: center; justify-content: center; gap: var(--space-2);
  margin: 0; padding-top: var(--space-4); border-top: 1px dashed var(--borde);
  font-size: 14px; line-height: 20px; color: var(--texto-suave); text-align: center;
}
</style>
