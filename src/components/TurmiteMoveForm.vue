<template lang="pug">
form.turmite-move-form(@submit.prevent="move")
  input.w-full.mb-2.border.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.text-center(v-model="moveQty", type="number", min="1", step="1", v-autofocus)
  
  .grid.grid-cols-2.gap-1
    button.block.bg-accent1.text-accent2.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.mouse_hover_text-accent2.mouse_hover_bg-accent1 PREVIEW
    button.block.bg-accent1.text-accent2.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.mouse_hover_text-accent2.mouse_hover_bg-accent1(type="submit") MOVE

  template(v-if="status")
    div.text-center.text-xs.lowercase.pt-2.font-bold(:class="{'animate-pulse': status.msg.includes('...') }") {{ status.msg }}
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'
const props = defineProps(['tokenId'])
const emit = defineEmits(['moved'])

const moveQty = ref(1)
const status = ref()

const move = async () => {
  try {
    status.value = { msg: 'Confirm transaction in your wallet...' }
    
    console.log(props.tokenId, moveQty.value)
    const tx = await store.dispatch('turmiteMove', { tokenId: props.tokenId, moves: moveQty.value })

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