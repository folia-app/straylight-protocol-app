<template lang="pug">
article.index
  header.mt-72.lg_mt-80.px-6.lg_pl-20

    nav.flex.text-md.justify-center.sm_justify-start
      .flex
        router-link.h-9.border.rounded-full.px-8.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(to="/") worlds

      router-link.h-9.ml-1.border.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(to="/activity") activity

  section.mt-8
    router-view(v-slot="{ Component }")
      keep-alive
        component(:is="Component")

</template>

<script>
export default {
  name: 'Index',
  // metaInfo () {
  //   if (this.$route.name !== 'token') {
  //     setTimeout(() => {
  //       // console.log('prerender ready', document.querySelector('meta[property="og:image"]'))
  //       window.prerenderReady = true
  //     }, 100)

  //     return {
  //       meta: this.$store.getters.meta({})
  //     }
  //   }
  // }
}
</script>

<style lang="postcss">
article.index nav .router-link-exact-active{
  @apply bg-accent2 text-accent1;
}
</style>
