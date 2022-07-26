<template lang="pug">
  .index

    //- (token viewer overlay)
    //- .fixed.overlay.z-50.transition.transform.duration-700.origin-right.py-5.md_p-10.lg_p-12.xl_p-24.flex.bg-black(:class="{'pointer-events-none scale-x-0ff opacity-0': !viewToken}")
      view-token(:token="$route.params.token", :visible="viewToken", @close="closeViewer")
    //- (token viewer)
    //- .fixed.overlay.z-50.transition.transform.duration-700.origin-right.py-5.md_p-10.lg_p-12.xl_p-24.flex.bg-black(:class="{'pointer-events-none scale-x-0ff opacity-0': !viewToken}")
      view-token(:token="viewToken", @close="closeViewer")

    //- (RIGHT PANEL)
    .fixed.z-20.top-0.right-0.w-full.h-full.pointer-events-none
      .absolute.z-10.top-0.right-0.transition-all.duration-500.transform.origin-right.bg-white.min-h-screen.pointer-events-auto(:class="[panelWidths[1], {'scale-x-0': !panelOpen}]")
        //- panels
        transition-group(name="pagesfade", @before-enter="setPanelWidths")
          //- info(v-show="$route.name === 'info'", key="info")
          filters(v-show="filtersVisible", key="filter", @close="closeFiltersPanel")
          stats(v-if="$route.name === 'stats'", key="stats")
          //- set-view(v-if="$route.name === 'set'", key="set")
          mint-view(v-if="$route.name === 'mint'", key="mint")
          nft-view(v-else-if="$route.name === 'token'", :key="$route.params.token")

      //- (close panel overlay)
      transition(name="fade")
        button.absolute.overlay.bg-black.cursor-pointer.opacity-75.focus_outline-none.pointer-events-auto(v-show="panelOpen", @click="closePanel")

    //- BODY - squishes for video player
    //- .relative.transform.transition-transform.origin-left.duration-700(:class="{'scale-x-0ff': viewToken}")

    //- MAIN
    main.index.relative.min-h-screen.flex.flex-col.transition.duration-500.transform.origin-left(:class="panelOpen ? panelWidths[0] : ''")

      //- HEADER AS INTRO
      header.sticky.left-0.top-0.w-full.flex.flex-col.text-md.z-20
        //- top bar
        .flex.flex-wrap.w-full.items-start
          h1.sr-only Straylight Protocol

          .w-full.lg_w-auto.lg_flex-1.flex.bg-black
            a.w-20.h-20.flex.items-center.justify-center.borderff.pb-2.pr-2.hover_bg-yellow-500(href="https://folia.app", target="_blank")
              svg-fleuron(style="height:1.4em")

            .h-20.flex-1.flex.items-center
              div <b>Straylight Protocol</b>

          //- (info btn)
          button.text-sm.uppercase.h-20.w-1x2.lg_w-1x4.flex.items-center.justify-center.pointer-events-auto.bg-black.mouse_hover_bg-yellow-600(@click="openInfoOverlay")
            | Info

          div.w-1x2.lg_w-1x4.overflow-hidden.text-sm
            //- connect/disconnect btn
            connect-disconnect-btn.h-20.bg-black.shadow-md.relative.z-10(connectLbl="CONNECT", iconWidth="w-20")

            //- mint link
            router-link(to="/mint").text-sm.uppercase.h-20.flex.items-center.justify-center.pointer-events-auto.bg-black.relative.mouse_hover_bg-yellow-600
              div Mint
              .absolute.top-0.right-0.h-full.flex.items-center.w-20.justify-center &rarr;

      //- token grid ====================================

      .flex-1.flex.w-full
        minted-results(@showFilters="openFiltersPanel")

      //- token grid: x-scroll
      //- .overflow-x-scroll.whitespace-no-wrap
        template(v-for="n in 'ABCDEFGHIJKLMNOPQR'.split('')")
          router-link.inline-block.relative.hover_bg-gray-300ff.transition.duration-1000.group(:class="{'bg-gray-50': !(n % 2), 'bg-gray-100': n % 2}", :to="'/works/' + n")

            img.block.h-screen.w-auto(:src="`/demo/${n}2.png`")

            //- original
            //- img.absolute.overlay.z-10.transition.duration-1000.opacity-0.group-hover_opacity-100(:src="`/demo/${n}1.png`")

      //- info
      //- info.w-full.min-h-100vw.sm_min-h-50vw.lg_min-h-33vw(v-show="infoVisible && workDocs.length > 0")

      //- pie chart
      //- chart.z-10

    //- (info overlay)
    .fixed.z-40.overlay.overflow-y-scroll.scrollbars-hidden(ref="infoEl", :class="{'pointer-events-none': !infoVisible}")
      //- (reveals as background fades in)
      .relative
        //- info card
        .relative.z-10.bg-black(@click.stop, v-show="infoVisible")
          .px-10.py-10.leading-normal
            p.pr-10 A new interactive NFT collection by artist #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid(href="http://oliverlaric.com/", target="_blank", rel="noopener noreferrer") Oliver Laric].
            p.mt-em In Decomposer, collectors mint new "decomposed" NFTs from #[b their own collection]. Each pixel will be arranged from lightest to darkest&mdash;creating a stratum of color. The collector #[b retains their original NFT] and the new "decomposed" NFT is minted into their wallet. The script is an interactive adaptation of Laric’s piece from 2007 titled, #[a.border-b.border-current.border-dashed.hover_border-solid(href="http://oliverlaric.com/displacement.htm", target="_blank", rel="noopener noreferrer") „Pixels Rearranged from Lightest to Darkest“].

            p.mt-em At this time, only a <b>selected list</b> of NFT collections may be minted, with a limit of <b>88 mints per collection</b>, and max of <b>888 total mints</b> in the collection:

            .mt-em.relative(:class="{'max-h-56 overflow-hidden': whitelistExcerpted}")
              ul.text-columns-2.md_text-columns-3.lg_text-columns-4.pb-16
                //- whitelist items...
                li(v-for="item in whitelist")
                  template(v-if="item[1]")
                    a(:href="item[1]", target="_blank", rel="noopener")
                     span.border-b.border-dashed.hover_border-solid.border-gray-600 {{ item[0] }}
                     span(style="font-size:0.8em") &nbsp;↗
                  template(v-else)
                    | {{ item[0] }}

              .absolute.bottom-0.left-0.w-full.pointer-events-none
                .h-48(:class="{'bg-gradient-to-b from-transparent to-gray-200': whitelistExcerpted}")
                button.py-1.bg-black.text-xxs.uppercase.tracking-wide.flex.w-full.justify-center.pointer-events-auto(@click="whitelistExcerpted = !whitelistExcerpted")
                  .py-2.px-4.leading-none.rounded-full.border-current.bg-black.hover_bg-gray-400
                    | {{ whitelistExcerpted ? 'MORE' : 'LESS' }}

          footer.flex.w-full.flex-wrap
            template(v-if="$store.state.nftContract")
              a.text-sm.uppercase.h-24.w-1x2.flex.items-center.justify-center.bg-black.mouse_hover_bg-gray-400(:href="`${$store.getters.network.explorer.domain}/address/${$store.state.nftContract.address}`", target="_blank", rel="noopener noreferrer")
                | Contract &nbsp;↗

            a.text-sm.uppercase.h-24.w-1x2.flex.items-center.justify-center.bg-black.mouse_hover_bg-gray-400(:href="`${$store.getters.openSeaLink({})}/collection/decomposer${ $store.state.networkId === 4 ? '-v2': '' }`", target="_blank", rel="noopener noreferrer")
              | OpenSea &nbsp;↗

            a.text-sm.uppercase.h-24.w-1x2.flex.items-center.justify-center.bg-black.mouse_hover_bg-gray-400(href="https://discord.gg/fdQmZGgXdc", target="_blank", rel="noopener noreferrer")
              | Discord &nbsp;↗

            a.text-sm.uppercase.h-24.w-1x2.flex.items-center.justify-center.bg-black.mouse_hover_bg-gray-400(href="https://snapshot.org/#/decomposer.eth", target="_blank", rel="noopener noreferrer")
              | DAO/Snapshot &nbsp;↗

          //- close btn
          button.absolute.top-0.right-0.w-20.h-20.flex.items-center.justify-center.bg-black-a08(@click.stop="closeInfoOverlay")
            svg-x.w-5.h-5(strokeWidth="1.15")

        //- scroll off area
        observer#info-scroll-end.pointer-events-none(style="height:133vh", :threshold="0.75", @visible="closeInfoOverlay")

        //- background
        button.block.absolute.overlay.bg-black-a60.transition.duration-1000(:class="{'opacity-0 pointer-events-none': !infoVisible}", @click.stop="infoVisible = false", aria-label="Close Info")

