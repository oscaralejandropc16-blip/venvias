import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const rechargeRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.recharge,
    name: ROUTE_NAMES.recharge,
    component: () => import('@/modules/recharge/views/RechargeView.vue'),
    meta: { title: 'Recargar una placa', public: true },
  },
]
