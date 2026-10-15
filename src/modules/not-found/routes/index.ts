import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const notFoundRoutes: RouteRecordRaw[] = [
  {
    path: ':pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/modules/not-found/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada', public: true },
  },
]
