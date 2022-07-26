<template lang="pug">
  #app.text-base.font-sans.leading-snug
    //- main
    .app__main.relative.z-20
      router-view

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
export default {
  name: 'App',
  metaInfo: {
    titleTemplate: (ttl) => {
      return ttl ? `${ttl} – Decomposer` : 'Decomposer by Oliver Laric'
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
    }
  },
  created () {
    this.$store.dispatch('init')
    this.$store.dispatch('getCollectionsList')
  },
  mounted () {
    this.$store.dispatch('listenForMints')
    // hide loading overlay
    return document.getElementById('loading')?.remove()
  }
}
</script>

<style>
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
</style>
