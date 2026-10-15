<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import type { IconName } from '@/shared/icons/iconPaths'
import PlatePreview from '@/modules/plates/components/PlatePreview.vue'
import { BALANCE_TEXT, WALLET_TONE_ICONS } from '../constants/balance'
import type { WalletSummary } from '../types/WalletSummary'

/** Resultado de la consulta: la placa, el saldo disponible y el estado de la billetera. */
export default defineComponent({
  name: 'BalanceResult',
  components: { AppIcon, PlatePreview },
  props: {
    wallet: { type: Object as PropType<WalletSummary>, required: true },
  },
  data() {
    return { text: BALANCE_TEXT }
  },
  computed: {
    statusIcon(): IconName {
      return WALLET_TONE_ICONS[this.wallet.statusTone]
    },
  },
})
</script>

<template>
  <div class="br">
    <PlatePreview :value="wallet.plate" size="sm" />
    <dl class="br__data">
      <div>
        <dt>{{ text.balanceLabel }}</dt>
        <dd class="br__amount">{{ wallet.balanceLabel }}</dd>
      </div>
      <div>
        <dt class="visually-hidden">{{ text.statusLabel }}</dt>
        <dd class="br__status" :class="`is-${wallet.statusTone}`">
          <AppIcon :name="statusIcon" :size="18" />{{ wallet.statusLabel }}
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.br {
  display: grid; justify-items: center; gap: var(--space-6);
  padding: var(--space-8) var(--space-6);
  background: var(--superficie); border: 1px solid var(--borde); border-radius: var(--radius-md);
  box-shadow: var(--elev-1); text-align: center;
}
.br__data { display: grid; gap: var(--space-3); justify-items: center; margin: 0; }
.br__data dd { margin: 0; }
.br__data dt { font-size: 15px; color: var(--texto-suave); }
.br__amount { margin-top: var(--space-1); font: 500 clamp(36px, 4vw + 20px, 52px)/1.1 var(--font-mono); color: var(--marino-900); }
.br__status { display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
.br__status.is-ok { color: var(--azul-700); }
.br__status.is-low { color: var(--texto); }
.br__status.is-alert { color: var(--alerta); }
.br__status svg { flex: none; }
</style>
