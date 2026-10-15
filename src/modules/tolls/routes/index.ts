import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const tollsRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.tolls,
    name: ROUTE_NAMES.tolls,
    component: () => import('@/modules/tolls/views/TollsView.vue'),
    meta: { title: 'Peajes habilitados', public: true },
  },
]
