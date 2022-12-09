<template lang="pug">
article.index
  header.mt-64.lg_mt-60.px-6.lg_pl-20.lg_pr-12.relative.z-10

    nav.flex.flex-wrap.text-md.justify-center.sm_justify-start.items-center

      router-link.h-9.border.border-accent2.rounded-full.px-8.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index', params: $route.params }") worlds
      
      .w-2.border-t
      
      router-link.h-9.border.border-accent2.rounded-full.px-7.flex.items-center.justify-center.pb-1.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index__activity', params: $route.params }") activity

      .flex-1.sm_flex-none.sm_w-16.border-t

      network-switcher(:initNetworkName="$route.params.networkName", @change="onNetworkChange")
      
      template(v-if="$route.name === 'network-index'")
        .fixed.z-40.bottom-12.left-0.w-full.sm_static.sm_w-auto.flex-1.flex.justify-center.sm_justify-end.mt-4.sm_mt-0
          sort-dropdown-vue

  section.mt-9
    router-view(v-slot="{ Component }")
      keep-alive
        component(:is="Component")

</template>

<script setup>
import { useRouter } from 'vue-router'
import NetworkSwitcher from '@/components/NetworkSwitcher.vue'
import SortDropdownVue from '@/components/SortDropdown.vue';

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
