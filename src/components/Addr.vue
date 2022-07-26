<template lang="pug">
  span.addr {{ name || '...' }}
</template>

<script>
export default {
  name: 'Addr',
  props: {
    address: { type: String, default: undefined },
    short: { type: Boolean, default: true },
    openSeaEnabled: { type: Boolean, default: false }
  },
  computed: {
    name () {
      const profile = this.$store.state.addresses[this.address?.toLowerCase()] || {}

      return profile.ens ? profile.ens
        : profile.openSea && this.openSeaEnabled ? profile.openSea
          : this.short ? this.$store.getters.addrShort(this.address)
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
      return this.address && this.$store.dispatch('resolveAddress', { address: this.address, queryOpenSea: this.openSeaEnabled })
    }
  }
}
</script>

<style>
</style>
