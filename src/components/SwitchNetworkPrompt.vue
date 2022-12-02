<template lang="pug">
.switch-network-prompt.text-xs.leading-normal
  template(v-if="!error")
    p
      | oops!<br>your #[b.uppercase WALLET] is not connected to #[b.uppercase {{$route.params.networkName}}]&nbsp;network!
    .mt-5.flex.justify-center
      button.flex.h-8.leading-none.pl-5.pr-3.border.rounded-full.items-center(@click.prevent="switchNetwork")
        .pb-1 switch
        <arrow-path-icon class="ml-3 h-5 w-5 transform scale-110 origin-center"></arrow-path-icon>
  template(v-else)
    p(v-html="error.msg", :class="{'text-accent2': error.type === 'warn', 'text-accent3': error.type !== 'warn'}")
    .mt-5.flex.justify-center(v-if="error.connectBtn")
      connect-disconnect-btn.lowercase(@connected="emit('switched')", :networkName="$route.params.networkName")
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { ArrowPathIcon } from '@heroicons/vue/24/outline'
  import store from '@/store'
  import ConnectDisconnectBtn from '@/components/ConnectDisconnectBtn.vue'

  const route = useRoute()
  const error = ref()
  const emit = defineEmits(['switched'])

  async function switchNetwork () {
    try {
      await store.dispatch('switchNetwork', { name: route.params.networkName, reload: false })
      emit('switched')
    } catch (e) {
      console.error(e)
      
      // rejected request ?
      if (e.code === 4001) {
        return
      }
      
      if (e.message === 'No provider to change network') {
        // disconnect
        await store.dispatch('disconnect')
        // prompt reconnect
        error.value = {
          type: 'warn',
          msg: `oops!<br>we couldn't switch your wallet's network<br>try <b class="uppercase">reconnecting</b> with <b class="uppercase">${route.params.networkName}</b> network selected`,
          connectBtn: true
        }
      } else {
        error.value = {
          msg: `oops!<br>we couldn't switch your wallet's network.<br>try <b class="uppercase">disconnecting your wallet</b> and <b class="uppercase">reconnecting</b> with <b class="uppercase">${route.params.networkName}</b> network selected.<br>–OR–<br> you may need to <a href="https://chainlist.org" target="_blank" rel="noopener noreferrer" class="font-bold uppercase border-b border-dashed mouse_hover_border-solid pb-1">add the network to your wallet</a> ↗`,
        }
      }      
    }
  }
</script>