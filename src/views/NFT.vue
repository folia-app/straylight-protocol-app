<template lang="pug">
  article.work.w-full.relative

    .flex.w-full
      //- main
      .flex-1.relative.h-screen.overflow-y-scroll.scrollbars-hidden.transition.duration-500
        .w-full.grid.grid-cols-1.md_grid-cols-2
          //- left col
          figure.w-full
            mint-image.w-full(:mint="mint")
          //- figure.group.relative.bg-gray-200(:class="{'animate-pulse': imgLoaded === undefined}")
            //- (loading image/error)
            template(v-if="!imgLoaded")
              .pb-full
                .absolute.overlay.p-3.text-lg.text-gray-400.flex.items-center.justify-center(v-if="imgLoaded === false") ⚠︎

            //- image
            template(v-if="mint")
              img.w-full.block(:src="`/api/${$store.state.networkId}/get/${mint.contractAddress}/${mint.tokenId}`", @load="imgLoaded = true", @error="imgLoaded = false")
              //- original
              .absolute.overlay.z-10.transitionff.duration-1000ff.opacity-0.group-hover_opacity-100.bg-gray-100
                img.absolute.overlay.group-hover_animate-pulse2ff(:src="`/api/${$store.state.networkId}/get/original/${mint.contractAddress}/${mint.tokenId}`")

          //- right col
          section.order-first.md_order-none.flex.flex-col.bg-gray-50
            .md_hidden.-mb-4.relative.z-10
              router-link.w-20.h-20.pr-1.flex.items-center.justify-center.mouse_hover_bg-black-a08(to="/") &larr;

            header.p-8.text-gray-400.leading-normal
              .flex.justify-between
                //- name
                h1
                  //- .text-3xs.mb-1 [DECOMPOSED]
                  .text-black Decomposed {{ sourceAsset ? sourceAsset.name : '...' }}
                //- no.
                //- div {{ '#' + $route.params.work }}

              //- collection
              div.mt-3
                span.text-sm from&nbsp;
                template(v-if="mint")
                  a.text-black.border-b.border-gray-300.border-dotted.hover_border_solid(:href="`${$store.getters.openSeaLink({})}/assets/${mint.contractAddress}/${mint.tokenId}`", target="_blank", rel="noopener noreferrer")
                    template(v-if="sourceAsset") {{ sourceAsset.collectionName }}
                    template(v-else)
                      addr(:address="mint.contractAddress")
                  span.ml-2.text-gray-300(style="font-size:0.9em") ↗
                  //- <sup v-if="contractMints">&nbsp;{{ contractMints.length }}</sup>

                template(v-else) ...
                  //- | #[span.text-sm from] #[router-link(to="/").text-black.border-b.border-gray-300.border-dotted.hover_border-solid Mutant Garden Seeder] #[sup.text-xs.text-gray-400 88]

              //- (minted by)
              div(v-if="mintedBy && owner && owner !== mintedBy")
                | #[span.text-sm minter] #[a.border-b.border-gray-300.border-dotted.hover_border-solid(v-if="mintedBy", :href="$store.getters.openSeaLink({ account: mintedBy })", target="_blank", rel="noopener noreferrer") #[addr.text-black(:address="mintedBy", :openSeaEnabled="true")]]#[template(v-else) ...]
                span.ml-2.text-gray-300(style="font-size:0.9em") ↗

              //- (owner)
              div
                | #[span.text-sm owner] #[a.border-b.border-gray-300.border-dotted.hover_border-solid(v-if="owner", :href="$store.getters.openSeaLink({ account: owner })", target="_blank", rel="noopener noreferrer") #[addr.text-black(:address="owner", :openSeaEnabled="true")]]#[template(v-else) ...]
                span.ml-1.text-gray-300(style="font-size:0.9em") ↗

              //- div
                | #[span.text-sm.mt-8.text-gray-400 ID] #[router-link(to="/").border-b.border-gray-300 Mutant Garden Seeder] #[sup.text-xs.text-gray-400 88]
              //- div.text-gray-400.text-sm.mt-8
                div color range: 168
                div rows: 144
                div density: 10
                div ...

            .flex-1

            //- external links
            footer.flex.justify-end.px-8.pt-4.pb-6.md_pb-8.text-xxs.text-gray-300
              //- (looks rare)
              template(v-if="$store.state.nftContract")
                a.hover_text-black(:href="`https://${ $store.state.networkId === 4 ? 'rinkeby.': ''}looksrare.org/collections/${$store.state.nftContract.address}`", target="_blank", rel="noopener noreferrer") LooksRare ↗
              //- opensea
              a.hover_text-black.ml-5(:href="$store.getters.openSeaLink({ token: $route.params.token })", target="_blank", rel="noopener noreferrer") OpenSea ↗

        //- (related assets)
        footer(v-if="relatedAssets.length > 0")
          //- header
          h6.block.w-full.px-6.pt-48.pb-4.text-smm.border-tff.bg-gray-100
            span.text-gray-400 More from&nbsp;
            template(v-if="sourceAsset") {{ sourceAsset.collectionName }}
            template(v-else)
              addr(:address="mint && mint.contractAddress")

          .grid.grid-cols-4.items-end
            //- mints...
            template(v-for="mint in relatedAssets")
              mint-thumb.mt-16.text-xxs(:mint="mint")
              //- router-link.relative.group.block.mt-16(:to="'/tokens/' + mint.newTokenId")
                mint-image(:mint="mint")

                img.w-full(:src="`/api/${$store.state.networkId}/get/${mint.contractAddress}/${mint.tokenId}`")
                //- original
                .absolute.overlay.z-10.transitionff.duration-1000ff.opacity-0.group-hover_opacity-100.bg-gray-100
                  img.absolute.overlay.group-hover_animate-pulse2ff(:src="`/api/${$store.state.networkId}/get/original/${mint.contractAddress}/${mint.tokenId}`")

            //- template(v-for="n in 'ABCDEFGHIJKLMNOPQR'.split('')")
              router-link.relative.group.block.transition.duration-1000(:to="'/works/' + n")

                img.w-full(:src="`/demo/${n}2.png`")

                //- original
                .absolute.overlay.z-10.transition.duration-1000.opacity-0.group-hover_opacity-100
                  img.absolute.overlay.group-hover_animate-pulse2(:src="`/demo/${n}1.png`")

          //- h6.p-8 More from "Collection"
          //- section.grid.grid-cols-4
            template(v-for="n in 88")
              router-link.block.relative.border-b.border-gray-100.hover_bg-gray-300.transition.duration-1000(:to="'/works/' + n", :class="{'bg-gray-50': !(n % 2), 'bg-gray-100': n % 2}")
                .pb-full
                  .absolute.overlay.flex.items-center.justify-center.text-sm.opacity-10 {{ n }}

          .sticky.z-10.bottom-0.left-0.w-full.h-28.flex.text-smm.uppercase.tracking-wide
            router-link.w-1x2.flex.items-center.justify-center.bg-gray-200.relative.mouse_hover_bg-yellow-600(to="/")
              .w-28.h-full.flex.items-center.justify-center.absolute.top-0.left-0.pt-2 &larr;
              div View All
            router-link.w-1x2.flex.items-center.justify-center.bg-gray-300.relative.mouse_hover_bg-yellow-600(to="/mint")
              div Mint New
              .w-28.h-full.flex.items-center.justify-center.absolute.top-0.right-0 ꩜
