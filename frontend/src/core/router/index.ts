import { authService } from '@/features/auth/service'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/shared/layout/Layout.vue'),

      children: [
        {
          path: '',
          redirect: { name: 'main' },
        },
        {
          path: 'login',
          component: () => import('@/features/auth/pages/Auth.vue'),
          name: 'login',
          meta: {
            requiredAuth: false,
          },
        },
        {
          path: 'main',
          component: () => import('@/features/todos/Todos.vue'),
          name: 'main',
          meta: {
            requiredAuth: true,
          },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from) => {
  await authService.auth()

  const isAuth = authService.isAuth()

  if (to.meta.requiredAuth) {
    if (!isAuth) {
      return { name: 'login' }
    }
  }

  if (!to.meta.requiredAuth && isAuth) {
    return { name: 'main' }
  }

  return true
})

export default router
