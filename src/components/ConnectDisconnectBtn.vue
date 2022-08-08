<template lang="pug">
//- set height in parent
.connect-disconnect.flex
  //- (connect btn)
  template(v-if="!$store.state.address")
    button.relative(@click="connectWallet")
      | {{ connectLbl }}
      //- .absolute.top-0.right-0.h-full.flex.items-center.justify-center.pt-2(:class="[iconWidth]") ꩜

  //- (connected)
  template(v-else)
    .relative.w-full.flex.items-center
      .w-full.text-center
        addr(:address="$store.state.address")
      //- (disconnect btn)
      button.absolute.top-0.right-0.h-full.flex.items-center.justify-center.mouse_hover_bg-yellow-600(@click="disconnectWallet", title="Disconnect", :class="[iconWidth]")
        svg-x.h-2.w-2(strokeWidth="1.1")
</template>

<script>
import Addr from '@/components/Addr.vue'
import SvgX from '@/components/SVG-X.vue'
export default {
  name: 'ConnectDisconnectBtn',
  props: {
    connectLbl: { type: String, default: 'Connect' },
    iconWidth: { type: String, default: 'w-24' }
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
