<template lang="pug">
article.work

  .min-h-screen.flex.flex-col

    //- title row
    header.mt-48.md_mt-24.lg_mt-0.h-20.flex.w-full.items-center.justify-center
      h1 world_{{ boardId }}

    .flex-1.relative.flex.items-start.sm_items-center.justify-center.pb-8.lg_py-24
      //- board image
      img.border.border-gray-800(:src="boardImage", @load="imgLoaded = true", :class="{'opacity-0': !boardImage}")

    //- turmite list
    ul.flex.flex-wrap.items-end.sticky.bottom-0.left-0.w-full.bg-black(style="mix-blend-mode:difference; ")
      template(v-for="(owner, i) in owners")
        li.px-9.pt-5.pb-5.w-1x2.lg_w-1x4.flex.flex-col
          .flex.pb-4(:class="{'opacity-33': !owner}")
            | turmite_{{ ['W', 'N', 'S', 'E'][i] }}
            .flex.items-center.opacity-33.ml-4(v-if="owner") \#{{tokenIds[i]}} 
            //- #[span.ml-2(style="font-size:0.66em") ↗]
          template(v-if="owner")
            .text-smm
              //- owner
              .h-9.flex.items-center
                .inline-block.opacity-33(style="min-width:3.5em") owner
                .inline-block
                  template(v-if="owner === undefined")
                    span.animate-pulse ...
                  template(v-else)
                    .flex.items-center
                      addr(:address="owner")
                      span.ml-2.opacity-33(style="font-size:0.9em") ↗
              .h-9.flex.items-center
                .inline-block.opacity-33(style="min-width:3.5em") moves
                .inline-block 8
          template(v-else)
            .h-18.flex.items-start
              router-link.w-full.block.border.border-dashed.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.animate-pulse.font-bold.mouse_hover_bg-accent2.mouse_hover_text-accent1.text-md(to="/mint") JOIN / MINT

      
  //- (related assets)
  footer
    //- header
    h6.block.w-full.px-6.pt-48.pb-4.text-smm.border-tff
      span.text-gray-400 Activity

      div(style="min-height:50vh")
      //- template(v-if="sourceAsset") {{ sourceAsset.collectionName }}
      //- template(v-else)
        addr(:address="mint && mint.contractAddress")

    //- .grid.grid-cols-4.items-end(v-if="relatedAssets.length > 0")
      //- mints...
      template(v-for="mint in relatedAssets")
        board-thumb.mt-16.text-xxs(:mint="mint")
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

    //- .sticky.z-10.bottom-0.left-0.w-full.h-28.flex.text-smm.uppercase.tracking-wide
      router-link.w-1x2.flex.items-center.justify-center.bg-gray-200.relative.mouse_hover_bg-yellow-600(to="/")
        .w-28.h-full.flex.items-center.justify-center.absolute.top-0.left-0.pt-2 &larr;
        div View All
      router-link.w-1x2.flex.items-center.justify-center.bg-gray-300.relative.mouse_hover_bg-yellow-600(to="/mint")
        div Mint New
        .w-28.h-full.flex.items-center.justify-center.absolute.top-0.right-0 ꩜
</template>

<script>
import Addr from '@/components/Addr.vue'
export default {
  name: 'NFT',
  components: { Addr },
  created () {
    this.getOwner()
    this.getMint()
  },
  data () {
    return {
      mint: undefined,
      owner: undefined,
      owners: [undefined, undefined, undefined, undefined],
      mintedBy: undefined,
      sourceAsset: undefined,
      imgLoaded: undefined,
      boardImage: undefined
    }
  },
  computed: {
    boardId () {
      return this.$route.params.board
    },
    tokenIds () {
      const boardId = Number(this.boardId) * 4
      return [boardId, boardId + 1, boardId + 2, boardId + 3]
    },
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
    async getOwners () {
      for (var i = 0; i < this.tokenIds.length; i++) {
        const index = i
        this.$store.dispatch('getNFTOwnerByTokenId', this.tokenIds[i])
          .then(owner => this.$set(this.owners, index, owner))
      }
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
    },
    getBoardImage () {
      this.$store.dispatch('getBoardImage', { id: this.boardId.toString() })
        .then(imgSrc => this.boardImage = imgSrc)
    }
  },
  metaInfo () {
    const title = `world_` + this.boardId
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
  },
  created () {
    this.getOwners()
    this.getBoardImage()
  }
}
</script>

<style>
</style>
