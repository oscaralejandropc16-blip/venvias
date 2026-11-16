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

  it('renderiza las ilustraciones de alta fidelidad para los 6 pasos y el hero banner', () => {
    const w = mount(HowItWorksDiagram)

    const heroImg = w.find('img.diagram-hero-banner__img')
    expect(heroImg.exists()).toBe(true)

    const images = w.findAll('img.diagram-img')
    expect(images).toHaveLength(6)

    // Verifica que las imágenes tienen atributos alt descriptivos
    expect(images[0].attributes('alt')).toContain('Free Flow')
    expect(images[1].attributes('alt')).toContain('ALPR')
    expect(images[2].attributes('alt')).toContain('tasa de peaje')
    expect(images[3].attributes('alt')).toContain('pago')
    expect(images[4].attributes('alt')).toContain('obligación pendiente')
    expect(images[5].attributes('alt')).toContain('cancelación')
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

  it('permite descargar la infografía oficial original en alta resolución', () => {
    const w = mount(HowItWorksDiagram)

    const downloadLink = w.find('a.how-diagram__download-btn')
    expect(downloadLink.exists()).toBe(true)
    expect(downloadLink.text()).toContain('Descargar infografía original')
    expect(downloadLink.attributes('href')).toContain('cobro-por-placa.png')
    expect(downloadLink.attributes('download')).toBe('infografia-oficial-cobro-por-placa.png')
  })
})
