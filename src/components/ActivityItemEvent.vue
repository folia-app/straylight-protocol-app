<template lang="pug">
//- TODO color based on address / account >:)
observer.activity-item-event.flex.justify-between.items-end.w-full.tracking-wide.mb-1(@visible="getInfo", :class="{'text-accent3': props.event.type === 'move', 'text-accent2': props.event.type === 'mint', 'text-accent4': props.event.type === 'reprogram'}")
  //- time
  .w-1x4.lg_w-1x4.text-left.text-xs.flex.pr-2.lg_pr-0(style="min-width:10em")
    .w-3.border-b.opacity-30.mb-1.mr-2
    .pr-2
      template(v-if="localTime") {{ localTime }}
      span.animate-pulseff(v-else) #[span.opacity-50 block] {{ props.event.blockNumber }}
  
    .flex-1.border-b.opacity-30.mb-1
  
  .lg_w-2.border-b.opacity-30.mb-1.mr-3
  //- log
  .pr-2
    
    //- (move)
    template(v-if="props.event.type === 'move'")
      | #[router-link.link.mouse_hover_bg-accent3.mouse_hover_text-accent1.mouse_hover_border-accent3(v-if="from", :to="profileRt") #[addr(:address="from", :youOn="true")]]#[span.opacity-40.animate-pulse(v-else-if="!props.fromHidden") 0x...] moved #[span.relative.inline-block.ml-1 #[span(style="position:relative; filter:grayscale(100%)") 🐜] #[span.absolute.overlay.bg-accent3(style="mix-blend-mode:multiply")]] #[router-link.ml-1.link.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(:to="{name: 'board', params: { board: props.event.boardId }}") {{ turmiteName(props.event.tokenId) }}] {{ props.event.moves }} steps
    
    //- (mint)
    template(v-else-if="props.event.type === 'mint'")
      | #[router-link.link.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(v-if="from", :to="profileRt") #[addr(:address="from", :youOn="true")]]#[span.opacity-40.animate-pulse(v-else-if="!props.fromHidden") 0x...] minted #[span.relative.inline-block.ml-1 #[span(style="position:relative; filter:grayscale(100%)") ✨] #[span.absolute.overlay.bg-accent2(style="mix-blend-mode:multiply")]] #[router-link.ml-1.link.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(:to="{name: 'board', params: { board: props.event.boardId }}") {{ turmiteName(props.event.tokenId) }}] as #[router-link.link.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2.lowercase(:to="{name: 'pattern', params: { pattern: props.event.rule }}") {{ ruleName }}]
    
    //- (reprogram)
    template(v-else-if="props.event.type === 'reprogram'")
      | #[router-link.link.mouse_hover_bg-accent4.mouse_hover_text-accent1.mouse_hover_border-accent4(v-if="from", :to="profileRt") #[addr(:address="from", :youOn="true")]]#[span.opacity-40.animate-pulse(v-else-if="!props.fromHidden") 0x...] reprogrammed #[span.relative.inline-block.ml-1 #[span(style="position:relative; filter:grayscale(100%)") 🧠] #[span.absolute.overlay.bg-accent4(style="mix-blend-mode:multiply")]] #[router-link.ml-1.link.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(:to="{name: 'board', params: { board: props.event.boardId }}") {{ turmiteName(props.event.tokenId) }}] to #[router-link.link.mouse_hover_bg-accent4.mouse_hover_text-accent1.mouse_hover_border-accent4.lowercase(:to="{name: 'pattern', params: { pattern: props.event.rule }}") {{ ruleName }}]

  .flex-1.border-b.opacity-30.mb-1
</template>

<script>
  export default {
    inheritAttrs: false
  }
</script>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Observer from '@/components/Observer.vue'
import Addr from '@/components/Addr.vue'
import { turmiteName } from '@/utils'
import rules from '../../contracts/rulesSelected.js'
import { useRoute } from 'vue-router'

const props = defineProps(['event', 'fromHidden'])
const route = useRoute()

const from = ref()
const profileRt = computed(() => from.value && {name: 'profile-network__worlds', params: { address: from.value, networkName: route.params.networkName }})

// time
const timestamp = ref()
const locale = window.navigator.language || 'en-US'
const localTime = computed(() => {
  return timestamp.value && `${new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(timestamp.value * 1000)}`
})

// rule name
const ruleName = computed(() => {
  if (!props.event.rule) return false
  const meta = rules.find(rule => rule.rule === props.event.rule.toLowerCase())
  return meta?.nickname || props.event.rule.slice(0, 4) + '...'
})

const getInfo = () => {
  // if (!timestamp.value) {
  //   props.event.getBlock()
  //     .then(block => timestamp.value = new Date(block.timestamp))
  //     .catch(console.error)  
  // }

  if (!from.value && !props.fromHidden) {
    props.event.getReceipt()
      .then(receipt => from.value = receipt.from)
      .catch(console.error)  
  }
}
</script>

<style scoped>
.link{
  @apply border rounded-lg px-3px text-smm mr-1 font-bold tracking-wider;
}
</style>