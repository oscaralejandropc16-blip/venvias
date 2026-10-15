import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PlateField from '@/modules/plates/components/PlateField.vue'

const baseProps = { modelValue: '', footText: 'Escribe la placa de tu vehículo' }

describe('PlateField', () => {
  it('normaliza lo escrito y entrega también el texto crudo', async () => {
    const w = mount(PlateField, { props: baseProps })
    const input = w.find('input')
    await input.setValue('ab-12 3cd')
    expect(w.emitted('update:modelValue')?.[0]).toEqual(['AB123CD'])
    expect(w.emitted('typed')?.[0]).toEqual(['ab-12 3cd'])
    expect((input.element as HTMLInputElement).value).toBe('AB123CD')
  })

  it('pinta la placa sin agrupar', () => {
    const w = mount(PlateField, { props: { ...baseProps, modelValue: 'AB123CD' } })
    const chars = w.findAll('.plate__ch')
    expect(chars.map((c) => c.text()).join('')).toBe('AB123CD')
  })

  it('sin placa muestra el ejemplo AB123CD', () => {
    const w = mount(PlateField, { props: baseProps })
    expect(w.find('.plate__ghost').text()).toBe('AB123CD')
  })

  it('el error se anuncia y marca el campo', () => {
    const w = mount(PlateField, { props: { ...baseProps, error: 'Falta la placa.' } })
    expect(w.find('[role="alert"]').text()).toBe('Falta la placa.')
    expect(w.find('input').attributes('aria-invalid')).toBe('true')
    expect(w.find('.plate').classes()).toContain('is-error')
  })

  it('avisa cuando termina el balanceo', async () => {
    const w = mount(PlateField, { props: { ...baseProps, swinging: true } })
    await w.find('.plate').trigger('animationend')
    expect(w.emitted('swing-end')).toHaveLength(1)
  })
})
