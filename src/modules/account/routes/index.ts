import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const accountRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.account,
    name: ROUTE_NAMES.account,
    component: () => import('@/modules/account/views/AccountView.vue'),
    meta: { title: 'Mi cuenta', public: true },
  },
]
