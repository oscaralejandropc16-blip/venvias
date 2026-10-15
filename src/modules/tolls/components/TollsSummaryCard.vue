<script lang="ts">
import { defineComponent } from 'vue'
import EmptyState from '@/shared/ui/EmptyState.vue'
import { ROUTE_NAMES } from '@/core/constants/routing'
import { useTollsList } from '../composables/useTollsList'
import { TOLLS_TEXT } from '../constants/tolls'

/** Resumen de peajes habilitados para inicio. Mientras no haya lista oficial, dice que está en preparación. */
export default defineComponent({
  name: 'TollsSummaryCard',
  components: { EmptyState },
  setup() {
    return { ...useTollsList() }
  },
  data() {
    return {
      text: TOLLS_TEXT,
      tollsRoute: { name: ROUTE_NAMES.tolls },
    }
  },
  computed: {
    title(): string {
      const n = this.tolls.length
      if (n === 0) return this.text.emptyTitle
      return n === 1 ? '1 peaje habilitado' : `${n} peajes habilitados`
    },
    description(): string {
      return this.tolls.length === 0 ? this.text.emptyDescription : 'Consulta dónde funciona el pago por placa.'
    },
  },
  mounted() {
    void this.fetchTolls()
  },
})
</script>

<template>
  <EmptyState icon="peaje" :title="title" :description="description">
    <template #action>
      <RouterLink :to="tollsRoute" class="btn btn--secundario">{{ text.emptyAction }}</RouterLink>
    </template>
  </EmptyState>
</template>
