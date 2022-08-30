<template lang="pug">
.board-animates
  .border(id="myCanvasContainer")
  .flex.justify-center.w-full.mt-2
    button(ref="previewButton") play/pause
</template>

<script setup>
import { ref, watch } from 'vue'
import store from '@/store'
import tokenUriParser from '@/plugins/p5_turmites/tokenUriParser.js'
import sketch from '@/plugins/p5_turmites/sketch.js'

const props = defineProps(['tokenIds', 'boardId'])

let contract
const turmiteData = ref([undefined, undefined, undefined, undefined])
const boardData = ref()
const previewButton = ref()

const getTokenURI = async (tokenId) => {
  try {
    contract = contract || await store.dispatch('getNFTContract', { network: { name: props.networkName }})
    const data = await contract.tokenURI(tokenId)
    console.log(tokenId, { data })
    return data
    // convert from base64
    // const json = JSON.parse(atob(data.split(',')[1]))
    // attributes.value = json.attributes
  } catch (e) {
    console.error(e)
    return 0
  }
}

const getBitmap = async (boardId) => {
  try {
    contract = contract || await store.dispatch('getNFTContract', { network: { name: props.networkName }})
    const data = await contract.getBitmap(boardId, 0, 0, true)
    console.log('boardData', { data })
    return data
  } catch (e) {
    console.error(e)
  }
}

const init = () => {
  // get tokendata
  for (var i = 0; i < props.tokenIds.length; i++) {
    const tokenId = props.tokenIds[i]
    const index = i
    getTokenURI(tokenId).then((data) => {
      turmiteData.value[index] = tokenUriParser.turmiteParser(data)
    })    
  }
  // get board data
  getBitmap(props.boardId)
    .then(data => { boardData.value = tokenUriParser.boardParser(data) })
}

const makeSketch = () => {
  const hasTurmiteData = turmiteData.value.filter(val => val === undefined).length === 0
  const hasBoardData = boardData.value !== undefined
  
  if (hasTurmiteData && hasBoardData) {
    console.log("ready!", {
      0: turmiteData.value[0],
      1: turmiteData.value[1],
      2: turmiteData.value[2],
      3: turmiteData.value[3],
      board: boardData.value
    })

    sketch(
      'myCanvasContainer',
      turmiteData.value[0],
      turmiteData.value[1],
      turmiteData.value[2],
      turmiteData.value[3],
      ['W', 'S', 'N', 'E'],
      boardData.value,
      previewButton.value,
    );
  }
}

watch(turmiteData, () => makeSketch(), { deep: true })
watch(boardData, () => makeSketch())

init()
</script>