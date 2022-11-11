<template lang="pug">
section.profile-worlds  
  template(v-if="!props.boards.length")
    p.text-smm.px-6.lg_pl-22.text-accent3 no #[b turmites] found on #[b {{ $route.params.networkName }}] network
  
  template(v-else)
    ul.boards-grid
      template(v-for="n in 1")
        li(v-for="board in props.boards")
          board-thumb(:boardId="board.id", :network="{ name: $route.params.networkName }")
            .absolute.overlay.px-2.pt-1.text-xs.leading-tight(style="mix-blend-mode:difference")
              h6 world_{{board.id}}
              //- div
                | {{ board.tokens.map(id => turmiteName(id)).join(', ') }}
              ul.opacity-40
                li(v-for="id in board.tokens") {{ turmiteName(id) }}
</template>

<script setup>
import { ref, computed } from 'vue'
import BoardThumb from '@/components/BoardThumb.vue'
import { turmiteName } from '@/utils.js'
import { useRoute } from 'vue-router';

const props = defineProps(['boards'])
const route = useRoute()
</script>