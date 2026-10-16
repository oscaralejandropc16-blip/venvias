import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/core/constants/routing'

export const debtRoutes: RouteRecordRaw[] = [
  {
    path: ROUTE_NAMES.debt,
    name: ROUTE_NAMES.debt,
    component: () => import('@/modules/debt/views/DebtView.vue'),
    meta: { title: 'Pagar saldo deudor', public: true },
  },
  {
    path: ROUTE_NAMES.debtConditions,
    name: ROUTE_NAMES.debtConditions,
    component: () => import('@/modules/debt/views/DebtConditionsView.vue'),
    meta: { title: 'Condiciones de la deuda', public: true },
  },
]
