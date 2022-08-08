<template lang="pug">
section.minted-results.flex.flex-col.w-full
  template(v-if="boardCount === undefined")
    .fixed.z-50.bottom-0.left-0.animate-pulse.text-black.px-6.py-4.text-md Loading...

  template(v-else)
    .flex-1.w-full.grid.grid-cols-2.sm_grid-cols-3.lg_grid-cols-4.xl_grid-cols-5.items-end.bg-black
      template(v-for="n in 128")

        //- mints...
        //- template(v-for="(mint, i) in mintsFiltered")
        template(v-for="n in boardCount")
          //- board index starts at 1 lol
          //- reverse
          board-thumb(:boardId="boardCount - (n - 1)")
            //- mint-thumb.mt-32.text-xs.md_text-md(:mint="mint", :key="mint.newTokenId")

      //- DEMO ITEMS

      //- divider
      //- .col-span-2.sm_col-span-3.lg_col-span-4

      //- demo items...
      //- template(v-for="n in 'ABCDEFGHIJKLMNOPQR'.split('')")
        router-link.relative.group.block.mt-32(:to="'/tokens/' + n")

          img.w-full(:src="`/demo/${n}2.png`")

          //- original
          .absolute.overlay.z-10.transitionff.duration-1000ff.opacity-0.group-hover_opacity-100.bg-black
            img.absolute.overlay.group-hover_animate-pulse2ff(:src="`/demo/${n}1.png`")

    //- credits
    .bg-black.mt-48
      .w-1x2.lg_w-3x4.text-sm.h-20.flex.items-center.px-6.opacity-25.justify-left
        //- | End

    //- filters btn (sticky)
    //- .sticky.z-10.bottom-0.left-0.w-full.pointer-events-none
      //- chart

      .absolute.bottom-0.left-0.w-full.h-20.flex.justify-end
        .w-1x2.lg_w-1x4.flex.overflow-hidden.pointer-events-auto
          //- (filters active)
          template(v-if="filters.length")
            .w-full.flex.items-stretch.bg-yellow-500.relative(to="/filter", @click="$emit('showFilters')")
              //- open filters panel btn
              button.flex.w-full.items-center.justify-center.text-sm.uppercase.tracking-wide.mouse_hover_bg-yellow-600(@click="$emit('showFilters')")
                | Filters<sup class="ml-1 text-gray-400ff">{{ filters.length }}</sup>
              //- clear filters btn
              button.absolute.top-0.right-0.h-full.flex.items-center.w-20.pt-2.text-lg.flex.items-center.justify-center.bg-yellow-500.mouse_hover_bg-yellow-600(@click.stop="$router.replace({ query: {} })")
                svg-x.h-4.w-4(strokeWidth="1.1")

          //- (open filters btn)
          template(v-else)
            button.w-full.flex.items-center.justify-center.bg-gray-800.relative.mouse_hover_bg-yellow-600.mouse_hover_text-black(to="/filter", @click="$emit('showFilters')")
              div.text-sm.uppercase.tracking-wide Filter
              .absolute.top-0.right-0.h-full.flex.items-center.w-20.pt-2.text-lg.flex.items-center.justify-center ⍆

</template>

<script>
import { mapState } from 'vuex'
import SvgX from '@/components/SVG-X.vue'
import BoardThumb from '@/components/BoardThumb.vue'
import Observer from '@/components/Observer.vue'
export default {
  name: 'MintedResults',
  components: { SvgX, BoardThumb, Observer },
  data () {
    return {
      boardCount: undefined
    }
  },
  computed: {
    ...mapState(['mints']),

    filters () {
      return this.$route.query.collections?.split(',') || []
    },

    mintsFiltered () {
      let mints = this.mints
      const filterBy = this.filters.map(addr => addr.toLowerCase())
      if (filterBy.length) {
        mints = mints.filter(mint => filterBy.includes(mint.contractAddress.toLowerCase()))
      }
      return mints
    }
  },
  created () {
    // this.$store.dispatch('getMints', { cached: false })
    this.$store.dispatch('getBoardCount').then(val => { this.boardCount = val })
  }
}
</script>

<style>
</style>
