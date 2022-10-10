<template lang="pug">
.board-animates.relative
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
import { ref, watch, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import tokenUriParser from '@/plugins/p5_turmites/tokenURIParser.js'
import sketch from '@/plugins/p5_turmites/sketch.js'
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'

const props = defineProps(['tokenIds', 'boardId', 'networkName', 'previewButton', 'frameRate'])
const emit = defineEmits(['rendered', 'loading'])

let contract, myp5
const turmiteData = ref([undefined, undefined, undefined, undefined])
const boardData = ref()
const previewButton = ref()
const playing = ref(false)
const containerEl = ref()

const loadP5Library = async () => {
  if (!window.p5Loader && !window.p5) {
    window.p5Loader = new Promise((resolve, reject) => {
      console.log('loading p5 library...')

      var script = document.createElement('script');
      script.src = '/p5.min.js';
      script.type = 'text/javascript';
      script.id = 'p5script'

      script.onload = function () {
        delete window.p5Loader
        console.log("loaded p5 library")
        resolve()
      };
      
      script.onerror = function (e) {
        console.error(e)
        delete window.p5Loader
        reject(new Error("Couldn't load p5 library."))
      }

      document.body.appendChild(script)
    })
  }
  return window.p5Loader
}

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
    .then(data => { boardData.value = tokenUriParser.boardParser(data) })
}

const makeSketch = async () => {
  emit('loading', true)
  
  try {
    await loadP5Library()  
  } catch (e) {
    console.error(e)
    return
  }

  // clear any existing canvases
  if (myp5) {
    myp5.remove()
  }
  // while (containerEl.value.lastChild) {
  //   containerEl.value.removeChild(containerEl.value.lastChild)
  // }

  const hasTurmiteData = turmiteData.value.filter(val => val === undefined).length === 0
  const hasBoardData = boardData.value !== undefined
  
  if (hasTurmiteData && hasBoardData) {
    // console.log("ready!", {
    //   0: turmiteData.value[0],
    //   1: turmiteData.value[1],
    //   2: turmiteData.value[2],
    //   3: turmiteData.value[3],
    //   board: boardData.value
    // })

    // filter out empty (null) turmites
    const turmites = turmiteData.value.filter(val => val !== null)

    // render
    myp5 = sketch(
      'myCanvasContainer',
      turmites,
      ['W', 'S', 'N', 'E'],
      boardData.value,
      props.frameRate
    );

    emit('rendered', myp5)
  }
}

onUnmounted(() => {
  myp5.remove() // stops loop and removes canvas el
  console.log('destroyed')
})

watch(turmiteData, () => makeSketch(), { deep: true })
watch(boardData, () => makeSketch())

init()
</script>