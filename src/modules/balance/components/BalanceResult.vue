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
  padding: var(--space-8);
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 1.25rem;
  box-shadow: 0 10px 25px -5px rgba(18, 33, 66, 0.06);
  text-align: center;
  transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out);
}
.br:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 32px -4px rgba(18, 33, 66, 0.1);
}
.br__data { display: grid; gap: var(--space-3); justify-items: center; margin: 0; }
.br__data dd { margin: 0; }
.br__data dt { font-size: 15px; color: var(--texto-suave); font-weight: 500; }
.br__amount { margin-top: var(--space-1); font: 700 clamp(36px, 4vw + 20px, 52px)/1.1 var(--font-mono); color: #122142; }
.br__status { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; }
.br__status.is-ok { color: var(--azul-700); }
.br__status.is-low { color: var(--texto); }
.br__status.is-alert { color: var(--alerta); }
.br__status svg { flex: none; }
</style>
