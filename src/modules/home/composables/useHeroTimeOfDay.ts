import { computed } from 'vue'
import dayImg from '@/assets/hero/highway-day.jpg'
import nightImg from '@/assets/hero/highway-night.jpg'

export type HeroTimeOfDay = 'day' | 'night'

export interface TimeSceneOption {
  id: HeroTimeOfDay
  label: string
  emoji: string
  location: string
  timeRange: string
}

export const TIME_OF_DAY_OPTIONS: readonly TimeSceneOption[] = [
  {
    id: 'day',
    label: 'Día',
    emoji: '☀️',
    location: 'Autopista GMA · El Ávila',
    timeRange: '06:00 - 18:59',
  },
  {
    id: 'night',
    label: 'Noche',
    emoji: '🌙',
    location: 'Autopista GMA · Peaje Caracas',
    timeRange: '19:00 - 05:59',
  },
] as const

function detectLocalTimeOfDay(): HeroTimeOfDay {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 19 ? 'day' : 'night'
}

export function useHeroTimeOfDay() {
  const currentTime = computed<HeroTimeOfDay>(() => detectLocalTimeOfDay())

  const currentScene = computed<TimeSceneOption>(() => {
    return TIME_OF_DAY_OPTIONS.find((opt) => opt.id === currentTime.value) ?? TIME_OF_DAY_OPTIONS[0]
  })

  return {
    currentTime,
    currentScene,
    dayImg,
    nightImg,
    options: TIME_OF_DAY_OPTIONS,
  }
}

