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
      <div class="modal-tricolor" aria-hidden="true"></div>
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
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: var(--radius-2xl, 24px);
  box-shadow: 0 25px 60px -12px rgba(18, 33, 66, 0.25);
  width: min(100%, 480px);
  overflow: hidden;
  display: grid;
  animation: modal-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-tricolor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #F9D616 0%, #0038A8 50%, #CE1126 100%);
  z-index: 2;
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
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--borde);
  background: var(--fondo-frio);
}

.modal-title {
  margin: 0;
  font: 600 18px/24px var(--font-display);
  color: #122142;
}

.btn-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--texto-suave);
  padding: 6px;
  border-radius: 8px;
  display: flex;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #FEE2E2;
  color: var(--rojo-sistema);
}

.modal-body {
  padding: var(--space-6);
  display: grid;
  gap: var(--space-5);
}

.form-group {
  display: grid;
  gap: 6px;
}

.form-group :deep(.plate) {
  max-width: 280px;
  width: 100%;
  margin-inline: auto;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #122142;
}

.input-alias {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid rgba(226, 232, 240, 0.95);
  border-radius: var(--radius-md, 12px);
  font: 500 15px var(--font-body);
  color: #122142;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-alias:focus {
  outline: none;
  border-color: #0038A8;
  box-shadow: 0 0 0 3px rgba(0, 56, 168, 0.12);
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
