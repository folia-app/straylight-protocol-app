<template lang="pug">
.network-resolver
  .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 {{ msg }}
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'

const msg = ref('loading...')
const emit = defineEmits(['resolved'])

store.dispatch('getProvider', {})
  .then(({ provider, chainId }) => {
    // provider is on supported network?
    let network = store.state.networks[Object.keys(store.state.networks).find(key => key === chainId.toString())]
    
    if (network) {
      // redirect to wallet network
      msg.value = 'redirecting to your wallet network...'
      setTimeout(() => {
        // router.push({ name: 'network-index', params: { networkName: network.name }})
        emit('resolved', network.name)
      }, 500)
    } else {
      // redirect to default
      network = store.state.networks[store.state.appDefaultNetworkId]
      // router.push({ name: 'network-index', params: { networkName: network.name }})
      emit('resolved', network.name)
    }
  })
  .catch(e => {
    console.error('error loading provider for redirect', e)
  })
</script>