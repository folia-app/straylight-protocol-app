<template lang="pug">
//- TODO change url
router-link.relative.group.block.hover_border.border.border-gray-800.-mr-px.-mt-px(:to="{name: 'board', params: {board:  boardId, networkName: network.name }}")
  //- mint-image(:mint="mint")
  .relative
    board-image(:boardId="boardId", :network="network", :key="imgKey")
    //- .absolute.overlay.bg-white.pointer-events-none(:style="{ opacity: boardId % 2 === 0 ? 0.08 : 0.06 }")

  .absolute.z-10.bottom-0.right-0.px-5.py-2.hidden.mouse_group-hover_block
    svg-eye.text-accent4

  //- additional content
  slot
</template>

<script>
import BoardImage from '@/components/BoardImage.vue'
import SvgEye from '@/components/SVG-Eye.vue'
export default {
  name: 'BoardThumb',
  props: ['boardId', 'network', 'imgKey'],
  components: { BoardImage, SvgEye }
}
</script>

<style>
</style>
