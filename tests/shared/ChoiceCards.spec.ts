import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChoiceCards from '@/shared/ui/ChoiceCards.vue'
import PaymentMethodPicker from '@/modules/recharge/components/PaymentMethodPicker.vue'

const options = [
  { value: 'visa', title: 'Visa', icon: 'tarjeta' as const },
  { value: 'mc', title: 'Mastercard', description: 'Crédito o débito' },
]

describe('ChoiceCards', () => {
  it('pinta una tarjeta de radio por opción con su leyenda y descripción', () => {
    const w = mount(ChoiceCards, {
      props: { options, modelValue: 'mc', name: 'emisor', legend: 'Emisor de la tarjeta', describedby: 'emisor-error' },
    })
    expect(w.find('legend').text()).toBe('Emisor de la tarjeta')
    expect(w.find('fieldset').attributes('aria-describedby')).toBe('emisor-error')
    const labels = w.findAll('label')
    expect(labels).toHaveLength(2)
    expect(labels[1].classes()).toContain('on')
    expect(labels[1].text()).toContain('Crédito o débito')
    expect((w.findAll('input')[1].element as HTMLInputElement).checked).toBe(true)
  })

  it('emite el valor elegido', async () => {
    const w = mount(ChoiceCards, { props: { options, modelValue: '', name: 'emisor', legend: 'Emisor' } })
    await w.findAll('input')[0].trigger('change')
    expect(w.emitted('update:modelValue')).toEqual([['visa']])
  })

  it('sin describedby no deja el atributo vacío', () => {
    const w = mount(ChoiceCards, { props: { options, modelValue: '', name: 'emisor', legend: 'Emisor' } })
    expect(w.find('fieldset').attributes('aria-describedby')).toBeUndefined()
  })

  it('PaymentMethodPicker la reutiliza y sigue emitiendo `select`', async () => {
    const w = mount(PaymentMethodPicker, {
      props: {
        methods: [{ id: 'card', name: 'Tarjeta', description: 'Inmediata', icon: 'tarjeta' }],
        modelValue: '',
      },
    })
    expect(w.findComponent(ChoiceCards).exists()).toBe(true)
    await w.find('input').trigger('change')
    expect(w.emitted('select')).toEqual([['card']])
  })

  it('PaymentMethodPicker plegado muestra el método elegido y emite `expand`', async () => {
    const w = mount(PaymentMethodPicker, {
      props: {
        methods: [
          { id: 'card', name: 'Tarjeta', description: 'Inmediata', icon: 'tarjeta' },
          { id: 'mobile', name: 'Pago móvil', description: '', icon: 'rayo' },
        ],
        modelValue: 'card',
        collapsed: true,
      },
    })
    expect(w.findComponent(ChoiceCards).exists()).toBe(false)
    expect(w.text()).toContain('Tarjeta')
    expect(w.text()).not.toContain('Pago móvil')
    await w.find('button').trigger('click')
    expect(w.emitted('expand')).toHaveLength(1)
  })

  it('con logos, el logo va decorativo en una columna fija y los iconos se alinean con él', () => {
    const w = mount(ChoiceCards, {
      props: {
        options: [
          { value: '1', title: 'Cta. de Ahorro', icon: 'tarjeta' as const },
          { value: '3', title: 'Crédito Visa', icon: 'tarjeta' as const, image: '/visa.svg' },
        ],
        modelValue: '',
        name: 'metodo',
        legend: 'Método de pago',
      },
    })
    const media = w.findAll('.cc__media')
    expect(media).toHaveLength(2)
    expect(media.every((m) => m.attributes('aria-hidden') === 'true')).toBe(true)
    expect(media[0].find('img').exists()).toBe(false)
    const img = media[1].find('img')
    expect(img.attributes('src')).toBe('/visa.svg')
    expect(img.attributes('alt')).toBe('')
  })
})
