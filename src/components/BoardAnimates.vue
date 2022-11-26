<template lang="pug">
board-animates-canvas(:key="`${props.boardKey}`", :boardKey="boardKey", :tokenIds="props.tokenIds", :boardData="boardData", :turmiteData="turmiteData", v-bind="$attrs")
//- .board-animates.relative
  div.pointer-events-none(ref="containerEl", id="myCanvasContainer")

  //- controls
  //- button.absolute.overlay(v-show="rendered", ref="previewButton", @click.stop.prevent="playing = !playing")
    .absolute.bottom-0.right-0.p-3
      .rounded-full.pl-5.flex.items-center.justify-center.text-lg.md_text-smm.tracking-wide.font-bold.text-accent3(:class="{'animate-pulse': playing}")
        .pb-1(v-show="playing") preview
        .ml-2
          play-circle-icon.h-16.md_h-12(v-show="!playing")
          pause-circle-icon.h-16.md_h-12(v-show="playing")
</template>

<script setup>
  import { ref } from 'vue'
  import store from '@/store'
  import tokenUriParser from '@/plugins/p5_turmites/tokenURIParser.js'
  import { useAttrs } from 'vue'
  import BoardAnimatesCanvas from '@/components/BoardAnimatesCanvas.vue'
  // import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'

  const props = defineProps(['tokenIds', 'boardId', 'networkName', 'previewButton', 'frameRate', 'boardKey'])
  // const emit = defineEmits(['rendered', 'loading'])

  let contract
  const turmiteData = ref([undefined, undefined, undefined, undefined])
  const boardData = ref()

  const getTokenURI = async (tokenId) => {
    try {
      contract = contract || await store.dispatch('getNFTContract', { network: { name: props.networkName }})
      const data = await contract.tokenURI(tokenId)
      // console.log(tokenId, { data })
      return data
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  const getBitmap = async (boardId) => {
    try {
      contract = contract || await store.dispatch('getNFTContract', { network: { name: props.networkName }})
      const data = await contract.getBitmap(boardId, 0, 0, true)
      // console.log('boardData', { data })
      return data
    } catch (e) {
      console.error(e)
    }
  }

  const getData = () => {
    // get each tokendata async...
    for (var i = 0; i < props.tokenIds.length; i++) {
      const tokenId = props.tokenIds[i]
      const index = i

      getTokenURI(tokenId).then((data) => {
        data = tokenUriParser.turmiteParser(data)
        
        if (isNaN(data.rule)) {
          turmiteData.value[index] = data
        } else {
          turmiteData.value[index] = null // no turmite
        }
      })    
    }

    // get board data
    getBitmap(props.boardId)
      .then(data => {
        const buffer = tokenUriParser.boardParser(data)
        const array = JSON.parse(JSON.stringify(buffer)).data
        boardData.value = array
      })
  }

  getData()
</script>