<template lang="pug">
.text-accent1.text-md
  .border.border-accent2.rounded-full.bg-accent2
    button.h-8.flex.items-center.border.border-accent2.block.pl-6.rounded-full.flex.items-center.pb-1(@click.prevent="menuVisible = true")
      //- addr(:address="$store.state.address")
      | {{ networkName }}
      svg-chevron-down.w-6.h-6.mx-3.mt-1(strokeWidth="1")

  .relative(v-if="menuVisible", v-click-outside="() => { menuVisible = false }")
    .absolute.top-0.left-0.pt-2
      ul.bg-accent2.bg-accent2.rounded-lg.pt-1.pb-2.whitespace-nowrap.shadow-2xl
        li
          button.block.px-4.rounded-full.opacity-40(disabled, @click.prevent="setNetwork('ethereum')") ethereum
        li
          button.block.px-4.rounded-full.opacity-40(disabled, @click.prevent="setNetwork('optimism')") optimism
        li(v-show="!testnetsVisible")
          button.block.px-4.rounded-full(@click.prevent="testnetsVisible = true")
            span.opacity-40.mouse_hover_opacity-100 testnets
        li(v-show="testnetsVisible")
          button.block.px-4.rounded-full(@click.prevent="setNetwork('goerli')") testnet - goerli
        li(v-show="testnetsVisible")
          button.block.px-4.rounded-full(@click.prevent="setNetwork('optimism-goerli')") testnet - optimism-goerli

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
</script>
