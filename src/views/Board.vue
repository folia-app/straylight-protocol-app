<template lang="pug">
article.board
  .min-h-screen.flex.flex-col

    //- title row
    header.mt-40.sm_mt-24.lg_mt-0.h-16.lg_h-20.flex.w-full.items-center.justify-center
      h1.text-md.sm_text-base.group #[router-link.opacity-40.mouse_hover_opacity-100(:to="{name: 'network-index', params: { networkName: $route.params.networkName }}") {{$route.params.networkName}}_]#[span.group-hover_opacity-40 world_{{ boardId }}]

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
            board-animates.origin-center.border.border-gray-700(ref="boardAnimator", :tokenIds="tokenIds", :boardId="boardId", :networkName="$route.params.networkName", @rendered="onBoardRender", :previewButton="$refs.previewBtn", :style="{ transform: boardScale ? `scale(${boardScale})` : 'none' }", :boardKey="boardKey")

            //- controls, below board
            .absolute.bottom-0.left-0.w-full(v-show="controlsVisible")
              .absolute.top-0.left-0.w-full.flex.justify-center
                //- container matches imgW dynamically
                .w-full.flex.justify-between.items-center.leading-none.text-smm.font-bold.tracking-wide.text-accent3.pt-2(:style="{ maxWidth: controlsMaxW }")
                  .flex.items-center
                    //- simulate btn
                    button.rounded-full.flex.items-center.pr-3.pl-1.-ml-1.justify-center(ref="previewBtn", @click="toggleBoardSimulation", :class="{'animate-pulse': playing}")
                      .mr-2
                        play-circle-icon.h-8(v-show="!playing")
                        pause-circle-icon.h-8(v-show="playing")
                      div {{ playing ? 'simulating' : 'simulate' }}
                    //- divider
                    div.h-px.w-6.bg-current.mt-1.opacity-50
                    //- selector
                    listbox(v-model="simulateSelection")
                      .relative
                        listbox-button.flex.items-center.px-3.rounded-full.pb-1ff
                          .flex.items-end.leading-none
                            .mr-2.mb-2px(v-if="typeof simulateSelection.value === 'number'", :style="{width:'0.9rem', height:'0.9rem', background: colors[tokenIds.indexOf(simulateSelection.value)]}")
                            | {{ simulateSelection.label }}
                          svg-chevron-down.w-5.h-5.ml-2.mt-1.opacity-50(strokeWidth="2")
                        listbox-options(class="absolute z-30 mt-2 min-w-12 rounded-lg bg-accent3 text-black py-1 shadow focus_outline-none")
                          //- options...
                          listbox-option(v-for="(option, index) in simulateSelectorOptions", v-slot="{ active, selected }", :key="option.value" :value="option")
                            li.pl-3.pr-6.py-1.flex.items-end.leading-none(:class="{'bg-gray-900/60 text-accent3': selected, 'bg-gray-900/90 text-accent3': active}")
                              .mr-3.mb-2px(:style="{width:'0.9rem', height:'0.9rem', background: colors[index - 1]}")
                              | {{ option.label }}
              
                  .flex
                    | {{stepCount}}
                    button.px-3.-mr-3.rounded-full.flex.items-center.justify-center(@click="resetBoard", v-show="resetBtnVisible")
                      arrow-path-icon(class="h-6 w-6 transform scale-110 origin-center")

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
        turmite-details(:tokenId="tokenId", :tokenIndex="i", @moved="onTurmiteMoved", :networkName="$route.params.networkName", @preview="previewTurmite", @moveFormOpened="onMoveFormVisible", @reprogrammed="onTurmiteReprogrammed")
      
  board-activity(ref="boardActivityComp", :boardId="boardId.toString()", :networkName="$route.params.networkName", :key="activityFetch", :cached="activityFetch === 0")

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
import Addr from '@/components/Addr.vue'
import TurmiteDetails from '@/components/TurmiteDetails.vue'
import BoardActivity from '@/components/BoardActivity.vue'
import BoardAnimates from '@/components/BoardAnimates.vue'
import { getImgSizeInfo } from '@/utils.js'
import { PlayCircleIcon, PauseCircleIcon } from '@heroicons/vue/24/solid'
import SvgChevronDown from '@/components/SvgChevronDown.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { turmiteName } from '@/utils.js'
import colors from '@/colors'

export default {
  name: 'Board',
  components: { Addr, TurmiteDetails, BoardActivity, BoardAnimates, PlayCircleIcon, PauseCircleIcon, SvgChevronDown, Listbox, ListboxButton, ListboxOptions, ListboxOption, ArrowPathIcon },
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
      controlsMaxW: 'auto',
      controlsVisible: false,
      resetBtnVisible: false,
      boardKey: 0,
      myp5: null,
      simulateSelection: undefined,
      colors,
      stepCount: 0,
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
    simulateSelectorOptions () {
      const values = ['all', ...this.tokenIds]
      return values.map((value, i) => ({
        label: !i ? 'all' : turmiteName(value),
        value
      }))
    }
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
      this.resetBoard()
    },
    onTurmiteReprogrammed () {
      this.activityFetch++
    },
    scaleBoard () {
      if (!this.$refs.boardImg) {
        return
      }
      // const imgW = this.$refs.boardImg.offsetWidth
      const { width } = getImgSizeInfo(this.$refs.boardImg)
      const boardW = this.$refs.boardAnimator.$el.offsetWidth
      requestAnimationFrame(() => {
        this.boardScale = width / boardW  
        this.controlsMaxW = width + 'px'
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
    },
    onBoardRender (myp5) {
      console.log('RENDER', this.boardKey)
      this.myp5 = myp5
      this.scaleBoard()
      this.controlsVisible = true
    },
    toggleBoardSimulation () {
      if (this.myp5) {
        this.resetBtnVisible = true  
        this.myp5.myMethods.togglePlayback()
        this.playing = this.myp5.isLooping()
      }
    },
    async resetBoard () {
      this.myp5.myMethods.restart()
      this.stepCount = this.myp5.myMethods.getStepCount()
      this.playing = false
      this.resetBtnVisible = false
    },
    onMoveFormVisible () {
      // reset board so can properly preview
      if (this.resetBtnVisible) {
        this.resetBoard()
      }
    },
    previewTurmite ({ tokenId, moveQty }) {
      if (this.resetBtnVisible) {
        this.resetBoard()
      }
      this.myp5.myMethods.simulateSteps({ turmiteId: tokenId, steps: moveQty })
      this.resetBtnVisible = true
    }
  },
  watch: {
    simulateSelection ({ value }) {
      return this.myp5?.myMethods.changeTurmiteSelection(value)
    },
    playing (playing) {
      const track = () => {
        this.stepCount = this.myp5.myMethods.getStepCount()
        this.stepCountAnim = requestAnimationFrame(track)
      }
      if (playing && this.myp5) {
        this.stepCountAnim = requestAnimationFrame(track)
      } else {
        cancelAnimationFrame(this.stepCountAnim)
      }
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

    this.simulateSelection = this.simulateSelectorOptions[0]
  },
}
</script>
