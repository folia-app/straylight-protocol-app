<template lang="pug">
  observer.mint-images.relative.group(@visible="onVisible", @hidden="visible = false")

    //- (placeholder)
    template(v-if="outputLoaded === false && inputLoaded === false")
      .w-full.pb-full.bg-gray-150

    //- (mint:)
    template(v-if="mint")
      //- (output image)
      template(v-if="loadOutput")
        //- w cloudinary
        //- img.w-full.transition.duration-200(:src="`https://res.cloudinary.com/folia/image/fetch/https://decomposer.folia.app/api/${$store.state.networkId}/get/${mint.contractAddress}/${mint.tokenId}`", :class="{'opacity-0': !outputLoaded, 'hidden': outputLoaded === false}", @error="onOutputLoadError", @load="onOutputLoad",)
        //- direct
        img.w-full.transition.duration-200(:src="`/api/${$store.state.networkId}/get/${mint.contractAddress}/${mint.tokenId}`", :class="{'opacity-0': !outputLoaded, 'hidden': outputLoaded === false}", @error="onOutputLoadError", @load="onOutputLoad",)

      //- (input image)
      //- * placeholder when outputLoaded = false
      //- * overlay when outputLoaded = true
      template(v-if="loadInput")
        //- cloudinary
        //- img.w-full(:src="`https://res.cloudinary.com/folia/image/fetch/https://decomposer.folia.app/api/${$store.state.networkId}/get/original/${mint.contractAddress}/${mint.tokenId}`", :class="{'absolute overlay opacity-0 group-hover_opacity-100': outputLoaded, 'opacity-0': !inputLoaded, 'hidden': inputLoaded === false}", @load="onInputLoad", @error="onInputLoadError")
        //- direct
        img.w-full(:src="`/api/${$store.state.networkId}/get/original/${mint.contractAddress}/${mint.tokenId}`", :class="{'absolute overlay opacity-0 group-hover_opacity-100 bg-white': outputLoaded, 'opacity-0': !inputLoaded, 'hidden': inputLoaded === false}", @load="onInputLoad", @error="onInputLoadError")

    //- (loading overlay text)
    template(v-if="outputLoaded === false")
      .absolute.overlay.flex.items-center.justify-center.animate-pulse.text-white
        .py-1.pl-3.pr-2.bg-blackff(:style="{ color: inputLoaded === false ? 'black': 'white', textShadow: inputLoaded ? '0 1px 1px rgba(0,0,0,0.75)' : 'none' }") Decomposing...
</template>

<script>
import Observer from '@/components/Observer'
export default {
  name: 'MintImages',
  props: ['mint'],
  components: { Observer },
  data () {
    return {
      visible: false,

      loadInput: false,
      loadOutput: false,

      outputLoaded: undefined,
      inputLoaded: undefined
    }
  },
  methods: {
    onVisible () {
      this.visible = true
      this.loadOutput = true
      // load input in case skipped
      if (this.outputLoaded !== undefined) {
        this.loadInput = true
      }
    },
    onHidden () {
      this.visible = true
      if (!this.outputLoaded) {
        this.loadOutput = undefined
      }
    },
    onInputLoad () {
      // // test failed input load:
      // this.inputLoaded = false
      // return

      this.inputLoaded = true
    },
    onInputLoadError () {
      this.inputLoaded = false
    },
    onOutputLoad () {
      if (this.visible) {
        this.loadInput = true
      }

      // // test failed output load:
      // this.outputLoaded = false
      // return

      this.outputLoaded = true
    },
    onOutputLoadError (e) {
      // console.error(e)
      this.outputLoaded = false
      this.loadInput = true
    }
  }
}
</script>

<style>
</style>
