<template lang="pug">
article.patterns-view.pb-64.lg_pb-36
  header.mt-64.lg_mt-48.px-6.lg_pl-20
    h1.text-6xl.leading-none.text-accent3
      | patterns

    .text-smm.mt-4.opacity-80ff.text-accent4
      div turmites can move in #[b ~60,000] patterns&mdash;or "#[a.border-b.border-dashed.mouse_hover_border-solid(:href="$store.getters.docsLink('/Environment.html#rulesets')", target="_blank") rulesets]"<br>here is a selected list of #[b {{ rules.length }}] by the artist
  
  ul.boards-grid.mt-20
    li(v-for="rule in rules")
      //- {{ rule.nickname }}
      pattern-thumb(:rule="rule")
    
</template>

<script setup>
import rules from '../../contracts/rulesSelected.js'
import PatternThumb from '@/components/PatternThumb.vue'
import { useMeta } from 'vue-meta';
import store from '@/store'

useMeta(store.getters.meta({ title: 'patterns' }))
</script>