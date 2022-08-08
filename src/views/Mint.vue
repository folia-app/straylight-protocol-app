<template lang="pug">
article

  //- title row
  header
    h1.sr-only mint

  .mt-48.md_mt-24
    //- main / left col
    
    .relative
      header.h-20.relative.sticky.top-0.left-0.w-full.flex.w-full.items-center.justify-center
        router-link.w-20.absolute.top-0.left-0.h-full.flex.items-center.justify-center.mouse_hover_bg-black-a08(to="/") &larr;
        h2.font-bold.tracking-wide MINT TURMITE

      //- p.pt-8.px-8.leading-relaxed
        template(v-if="!isConnected") Connect your wallet and switch to
        | {{ !isConnected ? 'Connect your wallet to select an elligible NFT' : 'Select an elligible NFT from your wallet' }} to decompose and mint into a new NFT. You will not lose your original NFT. The new one will be minted into your wallet.

      .mt-3.flex.justify-end
        .h-12.text-xs.px-6.flex.items-center
          span.animate-pulse {{ mintCount !== undefined ? mintCount : '...' }}/1024 Mints

      ol
        //- connect step
        li.relative
          .absolute.z-10.left-0.top-0.h-24.w-24.flex.items-center.justify-center.bg-black-a15 1
          //- step label
          //- .flex.h-24.relative(v-if="$store.state.address")
            .flex.w-full.items-center.justify-center.bg-gray-100ff
              | Connect Wallet
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>

          .flex.h-24.relative
            connect-disconnect-btn.flex-1(connectLbl="CONNECT WALLET", :class="{'bg-accent2 text-accent1': !isConnected}")

        //- select step
        li
          .flex.h-36.relative(:class="{'opacity-50': !isConnected, 'bg-accent3 text-accent1': isConnected && !selection}")
            .absolute.z-10.left-0.top-0.h-full.w-36.flex.items-center.justify-center.bg-black-a15 2
            .flex.w-full.items-center.justify-center.uppercase.tracking-wide Select Turmite Type

          //- (colletions)
          template(v-if="isConnected")
            .flex.justify-center.py-12.w-full
              //- input.border.text-center(v-model="selection", type="number", step="1", min="0", required, placeholder="0")
              select(v-model="selection")
                option(value="ff0801ff0201ff0000000001") spiral
                option(value="ff0800ff0201ff0800000001") cloud
                option(value="ff0801ff0801ff0201000000") fibbonacci
                option(value="ff0201ff0801ff0201000200") worms
                option(value= "000201ff0201ff0801ff0800") burn
                option(value="ff0801000200000800ff0800") ornament
                option(value="ff0001000200ff0801ff0200") fort
                option(value="ff0201000201000201ff0400") snowflake
                option(value= "ff0201000801ff0401000000") storm
                option(value= "ff0201000200ff0801ff0800") brain
                option(value= "ff0201000201ff0400000000") cavetec
                option(value="ff0201000801ff0000000201") moss
                option(value= "ff0201000800ff0200000200") phonk
                option(value= "0xff0201000801ff0000000000") cross
                option(value= "ff0201000800ff0000000000") castle
                option(value= "ff0201000800ff0000000401") spacer
                option(value= "ff0201000800ff0801ff0200") battery
                option(value= "ff0201000800000000ff0001") zersetzung
                option(value= "ff0201000800ff0000000801") chutullu
                option(value="ff0801ff0201ff0000000001") eyes
                option(value= "ff0801ff0201ff0000000000000000") freezer

            div.text-center(v-if="selection") {{ selection }}

        //- (selection overlay)
        //- button.absolute.overlay.bg-black-a60(v-if="selection", @click="clearSelection")

        //- (mint step)
        li.stickyff.z-10.bottom-0.left-0.w-full.border-t
          div(:class="{'opacity-25': !isConnected, 'opacity-75': isConnected && selection === undefined}")
            //- (status)
            template(v-if="status")
              .min-h-14.flex.items-center.justify-center.relative.text-sm.px-6.py-4(:class="{'bg-green-400': status.type === 'success', 'bg-red-duller': status.type === 'error' }")
                //- msg
                span.break-all(:class="{'animate-pulse': status.msg.includes('...') }") {{ status.msg }}
                //- (tx link)
                template(v-if="status.tx")
                 a.absolute.top-0.right-0.h-full.px-10.flex.items-center.w-48.justify-center(:href="`${$store.getters.network.explorer.domain}/tx/${status.tx.hash}`", target="_blank", rel="noopener noreferrer").bg-black-a45
                  | Tx#[span(style="font-size:0.85em") ↗]
                //- (clear btn)
                button.w-14.flex.items-center.justify-center.absolute.top-0.left-0.h-full(v-if="status.type === 'error'", @click="status = null")
                  svg-x.w-3.h-3

            //- (selection)
            .flex.items-center(v-if="selection !== undefined")
              //- thumb
              //- .relative.w-48.h-48
                img.absolute.overlay.object-cover(:src="selection.image.thumb")
              
              //- label
              .flex-1.min-w-0.inline.px-8
                .truncate.opacity-25.text-sm selected: {{ selection }}
                //- .truncate.opacity-25.text-sm {{ selection.collection.name }}
                //- .truncate.font-bold.mt-1
                  .inline {{ selection.name || '#' + selection.tokenId }}

                div.opacity-25ff.text-sm.mt-1.mb-1 0.08 ETH

              //- remove "X" btn
              button.w-48.h-48.flex.items-center.justify-center.mouse_hover_bg-black-a15(@click="clearSelection")
                svg-x.h-5.w-5

            //- (success options)
            template(v-if="status && status.type === 'success'")
              .flex.h-48
                button.w-1x2.flex.items-center.justify-center.bg-gray-100.mouse_hover_bg-gray-200(@click="clearSelection")
                  | Select New ꩜

                button.w-1x2.flex.items-center.justify-center.bg-gray-200.relative(:disabled="!myMint", :class="{'bg-accent3': myMint}", @click="goToMinted")
                  div.animate-pulse(v-if="!myMint") Loading...
                  template(v-else)
                    | View Minted
                    //- icon
                    .absolute.w-24.h-full.top-0.right-0.flex.items-center.justify-center.pt-2 →

            //- (mint btn)
            template(v-else)
              button.block.w-full.relative(:disabled="!selection", :class="{'bg-accent3': selection}", @click="mint")
                //- (step icon)
                .absolute.z-10.left-0.top-0.h-full.w-48.flex.items-center.justify-center.bg-black-a15(v-show="!selection")
                  | 3
                //-
                .flex.h-48.w-full.items-center.justify-center.uppercase.tracking-wide.relative
                  | Mint
                //- (icon)
                .absolute.w-48.h-full.top-0.right-0.flex.items-center.justify-center(v-if="selection") ꩜

</template>

<script>
import { mapState } from 'vuex'
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn.vue'
import SvgX from '@/components/SVG-X.vue'
export default {
  name: 'MintView',
  components: { ConnectDisconnectBtn, SvgX },
  data () {
    return {
      selection: undefined,
      tx: null,
      status: null,
      myMint: null
    }
  },

  computed: {
    ...mapState(['mintCount']),
    isConnected () {
      return this.$store.state.address
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

        const rule = '0x' + this.selection

        // confirm...
        tx = await this.$store.dispatch('mint', { rule })

        // wait for confirmation...
        this.status = { msg: 'Waiting for confirmation...', tx }
        await tx.wait()

        // success
        this.status = { type: 'success', msg: 'Minted!' }
        // find my mint
        // this.myMint = await this.$store.dispatch('findMint', { contract, tokenId })
      } catch (e) {
        console.error(e)
        //
        const msg = 'Error - ' + (e.reason || e.message || e)
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
