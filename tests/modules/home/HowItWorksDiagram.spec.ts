import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorksDiagram from '@/modules/home/components/HowItWorksDiagram.vue'

describe('HowItWorksDiagram', () => {
  it('renderiza las 6 etapas del flujo oficial de la infografía con sus títulos y descripciones', () => {
    const w = mount(HowItWorksDiagram)

    const articles = w.findAll('article.diagram-card')
    expect(articles).toHaveLength(6)

    expect(w.text()).toContain('Circula por el peaje')
    expect(w.text()).toContain('Se identifica la placa')
    expect(w.text()).toContain('Se calcula la tarifa')
    expect(w.text()).toContain('Se verifica el pago')
    expect(w.text()).toContain('Sin pago válido · Se genera una deuda')
    expect(w.text()).toContain('Se cancela el pendiente')
  })

  it('renderiza las tarjetas inferiores de información oficial de la infografía', () => {
    const w = mount(HowItWorksDiagram)

    expect(w.text()).toContain('¿QUÉ INCLUYE Y DÓNDE SE PAGA?')
    expect(w.text()).toContain('Deuda = tasa de peaje + cargos administrativos')
    expect(w.text()).toContain('SOBRE LA OBLIGACIÓN DE PAGO')
    expect(w.text()).toContain('La obligación de pago del peaje nace con la utilización efectiva')
  })

  it('renderiza las ilustraciones SVG nativas para los 6 pasos', () => {
    const w = mount(HowItWorksDiagram)

    const svgs = w.findAll('svg.diagram-svg')
    expect(svgs).toHaveLength(6)

    // Verifica que los SVGs tienen descripciones accesibles
    expect(svgs[0].attributes('aria-label')).toContain('Free Flow')
    expect(svgs[1].attributes('aria-label')).toContain('ALPR')
    expect(svgs[2].attributes('aria-label')).toContain('tarifa')
    expect(svgs[3].attributes('aria-label')).toContain('pago')
    expect(svgs[4].attributes('aria-label')).toContain('deuda')
    expect(svgs[5].attributes('aria-label')).toContain('Cancelación')
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
