<template lang="pug">
div
  template(v-if="props.type === 'dot'")
    .flex.items-center.text-accent4
      .mt-1.relative.group
        .rounded-full.h-4.w-4(:class="{'animate-pulse bg-accent4': isListening, 'border border-current opacity-50': !isListening }")
        .absolute.top-0.left-full.h-full.flex.items-center.opacity-0.mouse_group-hover_opacity-100.text-xxs.pl-2(v-if="isListening && !updateCount")
          | listening...
          
      button.px-2.ml-1.flex.items-center(v-if="updateCount", @click="refreshClick")
        | {{ updateCount }}
        arrow-path-icon.ml-2.text-accent4(class="h-7 w-7")
  template(v-if="props.type === 'text'")
    .p-3.text-smm.leading-none(v-show="isListening")
      .py-1.px-5.bg-accent1.rounded-full.text-accent4(v-if="updateMsg") {{ updateMsg }}
      .py-1.rounded-full.text-accent3.animate-pulse(v-show="!updateMsg") listening...
</template>

<script setup>
  import store from '@/store'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { ArrowPathIcon } from '@heroicons/vue/24/outline'

  const props = defineProps({
    type: { type: String, default: 'text' },
    boardId: { type: String, default: undefined }
  })
  
  const emit = defineEmits(['update'])

  let contract
  const route = useRoute()
  const isListening = ref(false)
  const updateCount = ref(0)
  const updateMsg = ref()
  let updateMsgTmOut
  
  function refreshClick () {
    updateCount.value = 0
    emit('refreshClick')
  }

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

  function onEvent ({ type, msg, data }) {
    // return if filtering for particular board
    if (props.boardId && props.boardId !== data.boardId) return

    console.log(msg, data)
    flashUpdate(msg)
    updateCount.value = updateCount.value + 1
    emit('update', { type, data })
  }

  async function listenForMints () {
    try {
      contract.on('TurmiteMint', (tokenId, rule, boardId) => {
        const data = {tokenId: tokenId.toString(), rule, boardId: boardId.toString() }
        onEvent({ type: 'mint', msg: 'new turmite!', data })
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
        onEvent({ type: 'move', msg: 'turmite moved!', data })
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