<script lang="ts">
  import { ref } from 'vue';

  const boardImgEl = ref()
  const boardImgSrc = ref()
  const boardScale = ref(0)
  const isImgLoading = ref(false)

  // UNFINISHED
</script>

<template lang="pug">
.board-media.relative
  //- contract image (loader + sizer)
  img.sm_absolute.overlay.object-center.object-contain(v-if="boardImgSrc", ref="boardImgEl", :src="boardImgSrc", :class="{'opacity-0': !boardImgSrc, 'animate-pulse': !boardScale}")
  
  //- p5 board (scales based on <img> .object-contain size)
  .absolute.overlay.flex.justify-center.items-center.transition.duration-150(:class="{'opacity-0': boardScale === undefined || isImgLoading}")
    board-animates.origin-center.border.border-gray-700(ref="boardAnimator", :tokenIds="tokenIds", :boardId="boardId", :networkName="$route.params.networkName", @rendered="onBoardRender", :previewButton="$refs.previewBtn", :style="{ transform: boardScale ? `scale(${boardScale})` : 'none' }", :frameRate="60", :resetKey="boardKey")

    //- controls, below board
    .absolute.bottom-0.left-0.w-full(v-show="controlsVisible")
      .absolute.top-0.left-0.w-full.flex.justify-center
        //- controls container matches imgW dynamically
        .w-full.flex.justify-between.items-center(:style="{ maxWidth: controlsMaxW }")
          div
            button.rounded-full.flex.items-center.justify-center.text-smm.font-bold.tracking-wide.text-accent3(@click="resetBoard", v-show="resetBtnVisible")
              | reset
          //- simulate btn
          button.rounded-full.pl-5.flex.items-center.justify-center.text-smm.font-bold.tracking-wide.text-accent3(ref="previewBtn", @click="toggleBoardSimulation")
            .pb-1 {{ playing ? 'simulating' : 'simulate' }}
            .ml-2
              play-circle-icon.h-8(v-show="!playing")
              pause-circle-icon.h-8(v-show="playing")
</template>