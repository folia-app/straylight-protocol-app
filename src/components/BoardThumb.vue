<template lang="pug">
  //- TODO change url
  router-link.relative.group.block.hover_border.border.border-gray-800.-mr-1.-mb-1(:to="'/boards/' + (boardId - 1)")
    //- mint-image(:mint="mint")
    .relative
      board-image(:boardId="boardId - 1")
      //- .absolute.overlay.bg-white.pointer-events-none(:style="{ opacity: boardId % 2 === 0 ? 0.08 : 0.06 }")

    .absolute.z-10.bottom-0.right-0.px-5.py-2.hidden.group-hover_block.group-hover_blend-difference
      svg-eye.text-white
</template>

<script>
import BoardImage from '@/components/BoardImage'
import SvgEye from '@/components/SVG-Eye'
export default {
  name: 'BoardThumb',
  props: ['mint', 'boardId'],
  components: { BoardImage, SvgEye }
}
</script>

<style>
</style>
