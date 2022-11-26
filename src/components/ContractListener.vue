<template lang="pug">
template(v-if="isListening")
  .p-3.text-smm.leading-none
    .py-1.px-5.bg-accent1.rounded-full.text-accent4(v-if="updateMsg") {{ updateMsg }}
    .py-1.rounded-full.text-accent3.animate-pulse(v-show="!updateMsg") listening...
</template>

<script setup>
  import store from '@/store'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  
  const emit = defineEmits(['update'])

  let contract
  const route = useRoute()
  const isListening = ref(false)
  const updateMsg = ref()
  let updateMsgTmOut
  

  async function getContract () {
    try {
      contract = await store.dispatch('getNFTContract', { network: { name: route.params.networkName }})
    } catch (e) {
      console.error(e)
    }
  }

  function flashUpdate (msg) {
    clearTimeout(updateMsgTmOut)
    updateMsg.value = msg
    updateMsgTmOut = setTimeout(() => { updateMsg.value = null }, 10000)
  }

  async function listenForMints () {
    try {
      contract.on('TurmiteMint', (tokenId, rule, boardId) => {
        const data = {tokenId: tokenId.toString(), rule, boardId: boardId.toString() }
        console.log('new mint!', data)
        flashUpdate('new turmite!')
        emit('update', { type: 'mint', data })
      })

      console.log('listening for mints...')
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async function listenForMoves () {
    try {
      contract.on('TurmiteMove', (tokenId, boardnumber, moves) => {
        const data = {tokenId: tokenId.toString(), boardId: boardnumber.toString(), moves: moves.toString() }
        console.log('new move!', data)
        flashUpdate('turmite moved!')
        emit('update', { type: 'move', data })
      })

      console.log('listening for moves...')
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  async function listen () {
    try {
      if (!contract) {
        await getContract()
      }
      listenForMints()
      listenForMoves()
      isListening.value = true
    } catch (e) {
      console.error(e)
    }
  }

  function unlisten () {
    console.log('unlisten')
    if (contract) {
      contract.removeAllListeners()
    }
    isListening.value = false
  }

  onMounted(() => {
    if (document.hasFocus) {
      listen()
    }
  })

  window.addEventListener('focus', listen)
  window.addEventListener('blur', unlisten)

  onUnmounted(() => {
    unlisten()
    window.removeEventListener('focus', listen)
    window.removeEventListener('blur', unlisten)
  })
</script>