<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { AccountTransit } from '../types/AccountTypes'

export default defineComponent({
  name: 'AccountTransitsTable',
  components: { AppIcon },
  props: {
    transits: { type: Array as PropType<AccountTransit[]>, required: true },
  },
  emits: ['download-receipt'],
})
</script>

<template>
  <div class="transits-box">
    <div class="transits-box__header">
      <div>
        <h3 class="transits-box__title">Historial de tránsitos recientes</h3>
        <p class="transits-box__sub">Registro de cobros automáticos en puntos de peaje nacional.</p>
      </div>
    </div>

    <div class="transits-table-wrap">
      <table class="transits-table">
        <thead>
          <tr>
            <th>Fecha / Hora</th>
            <th>Estación de Peaje</th>
            <th>Placa</th>
            <th>Método</th>
            <th>Monto</th>
            <th>Estatus</th>
            <th>Comprobante</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transits" :key="t.id">
            <td class="cell-date">{{ t.passedAtFormatted }}</td>
            <td>
              <div class="toll-name">{{ t.tollName }}</div>
              <div class="toll-loc">{{ t.highway }} · {{ t.state }}</div>
            </td>
            <td>
              <span class="plate-pill">{{ t.plateFormatted }}</span>
            </td>
            <td>
              <span class="method-tag">{{ t.methodLabel }}</span>
            </td>
            <td class="cell-amount">{{ t.amountFormatted }}</td>
            <td>
              <span class="status-badge" :class="`status--${t.statusTone}`">
                <AppIcon v-if="t.status === 'PAID'" name="check" :size="12" />
                <AppIcon v-else name="info" :size="12" />
                {{ t.statusLabel }}
              </span>
            </td>
            <td>
              <button
                type="button"
                class="btn-receipt"
                :title="`Descargar comprobante ${t.receiptNumber}`"
                @click="$emit('download-receipt', t.receiptNumber)"
              >
                <AppIcon name="recibo" :size="14" />
                {{ t.receiptNumber }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.transits-box {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: var(--radius-md);
  padding: var(--space-8);
  box-shadow: var(--elev-1);
  display: grid;
  gap: var(--space-6);
}

.transits-box__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transits-box__title {
  font: 600 18px/24px var(--font-display);
  color: var(--marino-900);
  margin: 0;
}

.transits-box__sub {
  font-size: 14px;
  color: var(--texto-suave);
  margin-top: 2px;
}

.transits-table-wrap {
  overflow-x: auto;
}

.transits-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  text-align: left;
}

.transits-table th {
  padding: var(--space-3) var(--space-4);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--texto-suave);
  border-bottom: 1px solid var(--borde);
  background: var(--fondo-frio);
}

.transits-table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--borde);
  vertical-align: middle;
}

.cell-date {
  font-size: 13px;
  color: var(--texto-suave);
  white-space: nowrap;
}

.toll-name {
  font-weight: 600;
  color: var(--marino-900);
}

.toll-loc {
  font-size: 12px;
  color: var(--texto-suave);
}

.plate-pill {
  display: inline-block;
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 12px;
  background: var(--fondo-frio);
  padding: 3px 8px;
  border-radius: 4px;
  color: var(--marino-900);
  border: 1px solid var(--borde);
}

.method-tag {
  font-size: 12px;
  color: var(--azul-700);
  background: var(--azul-100);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  font-weight: 500;
  white-space: nowrap;
}

.cell-amount {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--marino-900);
  white-space: nowrap;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: var(--radius-pill);
  white-space: nowrap;
}

.status--success {
  background: #f0fdf4;
  color: var(--exito);
}

.status--warning {
  background: #fefce8;
  color: #854d0e;
}

.status--alert {
  background: #fdf2f2;
  color: var(--rojo-sistema);
}

.btn-receipt {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--azul-700);
  background: transparent;
  border: 1px dashed var(--azul-300);
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-receipt:hover {
  background: var(--azul-100);
  border-color: var(--azul-700);
}
</style>
