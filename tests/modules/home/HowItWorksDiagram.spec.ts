import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HowItWorksDiagram from '@/modules/home/components/HowItWorksDiagram.vue'

function mountDiagram() {
  return mount(HowItWorksDiagram, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a :data-to="JSON.stringify(to)"><slot /></a>',
          props: ['to'],
        },
      },
    },
  })
}

describe('HowItWorksDiagram', () => {
  it('renderiza las 6 etapas del flujo oficial de la infografía en el grid', () => {
    const w = mountDiagram()

    const articles = w.findAll('article.diagram-print-card')
    expect(articles).toHaveLength(6)

    expect(w.text()).toContain('Circula por el peaje')
    expect(w.text()).toContain('Se identifica la placa')
    expect(w.text()).toContain('Se calcula la tarifa')
    expect(w.text()).toContain('Se verifica el pago')
    expect(w.text()).toContain('Sin pago válido · Se genera deuda')
    expect(w.text()).toContain('Se cancela el pendiente')
  })

  it('renderiza las imágenes con loading="lazy", anchos responsivos w-full max-w-[280px] y drop-shadow-md', () => {
    const w = mountDiagram()

    const imgs = w.findAll('article.diagram-print-card img')
    expect(imgs).toHaveLength(6)

    imgs.forEach((img) => {
      expect(img.attributes('loading')).toBe('lazy')
      expect(img.classes()).toContain('w-full')
      expect(img.classes()).toContain('max-w-[280px]')
      expect(img.classes()).toContain('drop-shadow-md')
    })
  })

  it('renderiza enlaces de acción directa en las etapas de pago y deuda', () => {
    const w = mountDiagram()

    const rechargeBtn = w.findAll('a').find((a) => a.text().includes('Recargar placa'))
    expect(rechargeBtn).toBeDefined()

    const debtBtn = w.findAll('a').find((a) => a.text().includes('Consultar / Pagar deuda'))
    expect(debtBtn).toBeDefined()
  })

  it('renderiza las tarjetas inferiores de información oficial', () => {
    const w = mountDiagram()

    expect(w.text()).toContain('¿QUÉ INCLUYE Y DÓNDE SE PAGA?')
    expect(w.text()).toContain('Deuda = tasa de peaje + cargos administrativos')
    expect(w.text()).toContain('SOBRE LA OBLIGACIÓN DE PAGO')
  })

  it('permite accionar la impresión de la ficha técnica', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})
    const w = mountDiagram()

    const printBtn = w.find('button.how-diagram__print-btn')
    expect(printBtn.exists()).toBe(true)

    await printBtn.trigger('click')
    expect(printSpy).toHaveBeenCalled()
    printSpy.mockRestore()
  })

  it('permite descargar la infografía oficial original en alta resolución', () => {
    const w = mountDiagram()

    const downloadLink = w.find('a.how-diagram__download-btn')
    expect(downloadLink.exists()).toBe(true)
    expect(downloadLink.text()).toContain('Descargar infografía original')
    expect(downloadLink.attributes('href')).toContain('cobro-por-placa.png')
    expect(downloadLink.attributes('download')).toBe('infografia-oficial-cobro-por-placa.png')
  })
})
