<template lang="pug">
  .chart.sticky.bottom-0.left-0.p-6.lg_p-8.w-full.pointer-events-none(v-if="mintedChartDataset")
    //- mini chart
    router-link.w-24.lg_w-32.block.pointer-events-auto.transform.mouse_hover_scale-105.transition.duration-200.cursor-pointer(to="/stats")
      chart-pie-minted.pointer-events-none(key="0", :dataset="mintedChartDataset", :mini="true", size="100")
</template>

<script>
import { mapGetters } from 'vuex'
import ChartPieMinted from '@/components/ChartPieMinted'
export default {
  name: 'Chart',
  components: { ChartPieMinted },
  computed: {
    ...mapGetters(['mintedChartDataset'])
  }
}
</script>

<style>
</style>
