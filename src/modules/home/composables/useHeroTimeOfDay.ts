import { ref, computed } from 'vue'
import dayImg from '@/assets/hero/highway-day.jpg'
import sunsetImg from '@/assets/hero/highway-sunset.jpg'
import nightImg from '@/assets/hero/highway-night.jpg'

export type HeroTimeOfDay = 'day' | 'sunset' | 'night'
export type HeroTimeMode = 'auto' | 'manual'

export const TIME_OF_DAY_OPTIONS = [
  { id: 'day' as HeroTimeOfDay, label: 'Día', emoji: '☀️', timeRange: '06:00 - 17:59' },
  { id: 'sunset' as HeroTimeOfDay, label: 'Tarde', emoji: '🌅', timeRange: '18:00 - 19:59' },
  { id: 'night' as HeroTimeOfDay, label: 'Noche', emoji: '🌙', timeRange: '20:00 - 05:59' },
] as const

function detectLocalTimeOfDay(): HeroTimeOfDay {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 18) return 'day'
  if (hour >= 18 && hour < 20) return 'sunset'
  return 'night'
}

// Estado singleton para que persista durante la sesión
const timeMode = ref<HeroTimeMode>('auto')
const selectedTime = ref<HeroTimeOfDay>(detectLocalTimeOfDay())

export function useHeroTimeOfDay() {
  const currentTime = computed<HeroTimeOfDay>(() => {
    return timeMode.value === 'auto' ? detectLocalTimeOfDay() : selectedTime.value
  })

  function setTimeOfDay(time: HeroTimeOfDay): void {
    timeMode.value = 'manual'
    selectedTime.value = time
  }

  function setAuto(): void {
    timeMode.value = 'auto'
    selectedTime.value = detectLocalTimeOfDay()
  }

  return {
    currentTime,
    timeMode,
    setTimeOfDay,
    setAuto,
    dayImg,
    sunsetImg,
    nightImg,
    options: TIME_OF_DAY_OPTIONS,
  }
}
