<template lang="pug">
//- set height in parent
.connect-disconnect.flex
  //- (connect btn)
  template(v-if="!$store.state.address")
    button.flex.pl-6.pr-2.items-center.rounded-full.mouse_hover_bg-accent2.mouse_hover_text-accent1.rounded-full.border(@click="connectWallet")
      .pb-1 {{ connectLbl }}
      div(style="font-size:0.75em;padding:0 0.5em 0.28em;") ꩜

  //- (connected)
  template(v-else)
    .flex.pl-6
      .flex.items-center
        addr(:address="$store.state.address")
      //- (disconnect btn)
      button.flex.w-8.ml-4.justify-center.items-center.ml-1.mouse_hover_bg-accent2.mouse_hover_text-accent1.rounded-full.border(@click="disconnectWallet", title="Disconnect")
        svg-x.h-3.w-3(strokeWidth="1.1")
</template>

<script>
import Addr from '@/components/Addr.vue'
import SvgX from '@/components/SVG-X.vue'
export default {
  name: 'ConnectDisconnectBtn',
  props: {
    connectLbl: { type: String, default: 'Connect' },
  },
  components: { Addr, SvgX },
  methods: {
    async connectWallet () {
      try {
        await this.$store.dispatch('connect')
      } catch (e) {
        console.error(e)
        if (e !== 'Modal closed by user') {
          alert('Error connecting wallet!')
        }
      }
    },

    disconnectWallet () {
      this.$store.dispatch('disconnect')
    }
  }
}
</script>

<style>
</style>
