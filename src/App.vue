<template lang="pug">
#app.text-base.font-sans.leading-snug

  .min-h-screen.flex.flex-col

    //- HEADER AS INTRO
    header.fixed.top-0.left-0.w-full.z-20.pointer-events-none
      //- top bar
      .flex.flex-wrap.w-full.items-start.relative.z-10
        //- h1.sr-only Straylight Protocol
        
        //- laptop left
        .flex.pointer-events-auto
          //- folia logo link
          a.block.borderff.opacity-30.mouse_hover_opacity-100.mouse_hover_bg-current.rounded-lg(href="https://folia.app", target="_blank", title="folia.app ↗")
            .w-22.h-22.sm_w-20.sm_h-20.flex.items-center.justify-center.text-accent2.mouse_hover_text-black.pb-2.pr-1
              svg-fleuron(style="height:1.3em")

          .h-22.sm_h-20.flex-1.flex.items-center.pb-1b
            //- div <b>Straylight Protocol</b>
            router-link.rounded-lg(:to="$route.params.networkName ? { name: 'network-index', params: { networkName: $route.params.networkName }} : '/'")
              svg-logo.h-12.sm_h-10

        //- laptop right
        nav.sm_h-20.w-full.sm_w-auto.sm_flex-1.flex.justify-end.lg_justify-end.items-center.px-6.md_px-12.leading-none.text-md
          .flex.flex-1.lg_flex-none.pointer-events-auto
            //- border cell
            .w-full.lg_w-auto.flex.justify-evenly.border.rounded-full.border-current.flex.overflow-hiddenff.bg-accent1.text-center
              //- (info btn)
              button.h-8.flex.items-center.justify-center.flex-1.lg_w-auto.lg_px-12.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1.rounded-full(@click="openInfoOverlay")
                | info

              //- mint link
              router-link.h-8.flex.items-center.justify-center.flex-1.lg_w-auto.lg_px-12.lg_-ml-4.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1.rounded-full(to="/mint")
                div mint

              //- (connect btn)
              template(v-if="!$store.state.address")
                button.h-8.flex.items-center.justify-center.flex-1.block.lg_-ml-4.lg_w-auto.lg_px-10.mouse_hover_bg-accent2.mouse_hover_text-black.pb-1.rounded-full(@click="connectWallet") connect

            //- (connected dropdown)
            template(v-if="$store.state.address")
              div.ml-1.text-accent1.text-smm
                .border.border-accent2.rounded-full.bg-accent2
                  button.h-8.flex.items-center.border.border-accent2.block.pl-8.rounded-full.flex.items-center.pb-1(@click="userMenuVisible = true")
                    addr(:address="$store.state.address")
                    svg-chevron-down.w-6.h-6.mx-3.mt-1(strokeWidth="1")

                .relative(v-if="userMenuVisible", v-click-outside="() => { userMenuVisible = false }")
                  .absolute.top-0.right-0.pt-2
                    ul.bg-accent2.bg-accent2.rounded-lg.pt-1.pb-2
                      li
                        router-link.block.px-4.py-1.rounded-full(:to="`/${$store.state.address}`") my profile
                      li
                        button.block.px-4.py-1.rounded-full(@click.stop="disconnectWallet") sign-out

      //- bg gradient
      .sm_hidden.absolute.overlay.bg-gradient-to-b.from-accent1.to-transparent.pointer-events-none(style="height:200%")
            

    //- (info overlay)
    .fixed.pt-36.md_pt-20.z-40.overlay.overflow-y-scroll.scrollbars-hidden(ref="infoEl", :class="{'pointer-events-none': !infoVisible}")
      //- (reveals as background fades in)
      .relative.px-6
        .flex.justify-end.items-start
          //- info card
          .relative.z-10.bg-accent2.text-black.rounded-xl.border-accent2.overflow-hidden(@click.stop, v-show="infoVisible", style="box-shadowff: #f72d8e 0 4px 98px; box-shadow: black 0 4px 98px")
            .px-6.md_px-9.py-9.leading-snug.text-2xl.tracking-wide.w-full(style="max-width:42em")
              p.text-md.mb-em.pb-1
                | #[a.font-bold(href="https://folia.app", target="_blank", rel="noopener noreferrer") #[svg-fleuron.inline-block(style="height:1em;margin-bottom:0.25em;margin-right:0.18em")] #[span.border-b.border-current.border-dashed.hover_border-solid folia]] presents&hellip;<br>
              p
                | #[span.inline-block.border.border-dashed.rounded-xl.px-1 straylight protocol] &mdash; a #[span.info-tag multi-player], #[span.info-tag NFT-based game] by #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid(href="https://twitter.com/brachlandberlin", target="_blank", rel="noopener noreferrer") paul seidler] of #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid(href="https://twitter.com/_terra0", target="_blank", rel="noopener noreferrer") terra0]
              
              p.mt-em the game runs #[span.info-tag entirely on-chain] on the #[span.info-tag ethereum] and #[span.info-tag optimism] networks

              ul.mt-em
                li players mint NFT-#[span.info-tag turmites]
                li there are 4 turmites per #[span.info-tag world]
                li turmites can dig in ~60,000 #[span.info-tag #[router-link(to="/patterns") patterns #[span(style="font-size:0.8em") &rarr;]]]
                li players #[span.info-tag move()] their turmites with just gas
                li the contract #[span.info-tag renders] a new world

              //- p.mt-em dig further, in the #[a.font-bold.border-b.border-current.border-dashed.hover_border-solid wiki]

            footer.mt-em.w-full.grid.grid-cols-2.gap-1.px-3.pb-3
              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(href="https://discord.gg/fdQmZGgXdc", target="_blank", rel="noopener noreferrer")
                | discord #[span.ml-1(style="font-size:0.75em") ↗]
              
              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(:href="$store.getters.docsLink()", target="_blank", rel="noopener noreferrer")
                | docs #[span.ml-1(style="font-size:0.75em") ↗]
              
              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(:href="$store.getters.etherscanLink({ networkName: 'ethereum' })", target="_blank", rel="noopener noreferrer")
                | ethereum contract #[span.ml-1(style="font-size:0.75em") ↗]

              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(:href="$store.getters.etherscanLink({ networkName: 'optimism' })", target="_blank", rel="noopener noreferrer")
                | optimism contract #[span.ml-1(style="font-size:0.75em") ↗]


              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(:href="$store.getters.marketplaceLink({ networkName: 'ethereum' })", target="_blank", rel="noopener noreferrer")
                | opensea #[span.ml-1(style="font-size:0.75em") ↗]

              a.pb-px.text-md.border.rounded-full.flex.items-center.justify-center.mouse_hover_bg-accent1.mouse_hover_text-accent2(:href="$store.getters.marketplaceLink({ networkName: 'optimism' })", target="_blank", rel="noopener noreferrer")
                | quixotic #[span.ml-1(style="font-size:0.75em") ↗]


            //- close btn
            button.absolute.top-0.right-0.w-16.h-16.m-4.border.border-gray-700.rounded-xl.flex.items-center.justify-center.bg-black-a08ff(@click.stop="closeInfoOverlay")
              svg-x.w-5.h-5(strokeWidth="1.15")

        //- scroll off area
        observer#info-scroll-end.pointer-events-none(style="height:133vh", :threshold="0.66", @visible="closeInfoOverlay")

        //- background
        button.block.absolute.overlay.bg-black-a60ff.transition.duration-1000(:class="{'opacity-0 pointer-events-none': !infoVisible}", @click.stop="infoVisible = false", aria-label="Close Info")

    //- main
    main.app_main.flex-1
      router-view(v-slot="{ Component }", :key="$route.path")
        keep-alive(include="Index")
          component(:is="Component")

    //- footer?
  
  //- template(v-if="isWrongNetwork")
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
// import '@/style/_main.css'
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn.vue'
import SvgLogo from '@/components/SvgLogo.vue'
import SvgFleuron from '@/components/SVG-Fleuron.vue'
import SvgX from '@/components/SVG-X.vue'
import Observer from '@/components/Observer.vue'
import Addr from '@/components/Addr.vue'
import SvgChevronDown from '@/components/SvgChevronDown.vue'
export default {
  name: 'App',
  components: { ConnectDisconnectBtn, SvgLogo, SvgFleuron, SvgX, Observer, Addr, SvgChevronDown },
  metaInfo: {
    titleTemplate: (ttl) => {
      return ttl ? `${ttl} :: s̷̰̃t̴̫̊r̶͔̽ả̷̜y̴̼͂l̸̙͛į̸͆g̴̘̎h̷̜̀ṭ̸͂ ̸̰̊p̵̞̅ȑ̴̙ơ̸͍t̶̗̑o̶͂͜ć̵͍ȏ̸͕l̷̗͗` : 's̷̰̃t̴̫̊r̶͔̽ả̷̜y̴̼͂l̸̙͛į̸͆g̴̘̎h̷̜̀ṭ̸͂ ̸̰̊p̵̞̅ȑ̴̙ơ̸͍t̶̗̑o̶͂͜ć̵͍ȏ̸͕l̷̗͗ by Paul Seidler'
    }
  },
  data () {
    return {
      infoVisible: false,
      userMenuVisible: false
    }
  },
  computed: {
    isWrongNetwork () {
      const id = this.$store.state.networkId
      return id && (id !== Number(this.$store.state.appDefaultNetworkId))
    }
  },
  methods: {
    // async switchToAppNetwork () {
    //   try {
    //     if (!window.ethereum) { throw new Error('No provider to change network') }

    //     await window.ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: '0x' + this.$store.state.appDefaultNetworkId }]
    //     })

    //     // reload app
    //     window.location.reload()
    //   } catch (e) {
    //     console.error(e)
    //     alert('Could not switch networks')
    //   }
    // },
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

    async connectWallet () {
      try {
        await this.$store.dispatch('connect')
      } catch (e) {
        console.error(e)
        if (e !== 'Modal closed by user') {
          alert('Error connecting wallet!')
        }
      }
    },

    async disconnectWallet () {
      try {
        await this.$store.dispatch('disconnect')
        this.userMenuVisible = false
      } catch (e) {
        alert("error disconnecting wallet")
      }
    }
  },
  created () {
    this.$store.dispatch('init')
  },
  mounted () {
    // this.$store.dispatch('listenForMints')
    // hide loading overlay
    return document.getElementById('loading')?.remove()
  },
  watch: {
    '$route' () {
      this.userMenuVisible = false
      this.infoVisible = false
    }
  }
}
</script>

<style lang="postcss">
/*@import './style/global';*/
/*@import './style/imports';*/
/*@import './style/variables';*/
/* @import './style/transitions'; */

#app {
  /*font-family: var(--serif);*/
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*font-size:var(--basefont);*/
}

/* #app nav .router-link-active{
  @apply bg-accent2 text-accent1
} */

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
