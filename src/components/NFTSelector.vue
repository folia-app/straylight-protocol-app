<template lang="pug">
  section.nft-selector
    //- (loading)
    template(v-if="status")
      .h-24.flex.items-center.justify-center.bg-gray-100(:class="{'animate-pulse': status.includes('...') }")
        | {{ status }}

    //-
    template(v-else)
      //- collections...
      template(v-for="(collection, i) in collections")
        nft-selector-collection.bg-gray-100(:collection="collection", :class="{'bg-gray-200': i % 2 !== 0}", v-on="$listeners")
        //- details.bg-gray-100(:class="{'bg-gray-200': i % 2 !== 0}")
          summary.h-24.flex.items-center.justify-center.relative.cursor-pointer
            | {{ collection.name }} <sup class="ml-1">{{ collection.assets.length }}</sup>
            .absolute.top-0.right-0.h-full.flex.items-center.text-xs
              .mr-5.opacity-50 0/88
              svg-chevron-down.mr-8.h-8.w-8.transform(strokeWidth="1")

          div.text-center {{ collection.address }}
          ul.w-full.overflow-x-scroll.whitespace-no-wrap.scrollbars-hidden
            //- assets...
            li.inline-block.px-8.py-7(v-for="asset in collection.assets", :class="{'bg-yellow-500': isSelected(asset) }")
              figure.w-48
                .relative.w-full.h-48
                  img.absolute.overlay.object-contain.object-left-bottom(:src="asset.image.thumb")
                  //- select button
                  button.absolute.overlay(@click="$emit('selected', asset)", aria-label="Select NFT")

                //- caption
                figcaption.text-xs
                  .w-full.truncate \#{{ asset.tokenId }}
                  .w-full.truncate(v-html="asset.name || '&nbsp;'")
</template>

<script>
import NftSelectorCollection from '@/components/NFTSelectorCollection'
export default {
  name: 'NFTSelector',
  components: { NftSelectorCollection },
  props: ['address', 'selection'],

  created () {
    this.getCollections()
  },

  data () {
    return {
      status: 'Loading...',
      collections: null
    }
  },

  methods: {
    async getCollections () {
      try {
        this.status = 'Loading...'

        // owner (optional as query param)
        const address = this.$route.query.wallet?.toLowerCase() || this.address

        // fetch...
        const assets = await this.$store.dispatch('assets/getWalletAssets', { address })

        // get names
        let collections = assets.map(asset => asset.collection.name)
        // dedupe names
        collections = [...new Set(collections)] // dedupe
        // fill with assets
        collections = collections.map(name => {
          const colAssets = assets
            .filter(asset => asset.collection.name === name)
            .map(asset => ({
              id: asset.collection.name + asset.tokenId,
              ...asset
            }))

          return {
            name,
            address: colAssets[0].collection.address,
            assets: colAssets
          }
        })

        this.collections = collections

        if (!this.collections.length) {
          this.status = 'No elligible NFTs (See INFO)'
        } else {
          this.status = null
        }
      } catch (e) {
        console.error(e)
        this.status = 'Erorr Loading Wallet'
      }
    }
  }
}
</script>
