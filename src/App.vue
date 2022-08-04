<template lang="pug">
  #app.text-base.font-sans.leading-snug

    .min-h-screen.flex.flex-col

      //- HEADER AS INTRO
      header.fixed.top-0.left-0.w-full.z-20
        //- top bar
        .flex.flex-wrap.w-full.items-start
          //- h1.sr-only Straylight Protocol
          
          //- laptop left
          .flex
            //- folia logo link
            a.block.borderff.opacity-33.mouse_hover_opacity-100.mouse_hover_bg-current.rounded-lg(href="https://folia.app", target="_blank", title="folia.app ↗")
              .w-20.h-20.flex.items-center.justify-center.mouse_hover_text-black.pb-2.pr-2
                svg-fleuron(style="height:1.35em")

            .h-20.flex-1.flex.items-center.pb-1b
              //- div <b>Straylight Protocol</b>
              router-link(to="/")
                svg-logo.h-10

          //- laptop right
          nav.sm_h-20.w-full.sm_w-auto.sm_flex-1.flex.justify-end.lg_justify-end.items-center.px-8.md_px-12
            //- border cell
            .w-full.lg_w-auto.flex.justify-evenly.border.rounded-full.border-current.flex.leading-none.overflow-hidden.bg-accent1.text-center
              //- (info btn)
              button.w-1x6.lg_w-auto.lg_px-12.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1b.rounded-full(@click="openInfoOverlay")
                | info

              //- mint link
              router-link.w-1x6.lg_w-auto.lg_px-12.lg_-mx-4.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1b.rounded-full(to="/mint")
                div mint

              div.w-1x6.lg_w-auto.lg_px-10.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1b.rounded-full
                div connect
                //- connect/disconnect btn
                //- connect-disconnect-btn.h-20.shadow-md.relative.z-10(connectLbl="connect", iconWidth="w-20")

              

      //- (info overlay)
      .fixed.pt-36.md_pt-20.z-40.overlay.overflow-y-scroll.scrollbars-hidden(ref="infoEl", :class="{'pointer-events-none': !infoVisible}")
        //- (reveals as background fades in)
        .relative.px-6
          .flex.justify-end.items-start
            //- info card
            .relative.z-10.bg-accent2.text-black.rounded-xl.border-accent2.overflow-hidden(@click.stop, v-show="infoVisible", style="box-shadowff: #f72d8e 0 4px 98px; box-shadow: black 0 4px 98px")
              .px-9.py-9.leading-snug.text-2xl.tracking-wide.w-full(style="max-width:42em")
                p.text-md.mb-em.pb-1
                  | #[a.font-bold(href="https://folia.app", target="_blank", rel="noopener noreferrer") #[svg-fleuron.inline-block(style="height:1em;margin-bottom:0.25em;margin-right:0.18em")] #[span.border-b.border-current.border-dashed.hover_border-solid folia]] presents&hellip;<br>
                p
                  | #[span.inline-block.border.border-dashed.rounded-xl.px-1 straylight protocol] &mdash; a #[span.info-tag multi-player], #[span.info-tag NFT-based game] by #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid(href="https://twitter.com/brachlandberlin", target="_blank", rel="noopener noreferrer") paul seidler] of #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid(href="https://twitter.com/_terra0", target="_blank", rel="noopener noreferrer") terra0]
                
                p.mt-em the game runs #[span.info-tag entirely on-chain] on the #[span.info-tag optimism] ethereum network

                ul.mt-em
                  li players mint up to #[span.info-tag 1024] NFT-"turmites"
                  li turmites dig in one of #[span.info-tag ~800] patterns
                  li each #[span.info-tag world] has #[span.info-tag 4 turmites]
                  li players #[span.info-tag move()] their turmites with just gas
                  li the contract renders a #[span.info-tag new world]

                p.mt-em dig further, in the #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid wiki]

              footer.w-full.grid.grid-cols-2.gap-1.px-3.pb-3
                template(v-if="$store.state.nftContract")
                  a.text-md.border.pb-1b.rounded-full.flex.items-center.justify-center(:href="`${$store.getters.network.explorer.domain}/address/${$store.state.nftContract.address}`", target="_blank", rel="noopener noreferrer")
                    | contract &nbsp;↗

                a.text-md.border.pb-1b.rounded-full.flex.items-center.justify-center(:href="`${$store.getters.openSeaLink({})}/collection/decomposer${ $store.state.networkId === 4 ? '-v2': '' }`", target="_blank", rel="noopener noreferrer")
                  | quixotic &nbsp;↗

                a.text-md.border.pb-1b.rounded-full.flex.items-center.justify-center(href="https://discord.gg/fdQmZGgXdc", target="_blank", rel="noopener noreferrer")
                  | discord &nbsp;↗

                a.text-md.border.pb-1b.rounded-full.flex.items-center.justify-center(href="https://snapshot.org/#/decomposer.eth", target="_blank", rel="noopener noreferrer")
                  | wiki &nbsp;↗

              //- close btn
              button.absolute.top-0.right-0.w-16.h-16.m-4.border.border-gray-700.rounded-xl.flex.items-center.justify-center.bg-black-a08ff(@click.stop="closeInfoOverlay")
                svg-x.w-5.h-5(strokeWidth="1.15")

          //- scroll off area
          observer#info-scroll-end.pointer-events-none(style="height:133vh", :threshold="0.75", @visible="closeInfoOverlay")

          //- background
          button.block.absolute.overlay.bg-black-a60ff.transition.duration-1000(:class="{'opacity-0 pointer-events-none': !infoVisible}", @click.stop="infoVisible = false", aria-label="Close Info")

      //- main
      main.app_main.flex-1
        keep-alive(include="Index")
          router-view(:key="$route.path")

      //- footer?
    
    template(v-if="isWrongNetwork")
      //- .p-8 Oops
      .sticky.z-50.bottom-0.left-0.w-full.p-6.md_p-8.bg-yellow-500.text-black.text-center.-shadow-md.font-sans.text-sm.md_text-base.lg_text-lg
        //- (v-html="'Wrong&nbsp;Network&nbsp;🤖 Please&nbsp;switch&nbsp;to&nbsp;Mainnet'")
        | 🤖 Wrong Network!
        //- .absolute.top-0.right-0.h-full.flex.items-center.px-6.md_p-8
        button.absolute.top-0.right-0.h-full.bg-black-a15.px-8.md_px-12.mouse_hover_bg-black-a30(@click="switchToAppNetwork", style="font-size:0.875em") Switch
