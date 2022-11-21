<!-- TODO: filter out reprograms... -->
<template lang="pug">
section.pattern-worlds.pb-64.lg_pb-36
  template(v-if="status || worlds === undefined")
    .px-6.lg_px-22.text-sm.text-accent3
        //- (status)
        template(v-if="status")
          div(v-if="status", v-html="status")
          div
            | #[router-link.border-b.border-dashed.mouse_hover_border-solid(v-if="worlds && !worlds.length", :to="{ name: 'mint', query: { network: props.networkName, rule: rule.rule }}") mint one]&nbsp;!
        //- (loading...)
        .animate-pulse(v-else) loading...

  template(v-if="worlds")
    .flex-1.w-full.boards-grid
      //- boards...
      template(v-for="boardId in worlds")
        //- board index starts at 1 lol
        //- reverse
        board-thumb(:boardId="boardId", :network="{ name: props.networkName }")
          .absolute.overlay.px-2.pt-1.text-xs.leading-tight(style="mix-blend-mode:difference")
            h6 world_{{boardId}}

    footer.pt-24
      nav.flex.text-md.items-center
        .flex-1.flex.justify-center.lg_-mr-28
          //- template(v-if="boardId - 1 >= 0")
            router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-12.pr-7.flex.items-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId - 1 }}")
              | world_{{ boardId - 1 }}
              .absolute.top-0.left-2.h-full.flex.items-center &larr;

        .flex.justify-center
          router-link.max-w-full.h-8.pb-px.px-8.rounded-full.border.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'patterns' }")
            | all patterns

        .flex-1.flex.justify-center.lg_-ml-28
          //- template(v-if="boardId + 1 < boardCount")
            router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-7.pr-12.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId + 1 }}")
              | world_{{ boardId + 1 }}
              .absolute.top-0.right-2.h-full.flex.items-center &rarr;
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import BoardThumb from '@/components/BoardThumb.vue'

const props = defineProps(['rule', 'networkName'])

const worlds = ref()
const status = ref(false)

const ruleNickname = computed(() => props.rule.nickname?.toLowerCase() || '??')

const getWorldsWithPattern = async () => {
  try {
    // get mints
    let mints = await store.dispatch('getMints', { network: { name: props.networkName }, cached: true })
    
    // filter mints by pattern
    mints = mints.filter(event => event.rule === props.rule.rule)

    // get ALL reprograms
    let reprograms = await store.dispatch('getReprograms', { network: { name: props.networkName }, cached: true })
    
    // remove mints that were reprogrammed
    let reprogrammedTokens = reprograms.map(r => r.tokenId)
    reprogrammedTokens = [...new Set(reprogrammedTokens)] // de-dupe
    mints = mints.filter(mint => !reprogrammedTokens.includes(mint.tokenId))

    // filter reprograms by pattern
    reprograms = reprograms.filter(event => event.rule === props.rule.rule)

    // merge + sort filtered lists
    const events =  [...mints, ...reprograms]
    events.sort((a, b) => b.blockNumber - a.blockNumber)

    // map as boardIds
    worlds.value = events.map(event => event.boardId.toString())

    if (!worlds.value.length) {
      status.value = `no worlds with <b>${ruleNickname.value}</b> pattern found on <b>${props.networkName}</b> network`
    }
    
    return true
  } catch (e) {
    console.error(e)
    status.value = 'error getting worlds :('
  }
}

getWorldsWithPattern()
</script>