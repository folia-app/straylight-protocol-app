<template lang="pug">
article.board
  .min-h-screen.flex.flex-col

    //- title row
    header.mt-40.sm_mt-24.lg_mt-0.h-16.lg_h-20.flex.w-full.items-center.justify-center
      h1.text-md.sm_text-base #[span.opacity-40 {{$route.params.networkName}}_]world_{{ boardId }}

    .flex-1.relative.px-8.pb-20.md_px-0.lg_pt-20.lg_pb-24.flex.flex-col
      .sm_flex-1.flex.w-full
        //- (prev board link)
        .hidden.sm_flex.w-20.transform.-translate-x-10.mouse_hover_-translate-x-px.transition.duration-100.relative.group
          template(v-if="boardImgSrc && boardId - 1 >= 0")
            router-link.w-full.block.border.border-gray-800(:to="{name: 'board', params: { board: boardId - 1 }}")
              .sr-only prev world
              //- label
              .absolute.top-0.h-full.right-0.transform.translate-x-full.px-6.flex.items-center.text-md.whitespace-nowrap.opacity-0.group-hover_opacity-100.transition.duration-150
                | world_{{ boardId - 1 }}
        
        .flex-1.relative.flex.sm_flex-colff.items-centerff.borderff
          //- contract image (loader + sizer)
          img.sm_absolute.overlay.object-center.object-contain(v-if="boardImgSrc", ref="boardImg", :src="boardImgSrc", :class="{'opacity-0': !boardImgSrc, 'animate-pulse': !boardScale}")
          
          //- p5 board (scales based on <img> .object-contain size)
          .absolute.overlay.flex.justify-center.items-center.transition.duration-150(:class="{'opacity-0': boardScale === undefined || imgIsLoading}")
            board-animates.origin-center.border.border-gray-700(ref="boardAnimator", :tokenIds="tokenIds", :boardId="boardId", :networkName="$route.params.networkName", @rendered="scaleBoard", :previewButton="$refs.previewBtn", :style="{ transform: boardScale ? `scale(${boardScale})` : 'none' }")
              

        //- (next board link)
        .hidden.md_flex.w-20.transform.translate-x-10.mouse_hover_translate-x-px.transition.duration-100.group
          template(v-if="boardImgSrc && boardId + 1 < boardCount")
            router-link.w-full.block.border.border-gray-800(:to="{name: 'board', params: { board: boardId + 1 }}")
              .sr-only next world
              //- label
              .absolute.top-0.h-full.left-0.transform.-translate-x-full.px-6.flex.items-center.text-md.whitespace-nowrap.opacity-0.group-hover_opacity-100.transition.duration-150
                | world_{{ boardId + 1 }}

      //- controls
      //- .flex.justify-center.pt-4(:class="{'opacity-0': !boardScale}")
        button.h-9.rounded-full.pl-5.flex.items-center.justify-center.text-sm.tracking-wide.font-bold(ref="previewBtn", @click="playing = !playing", :class="{'animate-pulse bg-accent3 text-accent1': playing, 'text-accent3': !playing}")
          .pb-1 preview
          .ml-2.mr-2
            play-circle-icon.h-7(v-show="!playing")
            pause-circle-icon.h-7(v-show="playing")

    //- turmite list
    ul.lg_sticky.bottom-0.left-0.w-full.pb-1.grid.grid-cols-2.lg_grid-cols-4.items-start.lg_items-end.gap-px
      //- turmites...
      template(v-for="(tokenId, i) in tokenIds")
        turmite-details(:tokenId="tokenId", :label="['W', 'S', 'N', 'E'][i]" @moved="onTurmiteMoved", :networkName="$route.params.networkName")
      
  board-activity(ref="boardActivityComp", :boardId="boardId.toString()", :networkName="$route.params.networkName", :key="activityFetch")

  footer.pt-24.pb-64.lg_pb-36
    nav.flex.text-md.items-center
      .flex-1.flex.justify-center.lg_-mr-28
        template(v-if="boardId - 1 >= 0")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-12.pr-7.flex.items-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId - 1 }}")
            | world_{{ boardId - 1 }}
            .absolute.top-0.left-2.h-full.flex.items-center &larr;

      .flex.justify-center
        router-link.max-w-full.h-8.pb-px.px-8.rounded-full.border.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{ name: 'network-index', params: { networkName: $route.params.networkName }}")
          | all worlds

      .flex-1.flex.justify-center.lg_-ml-28
        template(v-if="boardId + 1 < boardCount")
          router-link.max-w-full.h-8.pb-px.rounded-full.border.pl-7.pr-12.flex.items-center.justify-center.relative.mouse_hover_bg-accent2.mouse_hover_text-accent1(:to="{name: 'board', params: { board: boardId + 1 }}")
            | world_{{ boardId + 1 }}
            .absolute.top-0.right-2.h-full.flex.items-center &rarr;
          
      
