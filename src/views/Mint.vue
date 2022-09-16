<template lang="pug">
article.pb-64

  //- title row
  header.mt-40.md_mt-24.lg_mt-0
    .h-20.flex.w-full.items-center.justify-center
      h1.font-bold MINT TURMITE

    //- nav.flex.justify-center
      template(v-if="networkName")
        network-switcher(:initNetworkName="networkName")
      template(v-else)
        .h-8.flex.items-center.border.border-accent2.block.pl-6.pr-2.rounded-full.flex.items-center.pb-1.animate-pulse loading...
        
  //- body
  form(@submit.prevent="mint", validate)

    //- preview
    figure.mt-8.mb-12.px-4.flex.justify-center.w-full
      .w-full(style="max-width:300px")
        .aspect-square.border.border-gray-700

    section.w-full.lg_w-1x2.mx-auto
      
      //- steps
      ol.px-px
        //- step: connect
        li.relative.-mt-px.border.rounded-lg.relative.mouse_hover_opacity-100.transition.duration-150(:style="{zIndex: !isConnected ? 4 : 1}")
          .flex.items-center.justify-between
            header.relative.flex.items-center.h-40
              .w-18.md_w-40.flex-shrink-0.flex.items-center.justify-center.rounded-lg.text-smm 1
              h2.leading-none.pb-2px.text-md.sm_text-base select network #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]
              //- <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            .pr-2.sm_pr-20
              .min-w-64.flex.justify-center
                template(v-if="networkName")
                  network-switcher.relative.z-10(:initNetworkName="networkName", @change="val => { networkName = val }")
                template(v-else)
                  .h-8.flex.items-center.border.border-accent2.block.pl-6.pr-2.rounded-full.flex.items-center.pb-1.animate-pulse loading...

          //- mint count
          .absolute.bottom-0.right-0.text-xs.pb-px.pr-2(:class="{'animate-pulse': !networkMintCount }")
            | {{ networkMintCount !== undefined ? networkMintCount : '...' }}/1024 minted
        
        //- step: connect
        li.relative.-mt-px.border.rounded-lg.relative.mouse_hover_opacity-100.transition.duration-150(:style="{zIndexff: !isConnected ? 4 : 1}", :class="{'mb-5': isWrongNetwork || switchError }")
          .flex.items-center.justify-between
            header.relative.flex.items-center.h-40
              .w-18.md_w-40.flex-shrink-0.flex.items-center.justify-center.rounded-lg.text-smm 2
              h2.leading-none.pb-2px.text-md.sm_text-base connect wallet #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]
              //- <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            .pr-2.sm_pr-20
              .min-w-64.flex.justify-center
                connect-disconnect-btn.text-md.h-8(connectLbl="connect")

          //- !! wrong network
          template(v-if="isConnected && isWrongNetwork")
            .min-h-40.flex.relative.text-smm.font-bold.text-accent1(:class="{'bg-accent2': !switchError, 'bg-accent3': switchError}")
                //- msg
                .flex-1.flex.items-center.justify-center.break-all.px-6
                  div(v-if="!switchError")
                    | your wallet is not connected to selected network: #[span.uppercase {{ networkName }}]
                  div(v-else)
                    | couldn't switch to #[span.uppercase {{ networkName }}] - you may need to add it to your wallet first.
                
                //- (cta)
                .relative.w-32.sm_w-48.justify-center.bg-black-a08.rounded-lg
                  template(v-if="!switchError")
                    button.absolute.overlay.flex.items-center.justify-center.rounded-lg(@click.prevent="switchNetwork")
                      | Switch
                      <arrow-path-icon class="ml-3 h-6 w-6 transform scale-110 origin-center"></arrow-path-icon>
                  template(v-else)
                    a.absolute.overlay.flex.items-center.justify-center.rounded-lg(href="https://chainlist.org", target="_blank", rel="noopener noreferrer")
                      | Add #[span.ml-2(style="font-size:0.75em") ↗]

        //- step: select turmite
        li.relative.-mt-px.bg-accent1.relative(style="z-index:3")
          .border.rounded-lg(:class="{'opacity-50': !isConnected || isWrongNetwork}")
            .flex.items-center.justify-between
              header.relative.flex.items-center.h-40
                .w-18.md_w-40.flex-shrink-0.flex.items-center.justify-center.rounded-lg.text-smm 3
                h2.leading-none.pb-2px.text-md.sm_text-base.pr-4 select turmite pattern #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]

              .pr-14.sm_pr-20
                selector-rules.w-64(v-model="selection")

            //- div.text-center.lowercase(v-if="selection") {{ selection.nickname || selection.name }}

        //- step: premove?
        li.relative.-mt-px.bg-accent1(style="z-index:2")
          .border.rounded-lg(:class="{'opacity-40': !isConnected || isWrongNetwork}")
            .flex.items-center.justify-between
              header.relative.flex.items-center.h-40
                .w-18.md_w-40.flex-shrink-0.flex.items-center.justify-center.rounded-lg.text-smm 4
                h2.leading-none.pb-2px.text-md.sm_text-base move turmite #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]

              .pr-4.sm_pr-20
                .w-64.flex.items-center
                  input.flex-1.text-right.border-b.min-w-0.focus_ring-0.focus_bg-accent2.focus_text-accent1.px-1.focus_rounded-lg(type="number", v-model="premove", min="0", step="1", :max="$store.state.movesMax", placeholder="0", required)
                  div.ml-3.text-sm steps
        //- (selection overlay)
        //- button.absolute.overlay.bg-black-a60(v-if="selection", @click="clearSelection")

        //- (mint step)
        li(:class="{'opacity-30': !isConnected || selection === undefined || isWrongNetwork}")
          //- mint-btn
          button.block.w-full.bg-accent1(type="submit", :disabled="!isConnected || isWrongNetwork")
            .border.rounded-lg.relative(:class="{'mt-3px bg-accent2 text-accent1 border-none': isConnected, '-mt-px': !isConnected}")
              //-
              .flex.h-40.w-full.items-center.justify-center.uppercase.tracking-wide.relative
                | Mint
              //- (icon)
              .absolute.w-18.md_w-40.flex-shrink-0.h-full.top-0.left-0.flex.items-center.justify-center(v-if="selection") ꩜
              //- price
              .absolute.h-full.pr-4.sm_pr-20.top-0.right-0.flex.items-center.justify-center.text-xs(v-if="selection")
                | {{ networkMintPrice || '...' }} ETH

          //- (status)
          template(v-if="status")
            .sticky.bottom-1.left-0.mt-3px.min-h-16.flex.items-center.justify-center.relative.text-smm.font-bold.px-6.py-4.rounded-lg(:class="{'bg-green-400 text-black': status.type === 'success', 'bg-red text-black': status.type === 'error', 'bg-accent3 text-accent1': !status.type, 'animate-pulse': status.msg.includes('...') }")
              //- msg
              span.break-all.text-center(v-html="status.msg")
              //- (success profile link)
              router-link.absolute.overlay(:to="{name: 'profile-network__worlds', params: { address: $store.state.address, networkName }}")
                .sr-only Go to your Profile
              
              //- (tx link)
              template(v-if="status.tx")
                a.absolute.top-0.right-0.h-full.flex.items-center.w-32.sm_w-48.justify-center(:href="$store.getters.etherscanLink({ hash: status.tx.hash, networkName })", target="_blank", rel="noopener noreferrer").bg-black-a08.rounded-lg
                  | Tx#[span(style="font-size:0.85em") ↗]
              
              //- (clear btn)
              button.w-14.flex.items-center.justify-center.absolute.top-0.left-0.h-full(v-if="status.type === 'error'", @click.prevent="status = null")
                svg-x.w-3.h-3

              //- icon
              //- .absolute.h-full.top-0.right-12.flex.items-center →

          //- (success options)
          //- template(v-if="status && status.type === 'success'")
            .flex.h-40.mt-4
              //- button.w-1x2.flex.items-center.justify-center.bg-gray-100.mouse_hover_bg-gray-200(@click="clearSelection")
                | Select New ꩜

              button.w-full.flex.items-center.justify-center.bg-gray-200.relative(:disabled="!myMint", :class="{'bg-accent3': myMint}", @click="goToMinted")
                div.animate-pulse(v-if="!myMint") Loading...
                template(v-else)
                  | View Minted
                  //- icon
                  .absolute.w-24.h-full.top-0.right-0.flex.items-center.justify-center.pt-2 →
      
      

