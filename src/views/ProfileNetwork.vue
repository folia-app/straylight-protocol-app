<template lang="pug">
.profile-network.flex.flex-col.w-full
  nav.relative.z-10.mt-22.flex.px-6.lg_pl-20.text-md.justify-center.sm_justify-start.items-center    
    router-link.h-9.border.border-accent2.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile-network__worlds', params: { address: route.params.address }}") turmites

    .w-2.border-t

    router-link.h-9.border.border-accent2.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'profile-network__activity', params: { address: route.params.address }}") activity

    .flex-1.sm_flex-none.sm_w-16.border-t

    network-switcher(:initNetworkName="$route.params.networkName", @change="onNetworkChange")

  //- view
  section.flex-1.flex.flex-col.mt-14
    //- * wait for 'boards' so activity doesn't fetch until tokenIds is set
    template(v-if="!boards")
      .px-6.lg_px-22.animate-pulse.text-sm.text-accent3 loading...
    template(v-else)
      .flex-1.w-full
        router-view(v-slot="{ Component }", :boards="boards", :tokenIds="tokenIds")
          keep-alive
            component(:is="Component")

      footer.mt-36.pb-64.lg_pb-36
        nav.flex.text-md.items-center
          .flex-1.flex.justify-center.lg_-mr-28
            //- template(v-if="boardId - 1 >= 0")
              router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-12.pr-7.flex.items-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId - 1 }}")
                | world_{{ boardId - 1 }}
                .absolute.top-0.left-2.h-full.flex.items-center &larr;

          .flex.justify-center
            router-link.max-w-full.h-8.pb-px.px-8.rounded-full.border.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index', params: { networkName: $route.params.networkName }}")
              | all worlds

          .flex-1.flex.justify-center.lg_-ml-28
            //- template(v-if="boardId + 1 < boardCount")
              router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-7.pr-12.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId + 1 }}")
                | world_{{ boardId + 1 }}
                .absolute.top-0.right-2.h-full.flex.items-center &rarr;
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import NetworkSwitcher from '@/components/NetworkSwitcher.vue'

const props = defineProps(['address'])
const route = useRoute()
const router = useRouter()

const tokenIds = ref()

const boards = computed(() => {
  let boards
  if (tokenIds.value) {
    boards = tokenIds.value.map(id => Math.floor(id / 4) + 1)
    boards = [...new Set(boards)]
    boards.sort().reverse()
    boards = boards.map(board => ({
      id: board,
      tokens: tokenIds.value.filter(id => Math.floor(id / 4) === board - 1)
    }))
  }
  return boards
})

const getAddressTokens = async () => {
  try {    
    const contract = await store.dispatch('getNFTContract', { network: { name: route.params.networkName }})

    // get balance
    const balance = (await contract.balanceOf(props.address)).toString()
    const ids = []

    if (balance > 0) {
      for (var i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(props.address, i)
        ids.push(tokenId.toString())
      }
    }

    tokenIds.value = ids
  } catch (e) {
    console.error(e)
  }
}

const onNetworkChange = (networkName) => {
  router.push({ params: { networkName }})
}

getAddressTokens()
</script>