</template>

<script>
// import Notifications from './components/Notifications.vue'
// import Status from './components/Status.vue'
import '@/style/_main.css'
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn'
import SvgLogo from '@/components/SvgLogo'
import SvgFleuron from '@/components/SVG-Fleuron'
import SvgX from '@/components/SVG-X'
import Observer from '@/components/Observer'
export default {
  name: 'App',
  components: { ConnectDisconnectBtn, SvgLogo, SvgFleuron, SvgX, Observer },
  metaInfo: {
    titleTemplate: (ttl) => {
      return ttl ? `${ttl} :: s̷̰̃t̴̫̊r̶͔̽ả̷̜y̴̼͂l̸̙͛į̸͆g̴̘̎h̷̜̀ṭ̸͂ ̸̰̊p̵̞̅ȑ̴̙ơ̸͍t̶̗̑o̶͂͜ć̵͍ȏ̸͕l̷̗͗` : 's̷̰̃t̴̫̊r̶͔̽ả̷̜y̴̼͂l̸̙͛į̸͆g̴̘̎h̷̜̀ṭ̸͂ ̸̰̊p̵̞̅ȑ̴̙ơ̸͍t̶̗̑o̶͂͜ć̵͍ȏ̸͕l̷̗͗ by Paul Seidler'
    }
  },
  data () {
    return {
      infoVisible: false
    }
  },
  computed: {
    isWrongNetwork () {
      const id = this.$store.state.networkId
      return id && (id !== Number(this.$store.state.appNetworkId))
    }
  },
  methods: {
    async switchToAppNetwork () {
      try {
        if (!window.ethereum) { throw new Error('No provider to change network') }

        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + this.$store.state.appNetworkId }]
        })

        // reload app
        window.location.reload()
      } catch (e) {
        console.error(e)
        alert('Could not switch networks')
      }
    },
    // info overlay
    async openInfoOverlay () {
      this.infoVisible = true
      await this.$nextTick()
      this.$refs.infoEl.scrollTo(0, 0)
    },
    closeInfoOverlay () {
      this.infoVisible = false
    },
    // end info overlay
  },
  created () {
    this.$store.dispatch('init')
  },
  mounted () {
    // this.$store.dispatch('listenForMints')
    // hide loading overlay
    return document.getElementById('loading')?.remove()
  }
}
</script>

<style lang="postcss">
/*@import './style/global';*/
/*@import './style/imports';*/
/*@import './style/variables';*/
@import './style/transitions';

#app {
  /*font-family: var(--serif);*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*font-size:var(--basefont);*/
}

.app__main{
  transition:transform 500ms;
  transform-origin:top right;
}
.app__main--squished{
  transform:scale(0.0833,1);
}
.app__notifications{
  transition:transform 500ms;
  transform-origin:top left;
}
.app__notifications--squished{
  transform:scale(0,1);
}

@media (--breakpoint-md){
  .app__main.app__main--squished{
    transform:scale(0.5,1);
  }
}
@media (--breakpoint-lg){
  .app__main.app__main--squished{
    transform:scale(0.5833,1);
  }
}

/* web3 modal styling */
#WEB3_CONNECT_MODAL_ID .web3modal-modal-lightbox{
  font-family: var(--ff-sans);
  z-index: 1000;
}

button{
  font-weight: inherit;
  color:inherit;
  letter-spacing: inherit;
}

input{
  appearance:none;
  letter-spacing: inherit;
  line-height: inherit;
  color: inherit;
  background: transparent;
  &::placeholder{
    color:inherit;
  }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
}

.info-tag{
  @apply  inline-block border rounded-xl px-1 text-accent2 bg-accent1
}

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
</style>
