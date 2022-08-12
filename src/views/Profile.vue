<template lang="pug">
article.profile
  .min-h-screen.flex.flex-col
    
    header.mt-64.lg_mt-56.px-6.lg_pl-20
      //- ("YOU")
      .relative(v-if="$store.getters.isConnectedAddr(address)")
        .absolute.top-0.left-0.transform.-translate-y-full.pb-2
          .px-1.text-sm.leading-tight.rounded-lg.bg-accent2.text-accent1.font-bold YOU
      
      .flex.flex-wrap.items-end
        h1.text-6xl.leading-none.lg_order-1
          addr(:address="address")
        
        .w-full.mt-2.opacity-40.text-xs.lg_order-2 {{ address }}

        nav.text-xs.-ml-3.lg_ml-8.pb-px.-mb-2.lg_order-1
          //- quixotic link
          a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="$store.getters.quixoticLink({ account: address })", target="_blank", rel="noopener noreferrer")
            | Quixotic
          //- OS link
          a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="$store.getters.openSeaLink({ account: address })", target="_blank", rel="noopener noreferrer") OpenSea
          //- ENS link
          template(v-if="ens")
            a.inline-block.px-3.py-2.mouse_hover_text-accent3(:href="`https://app.ens.domains/name/${ens}`", target="_blank", rel="noopener noreferrer")
              | ENS
    
    section.flex-1
      template(v-if="!address")
        .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 resolving...
      
      template(v-else)
        nav.mt-22.flex.px-6.lg_pl-20
          .flex
            router-link.h-8.border.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile', params: { address }}") turmites

          router-link.h-8.ml-1.border.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile__activity', params: { address }}") acitivty

        //- view
        //- * wait for 'boards' so activity doesn't fetch until tokenIds is set
        router-view.mt-26(v-if="boards", v-slot="{ Component }", :boards="boards", :tokenIds="tokenIds")
          keep-alive
            component(:is="Component")

  footer.pb-64.lg_pb-36
    nav.flex.text-md.items-center
      .flex-1.flex.justify-center.lg_-mr-28
        //- template(v-if="boardId - 1 >= 0")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-12.pr-7.flex.items-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId - 1 }}")
            | world_{{ boardId - 1 }}
            .absolute.top-0.left-2.h-full.flex.items-center &larr;

      .flex.justify-center
        router-link.max-w-full.h-8.pb-px.px-8.rounded-full.border.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(to="/")
          | all worlds

      .flex-1.flex.justify-center.lg_-ml-28
        //- template(v-if="boardId + 1 < boardCount")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-7.pr-12.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId + 1 }}")
            | world_{{ boardId + 1 }}
            .absolute.top-0.right-2.h-full.flex.items-center &rarr;
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

const tokenIds = ref()

const boards = computed(() => {
  let boards
  if (tokenIds.value) {
    boards = tokenIds.value.map(id => Math.floor(id / 4))
    boards = [...new Set(boards)]
    boards.sort().reverse()
    boards = boards.map(board => ({
      id: board,
      tokens: tokenIds.value.filter(id => Math.floor(id / 4) === board)
    }))
  }
  return boards
})

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

const getAddressTokens = async () => {
  try {    
    await resolveAddress()

    const contract = await store.dispatch('getNFTContract')

    // get balance
    const balance = (await contract.balanceOf(address.value)).toString()
    const ids = []

    if (balance > 0) {
      for (var i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address.value, i)
        ids.push(tokenId.toString())
      }
    }

    tokenIds.value = ids
  } catch (e) {
    console.error(e)
  }
}

getAddressTokens()
</script>

<style lang="postcss">
.profile nav .router-link-exact-active{
  @apply bg-accent2 text-accent1;
}
</style>