</template>

<script>
import Addr from '@/components/Addr'
import MintImage from '@/components/MintImage'
import MintThumb from '@/components/MintThumb'
export default {
  name: 'NFT',
  components: { Addr, MintImage, MintThumb },
  created () {
    this.getOwner()
    this.getMint()
  },
  data () {
    return {
      mint: undefined,
      owner: undefined,
      mintedBy: undefined,
      sourceAsset: undefined,
      imgLoaded: undefined
    }
  },
  computed: {
    contractMints () {
      return this.$store.state.mints?.filter(mint => mint.contractAddress === this.mint?.contractAddress)
    },
    relatedAssets () {
      return this.contractMints?.filter(mint => mint.newTokenId !== this.mint?.newTokenId) || []
    }
  },
  methods: {
    async getOwner () {
      this.owner = await this.$store.dispatch('getNFTOwnerByTokenId', this.$route.params.token)
    },
    async getMint () {
      try {
        // const cached = this.$route.params.new ? false : true
        // fetch...
        await this.$store.dispatch('getMints', { cached: false })
        this.mint = this.$store.state.mints.find(mint => mint.newTokenId === this.$route.params.token)

        if (this.mint) {
          // set minted by
          this.mintedBy = (await this.mint.getTx()).from
          // get source asset
          this.sourceAsset = await this.$store.dispatch('assets/getSourceAsset', this.mint)
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  metaInfo () {
    const title = this.sourceAsset ? `Decomposed ${this.sourceAsset.name}` : 'Decomposed ...'
    const descrip = this.sourceAsset ? `from ${this.sourceAsset.collectionName}` : ''
    const networkId = this.$store.state.networkId || 1
    const img = this.$store && this.mint ? `${window.location.origin}/api/${networkId}/get/${this.mint.contractAddress}/${this.mint.tokenId}`
      : undefined

    if (this.mint && this.sourceAsset) {
      setTimeout(() => {
        // console.log('prerender ready', document.querySelector('meta[property="og:image"]'))
        window.prerenderReady = true
      }, 100)
    }

    return {
      title,
      meta: this.$store.getters.meta({ title, descrip, img })
    }
  }
}
</script>

<style>
</style>
