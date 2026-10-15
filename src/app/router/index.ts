import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PublicLayout from '@/app/layouts/PublicLayout.vue'
import { homeRoutes } from '@/modules/home/routes'
import { rechargeRoutes } from '@/modules/recharge/routes'
import { debtRoutes } from '@/modules/debt/routes'
import { tollsRoutes } from '@/modules/tolls/routes'
import { accountRoutes } from '@/modules/account/routes'
import { balanceRoutes } from '@/modules/balance/routes'
import { notFoundRoutes } from '@/modules/not-found/routes'
import { STICKY_NAV_OFFSET } from '@/core/constants/routing'
import { DEFAULT_DOCUMENT_TITLE, PRODUCT_NAME } from '@/core/constants/system'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      ...homeRoutes,
      ...rechargeRoutes,
      ...debtRoutes,
      ...tollsRoutes,
      ...accountRoutes,
      ...balanceRoutes,
      ...notFoundRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: STICKY_NAV_OFFSET, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta?.title as string | undefined) ?? ''
  document.title = title ? `${title} · ${PRODUCT_NAME}` : DEFAULT_DOCUMENT_TITLE
})

export default router
