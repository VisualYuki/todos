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
          component: () => import('@/features/auth/pages/Auth.vue'),
          meta: {
            requiredAuth: false,
          },
        },
      ],
    },
  ],
})

export default router
