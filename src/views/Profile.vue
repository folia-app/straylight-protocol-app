<template lang="pug">
article.profile
  header.mt-56.pl-20.pr-12
    //- ("YOU")
    .relative(v-if="$store.getters.isConnectedAddr(address)")
      .absolute.top-0.left-0.transform.-translate-y-full.pb-2
        .px-1.text-sm.leading-tight.rounded-lg.bg-accent2.text-accent1.font-bold YOU
    
    .flex.items-end
      h1.text-6xl.leading-none
        addr(:address="address")
      nav.text-xs.ml-8.pb-px.-mb-2
        //- quixotic link
        a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="$store.getters.quixoticLink({ account: address })", target="_blank", rel="noopener noreferrer")
          | Quixotic
        //- OS link
        a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="$store.getters.openSeaLink({ account: address })", target="_blank", rel="noopener noreferrer") OpenSea
        //- ENS link
        template(v-if="ens")
          a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="`https://app.ens.domains/name/${ens}`", target="_blank", rel="noopener noreferrer")
            | ENS
    .mt-2.opacity-40.text-xs {{ address }}
  
  section
    template(v-if="!address")
      .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 resolving...
    
    template(v-else)
      nav.mt-22.flex.pl-20
        .flex
          router-link.h-8.border.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile', params: { address }}") turmites

        router-link.h-8.ml-1.border.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile__activity', params: { address }}") acitivty

      router-view.mt-26(v-if="address", :address="address", v-slot="{ Component }")
        keep-alive(include="ProfileBoards")
          component(:is="Component")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import { utils } from 'ethers'
import { useRoute } from 'vue-router'
import Addr from '@/components/Addr.vue'

const route = useRoute()

const address = ref()

// Addr.vue will lookup ens
const ens = computed(() => store.state.addresses[address.value?.toLowerCase()]?.ens)

const resolveAddress = async () => {
  try {
    let input = route.params.address.toLowerCase()
    
    if (utils.isAddress(input)) {
      address.value = input
      return
    }

    // resolve non-address
    if (input.endsWith('.eth')) {
      address.value = await store.dispatch('resolveENS', input)
    } else {
      throw new Error(`${input} is neither a valid address or ENS name`)
    }

  } catch (e) {
    console.error(e)
  }
}

resolveAddress()
</script>

<style lang="postcss">
.profile nav .router-link-exact-active{
  @apply bg-accent2 text-accent1;
}
</style>
