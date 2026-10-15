import { afterEach, describe, expect, it } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import CodeInput from '@/shared/ui/CodeInput.vue'

const digitLabel = (n: number, total: number) => `Dígito ${n} de ${total}`
let wrapper: VueWrapper | null = null

/** Monta el campo con `v-model` de verdad: cada emisión vuelve como prop. */
function mountCode(modelValue = '') {
  wrapper = mount(CodeInput, {
    attachTo: document.body,
    props: {
      modelValue,
      digitLabel,
      'onUpdate:modelValue': (value: string) => wrapper?.setProps({ modelValue: value }),
    },
  })
  return wrapper
}

const emitted = (w: VueWrapper) => (w.emitted('update:modelValue') ?? []).map((e) => e[0])

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
})

describe('CodeInput', () => {
  it('pinta seis casillas numéricas y ocultas con su etiqueta', () => {
    const inputs = mountCode().findAll('input')
    expect(inputs).toHaveLength(6)
    expect(inputs[0].attributes()).toMatchObject({ type: 'password', inputmode: 'numeric', autocomplete: 'one-time-code' })
    expect(inputs[5].attributes('aria-label')).toBe('Dígito 6 de 6')
  })

  it('al escribir un dígito avanza a la siguiente casilla', async () => {
    const w = mountCode()
    await w.findAll('input')[0].setValue('4')
    await w.vm.$nextTick()
    expect(emitted(w)).toEqual(['4'])
    expect(document.activeElement).toBe(w.findAll('input')[1].element)
  })

  it('lo que no es dígito no entra', async () => {
    const w = mountCode('1')
    const second = w.findAll('input')[1]
    await second.setValue('a')
    expect(emitted(w)).toEqual([])
    expect((second.element as HTMLInputElement).value).toBe('')
  })

  it('pegar el código lo reparte en las casillas', async () => {
    const w = mountCode()
    await w.find('.code').trigger('paste', { clipboardData: { getData: () => '12-34 56' } })
    expect(emitted(w)).toEqual(['123456'])
    expect(w.findAll('input').map((i) => (i.element as HTMLInputElement).value)).toEqual(['1', '2', '3', '4', '5', '6'])
  })

  it('Backspace en una casilla vacía borra la anterior y vuelve a ella', async () => {
    const w = mountCode('12')
    await w.findAll('input')[2].trigger('keydown', { key: 'Backspace' })
    await w.vm.$nextTick()
    expect(emitted(w)).toEqual(['1'])
    expect(document.activeElement).toBe(w.findAll('input')[1].element)
  })

  it('escribir más allá de lo escrito sigue desde la primera casilla libre', async () => {
    const w = mountCode('1')
    await w.findAll('input')[4].setValue('7')
    expect(emitted(w)).toEqual(['17'])
  })
})
