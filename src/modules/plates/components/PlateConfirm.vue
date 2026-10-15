<script lang="ts">
import { defineComponent } from 'vue'
import PlatePreview from './PlatePreview.vue'

/** Confirmación visual de la placa antes de cualquier pago. */
export default defineComponent({
  name: 'PlateConfirm',
  components: { PlatePreview },
  props: {
    plate: { type: String, required: true },
    hasPlate: { type: Boolean, required: true },
  },
})
</script>

<template>
  <template v-if="hasPlate">
    <PlatePreview :value="plate" />
    <p class="confirm__q">¿Es la placa correcta? Si no, vuelve y corrígela.</p>
  </template>
  <p v-else class="confirm__q">Primero escribe la placa del vehículo.</p>
</template>

<style scoped>
.confirm__q { font-weight: 500; color: var(--marino-900); }
</style>
