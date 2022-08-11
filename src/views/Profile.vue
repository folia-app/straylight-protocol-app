<template lang="pug">
article.profile
  div(style="height:25vh")
  template(v-if="!tokenIds")
    .animate-pulse loading...
  template(v-else)
    ul
      | boards
      li(v-for="board in boardIds")
        ul
          li {{ board.id }}
          ul
            li {{ JSON.stringify(board.tokens) }}
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import { utils } from 'ethers'
import { useRoute } from 'vue-router'

const route = useRoute()

const tokenIds = ref()

const boardIds = computed(() => {
  let boards = []
  if (tokenIds.value) {
    boards = tokenIds.value.map(id => Math.floor(id / 4))
    boards = [...new Set(boards)]
    boards.sort()
    boards = boards.map(board => ({
      id: board,
      tokens: tokenIds.value.filter(id => Math.floor(id / 4) === board)
    }))
  }
  return boards
})

const getAddressTokens = async () => {
  try {
    let address = route.params.address

    if (!utils.isAddress(address)) {
      if (address.endsWith('.eth')) {
        address = await store.dispatch('resolveENS', address)
      } else {
        throw new Error(`${address} is neither a valid address or ENS name`)
      }
    }

    const contract = await store.dispatch('getNFTContract')
    
    // get balance
    const balance = (await contract.balanceOf(address)).toString()
    const ids = []

    if (balance > 0) {
      for (var i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i)
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