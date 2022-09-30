<template lang="pug">
article.index
  header.mt-72.lg_mt-60.px-6.lg_pl-20.relative.z-10

    nav.flex.text-md.justify-center.sm_justify-start.items-center
      
      
      
      
      router-link.h-9.border.border-accent2.rounded-full.px-8.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index', params: $route.params }") worlds
      
      .w-2.border-t
      
      router-link.h-9.border.border-accent2.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index__activity', params: $route.params }") activity

      .flex-1.sm_flex-none.sm_w-16.border-t

      network-switcher(:initNetworkName="$route.params.networkName", @change="onNetworkChange")

  section.mt-8
    router-view(v-slot="{ Component }")
      keep-alive
        component(:is="Component")

</template>

<script setup>
import { useRouter } from 'vue-router'
import NetworkSwitcher from '@/components/NetworkSwitcher.vue'

const router = useRouter()

const onNetworkChange = (val) => {
  router.push({ params: { networkName: val }})
}
</script>

<style lang="postcss">
article.index nav .router-link-exact-active{
  @apply bg-accent2 text-accent1 border-accent2;
}
</style>
