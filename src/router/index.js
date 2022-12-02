import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Index from '@/views/Index.vue'
import IndexWorlds from '@/views/IndexWorlds.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },

  {
    path: '/mint',
    name: 'mint',
    component: () => import('../views/Mint.vue')
  },

  {
    path: '/networks/:networkName',
    children: [
      // network index
      {
        path: '',
        component: Index,
        children: [
          {
            path: 'worlds',
            name: 'network-index',
            component: IndexWorlds,
          },
          {
            path: 'activity',
            name: 'network-index__activity',
            component: () => import('../views/IndexActivity.vue')
          }
        ]
      },

      {
        path: 'worlds/:board',
        name: 'board',
        component: () => import('../views/Board.vue')
      },
    ]
  },

  {
    path: '/patterns',
    name: 'patterns',
    component: () => import('../views/Patterns.vue')
  },

  {
    path: '/patterns/:pattern',
    name: 'pattern',
    component: () => import('../views/Pattern.vue')
  },

  {
    path: '/:address',
    children: [
      {
        path: '',
        component: () => import('../views/Profile.vue'),
        children: [
          // root redirects to network profile after lookup
          {
            path: '',
            name: 'profile',
            component: () => import('../views/ProfileIndex.vue'),
          },
          // 
          {
            path: ':networkName',
            component: () => import('../views/ProfileNetwork.vue'),
            children: [
              {
                path: '',
                name: 'profile-network__worlds',
                component: () => import('../views/ProfileNetworkWorlds.vue'),
              },
              {
                path: 'activity',
                name: 'profile-network__activity',
                component: () => import('../views/ProfileNetworkActivity.vue'),
              }
            ]
          },
        ]
      },
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
      const isSameAddress = to.params.address && to.params.address === from.params.address
      const isSameNetwork = to.query.network && to.query.network === from.query.network
      if (isSameAddress || isSameNetwork) {
        return
      }
      // scroll to top
      return { top: 0 }
    }
  }
})

export default router
