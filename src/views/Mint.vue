<template lang="pug">
article.pb-64

  //- title row
  header.mt-40.md_mt-24.lg_mt-0.h-20.flex.w-full.items-center.justify-center
    h1.font-bold MINT TURMITE
        
  //- body
  div

    //- preview
    figure.mt-8.mb-12.px-4.flex.justify-center.w-full
      .w-full(style="max-width:300px")
        .aspect-square.border.border-gray-700

    section.w-full.lg_w-1x2.mx-auto
      //- mint count
      .text-right.text-sm.animate-pulse.pb-px.pr-2 {{ mintCount !== undefined ? mintCount : '...' }}/1024 minted
      
      //- steps
      ol.px-px
        //- step: connect
        li.relative.border.rounded-lg.relative.mouse_hover_opacity-100.transition.duration-150(:style="{zIndex: !isConnected ? 4 : 1}")
          .flex.items-center.justify-between
            header.relative.flex.items-center.h-40
              .h-40.w-40.flex.items-center.justify-center.rounded-lg.text-smm 1
              h2.leading-none.pb-2px connect wallet #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]
              //- <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            .pr-20
              .min-w-64.flex.justify-center
                connect-disconnect-btn.text-md.h-8(connectLbl="connect")

        //- step: select turmie
        li.relative.-mt-px.bg-accent1.relative(style="z-index:3")
          .border.rounded-lg(:class="{'opacity-50': !isConnected}")
            .flex.items-center.justify-between
              header.relative.flex.items-center.h-40
                .h-40.w-40.flex.items-center.justify-center.rounded-lg.text-smm 2
                h2.leading-none.pb-2px select turmite pattern #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]

              .pr-20
                selector-rules.w-64(v-model="selection")

            //- div.text-center.lowercase(v-if="selection") {{ selection.nickname || selection.name }}

        //- step: premove?
        li.relative.-mt-px.bg-accent1(style="z-index:2")
          .border.rounded-lg(:class="{'opacity-40': !isConnected}")
            .flex.items-center.justify-between
              header.relative.flex.items-center.h-40
                .h-40.w-40.flex.items-center.justify-center.rounded-lg.text-smm 3
                h2.leading-none.pb-2px move turmite #[span.opacity-50.ml-2(style="font-size:0.8em") &rarr;]

              .pr-20
                .w-64.flex.items-center
                  input.flex-1.text-right.border-b.min-w-0.focus_ring-0.focus_bg-accent2.focus_text-accent1.px-1.focus_rounded-lg(type="number", v-model="premove", min="0", step="1", placeholder="0")
                  div.ml-3.text-sm steps
        //- (selection overlay)
        //- button.absolute.overlay.bg-black-a60(v-if="selection", @click="clearSelection")

        //- (mint step)
        li(:class="{'opacity-30': !isConnected || selection === undefined}")
          //- mint-btn
          button.block.w-full.bg-accent1(@click="mint", :disabled="!isConnected")
            .border.rounded-lg.relative(:class="{'mt-3px bg-accent2 text-accent1 border-none': isConnected, '-mt-px': !isConnected}")
              //-
              .flex.h-40.w-full.items-center.justify-center.uppercase.tracking-wide.relative
                | Mint
              //- (icon)
              .absolute.w-40.h-full.top-0.left-0.flex.items-center.justify-center(v-if="selection") ꩜
              //- price
              .absolute.h-full.pr-20.top-0.right-0.flex.items-center.justify-center.text-xs(v-if="selection") 0.08 ETH

          //- (status)
          template(v-if="status")
            .sticky.bottom-1.left-0.mt-3px.min-h-16.flex.items-center.justify-center.relative.text-smm.font-bold.px-6.py-4.rounded-lg(:class="{'bg-green-400 text-black': status.type === 'success', 'bg-red text-black': status.type === 'error', 'bg-accent3 text-accent1': !status.type, 'animate-pulse': status.msg.includes('...') }")
              //- msg
              span.break-all.text-center(v-html="status.msg")
              //- (success profile link)
              router-link.absolute.overlay(:to="{name: 'profile', params: { address: $store.state.address }}")
                .sr-only Go to your Profile
              
              //- (tx link)
              template(v-if="status.tx")
               a.absolute.top-0.right-0.h-full.px-10.flex.items-center.w-48.justify-center(:href="`${$store.getters.network.explorer.domain}/tx/${status.tx.hash}`", target="_blank", rel="noopener noreferrer").bg-black-a08.rounded-lg
                | Tx#[span(style="font-size:0.85em") ↗]
              
              //- (clear btn)
              button.w-14.flex.items-center.justify-center.absolute.top-0.left-0.h-full(v-if="status.type === 'error'", @click="status = null")
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
export default {
  name: 'MintView',
  components: { ConnectDisconnectBtn, SvgX, SelectorRules },
  data () {
    return {
      selection: undefined,
      premove: 100,
      tx: null,
      status: null,
      myMint: null,
    }
  },

  computed: {
    ...mapState(['mintCount']),
    isConnected () {
      return this.$store.state.address !== undefined
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
        tx = await this.$store.dispatch('mint', { rule, moves })

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

    goToMinted () {
      return this.$router.push({ name: 'token', params: { token: this.myMint.args.newTokenId.toString() } })
    }

    // async getTotalMints () {
    //   this.totalMints = await this.$store.dispatch('getTotalMints')
    // },

    // listenForMints (interval = 3000) {
    //   this.checkMintsTmOut = setTimeout(() => {
    //     this.getTotalMints()
    //     this.listenForMints(interval)
    //   }, interval)
    // }
  },

  created () {
    this.$store.dispatch('getMintCount')
    this.$store.dispatch('getMintPrice')
  },

  mounted () {
    // this.listenForMints(3000)
  },

  watch: {
    isConnected (connected) {
      if (!connected) {
        this.clearSelection()
        this.status = null
      }
    }
  },

  destroyed () {
    clearTimeout(this.checkMintsTmOut)
  }
}
</script>
