import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'
import HomeView from '@/modules/home/views/HomeView.vue'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.howItWorks,
    name: ROUTE_NAMES.howItWorks,
    component: () => import('@/modules/home/views/HowItWorksView.vue'),
    meta: { title: 'Cómo funciona', public: true },
  },
  {
    path: '',
    name: ROUTE_NAMES.home,
    component: HomeView,
    meta: { public: true },
  },
]
