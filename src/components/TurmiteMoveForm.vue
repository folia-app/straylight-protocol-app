<template lang="pug">
.turmite-move-form
  form(@submit.prevent="move")
    input.w-full.border.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.text-center(v-model="moveQty", type="number", min="1", step="1", :max="$store.state.movesMax", v-autofocus)
    
    .mt-2.grid.grid-cols-2.gap-1
      button.block.bg-accent1.text-accent2.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.mouse_hover_text-accent2.mouse_hover_bg-accent1(@click.prevent="emit('preview', { tokenId, moveQty })") PREVIEW
      button.block.bg-accent1.text-accent2.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.mouse_hover_text-accent2.mouse_hover_bg-accent1(type="submit") MOVE

  .mt-1.w-full.flex
    button.w-full.bg-accent1.text-accent2.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.mouse_hover_text-accent2.mouse_hover_bg-accent1(@click.prevent="$emit('reprogramClick')") REPROGRAM...

  template(v-if="status")
    div.text-center.text-xs.lowercase.pt-2.font-bold(:class="{'animate-pulse': status.msg.includes('...') }") {{ status.msg }}
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'

const props = defineProps(['tokenId', 'networkName'])
const emit = defineEmits(['moved', 'preview', 'reprogramClick'])

const moveQty = ref(1000)
const status = ref()

const move = async () => {
  try {
    status.value = { msg: 'Confirm transaction in your wallet...' }
    
    console.log(props.tokenId, moveQty.value)
    const tx = await store.dispatch('turmiteMove', { tokenId: props.tokenId, moves: moveQty.value, network: { name: props.networkName } })

    // wait for confirmation...
    status.value = { msg: 'Waiting for confirmation...', tx }
    await tx.wait()

    // success
    emit('moved')
    status.value = { type: 'success', msg: 'your turmite moved!' }
  } catch (e) {
    console.error(e)
    // show error to user
    status.value = { type: 'error', msg: 'Error - ' + (e.reason || e.message || e) }
  }
}
</script>