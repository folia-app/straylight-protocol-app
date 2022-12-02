<template lang="pug">
modal(@close="close")
  <DialogTitle class="uppercase text-lg font-bold">#[span.text-accent4 Move] Turmite_{{ props.tokenId }}</DialogTitle>

  <DialogDescription class="mt-6">
    div how many #[b steps] would you like to move?
  </DialogDescription>

  form.mt-12(@submit.prevent="move")
    input.w-full.border-b.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.text-center.focus-visible_ring-0(v-model="moveQty", type="number", min="1", step="1", :max="$store.state.networks[$store.getters.chainId(route.params)].movesMax", v-autofocus)

    div.text-sm.mt-4.opacity-40.mx-auto HINT: use the simulator to preview steps

    .mt-16.w-full.grid.grid-cols-2.gap-3
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent4(@click.prevent="close") {{ hasMoved ? 'CLOSE' : 'CANCEL'}}
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent4(type="submit") MOVE

  template(v-if="status")
    div.mt-6.text-center.text-xs.pt-2.text-accent3(:class="{'animate-pulse': status.msg.includes('...') }", v-html="status.msg")
  
  template(v-if="isWrongNetwork")
    switch-network-prompt.mt-8(@switched="isWrongNetwork = false")
</template>

<script setup>
  import Modal from '@/components/Modal.vue'
  import { DialogTitle, DialogDescription } from '@headlessui/vue'
  import { ref } from 'vue'
  import store from '@/store'
  import { useRoute } from 'vue-router'
  import SwitchNetworkPrompt from '@/components/SwitchNetworkPrompt.vue'

  const route = useRoute()

  const props = defineProps(['tokenId'])
  const emit = defineEmits(['moved'])

  const moveQty = ref(500)
  const status = ref()
  const isWrongNetwork = ref(false)

  const hasMoved = ref(false)

  const move = async () => {
    try {
      status.value = { msg: 'confirm transaction in your wallet...' }

      console.log(props.tokenId, moveQty.value)
      const tx = await store.dispatch('moveTurmite', { tokenId: props.tokenId, moves: moveQty.value, network: { name: route.params.networkName } })

      // wait for confirmation...
      status.value = { msg: `
        waiting for <a href="${store.getters.etherscanLink({ hash: tx.hash, networkName: route.params.networkName })}" target="_blank" rel="noopener noreferrer" class="border-b">tx</a> confirmation...
        `,
        tx
      }
      await tx.wait()

      // success
      emit('moved')
      hasMoved.value = true
      status.value = { type: 'success', msg: 'your turmite moved!' }
    } catch (e) {
      console.error(e)
      
      // ! wrong network?
      if (e.message === 'WALLET IS WRONG NETWORK' || e.reason === 'underlying network changed') {
        status.value = undefined
        isWrongNetwork.value = true
        return
      }
      
      // show error to user
      status.value = { type: 'error', msg: 'ERROR - ' + (e.reason || e.message || e) }
    }
  }
  
  const close = () => emit('close')
</script>