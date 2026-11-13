import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorksDiagram from '@/modules/home/components/HowItWorksDiagram.vue'

describe('HowItWorksDiagram', () => {
  it('renderiza las 4 etapas del flujo operativo con sus títulos y descripciones', () => {
    const w = mount(HowItWorksDiagram)

    const articles = w.findAll('article.diagram-card')
    expect(articles).toHaveLength(4)

    expect(w.text()).toContain('Paso por Pórtico Free Flow')
    expect(w.text()).toContain('Lectura Óptica ALPR')
    expect(w.text()).toContain('Clasificación y Pesaje Dinámico WIM')
    expect(w.text()).toContain('Liquidación y Conciliación Inmediata')
  })

  it('renderiza las ilustraciones SVG nativas para cada paso', () => {
    const w = mount(HowItWorksDiagram)

    const svgs = w.findAll('svg.diagram-svg')
    expect(svgs).toHaveLength(4)

    // Verifica que los SVGs tienen descripciones accesibles
    expect(svgs[0].attributes('aria-label')).toContain('pórtico Free Flow')
    expect(svgs[1].attributes('aria-label')).toContain('cámara ALPR')
    expect(svgs[2].attributes('aria-label')).toContain('pesaje dinámico WIM')
  })

  it('permite accionar la impresión de la ficha técnica', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    const w = mount(HowItWorksDiagram)

    const printBtn = w.find('button.how-diagram__print-btn')
    expect(printBtn.exists()).toBe(true)

    await printBtn.trigger('click')
    expect(printSpy).toHaveBeenCalled()
    printSpy.mockRestore()
  })
})
