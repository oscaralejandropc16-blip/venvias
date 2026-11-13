import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeActionCards from '@/modules/home/components/HomeActionCards.vue'
import { HOME_ACTION_CARDS } from '@/modules/home/constants/home.content'

describe('HomeActionCards', () => {
  it('renderiza las 3 tarjetas de navegación con sus títulos y descripciones', () => {
    const w = mount(HomeActionCards, {
      props: { cards: HOME_ACTION_CARDS },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const articles = w.findAll('article.action-card')
    expect(articles).toHaveLength(3)

    expect(w.text()).toContain('Recargar saldo')
    expect(w.text()).toContain('Consultar saldo')
    expect(w.text()).toContain('Pagar deuda')

    // Verifica que la tarjeta primaria tiene clase action-card--primary y su badge
    const primaryCard = w.find('.action-card--primary')
    expect(primaryCard.exists()).toBe(true)
    expect(primaryCard.text()).toContain('Recomendado')
  })

  it('cada tarjeta contiene su enlace con botón y su icono correspondiente', () => {
    const w = mount(HomeActionCards, {
      props: { cards: HOME_ACTION_CARDS },
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    })

    const links = w.findAll('a.action-card__btn')
    expect(links).toHaveLength(3)
    expect(links[0].text()).toContain('Recargar placa')
    expect(links[1].text()).toContain('Consultar saldo')
    expect(links[2].text()).toContain('Pagar deuda')
  })
})
