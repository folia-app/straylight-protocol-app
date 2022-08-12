<template lang="pug">
//- TODO color based on address / account >:)
observer.activity-item-event.flex.justify-between.items-end.w-full.tracking-wide.mb-1(@visible="getInfo", :class="{'text-accent3': props.event.type === 'move', 'text-accent2': props.event.type === 'mint'}")
  //- time
  .w-1x4.lg_w-1x4.text-left.text-xs.flex.pr-2.lg_pr-0(style="min-width:10em")
    .w-3.border-b.opacity-30.mb-1.mr-2
    .pr-2
      template(v-if="localTime") {{ localTime }}
      span.animate-pulse(v-else) block {{ props.event.blockNumber }}
  
    .flex-1.border-b.opacity-30.mb-1
  
  .lg_w-2.border-b.opacity-30.mb-1.mr-3
  //- log
  .pr-2
    
    //- (move)
    template(v-if="props.event.type === 'move'")
      | #[router-link.border.rounded-lg.px-3px.text-smm.mr-1.font-bold.tracking-wider.mouse_hover_bg-accent3.mouse_hover_text-accent1.mouse_hover_border-accent3(v-if="from", :to="'/' + from") #[addr(:address="from", :youOn="true")]]#[span.opacity-40.animate-pulse(v-else) 0x...] moved #[span.relative.inline-block.ml-1 #[span(style="position:relative; filter:grayscale(100%)") 🐜] #[span.absolute.overlay.bg-accent4(style="mix-blend-mode:multiply")]] {{ turmiteName(props.event.tokenId) }}
    //- (mint)
    template(v-else-if="props.event.type === 'mint'")
      | #[router-link.border.rounded-lg.px-3px.text-smm.mr-1.font-bold.tracking-wider.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(v-if="from", :to="'/' + from") #[addr(:address="from", :youOn="true")]]#[span.opacity-40.animate-pulse(v-else) 0x...] minted #[span.relative.inline-block.ml-1 #[span(style="position:relative; filter:grayscale(100%)") ✨] #[span.absolute.overlay.bg-accent4(style="mix-blend-mode:multiply")]] {{ turmiteName(props.event.tokenId) }}

    span.ml-2(v-if="props.includeWorld && props.event.boardId")
      | in #[router-link.ml-1.border.rounded-lg.px-3px.text-smm.mr-1.font-bold.tracking-wider.mouse_hover_bg-accent2.mouse_hover_text-accent1.mouse_hover_border-accent2(:to="{name: 'board', params: { board: props.event.boardId }}") world_{{ event.boardId }}]
  
  .flex-1.border-b.opacity-30.mb-1
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Observer from '@/components/Observer.vue'
import Addr from '@/components/Addr.vue'
import { turmiteName } from '@/utils'

const props = defineProps(['event', 'includeWorld'])

const from = ref()

// time
const timestamp = ref()
const locale = window.navigator.language || 'en-US'
const localTime = computed(() => {
  return timestamp.value && `${new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(timestamp.value * 1000)}`
})

const getInfo = () => {
  if (!timestamp.value) {
    props.event.getBlock()
      .then(block => timestamp.value = new Date(block.timestamp))
      .catch(console.error)  
  }

  if (!from.value) {
    props.event.getReceipt()
      .then(receipt => from.value = receipt.from)
      .catch(console.error)  
  }
}
</script>