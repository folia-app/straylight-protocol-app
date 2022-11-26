<template lang="pug">
.text-accent1.text-md
  .border.border-accent4.rounded-full.flex.leading-none
    //- div.h-8.text-accent2.flex.items-center.pb-1
      .pl-4.pr-3 🗼
    
    button.network-switcher__btn.h-8.rounded-full.bg-accent4.flex.items-center.border.border-accent4.block.pl-6.rounded-full.flex.items-center.pb-1(@click.prevent="menuVisible = !menuVisible")
      //- addr(:address="$store.state.address")
      .whitespace-nowrap.pointer-events-none {{ networkName }}
      svg-chevron-down.w-6.h-6.mx-3.mt-1.pointer-events-none(strokeWidth="1.25")

  .relative(v-if="menuVisible", v-click-outside="onClickOutsideMenu")
    .absolute.top-0.right-2.sm_right-auto.sm_left-0.pt-2
      ul.bg-accent4.rounded-lg.pb-3.whitespace-nowrap.shadow
        .text-xxs.pl-3.pb-1b networks:
        li
          button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('ethereum')") ethereum
        li
          button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('optimism')") optimism
        li(v-show="!testnetsVisible")
          button.block.pl-6.pr-6.rounded-full(@click.prevent="testnetsVisible = true")
            span.opacity-40.mouse_hover_opacity-100.text-xs testnets
        li(v-show="testnetsVisible")
          button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('goerli')")
            span.text-xxs.mr-2.opacity-40 testnet
            | goerli
        li(v-show="testnetsVisible")
          button.block.pl-6.pr-6.rounded-full(@click.prevent="setNetwork('optimism-goerli')")
            span.text-xxs.mr-2.opacity-40 testnet
            | optimism-goerli

</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import store from '@/store'
import SvgChevronDown from '@/components/SvgChevronDown.vue'

const props = defineProps(['initNetworkName'])
const route = useRoute()
const emit = defineEmits(['change'])

const networkName = ref(props.initNetworkName)

const menuVisible = ref(false)
const testnetsVisible = ref(![1,5].includes(store.state.appDefaultNetworkId))

// watch(menuVisible, (visible) => {
//   if (!visible) {
//     testnetsVisible.value = false
//   }
// })

const setNetwork = (val) => {
  networkName.value = val
  menuVisible.value = false
  emit('change', val)
}

const onClickOutsideMenu = (e) => {
  // ignore touches on the button
  if (e.target.classList.value.includes('network-switcher__btn')) {
    return
  }
  menuVisible.value = false
}
</script>
