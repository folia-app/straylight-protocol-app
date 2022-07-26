<template lang="pug">
  <canvas ref="pieChart" :width="size" :height="size"></canvas>
</template>

<script>
// chart.js
import { Chart, ArcElement, PieController, Tooltip, Legend } from 'chart.js'
// Chart.register(PieController, ArcElement, Tooltip)

export default {
  name: 'ChartPieMinted',
  inheritAttrs: false,
  props: {
    dataset: { type: Array, default: undefined },
    mini: { type: Boolean, default: false },
    size: { type: String, default: '100' }
  },
  data () {
    return {
      chart: undefined
    }
  },
  methods: {
    makeChart () {
      // console.log(this.dataset)
      // debugger
      if (!this.dataset) return console.error('Mount with dataset!')

      if (this.mini) {
        Chart.register(PieController, ArcElement)
      } else {
        Chart.register(PieController, ArcElement, Tooltip, Legend)
      }

      const ctx = this.$refs.pieChart.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.dataset.map(contract => contract.label),
          // labels: [
          //   'Red',
          //   'Blue',
          //   'Yellow'
          // ],
          datasets: [{
            label: 'My First Dataset',
            data: this.dataset.map(contract => contract.count),
            // data: [300, 50, 100],
            backgroundColor: this.dataset.map(contract => contract.color),
            // backgroundColor: [
            //   'rgb(255, 99, 132)',
            //   'rgb(54, 162, 235)',
            //   'rgb(255, 205, 86)'
            // ],
            borderWidth: 0
            // hoverOffset: 0
          }]
        }
      })
    }
  },
  mounted () {
    this.makeChart()
  }
}
</script>

<style>
</style>
