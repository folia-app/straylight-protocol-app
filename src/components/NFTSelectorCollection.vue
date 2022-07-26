<template lang="pug">
  details(v-show="assetsFiltered.length")
    summary.h-24.flex.items-center.justify-center.relative.cursor-pointer
      .flex-1.min-w-0.truncate.px-6.md_text-center
        .inline {{ collectionName }} <sup class="ml-1">{{ assetsFiltered.length }}</sup>

      .md_absolute.top-0.right-0.h-full.flex.items-center.text-xs
        .mr-5.opacity-50
          template(v-if="editionsLeft === undefined") .../88
          template(v-else) {{ 88 - editionsLeft }}/88 #[span.hidden.sm_inline Mints]
          //- | max 88
        svg-chevron-down.mr-8.h-8.w-8.transform(strokeWidth="1")

    //- div.text-center {{ collection.address }}

    ul.w-full.overflow-x-scroll.whitespace-no-wrap.scrollbars-hidden
      //- assets...
      template(v-for="asset in assetsFiltered")
        li.inline-block.px-8.py-7.relative(:class="{'bg-yellow-500': isSelected(asset), 'text-gray-400': isAlreadyMinted(asset), 'mouse_hover_bg-yellow-500': !isAlreadyMinted(asset) }")
          figure.w-48
            .relative.w-full.h-48
              img.absolute.overlay.object-contain.object-left-bottom(:src="asset.image.thumb", :class="{'opacity-25': isAlreadyMinted(asset)}")
              //- (minted label)
              template(v-if="isAlreadyMinted(asset)")
                .absolute.overlay.flex.items-center.justify-center.text-xs.text-black.uppercase.tracking-wide.pt-2 Minted

            //- caption
            figcaption.text-xs
              .w-full.truncate \#{{ asset.tokenId }}
              .w-full.truncate(v-html="asset.name || '&nbsp;'")

          //- (select btn as overlay)
          button.absolute.overlay(@click="$emit('selected', asset)", aria-label="Select NFT", :disabled="isAlreadyMinted(asset)")
</template>

<script>
import SvgChevronDown from '@/components/SvgChevronDown'
export default {
  name: 'NFTSelectorCollection',
  components: { SvgChevronDown },
  props: ['collection'],
  async mounted () {
    this.editionsLeft = await this.$store.dispatch('getEditionsLeft', this.collection.address.toLowerCase())
  },
  data () {
    return {
      editionsLeft: undefined
    }
  },
  computed: {
    collectionName () {
      if (this.collection.name === 'Folia') {
        return 'Emoji Script'
      }
      return this.collection.name
    },
    assetsFiltered () {
      let assets = this.collection.assets || []
      // filter folia's
      if (this.collection.name === 'Folia') {
        assets = assets.filter(asset => {
          const id = Number(asset.tokenId)
          return id >= 2000000 && id <= 2000500
        })
      }
      // filter artblocks curated
      if (this.collection.address === '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270') {
        assets = assets.filter(asset => {
          const id = Number(asset.tokenId)
          const isFidenza = id >= 78000000 && id < 79000000
          const isEndlessNameless = id >= 120000000 && id < 130000000
          const isApparitions = id >= 28000000 && id < 29000000
          const isArchetype = id >= 23000000 && id < 24000000
          const isFragments = id >= 159000000 && id < 160000000
          const isNeophyte = id >= 279000000 && id < 280000000
          const isWindow = id >= 280000000 && id < 281000000
          const isCryptoCitizen = id >= 189000000 && id < 190000000
          return isFidenza || isEndlessNameless || isApparitions || isArchetype || isFragments || isNeophyte || isWindow || isCryptoCitizen
        })
      }
      return assets
    },
    collectionMints () {
      return this.$store.state.mints?.filter(mint => mint.contractAddress === this.collection.address)
    }
  },
  methods: {
    isSelected (asset) {
      return this.selection?.id === asset.id
    },
    isAlreadyMinted (asset) {
      return this.collectionMints?.find(mint => Number(mint.tokenId) === Number(asset.tokenId))
    }
  }
}
</script>

<style scoped lang="postcss">
details[open] summary .transform{
  @apply rotate-180
}

details summary::-webkit-details-marker {
  display:none;
}
</style>
