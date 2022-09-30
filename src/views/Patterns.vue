<template lang="pug">
article.patterns-view
  header.mt-56.lg_mt-40.px-6.lg_pl-20
    //- ("YOU")
    //- .relative(v-if="$store.getters.isConnectedAddr(address)")
      .absolute.top-0.left-0.transform.-translate-y-full.pb-2
        .px-1.text-sm.leading-tight.rounded-lg.bg-accent3.text-accent1.font-bold YOU
    
    div
      h1.text-4xl.leading-none
        | patterns

      .text-smm.mt-4.opacity-80ff.text-accent4
        div turmites can move in #[b ~60,000] patterns&mdash;or "#[a.border-b.border-dashed.mouse_hover_border-solid(:href="$store.getters.docsLink('/straylightdocs/Environment.html#rulesets')", target="_blank") rulesets]"<br>here is a selected list of #[b {{ rules.length }}] by the artist
  
  ul.boards-grid.mt-18
    li(v-for="rule in rules")
      //- {{ rule.nickname }}
      pattern-thumb(:rule="rule")
    
</template>

<script setup>
import rules from '../../contracts/rulesSelected.js'
import PatternThumb from '@/components/PatternThumb.vue'
</script>