<template lang="pug">
  article.work

    .min-h-screen.flex.flex-col

      //- title row
      header.h-20.flex.w-full.items-center.justify-center
        h1 world_{{ boardId }}

      .flex-1.relative.flex.items-center.justify-center.py-24
        //- board image
        img.sm_border.border-gray-800(:src="boardImage", @load="imgLoaded = true", :class="{'opacity-0': !boardImage}")

      //- turmite list
      ul.flex.flex-wrap.items-end.sticky.bottom-0.left-0.w-full.bg-black(style="mix-blend-mode:difference; ")
        template(v-for="(owner, i) in owners", v-if="owner !== null")
          li.px-9.pt-5.pb-5.w-1x2.lg_w-1x4
            div turmite_{{ ['W', 'N', 'S', 'E'][i] }} 
            .pt-6.text-smm
              //- owner
              div
                .inline-block.opacity-33(style="min-width:3.5em") owner
                .inline-block
                  template(v-if="owner === undefined")
                    span.animate-pulse ...
                  template(v-else)
                    addr(:address="owner")
              div
                .inline-block.opacity-33(style="min-width:3.5em") moves
                .inline-block 8

        
    //- (related assets)
    footer
      //- header
      h6.block.w-full.px-6.pt-48.pb-4.text-smm.border-tff
        span.text-gray-400 Activity

        div(style="min-height:50vh")
        //- template(v-if="sourceAsset") {{ sourceAsset.collectionName }}
        //- template(v-else)
          addr(:address="mint && mint.contractAddress")

      .grid.grid-cols-4.items-end(v-if="relatedAssets.length > 0")
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
import Addr from '@/components/Addr'
import BoardImage from '@/components/BoardImage'
import BoardThumb from '@/components/MintThumb'
export default {
  name: 'NFT',
  components: { Addr, BoardImage, BoardThumb },
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
      const boardId = Number(this.boardId) * 4
      const tokenIds = [boardId, boardId + 1, boardId + 2, boardId + 3]
      console.log(tokenIds)
      for (var i = 0; i < tokenIds.length; i++) {
        const index = i
        this.$store.dispatch('getNFTOwnerByTokenId', tokenIds[i])
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
