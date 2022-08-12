<template lang="pug">
section.profile-worlds
  template(v-if="!boards")
    .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 loading...
  
  template(v-else)
    ul.boards-grid
      template(v-for="n in 1")
        li(v-for="board in boards")
          board-thumb(:boardId="board.id")
            .absolute.overlay.px-2.pt-1.text-xs.leading-tight(style="mix-blend-mode:difference")
              h6 world_{{board.id}}
              //- div
                | {{ board.tokens.map(id => turmiteName(id)).join(', ') }}
              ul.opacity-40
                li(v-for="id in board.tokens") {{ turmiteName(id) }}
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import BoardThumb from '@/components/BoardThumb.vue'
import { turmiteName } from '@/utils.js'

const props = defineProps(['address'])

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

const getAddressTokens = async () => {
  try {    
    const contract = await store.dispatch('getNFTContract')

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

getAddressTokens()
</script>