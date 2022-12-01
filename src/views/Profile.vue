<template lang="pug">
article.profile
  .min-h-screen.flex.flex-col
    
    header.mt-64.lg_mt-48.px-6.lg_pl-20
      //- ("YOU")
      .relative(v-if="$store.getters.isConnectedAddr(address)")
        .absolute.top-0.left-0.transform.-translate-y-full.pb-2
          .px-1.text-sm.leading-tight.rounded-lg.bg-accent5.text-accent1.font-bold YOU
      
      .flex.flex-wrap.items-end
        h1.text-6xl.leading-none.lg_order-1.text-accent3
          addr(:address="address")
        
        .w-full.mt-2.text-xs.lg_order-2
          a.opacity-40.mouse_hover_opacity-100.mouse_hover_text-accent4(:href="$store.getters.etherscanLink({ address })", target="_blank", rel="noopener noreferrer")
            | {{ address }}

        nav.text-xs.-ml-3.lg_ml-8.pb-px.-mb-2.lg_order-1
          //- OS link
          a.inline-block.px-3.py-2.mouse_hover_text-accent4(:href="$store.getters.marketplaceLink({ networkName: 'ethereum', account: address })", target="_blank", rel="noopener noreferrer") OpenSea
          //- quixotic link
          a.inline-block.px-3.py-2.mouse_hover_text-accent4(:href="$store.getters.marketplaceLink({ networkName: 'optimism', account: address })", target="_blank", rel="noopener noreferrer")
            | Quixotic
          //- ENS link
          template(v-if="ens")
            a.inline-block.px-3.py-2.mouse_hover_text-accent4(:href="`https://app.ens.domains/name/${ens}`", target="_blank", rel="noopener noreferrer")
              | ENS
    
    section.flex-1.flex.w-full
      template(v-if="!address")
        .fixed.bottom-0.left-0.p-6.text-sm.text-accent3(:class="{'animate-pulse': status.includes('...') }") {{ status }}
      
      template(v-else)
        router-view(:address="address", :key="$route.path")
        
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import { utils } from 'ethers'
import { useRoute, useRouter } from 'vue-router'
import Addr from '@/components/Addr.vue'
import { useMeta } from 'vue-meta'

const route = useRoute()
const router = useRouter()

const address = ref()
const status = ref('loading...')

// Addr.vue will lookup ens
const ens = computed(() => store.state.addresses[address.value?.toLowerCase()]?.ens)

const resolveAddress = async () => {
  try {
    let input = route.params.address.toLowerCase()

    // enforce lowercase
    if (input !== route.params.address) {
      router.replace({ params: { address: input }})  
    }
    
    if (utils.isAddress(input)) {
      address.value = input
      return
    }

    // resolve ENS?
    if (input.endsWith('.eth')) {
      status.value = 'resolving ENS...'
      address.value = await store.dispatch('resolveENS', input)
      return
    }
    
    throw new Error('invalid profile address >:(')
  } catch (e) {
    console.error(e)
    status.value = e.message
  }
}

resolveAddress()

const computedMeta = computed(() => store.getters.meta({
  title: `${ens.value ?? store.getters.addrShort(route.params.address)}`,
  descrip: 'player profile'
}))
useMeta(computedMeta)
</script>

<style lang="postcss">
.profile nav .router-link-exact-active{
  @apply bg-accent2 text-accent1 border-accent2;
}
</style>