</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import Logo from '@/components/Logo'
import svgFleuron from '@/components/SVG-Fleuron'
// import Info from '@/components/Info'
// import WorkThumb from '@/components/WorkThumb'
import Btn from '@/components/Btn'
// import WorkView from '@/views/Work'
import MintView from '@/views/Mint'
import NftView from '@/views/NFT'
// import Info from '@/views/Info'
import Filters from '@/views/Filters'
import Stats from '@/views/Stats'

// import ViewToken from '@/views/ViewToken'
// import LandingSlideWork from '@/components/LandingSlideWork'
// import RichText from '@/components/RichText'
// import linkResolver from '@/plugins/prismic/link-resolver'
// import SliceTile from '@/slices/SliceTile'
// import SliceAuctions from '@/slices/SliceAuctions'
// import SliceAnnouncement from '@/slices/SliceAnnouncement'
import Observer from '@/components/Observer'
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn'
import SvgX from '@/components/SVG-X'
import MintedResults from '@/components/MintedResults'
import Chart from '@/components/Chart'

import whitelist from '@/whitelist'
// let lastRt
export default {
  name: 'Index',
  components: { Stats, MintView, NftView, Filters, svgFleuron, Btn, Observer, ConnectDisconnectBtn, SvgX, MintedResults, Chart },
  data () {
    return {
      squish: false,
      infoVisible: false,
      // workPanel: this.$route.name === 'work',
      panelOpen: this.$route.meta.layout === 'panel',
      // current: 0,
      panelWidths: [],
      // carouselTimer: null,
      whitelist,
      whitelistExcerpted: true,
      filtersVisible: false
    }
  },
  computed: {
    ...mapState({
      // home: state => state.prismic.docs.find(doc => doc.type === 'home')?.data,
      // address: state => state.address,
      // doc: state => state.prismic.
      // workDocs: state => state.prismic.works,
      // metadatas: state => state.metadatas
    }),
    ...mapGetters({
      // workDocs: 'prismic/works',
      // workId: 'workId'
    })
    // viewToken () {
    //   // return this.$route.name === 'view-token' ? this.$route.params.token : null
    //   return this.$route.name?.endsWith('-tokenviewer')
    // },
    // carouselEnabled () {
    //   return this.home?.landing.length > 1
    // }
  },
  methods: {
    async openInfoOverlay () {
      this.infoVisible = true
      await this.$nextTick()
      this.$refs.infoEl.scrollTo(0, 0)
    },
    closeInfoOverlay () {
      this.infoVisible = false
    },
    openFiltersPanel () {
      this.filtersVisible = true
      this.openPanel()
    },
    closeFiltersPanel () {
      this.filtersVisible = false
      this.closePanel()
    },

    // ==================
    // linkResolver,
    // next () {
    //   this.current = this.current + 1 === this.workDocs.length ? 0 : this.current + 1
    // },
    // onLogoClick () {
    //   document.getElementById('info').scrollIntoView({ behavior: 'smooth' })
    // },
    // closeViewer () {
    //   return lastRt?.name ? this.$router.go(-1) : this.$router.push('/')
    // },

    setPanelWidths () {
      // [body, work-panel]
      const wide = ['scale-x-5 sm_scale-x-20 lg_scale-x-33', 'w-19x20 sm_w-4x5 lg_w-2x3']
      const narrow = ['scale-x-5 sm_scale-x-20 lg_scale-x-60', 'w-19x20 sm_w-4x5 lg_w-2x5']
      const isNarrow = this.filtersVisible || ['stats'].includes(this.$route.name)
      this.panelWidths = isNarrow ? narrow : wide
    },
    openPanel () {
      this.setPanelWidths()
      this.panelOpen = true
      document.body.style.overflow = 'hidden'
    },
    closePanel () {
      document.body.style.overflow = ''
      this.panelOpen = false
      this.filtersVisible = false
      setTimeout(() => this.setPanelWidths(), 700) // after transition
      if (this.$route.name !== 'index') {
        this.$router.push('/')
      }
    },

    onRoute (to, from) {
      // open panel ?
      if (to.meta.layout === 'panel') {
        this.openPanel()
      }
      // index / no panel ?
      if (to.name === 'index' && (from && from.name !== 'index')) {
        this.closePanel()
      }
    }
  },

  // beforeRouteEnter (to, from, next) {
  //   lastRt = from
  //   next()
  // },

  // beforeRouteUpdate (to, from, next) {
  //   lastRt = from
  //   next()
  // },

  created () {
    // init view
    this.onRoute(this.$route)
  },

  watch: {
    '$route' (to, from) {
      this.onRoute(to, from)
    }
    // workDocs () {
    //   this.setPanelWidths()
    // }
  },

  metaInfo () {
    if (this.$route.name !== 'token') {
      setTimeout(() => {
        // console.log('prerender ready', document.querySelector('meta[property="og:image"]'))
        window.prerenderReady = true
      }, 100)

      return {
        meta: this.$store.getters.meta({})
      }
    }
  }
}
</script>

<style scoped>
@import '../style/variables';

/* info transition */
.y-squish-enter-active,
.y-squish-leave-active{
  transition: transform 1000ms 600ms, max-height 1000ms 600ms;
  transform-origin:top center;
}
.y-squish-enter,
.y-squish-leave-to{
  transform:scale(1,0);
  max-height:0;
}
.y-squish-enter-to,
.y-squish-leave{
  max-height:calc(100vw / 3);
}

@media (--breakpoint-md) {
  /*.index.index--squished{transform:scale(0.25, 1);}*/
  /*.viewer{width:75%;}*/
}

@media (--breakpoint-lg) {
  /*.index.index--squished{transform:scale(0.5, 1);}*/
  /*.viewer{width:50%;}*/
}

.slide-enter-active,
.slide-leave-active{
  transition:transform 500ms;
}
.slide-leave-to,
.slide-enter{
  transform: scale(0,1);
}
.slide-leave-active{
  transform-origin: top left;
}
.slide-enter-active{
  transform-origin: top right;
}
</style>