</template>

<script>
import { mapState } from 'vuex'
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn.vue'
import SvgX from '@/components/SVG-X.vue'
import SelectorRules from '@/components/SelectorRules.vue'
import store from '@/store'
import NetworkSwitcher from '@/components/NetworkSwitcher.vue'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import { utils } from 'ethers'
export default {
  name: 'MintView',
  components: { ConnectDisconnectBtn, SvgX, SelectorRules, NetworkSwitcher, ArrowPathIcon },
  data () {
    return {
      networkName: undefined,
      networkMintCount: undefined,
      networkMintPrice: undefined,
      switchError: false,
      selection: undefined,
      premove: 1000,
      tx: null,
      status: null,
      myMint: null,
    }
  },

  computed: {
    ...mapState(['mintCount']),
    isConnected () {
      return this.$store.state.address
    },
    isWrongNetwork () {
      const networks = this.$store.state.networks
      const targetNetworkId = Object.keys(networks).find(key => networks[key].name === this.networkName)
      return this.networkName && this.$store.state.givenNetworkId !== Number(targetNetworkId)
    }
  },

  methods: {
    clearSelection () {
      this.selection = undefined
      this.status = null
      this.myMint = null
    },

    async mint () {
      let tx
      try {
        this.myMint = null
        this.status = { msg: 'Confirm transaction in your wallet...' }

        const rule = '0x' + this.selection.rule
        const moves = this.premove

        // confirm...
        tx = await this.$store.dispatch('mint', { rule, moves, network: { name: this.networkName }})

        // wait for confirmation...
        this.status = { msg: 'Waiting for confirmation...', tx }
        const receipt = await tx.wait()

        console.log({ receipt })

        // success
        this.status = { type: 'success', msg: 'Minted! ~ View on your Profile →' }
      } catch (e) {
        console.error(e)
        //
        let msg = 'Error: ' + (e.reason || e.message || e)
        msg += e.data?.message ? '<br>' + e.data.message : ''
        // show error to user
        this.status = { type: 'error', msg }
      }
    },

    async switchNetwork () {
      try {
        this.switchError = false
        await this.$store.dispatch('switchNetwork', { name: this.networkName })
      } catch (e) {
        this.switchError = true
      }
    },

    async getMintPrice () {
      try {
        this.networkMintPrice = undefined
        const wei = await this.$store.dispatch('getMintPrice', { network: { name: this.networkName }})
        this.networkMintPrice = utils.formatEther(wei)
      } catch (e) {
        console.error(e)
      }
    },

    async getMintCount () {
      try {
        this.networkMintCount = undefined
        this.networkMintCount = await this.$store.dispatch('getMintCount', { network: { name: this.networkName }})
      } catch (e) {
        console.error(e)
      }
    },

    onNetworkChange () {
      this.getMintPrice()
      this.getMintCount()
    },

    setInitialNetwork () {
      if (this.$route.query.network) {
        this.networkName = this.$route.query.network
        return
      }
      // lookup...
      this.$store.dispatch('getProvider', {})
        .then(({ provider, chainId }) => {
          const networks = this.$store.state.networks
          let network = networks[Object.keys(networks).find(key => key === chainId.toString())]
          if (network) {
            // supported network
            this.networkName = network.name
          } else {
            this.networkName = networks[this.$store.state.appDefaultNetworkId].name
          }
        })
    }
  },

  created () {  
    this.setInitialNetwork()
  },

  watch: {
    isConnected (connected) {
      if (!connected) {
        this.status = null
        this.switchError = false
      }
    },
    networkName () {
      this.switchError = false
      this.onNetworkChange()
    }
  }
}
</script>
