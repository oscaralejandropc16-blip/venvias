import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorksDiagram from '@/modules/home/components/HowItWorksDiagram.vue'

describe('HowItWorksDiagram', () => {
  it('renderiza la estructura de 3 tarjetas en grid horizontal con sus títulos y descripciones', () => {
    const w = mount(HowItWorksDiagram)

    const grid = w.find('.diagram-grid')
    expect(grid.exists()).toBe(true)

    const articles = w.findAll('article.diagram-card')
    expect(articles).toHaveLength(3)

    expect(w.text()).toContain('Circula por el peaje')
    expect(w.text()).toContain('Se identifica la placa')
    expect(w.text()).toContain('Conciliación y pago')
  })

  it('integra elementos textuales construidos en HTML y Tailwind por encima y por debajo de las imágenes', () => {
    const w = mount(HowItWorksDiagram)

    // Letreros de peaje construidos en HTML (Paso 1)
    expect(w.text()).toContain('FREE FLOW')
    expect(w.text()).toContain('TELEPEAJE')
    expect(w.text()).toContain('CARRIL HABILITADO')
    expect(w.text()).toContain('HASTA 80 KM/H')

    // Indicadores ALPR y placa venezolana oficial en HTML (Paso 2)
    expect(w.text()).toContain('ESCÁNER ALPR 360°')
    expect(w.text()).toContain('VENEZUELA')
    expect(w.text()).toContain('AA 123 BB')
    expect(w.text()).toContain('MATRÍCULA AUDITADA')

    // Letrero de liquidación e indicadores duales en HTML (Paso 3)
    expect(w.text()).toContain('LIQUIDACIÓN DE PEAJE')
    expect(w.text()).toContain('CON SALDO')
    expect(w.text()).toContain('SIN SALDO')
  })

  it('renderiza las imágenes con loading="lazy" y anchos responsivos w-full max-w-[280px]', () => {
    const w = mount(HowItWorksDiagram)

    const imgs = w.findAll('.diagram-card__img-box img')
    expect(imgs).toHaveLength(3)

    imgs.forEach((img) => {
      expect(img.attributes('loading')).toBe('lazy')
      expect(img.classes()).toContain('w-full')
      expect(img.classes()).toContain('max-w-[280px]')
    })
  })

  it('renderiza las tarjetas inferiores de información oficial', () => {
    const w = mount(HowItWorksDiagram)

    expect(w.text()).toContain('¿QUÉ INCLUYE Y DÓNDE SE PAGA?')
    expect(w.text()).toContain('Deuda = tasa de peaje + cargos administrativos')
    expect(w.text()).toContain('SOBRE LA OBLIGACIÓN DE PAGO')
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
