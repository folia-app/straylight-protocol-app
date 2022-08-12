import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/Index.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },

  {
    path: '/boards/:board',
    name: 'board',
    component: () => import('../views/Board.vue')
  },

  {
    path: '/mint',
    name: 'mint',
    component: () => import('../views/Mint.vue')
  },

  {
    path: '/:address',
    component: () => import('../views/Profile.vue'),
    children: [
      {
        path: '',
        name: 'profile', // worlds,
        component: () => import('../views/ProfileBoards.vue'),
      },
      {
        path: 'activity',
        name: 'profile__activity', // worlds,
        component: () => import('../views/ProfileActivity.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else if (savedPosition) {
      return savedPosition
    } else {
      // don't scroll to top on user tab changes...
      if (to.params.address && to.params.address === from.params.address) {
        return
      }
      // scroll to top
      return { top: 0 }
    }
  }
})

export default router
