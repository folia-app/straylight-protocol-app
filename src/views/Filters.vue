<template lang="pug">
.filters.w-full.relative
  .flex.w-full.overflow-hidden
    //- scrollable column
    .flex-1.h-screen.overflow-y-scroll.scrollbars-hidden.transition.duration-500
      .min-h-screen.flex.flex-col.relative.text-md
        header.h-20.z-20.relative.sticky.top-0.left-0.w-full.flex.w-full.items-center.justify-center.bg-gray-50
          button.w-20.absolute.top-0.left-0.h-full.flex.items-center.justify-center.mouse_hover_bg-black-a08(@click="$emit('close')") &larr;
          h2.uppercase.tracking-wide Filter

        ul.flex-1.flex.flex-col
          //- collections...
          li.h-20.flex.w-full.items-stretch(v-for="(collection, i) in whitelistByNetwork", :class="{'bg-gray-100ff': i % 2 === 0, 'order-first': !isEmptyCollection(collection) }")
            button.block.flex-1.flex.min-w-0.items-stretch.group(@click="toggleFilter(collection)", :disabled="isEmptyCollection(collection)", :class="{'opacity-25': isEmptyCollection(collection)}")
              //- check mark
              .w-20.bg-black-a03.group-hover_bg-gray-200.flex.items-center.justify-center
                .h-3.w-3.rounded-full.bg-gray-400(v-if="isActive(collection)")
              //- label
              .flex-1.px-8.flex.items-center.text-left.min-w-0
                .flex-1.min-w-0.truncate.inline.text-gray-400
                  .inline
                    span.text-black {{ collection[0].split(' by')[0] }}
                    template(v-if="collection[0].split(' by')[1]") &nbsp;by {{ collection[0].split(' by')[1] }}
            //- opensea link
            a.w-24.bg-black-a03ff.flex.items-center.justify-center.text-gray-400.text-sm.mouse_hover_bg-black-a03.mouse_hover_text-black(:href="collection[1]", target="_blank", rel="noopener noreferrer", @click.stop) ↗

        footer.sticky.bottom-0.left-0.w-full.flex.h-28.items-stretch.bg-gray-200.uppercase.text-smm.tracking-wide
          //- apply/close btn
          button.flex-1.flex.items-center.justify-center.mouse_hover_bg-yellow-600(@click="$emit('close')")
            template(v-if="filters.length") View<sup class="ml-1 text-gray-400">{{ filters.length }}</sup>
            template(v-else) Close

          //- (clear btn)
          template(v-if="filters.length")
            button.w-1x2.flex.items-center.justify-center.bg-gray-100.mouse_hover_bg-yellow-600(@click="$router.replace({ query: {}})") Clear

  //- .flex.w-full
    //- scrollable column
    .flex-1.relative.h-screen.overflow-y-scroll.scrollbars-hiddenff.transition.duration-500
      ul.p-10
        h6.font-bold Collections
        li [ ] Mutant Garden Seeder
        li [ ] ...
</template>

<script>
import whitelist from '@/whitelist'
export default {
  name: 'FilterIndex',
  computed: {
    whitelistByNetwork () {
      if (this.$store.state.networkId === 4) {
        return whitelist.filter(collection => collection[3]) // has rinkeby deploy
      }
      return whitelist
    },
    filters () {
      return this.$route.query.collections?.split(',') || []
    },
    networkIndex () {
      return this.$store.state.networkId === 4 ? 3 : 2
    },
    mintedContracts () {
      let contracts = this.$store.state.mints?.map(mint => mint.contractAddress) || []
      contracts = [...new Set(contracts)] // de-dupe
      return contracts
    }
  },
  methods: {
    toggleFilter (collection) {
      const address = collection[this.networkIndex]
      let collections = this.$route.query.collections?.split(',') || []
      // add
      if (this.isActive(collection)) {
        // remove by index
        const index = collections.findIndex(address => address === collection[this.networkIndex])
        if (index > -1) {
          collections.splice(index, 1)
        }
      } else {
        // add
        collections.push(address)
      }
      if (collections.length) {
        collections = collections.join(',')
        this.$router.replace({ query: { collections } })
      } else {
        this.$router.replace({ query: {} })
      }
    },
    isActive (collection) {
      const address = collection[this.networkIndex]
      return (this.$route.query.collections?.split(',') || []).includes(address)
    },
    isEmptyCollection (collection) {
      return !this.mintedContracts.includes(collection[this.networkIndex].toLowerCase())
    }
  }
}
</script>

<style>
</style>