</template>

<script>
import { ref } from 'vue'
import Addr from '@/components/Addr.vue'
import TurmiteDetails from '@/components/TurmiteDetails.vue'
import BoardActivity from '@/components/BoardActivity.vue'
import BoardAnimates from '@/components/BoardAnimates.vue'
import { getImgSizeInfo } from '@/utils.js'
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'
export default {
  name: 'NFT',
  components: { Addr, TurmiteDetails, BoardActivity, BoardAnimates, PlayCircleIcon, PauseCircleIcon },
  data () {
    return {
      mint: undefined,
      owner: undefined,
      owners: [undefined, undefined, undefined, undefined],
      mintedBy: undefined,
      sourceAsset: undefined,
      imgIsLoading: false,
      boardImgSrc: undefined,
      boardCount: 0,
      activityFetch: 0,
      boardScale:0,
      boardSvg: '',
      playing: false,
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
    async getBoardImage () {
      this.imgIsLoading = true
      try {
        // fetch based on network param
        const imgSrc = await this.$store.dispatch('getBoardImage', {
          id: this.boardId.toString(),
          network: { name: this.$route.params.networkName }
        })

        this.imgIsLoading = false
        this.boardImgSrc = imgSrc
        await this.$nextTick()
        // console.log(getImgSizeInfo(this.$refs.boardImg))
        // debugger

        // const div = document.createElement('div')
        // div.innerHTML = atob(imgSrc.split(',')[1])
        // const svg = div.children[0]
        // // svg.setAttribute('preserveAspectRatio', 'none')
        // svg.removeAttribute('width')
        // svg.removeAttribute('height')
        // svg.style.display = 'block'
        // // svg.style.height = '100%'
        // this.boardSvg = svg.outerHTML
        this.listenToImgResize()
      } catch (e) {
        console.error(e)
        this.imgIsLoading = false
      }
      // this.$store.dispatch('getBoardImage', {
      //   id: this.boardId.toString(),
      //   network: { name: this.$route.params.networkName }}
      //   )
      //   .then(imgSrc => {
      //     this.imgIsLoading = false
      //     this.boardImgSrc = imgSrc
      //   })
      //   .catch(e => {
      //     console.error(e)
      //     this.imgIsLoading = false
      //   })
    },
    onTurmiteMoved () {
      this.getBoardImage()
      // update activity list
      this.activityFetch++
    },
    scaleBoard () {
      // const imgW = this.$refs.boardImg.offsetWidth
      const { width } = getImgSizeInfo(this.$refs.boardImg)
      const boardW = this.$refs.boardAnimator.$el.offsetWidth
      requestAnimationFrame(() => {
        this.boardScale = width / boardW  
      })
    },
    listenToImgResize () {
      const ro = new ResizeObserver(entries => {
        // resize board if initialized
        if (this.boardScale) {
          this.scaleBoard()
        }
      });
      ro.observe(this.$refs.boardImg)
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
    this.getBoardImage()
    this.$store.dispatch('getBoardCount', { network: { name: this.$route.params.networkName }})
      .then(count => { this.boardCount = count })
  },
}
</script>
