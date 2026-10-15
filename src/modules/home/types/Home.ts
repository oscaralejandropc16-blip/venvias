import type { RouteLocationRaw } from 'vue-router'
import type { IconName } from '@/shared/icons/iconPaths'

export interface SafetyItem {
  icon: IconName
  title: string
  text: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface HowItWorksLink {
  to: RouteLocationRaw
  label: string
}

export interface HowItWorksSlide {
  title: string
  stop: string
  text: string
  points?: string[]
  stat?: { value: string; label: string }
  note?: { strong: string; text: string }
  img: string
  imgSm: string
  alt: string
  zoom?: { img: string; alt: string }
  invoice?: { plate: string; status: string }
  cta?: HowItWorksLink
  more?: HowItWorksLink
}
