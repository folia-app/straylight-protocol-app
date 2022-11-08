<template lang="pug">
.board-animates.relative
  div.pointer-events-none(ref="containerEl", :id="'myCanvasContainer' + props.boardKey")
</template>

<script setup>
  import { watch, onUnmounted, onMounted } from 'vue'
  import sketch from '@/plugins/p5_turmites/sketch.js'
  import colors from '@/colors'
  
  const props = defineProps(['turmiteData', 'boardData', 'tokenIds', 'boardKey'])
  const emit = defineEmits(['rendered', 'loading'])

  let myp5

  onMounted(() => makeSketch())

  watch(props.turmiteData, () => makeSketch(), { deep: true })
  watch(() => props.boardData, () => makeSketch())

  onUnmounted(() => {
    console.log('destroyed')
    return myp5?.remove() // stops loop and removes canvas el
  })
  
  const makeSketch = async () => {
    emit('loading', true)

    // wait to load p5 library
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

    const hasTurmiteData = props.turmiteData.filter(val => val === undefined).length === 0
    const hasBoardData = props.boardData !== undefined

    if (hasTurmiteData && hasBoardData) {
      // console.log("ready!", {
      //   0: props.turmiteData[0],
      //   1: props.turmiteData[1],
      //   2: props.turmiteData[2],
      //   3: props.turmiteData[3],
      //   board: props.boardData
      // })

      // filter out empty (null) turmites
      const nonNullTurmites = props.turmiteData.filter(val => val !== null)

      // render
      myp5 = sketch({
        target: 'myCanvasContainer' + props.boardKey,
        turmitesData: nonNullTurmites,
        turmiteIds: props.tokenIds,
        boardData: props.boardData,
        frameRate: 60,
        colors,
      });

      emit('rendered', myp5)
    }
  }

  // p5 library lazy loader
  const loadP5Library = async () => {
    if (!window.p5Loader && !window.p5) {
      window.p5Loader = new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = '/p5.min.js';
        script.type = 'text/javascript';
        script.id = 'p5script'

        script.onload = function () {
          delete window.p5Loader
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
</script>