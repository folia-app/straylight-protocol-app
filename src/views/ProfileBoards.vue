<template lang="pug">
section.profile-worlds
  template(v-if="!props.boards")
    .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 loading...
  
  template(v-else)
    ul.boards-grid
      template(v-for="n in 1")
        li(v-for="board in props.boards")
          board-thumb(:boardId="board.id")
            .absolute.overlay.px-2.pt-1.text-xs.leading-tight(style="mix-blend-mode:difference")
              h6 world_{{board.id}}
              //- div
                | {{ board.tokens.map(id => turmiteName(id)).join(', ') }}
              ul.opacity-40
                li(v-for="id in board.tokens") {{ turmiteName(id) }}
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import BoardThumb from '@/components/BoardThumb.vue'
import { turmiteName } from '@/utils.js'

const props = defineProps(['boards'])
</script>