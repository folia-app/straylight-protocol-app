<template lang="pug">
//- set height in parent
.connect-disconnect.flex.text-md
  //- (connect btn)
  template(v-if="!$store.state.address")
    button.h-9.flex.pl-6.pr-2.items-center.rounded-full.mouse_hover_bg-accent2.mouse_hover_text-accent1.rounded-full.border(@click.prevent="connectWallet")
      .pb-1 {{ connectLbl }}
      div(style="font-size:0.75em;padding:0 0.5em 0.28em;") ꩜

  //- (connected)
  template(v-else)
    .h-9.flex.bg-accent2.text-accent1.rounded-full(@click.prevent="menuVisible = true")
      .flex.items-center.pl-6.pb-1
        addr(:address="$store.state.address")
      button.px-5.flex.items-center.justify-center.rounded-full(@click.prevent="disconnectWallet", title="Disconnect")
        svg-x.h-3.w-3(strokeWidth="0.8")
    //- .flex.pl-6
      .flex.items-center
        addr(:address="$store.state.address")
      //- (disconnect btn)
      button.flex.w-8.ml-4.justify-center.items-center.ml-1.mouse_hover_bg-accent2.mouse_hover_text-accent1.rounded-full.border(@click.prevent="disconnectWallet", title="Disconnect")
        svg-x.h-3.w-3(strokeWidth="1.1")
</template>

<script>
import Addr from '@/components/Addr.vue'
import SvgX from '@/components/SVG-X.vue'
export default {
  name: 'ConnectDisconnectBtn',
  props: {
    connectLbl: { type: String, default: 'Connect' },
    networkName: { type: String, default: undefined },
  },
  components: { Addr, SvgX },
  methods: {
    async connectWallet () {
      try {
        await this.$store.dispatch('connect', this.networkName)
        this.$emit('connected')
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
