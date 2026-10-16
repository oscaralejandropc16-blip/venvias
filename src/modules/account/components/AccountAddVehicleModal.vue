<script lang="ts">
import { defineComponent } from 'vue'
import AppIcon from '@/shared/icons/AppIcon.vue'
import PlateField from '@/modules/plates/components/PlateField.vue'
import { usePlateEntry } from '@/modules/plates/composables/usePlateEntry'
import { PLATE_PROMPTS, plateReadyLabel } from '@/modules/plates/constants/plateEntry.messages'
import { formatPlate } from '@/modules/plates/utils/plate'

export default defineComponent({
  name: 'AccountAddVehicleModal',
  components: { AppIcon, PlateField },
  emits: ['close', 'save'],
  setup() {
    return { ...usePlateEntry() }
  },
  data() {
    return {
      alias: '',
    }
  },
  computed: {
    footText(): string {
      return this.isValid ? plateReadyLabel(formatPlate(this.plate)) : PLATE_PROMPTS.recargar
    },
  },
  methods: {
    onPlateChange(val: string): void {
      this.applyInput(val, val.length)
    },
    onSave(): void {
      const sub = this.validate()
      if (!sub) return
      this.$emit('save', {
        plate: sub.plate,
        alias: this.alias.trim() || 'Nuevo Vehículo',
      })
    },
  },
})
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <header class="modal-header">
        <h3 id="modal-title" class="modal-title">Asociar nuevo vehículo</h3>
        <button type="button" class="btn-close" aria-label="Cerrar" @click="$emit('close')">
          <AppIcon name="close" :size="18" />
        </button>
      </header>

      <form class="modal-body" @submit.prevent="onSave">
        <div class="form-group">
          <label class="form-label">Placa vehicular</label>
          <PlateField
            input-id="modal-plate"
            :model-value="plate"
            :foot-text="footText"
            :error="error"
            :hint="hint"
            :is-valid="isValid"
            @update:model-value="onPlateChange"
          />
        </div>

        <div class="form-group">
          <label for="modal-alias" class="form-label">Identificador o Alias (opcional)</label>
          <input
            id="modal-alias"
            v-model="alias"
            type="text"
            class="input-alias"
            placeholder="Ej. Camioneta de Reparto 02"
            maxlength="40"
          />
          <span class="input-hint">Un nombre para identificarlo rápidamente en tu lista de flota.</span>
        </div>

        <footer class="modal-footer">
          <button type="button" class="btn btn--secundario btn--sm" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn btn--primario btn--sm" :disabled="!isValid">
            <AppIcon name="check" :size="16" />
            Guardar vehículo
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(18, 33, 66, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-4);
}

.modal-dialog {
  background: var(--superficie);
  border: 1px solid var(--borde);
  border-radius: var(--radius-md);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: min(100%, 480px);
  overflow: hidden;
  display: grid;
  animation: modal-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--borde);
  background: var(--fondo-frio);
}

.modal-title {
  margin: 0;
  font: 600 18px/24px var(--font-display);
  color: var(--marino-900);
}

.btn-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--texto-suave);
  padding: 4px;
  border-radius: 4px;
  display: flex;
}

.btn-close:hover {
  color: var(--rojo-sistema);
}

.modal-body {
  padding: var(--space-6);
  display: grid;
  gap: var(--space-4);
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--texto);
}

.input-alias {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--borde);
  border-radius: var(--radius-sm);
  font: 400 15px var(--font-body);
  color: var(--texto);
  background: #fff;
  transition: border-color 0.15s;
}

.input-alias:focus {
  outline: none;
  border-color: var(--azul-700);
  box-shadow: 0 0 0 3px var(--azul-100);
}

.input-hint {
  font-size: 12px;
  color: var(--texto-suave);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--borde);
}
</style>
