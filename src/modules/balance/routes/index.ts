import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const balanceRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.balance,
    name: ROUTE_NAMES.balance,
    component: () => import('@/modules/balance/views/BalanceView.vue'),
    meta: { title: 'Consultar saldo', public: true },
  },
]
