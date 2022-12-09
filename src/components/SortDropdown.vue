<template lang="pug">
.text-accent2.text-md.flex.flex-col-reverse.sm_flex-col
  .border.border-accent1.rounded-full.flex.leading-none
    //- div.h-8.text-accent2.flex.items-center.pb-1
      .pl-4.pr-3 🗼
    
    button.network-switcher__btn.h-8.rounded-full.bg-accent1.flex.items-center.border.border-accent2.block.pl-6.rounded-full.flex.items-center.pb-1(@click.prevent="menuVisible = !menuVisible")
      //- addr(:address="$store.state.address")
      .whitespace-nowrap.pointer-events-none {{ $route.query.sort }}
      svg-chevron-down.w-6.h-6.mx-3.mt-1.pointer-events-none(strokeWidth="1.25")

  .relative(v-if="menuVisible", v-click-outside="onClickOutsideMenu")
    .absolute.bottom-0.sm_bottom-auto.sm_top-0.right-1.py-2
      ul.bg-accent1.text-accent2.border.rounded-lg.py-3.pb-4.whitespace-nowrap.sm_shadow
        //- .text-xxs.pl-3.pb-1b networks:
        li
          button.block.px-5.rounded-full(@click.prevent="setSort('updated')") updated
        li
          button.block.px-5.rounded-full(@click.prevent="setSort('oldest')") oldest
        li  
          button.block.px-5.rounded-full(@click.prevent="setSort('newest')") newest
        //- li
        //-   button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('ethereum')") ethereum
        //- li
        //-   button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('optimism')") optimism
        //- li(v-show="!testnetsVisible")
        //-   button.block.pl-6.pr-6.rounded-full(@click.prevent="testnetsVisible = true")
        //-     span.opacity-40.mouse_hover_opacity-100.text-xs testnets
        //- li(v-show="testnetsVisible")
        //-   button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('goerli')")
        //-     span.text-xxs.mr-2.opacity-40 testnet
        //-     | goerli
        //- li(v-show="testnetsVisible")
        //-   button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('optimism-goerli')")
        //-     span.text-xxs.mr-2.opacity-40 testnet
        //-     | optimism-goerli

</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '@/store'
import SvgChevronDown from '@/components/SvgChevronDown.vue'

// const props = defineProps(['initNetworkName'])
const route = useRoute()
const router = useRouter()

const menuVisible = ref(false)

const setSort = (val) => {
  menuVisible.value = false
  router.replace({ query: { sort: val }})
}

const onClickOutsideMenu = (e) => {
  // ignore touches on the button
  if (e.target.classList.value.includes('network-switcher__btn')) {
    return
  }
  menuVisible.value = false
}
</script>
