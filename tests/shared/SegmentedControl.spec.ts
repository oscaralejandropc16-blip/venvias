import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SegmentedControl from '@/shared/ui/SegmentedControl.vue'

const options = [
  { value: 'natural', label: 'Natural' },
  { value: 'juridica', label: 'Jurídica' },
]

function mountControl(props: Record<string, unknown> = {}) {
  return mount(SegmentedControl, {
    props: { options, modelValue: 'natural', name: 'persona', legend: 'Tipo de persona', ...props },
  })
}

describe('SegmentedControl', () => {
  it('agrupa radios nativos bajo un fieldset con su leyenda', () => {
    const w = mountControl()
    expect(w.find('fieldset legend').text()).toBe('Tipo de persona')
    const radios = w.findAll('input[type="radio"]')
    expect(radios).toHaveLength(2)
    expect(radios.every((r) => r.attributes('name') === 'persona')).toBe(true)
    expect((radios[0].element as HTMLInputElement).checked).toBe(true)
  })

  it('emite el valor elegido y el pulgar se mueve a su sitio', async () => {
    const w = mountControl()
    await w.findAll('input')[1].trigger('change')
    expect(w.emitted('update:modelValue')).toEqual([['juridica']])
    await w.setProps({ modelValue: 'juridica' })
    expect(w.find('.seg__thumb').attributes('style')).toContain('translateX(100%)')
    expect(w.find('.seg__thumb').attributes('aria-hidden')).toBe('true')
  })

  it('puede ocultar la leyenda a la vista sin quitarla', () => {
    const w = mountControl({ legendHidden: true })
    expect(w.find('legend').classes()).toContain('visually-hidden')
  })
})
