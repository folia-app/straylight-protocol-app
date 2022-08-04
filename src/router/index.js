import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
// import Work from '@/views/Work'
// const WorkTokens = () => import(/* webpackChunkName: "work-tokens" */ '../views/work/WorkTokens.vue')
// const WorkInfo = () => import(/* webpackChunkName: "work" */ '../views/work/WorkInfo.vue')

// import Home from '@/views/Home'
// import Admin from '@/views/Admin'
Vue.use(Router)

/*
index (patches, users)
user/wallet: name?, addr, patches, patchesCount?
patch: artist, title, EditionId, printNum, currentPrice, currentUserThisPatch [tokenIds], transactionList (tokenId, addr/owner (isCurrent?), price, date)
(search?)
*/

export default new Router({
  mode: 'history',
  routes: [
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

    // {
    //   path: '/mint',
    //   name: 'mint',
    //   component: () => import(/* webpackChunkName: 'board' */ '../views/Mint.vue')
    // },
  ],
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
      return { y: 0 }
    }
  }
})
