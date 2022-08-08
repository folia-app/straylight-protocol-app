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
    component: () => import(/* webpackChunkName: 'board' */ '../views/Board.vue')
  },

  {
    path: '/mint',
    name: 'mint',
    component: () => import(/* webpackChunkName: 'board' */ '../views/Mint.vue')
  },
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
      // scroll to top
      return { top: 0 }
    }
  }
})

export default router
