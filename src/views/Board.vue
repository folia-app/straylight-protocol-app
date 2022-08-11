<template lang="pug">
article.board

  .min-h-screen.flex.flex-col

    //- title row
    header.mt-40.md_mt-24.lg_mt-0.h-20.flex.w-full.items-center.justify-center
      h1 world_{{ boardId }}

    .flex-1.relative.flex.items-center.justify-center.pb-12.lg_pb-24.px-12.md_px-0
      .flex.w-full
        //- (prev board link)
        .hidden.md_flex.w-20.transform.-translate-x-10.mouse_hover_-translate-x-px.transition.duration-100.relative.group
          template(v-if="boardImage && boardId - 1 >= 0")
            router-link.w-full.block.border.border-gray-800(:to="{name: 'board', params: { board: boardId - 1 }}")
              .sr-only prev world
              //- label
              .absolute.top-0.h-full.right-0.transform.translate-x-full.px-6.flex.items-center.text-md.whitespace-nowrap.opacity-0.group-hover_opacity-100.transition.duration-150
                | world_{{ boardId - 1 }}
        
        .flex-1.flex.justify-center.items-center
          //- board image
          img.border.border-gray-700.transition.duration-500(:src="boardImage", :class="{'opacity-0': !boardImage, 'animate-pulse': imgIsLoading}")

        //- (next board link)
        .hidden.md_flex.w-20.transform.translate-x-10.mouse_hover_translate-x-px.transition.duration-100.group
          template(v-if="boardImage && boardId + 1 < boardCount")
            router-link.w-full.block.border.border-gray-800(:to="{name: 'board', params: { board: boardId + 1 }}")
              .sr-only next world
              //- label
              .absolute.top-0.h-full.left-0.transform.-translate-x-full.px-6.flex.items-center.text-md.whitespace-nowrap.opacity-0.group-hover_opacity-100.transition.duration-150
                | world_{{ boardId + 1 }}

    //- turmite list
    ul.lg_sticky.bottom-0.left-0.w-full.pb-1.grid.grid-cols-2.lg_grid-cols-4.items-start.lg_items-end.gap-px
      //- turmites...
      template(v-for="(tokenId, i) in tokenIds")
        turmite-details(:tokenId="tokenId", :label="['W', 'S', 'N', 'E'][i]" @moved="getBoardImage")
      
  board-activity(:boardId="boardId.toString()")

  footer.pt-24.pb-64.lg_pb-36
    nav.flex.text-md.items-center
      .flex-1.flex.justify-center.lg_-mr-28
        template(v-if="boardId - 1 >= 0")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-12.pr-7.flex.items-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId - 1 }}")
            | world_{{ boardId - 1 }}
            .absolute.top-0.left-2.h-full.flex.items-center &larr;

      .flex.justify-center
        router-link.max-w-full.h-8.pb-px.px-8.rounded-full.border.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(to="/")
          | all worlds

      .flex-1.flex.justify-center.lg_-ml-28
        template(v-if="boardId + 1 < boardCount")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-7.pr-12.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId + 1 }}")
            | world_{{ boardId + 1 }}
            .absolute.top-0.right-2.h-full.flex.items-center &rarr;
          
      
</template>

<script>
import Addr from '@/components/Addr.vue'
import TurmiteDetails from '@/components/TurmiteDetails.vue'
import BoardActivity from '@/components/BoardActivity.vue'
export default {
  name: 'NFT',
  components: { Addr, TurmiteDetails, BoardActivity },
  data () {
    return {
      mint: undefined,
      owner: undefined,
      owners: [undefined, undefined, undefined, undefined],
      mintedBy: undefined,
      sourceAsset: undefined,
      imgIsLoading: false,
      boardImage: undefined,
      boardCount: 0,
    }
  },
  computed: {
    boardId () {
      return Number(this.$route.params.board)
    },
    tokenIds () {
      const boardId = Number(this.boardId) * 4
      return [boardId, boardId + 1, boardId + 2, boardId + 3]
    },
  },
  methods: {
    getBoardImage () {
      this.imgIsLoading = true
      this.$store.dispatch('getBoardImage', { id: this.boardId.toString() })
        .then(imgSrc => {
          this.imgIsLoading = false
          this.boardImage = imgSrc
        })
        .catch(e => {
          console.error(e)
          this.imgIsLoading = false
        })
    },
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
    this.getBoardImage()
    this.$store.dispatch('getBoardCount').then(count => { this.boardCount = count })
  }
}
</script>
