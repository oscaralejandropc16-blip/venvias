import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorksDiagram from '@/modules/home/components/HowItWorksDiagram.vue'

describe('HowItWorksDiagram', () => {
  it('renderiza la estructura de 3 tarjetas en grid horizontal con sus títulos y descripciones', () => {
    const w = mount(HowItWorksDiagram)

    const grid = w.find('.grid.grid-cols-1.md\\:grid-cols-3')
    expect(grid.exists()).toBe(true)

    const articles = w.findAll('article.diagram-print-card')
    expect(articles).toHaveLength(3)

    expect(w.text()).toContain('Circula por el peaje')
    expect(w.text()).toContain('Tránsito libre y continuo por pórtico Free Flow sin detener la marcha.')

    expect(w.text()).toContain('Se identifica la placa')
    expect(w.text()).toContain('Reconocimiento óptico instantáneo mediante cámaras de alta velocidad.')

    expect(w.text()).toContain('Conciliación y pago')
    expect(w.text()).toContain('Débito automático del saldo de tu placa o registro de saldo deudor.')
  })

  it('renderiza las imágenes con loading="lazy", anchos responsivos w-full max-w-[280px] y drop-shadow-md', () => {
    const w = mount(HowItWorksDiagram)

    const imgs = w.findAll('article.diagram-print-card img')
    expect(imgs).toHaveLength(3)

    expect(imgs[0].attributes('alt')).toBe('Circula por el peaje')
    expect(imgs[0].attributes('loading')).toBe('lazy')
    expect(imgs[0].classes()).toContain('w-full')
    expect(imgs[0].classes()).toContain('max-w-[280px]')
    expect(imgs[0].classes()).toContain('drop-shadow-md')

    expect(imgs[1].attributes('alt')).toBe('Se identifica la placa')
    expect(imgs[1].attributes('loading')).toBe('lazy')
    expect(imgs[1].classes()).toContain('w-full')
    expect(imgs[1].classes()).toContain('max-w-[280px]')
    expect(imgs[1].classes()).toContain('drop-shadow-md')

    expect(imgs[2].attributes('alt')).toBe('Conciliación y pago')
    expect(imgs[2].attributes('loading')).toBe('lazy')
    expect(imgs[2].classes()).toContain('w-full')
    expect(imgs[2].classes()).toContain('max-w-[280px]')
    expect(imgs[2].classes()).toContain('drop-shadow-md')
  })

  it('renderiza la lista de checks de cada tarjeta', () => {
    const w = mount(HowItWorksDiagram)

    const lists = w.findAll('article.diagram-print-card ul')
    expect(lists).toHaveLength(3)

    expect(w.text()).toContain('Circulación continua a velocidad regulada de autopista.')
    expect(w.text()).toContain('Cámaras ALPR con iluminación infrarroja estroboscópica.')
    expect(w.text()).toContain('Débito inmediato con emisión de recibo fiscal digital.')
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
