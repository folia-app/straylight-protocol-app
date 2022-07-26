<template lang="pug">
  router-link.relative.group.block(:to="'/tokens/' + mint.newTokenId")
    mint-image(:mint="mint")

    .absolute.z-10.bottom-0.right-0.px-5.py-2.hidden.group-hover_block.group-hover_blend-difference
      svg-eye.text-white
</template>

<script>
import MintImage from '@/components/MintImage'
import SvgEye from '@/components/SVG-Eye'
export default {
  name: 'MintThumb',
  props: ['mint'],
  components: { MintImage, SvgEye }
}
</script>

<style>
</style>
