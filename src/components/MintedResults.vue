<template lang="pug">
section.minted-results.flex.flex-col.w-full
  template(v-if="boardCount === undefined")
    p.mt-6.px-6.lg_px-22.text-sm.text-accent3 
      //- (status)
      div(v-if="status", v-html="status")
      //- (loading)
      .animate-pulse(v-else) loading...

  template(v-else-if="boardCount === 0")
    p.mt-6.px-6.lg_px-22.text-sm.text-accent3
      | no worlds found on #[b {{ $route.params.networkName }}] network<br>
      | #[router-link.border-b.border-dashed.mouse_hover_border-solid(:to="{ name: 'mint', query: { network: $route.params.networkName }}") mint one]&nbsp;!
  
  template(v-else)
    .flex-1.w-full.boards-grid
      //- repeat for demo...
      template(v-for="n in 1")

        //- mints...
        //- template(v-for="(mint, i) in mintsFiltered")
        template(v-for="id in boardIdsSorted", :key="id")
          //- board index starts at 1 lol
          //- reverse
          board-thumb(:boardId="id", :network="{ name: $route.params.networkName }", :imgKey="boardsUpdated[id] ?? 0")
            .hidden.mouse_group-hover_block.absolute.overlay.px-2.pt-1.text-xs.leading-tight(style="mix-blend-mode:difference")
              h6 world_{{id}}

    contract-listener.fixed.bottom-0.right-0.z-40(@update="onContractEvent")
</template>

<script>
import { mapState } from 'vuex'
import SvgX from '@/components/SVG-X.vue'
import BoardThumb from '@/components/BoardThumb.vue'
import Observer from '@/components/Observer.vue'
import ContractListener from '@/components/ContractListener.vue'
let contract
export default {
  name: 'MintedResults',
  components: { SvgX, BoardThumb, Observer, ContractListener },
  props: ['boardIdsUpdated', 'sort'],
  data () {
    return {
      status: null,
      boardCount: undefined,
      boardsUpdated: {}
    }
  },
  computed: {
    filters () {
      return this.$route.query.collections?.split(',') || []
    },
    boardIdsSorted () {
      let boardIds = new Array(this.boardCount).fill(0).map((v, i) => (this.boardCount - i).toString())
      if (this.sort === 'updated' && this.boardIdsUpdated?.length) {
        // add updated boards to beginning, then de-dupe
        boardIds = [...this.boardIdsUpdated, ...boardIds]
        boardIds = [...new Set(boardIds)]
      } else if (this.sort === 'oldest') {
        boardIds.reverse()
      }
      return boardIds
    }
  },
  methods: {
    getBoardCount () {
      this.status = null

      this.$store.dispatch('getBoardCount', { network: { name: this.$route.params.networkName }})
        .then(val => {
          this.boardCount = val
        })
        .catch(e => {
          this.status = "error<br>couldn't fetch worlds ☹️<br>try refreshing"
        })
    },
    onContractEvent ({ type, data }) {
      this.$emit('contractEvent')
      
      if (type === 'mint') {
        // see if new board count
        this.getBoardCount()
      }

      // record board updated so board thumb refreshes
      if (this.boardsUpdated[data.boardId]) {
        this.boardsUpdated[data.boardId]++
      } else {
        this.boardsUpdated[data.boardId] = 1
      }
    }
  },
  created () {
    this.getBoardCount()
  }
}
</script>

<style lang="postcss">
</style>
