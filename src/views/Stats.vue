<template lang="pug">
  aside.stats.w-full.h-screen.overflow-y-scroll.scrollbars-hidden
    header.h-20.z-20.relative.sticky.top-0.left-0.w-full.flex.w-full.items-center.justify-center.bg-gray-50
      button.w-20.absolute.top-0.left-0.h-full.flex.items-center.justify-center.mouse_hover_bg-black-a08(@click="$router.go(-1)") &larr;
      h2.uppercase.tracking-wide Stats

    //- (loading)
    template(v-if="!mintedChartDataset")
      .h-20.flex.items-center.px-4.text-center.w-full.justify-center.animate-pulse ...
    //- (chart)
    template(v-else)
      .mt-8.px-2
        chart-pie-minted(:key="chartKey", :dataset="mintedChartDataset", size="100")

    //- .h-screen
    //- .h-screen
</template>

<script>
import { mapGetters } from 'vuex'
import ChartPieMinted from '@/components/ChartPieMinted'
export default {
  name: 'Stats',
  components: { ChartPieMinted },
  computed: {
    ...mapGetters(['mintedChartDataset']),
    chartKey () {
      return this.mintedChartDataset && JSON.stringify(this.mintedChartDataset)
    }
  }
}
</script>

<style>
</style>
