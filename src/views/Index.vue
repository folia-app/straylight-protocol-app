<template lang="pug">
  article.index
    h1.sr-only Worlds
    div(style="height:25vh")
    minted-results

</template>

<script>
import MintedResults from '@/components/MintedResults'

export default {
  name: 'Index',
  components: { MintedResults },
  metaInfo () {
    if (this.$route.name !== 'token') {
      setTimeout(() => {
        // console.log('prerender ready', document.querySelector('meta[property="og:image"]'))
        window.prerenderReady = true
      }, 100)

      return {
        meta: this.$store.getters.meta({})
      }
    }
  }
}
</script>

<style>
</style>
