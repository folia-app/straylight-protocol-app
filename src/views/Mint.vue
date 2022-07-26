<template lang="pug">
  aside.shred.w-full.relative

    .flex.w-full.overflow-hidden
      //- main / left col
      .flex-1.h-screen.overflow-y-scroll.scrollbars-hidden.transition.duration-500
        .relative
          header.h-20.z-20.relative.sticky.top-0.left-0.w-full.flex.w-full.items-center.justify-center.bg-gray-100
            router-link.w-20.absolute.top-0.left-0.h-full.flex.items-center.justify-center.mouse_hover_bg-black-a08(to="/") &larr;
            h2 Mint Decomposed NFT

          p.pt-8.px-8.leading-relaxed
            | {{ !isConnected ? 'Connect your wallet to select an elligible NFT' : 'Select an elligible NFT from your wallet' }} to decompose and mint into a new NFT. You will not lose your original NFT. The new one will be minted into your wallet.

          .mt-3.flex.justify-end
            .h-12.bg-gray-100.text-xs.px-6.flex.items-center
              span.animate-pulse {{ mintCount !== undefined ? mintCount : '...' }}/888 Mints

          ol
            //- connect step
            li.bg-gray-200.relative
              .absolute.z-10.left-0.top-0.h-24.w-24.flex.items-center.justify-center.bg-black-a15 1
              //- step label
              //- .flex.h-24.relative(v-if="$store.state.address")
                .flex.w-full.items-center.justify-center.bg-gray-100ff
                  | Connect Wallet
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>

              .flex.h-24.relative
                connect-disconnect-btn.flex-1(connectLbl="CONNECT WALLET", :class="{'bg-yellow-500': !isConnected}")

            //- select step
            li
              .flex.h-36.relative.bg-gray-300(:class="{'opacity-50': !isConnected, 'bg-yellow-500': isConnected && !selection}")
                .absolute.z-10.left-0.top-0.h-full.w-36.flex.items-center.justify-center.bg-black-a15 2
                .flex.w-full.items-center.justify-center.bg-gray-100ff.uppercase.tracking-wide Select

              //- (colletions)
              template(v-if="isConnected")
                nft-selector(:key="$store.state.address", :address="$store.state.address", :selection="selection", @selected="$event => { selection = $event }")

            //- (selection overlay)
            button.absolute.overlay.bg-black-a60(v-if="selection", @click="clearSelection")

            //- (mint step)
            li.sticky.z-10.bottom-0.left-0.w-full.bg-white
              .bg-gray-300(:class="{'opacity-25': !isConnected, 'opacity-75': isConnected && !selection}")
                //- (status)
                template(v-if="status")
                  .min-h-14.flex.items-center.justify-center.relative.bg-gray-800.text-white.text-sm.px-6.py-4(:class="{'bg-green-400': status.type === 'success', 'bg-red-duller': status.type === 'error' }")
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
                .flex.items-center(v-if="selection")
                  //- thumb
                  .relative.w-48.h-48
                    img.absolute.overlay.object-cover(:src="selection.image.thumb")
                  //- label
                  .flex-1.min-w-0.inline.px-8
                    .truncate.opacity-25.text-sm {{ selection.collection.name }}
                    .truncate.font-bold.mt-1
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

                    button.w-1x2.flex.items-center.justify-center.bg-gray-200.relative(:disabled="!myMint", :class="{'bg-yellow-500 mouse_hover_bg-yellow-600': myMint}", @click="goToMinted")
                      div.animate-pulse(v-if="!myMint") Loading...
                      template(v-else)
                        | View Minted
                        //- icon
                        .absolute.w-24.h-full.top-0.right-0.flex.items-center.justify-center.pt-2 →

                //- (mint btn)
                template(v-else)
                  button.block.w-full.relative(:disabled="!selection", :class="{'bg-yellow-500 mouse_hover_bg-yellow-600': selection}", @click="mint")
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
import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn'
import NftSelector from '@/components/NFTSelector'
import SvgX from '@/components/SVG-X'
export default {
  name: 'MintView',
  components: { ConnectDisconnectBtn, NftSelector, SvgX },
  data () {
    return {
      selection: null,
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
      this.selection = null
      this.status = null
      this.myMint = null
    },

    async mint () {
      let tx
      try {
        this.myMint = null
        this.status = { msg: 'Confirm transaction in your wallet...' }

        const contract = this.selection.collection.address
        const tokenId = this.selection.tokenId
        // confirm...
        tx = await this.$store.dispatch('mint', { contract, tokenId })

        // wait for confirmation...
        this.status = { msg: 'Waiting for confirmation...', tx }
        await tx.wait()

        // success
        this.status = { type: 'success', msg: 'Minted!' }
        // find my mint
        this.myMint = await this.$store.dispatch('findMint', { contract, tokenId })
      } catch (e) {
        console.error(e)
        // check if puased
        const paused = await this.$store.dispatch('getPaused')
        //
        const msg = paused ? 'Minting is not yet active.'
          : 'Error - ' + (e.reason || e.message)
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
