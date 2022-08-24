<template lang="pug">
article.home
  .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 {{ msg }}
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'
import { useRouter } from 'vue-router'

const msg = ref('loading...')
const router = useRouter()

// const defaultChainId = store.state.appDefaultNetworkId

// const network = store.state.networks[defaultChainId]

// // redirect to default network
// router.replace({ name: 'network-index', params: { networkName: network.name }})

store.dispatch('getProvider', {})
  .then(({ provider, chainId }) => {
    // console.log(Object.keys(store.state.networks), chainId)
    let network = store.state.networks[Object.keys(store.state.networks).find(key => key === chainId.toString())]
    
    if (network) {
      msg.value = 'redirecting to your wallet network...'
      setTimeout(() => {
        router.push({ name: 'network-index', params: { networkName: network.name }})
      }, 1000)
    } else {
      network = store.state.networks[store.state.appDefaultNetworkId]
      router.push({ name: 'network-index', params: { networkName: network.name }})
    }
  })
  .catch(e => {
    console.error('error loading provider for redirect')
  })
</script>