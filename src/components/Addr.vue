<template lang="pug">
span.addr(:class="{'addr--is-you': isYou}") {{ name || '...' }}
</template>

<script>
import { utils } from 'ethers'
export default {
  name: 'Addr',
  props: {
    address: { type: String, default: undefined },
    short: { type: Boolean, default: true },
    openSeaEnabled: { type: Boolean, default: false },
    youOn: { type: Boolean, default: false },
  },
  computed: {
    isYou () {
      return this.address?.toLowerCase() === this.$store.state.address?.toLowerCase()
    },
    name () {
      const profile = this.$store.state.addresses[this.address?.toLowerCase()] || {}

      return this.youOn && this.isYou ? 'YOU'
        : profile.ens ? profile.ens
          : profile.openSea && this.openSeaEnabled ? profile.openSea
            : this.short && utils.isAddress(this.address) ? this.$store.getters.addrShort(this.address)
              : this.address
    }
  },
  mounted () {
    this.resolveAddress()
  },
  watch: {
    address () {
      this.resolveAddress()
    }
  },
  methods: {
    resolveAddress () {
      // save a lookup if "You"
      if (this.isYou && this.youOn) return

      if (this.address) {
        if (this.address.endsWith('.eth')) {
          // get address of ens
          this.$store.dispatch('resolveENS', this.address)
        } else if (utils.isAddress(this.address)) {
          // get ens
          this.$store.dispatch('resolveAddress', { address: this.address, queryOpenSea: this.openSeaEnabled })
        } else {
          console.warn(`${this.address} is not a valid ETH address or ENS name`)
        }
      }
    }
  }
}
</script>

<style>
</style>
