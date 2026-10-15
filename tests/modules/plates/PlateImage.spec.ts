import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PlateImage from '@/modules/plates/components/PlateImage.vue'

describe('PlateImage', () => {
  it('pinta la placa sin agrupar y la nombra para lectores de pantalla', () => {
    const w = mount(PlateImage, { props: { value: 'AB123CD' } })
    expect(w.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Placa AB123CD' })
    const chars = w.findAll('.pi__chars > span')
    expect(chars.map((c) => c.text()).join('')).toBe('AB123CD')
  })
})
