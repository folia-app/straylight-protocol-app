<template lang="pug">
observer.board-image.relative.group(:threshold="0.01", @visible="onVisible", @hidden="visible = false")

  //- (placeholder)
  template(v-if="!imgSrc")
    .w-full.pb-full
      .absolute.overlay.flex.items-center.justify-center.animate-pulse.text-accent3.text-smm
        .py-1.pl-3.pr-2 loading...

  template(v-else)
    img.block.w-full(:src="imgSrc")

</template>

<script>
import Observer from '@/components/Observer.vue'
export default {
  name: 'BoardImage',
  props: ['boardId'],
  components: { Observer },
  data () {
    return {
      visible: false,
      imgSrc: undefined,
    }
  },
  methods: {
    onVisible () {
      this.visible = true
      this.loadImage()
    },
    onHidden () {
      this.visible = true
    },
    loadImage () {
      this.$store.dispatch('getBoardImage', { id: this.boardId.toString() })
        .then(imgSrc => this.imgSrc = imgSrc)
    }
  }
}
</script>

<style>
</style>
