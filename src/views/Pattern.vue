<template lang="pug">
article.pattern-view
  
  .mt-64.lg_mt-48.flex.w-full.justify-between.flex-row-reverse.px-6.lg_px-12.lg_pl-20
    header.flex-1.pl-12.lg_pl-20
      .relative.z-10.mb-1
        //- back link
        router-link.px-2.text-sm.leading-tight.rounded-lg.bg-accent3.text-accent1.font-bold(:to="{name: 'patterns'}")
          | &larr; PATTERNS
      
      //- nickname
      h1.text-6xl.leading-none.lowercase
        | {{ name }}
      
      //- rule id
      .w-full.mt-2.opacity-40.text-xs.lg_order-2 {{ route.params.pattern }}

      div.mt-18.flex
        //- mint pattern btn
        router-link.border.h-9.flex.items-center.justify-center.pl-4.pr-2.mouse_hover_bg-accent2.mouse_hover_text-black.rounded-full.text-md(:to="{name: 'mint', query: { network: networkName, rule: rule.rule }}")
          .pb-1.lowercase mint {{ rule ? (rule.nickname || '??') : '' }}
          //- div(style="font-size:0.75em;padding:0 0.5em 0.1em;") ꩜
          div(style="font-size:0.75em;padding:0 0.5em 0em;") &rarr;

    //- preview img
    figure.w-1x2.sm_flex-1.border.border-gray-700(style="max-width:360px")
      .aspect-square.flex.items-center.justify-center.relative
        .animate-pulse.text-sm.text-accent2 loading...
        template(v-if="rule.nickname")
          img.absolute.overlay.object-contain.object-center(:src="$store.getters.docsLink(`/_images/turmites/${rule.nickname}_0.png`)")
  
  //- footer
  section.mt-56
    //- (resolve network)
    template(v-if="!networkName")
      network-resolver(@resolved="val => { networkName = val }")
    
    //- (worlds with pattern)
    template(v-else)
      nav.relative.z-10.flex.px-6.lg_pl-20.text-md.justify-center.sm_justify-start.items-center
        .h-9.border.border-accent2.rounded-full.px-7.flex.items-center.justify-center.pb-1.lowercase.bg-accent2.text-accent1
          div worlds with #[b {{ rule ? rule.nickname : '??' }}]

        .flex-1.sm_flex-none.sm_w-16.border-t

        network-switcher(:initNetworkName="networkName", @change="val => { networkName = val }")

      .mt-14
        pattern-worlds(:networkName="networkName", :key="networkName", :rule="rule")

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import rules from '../../contracts/rulesSelected.js'
import PatternThumb from '@/components/PatternThumb.vue'
import NetworkSwitcher from '@/components/NetworkSwitcher.vue'
import NetworkResolver from '@/components/NetworkResolver.vue'
import PatternWorlds from '@/components/PatternWorlds.vue'

const route = useRoute()

const rule = computed(() => {
  const namedRule = rules.find(rule => rule.rule.toLowerCase() === route.params.pattern.toLowerCase())
  const fallback = { rule: route.params.pattern }
  return namedRule || fallback
})

const name = computed(() => rule.value?.nickname || '(untitled)')

// network resolution
const networkName = ref(route.query.network)

</script>