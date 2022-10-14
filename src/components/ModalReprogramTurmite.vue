<template lang="pug">
modal(@close="close")
  <DialogTitle class="uppercase text-lg font-bold">Reprogram #[span.text-accent4 Turmite_{{ props.tokenId }}]</DialogTitle>
  
  <DialogDescription class="mt-6">Select a new <a href="/patterns" class="border-b border-dashed mouse_hover_border-solid font-bold" target="_blank">pattern</a><span style="font-size:0.75em">↗</span> for your turmite.</DialogDescription>

  form(@submit.prevent="submit")
    figure.mt-12.px-4.flex.justify-center.w-full(v-if="previewOption")
      .w-full(style="max-width:300px")
        .aspect-square.border.border-gray-700.relative
          .absolute.overlay.flex.items-center.justify-center.animate-pulse.text-sm.text-accent3 loading...
          img.absolute.overlay.object-contain.object-center(:src="$store.getters.docsLink(`/straylightdocs/_images/turmites/${previewOption.nickname}_0.png`)", :key="previewOption.nickname")
    
    .mt-4.w-full.flex.justify-center.items-center
      label.block.mr-4.text-smm.mt-2px.sr-only pattern:
      <SelectorRules v-model="selection" class="-mr-10" @activeOptionChanged="val => { activeOption = val }" />
    
    .mt-16.w-full.grid.grid-cols-2.gap-3
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2(@click.prevent="close") CANCEL
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2(type="submit", :disabled="!selection") REPROGRAM
  
  template(v-if="status")
    div.text-center.text-xs.lowercase.pt-2.font-bold.text-accent3(:class="{'animate-pulse': status.msg.includes('...') }") {{ status.msg }}
</template>

<script setup>
  import Modal from '@/components/Modal.vue'
  import { DialogTitle, DialogDescription } from '@headlessui/vue'
  import { ref, computed } from 'vue'
  import SelectorRules from '@/components/SelectorRules.vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'

  const props = defineProps(['tokenId'])
  const emit = defineEmits(['close', 'reprogrammed'])
  const route = useRoute()
  
  const selection = ref()
  const activeOption = ref()
  const status = ref()

  const previewOption = computed(() => {
    return activeOption.value || selection.value
  })

  const close = () => emit('close')
  
  const submit = async () => {
    try {
      status.value = { msg: 'Confirm transaction in your wallet...' }
      
      const tx = await store.dispatch('reprogramTurmite', { tokenId: props.tokenId, rule: selection.value.rule, network: { name: route.params.networkName } })
      
      // wait for confirmation...
      status.value = { msg: 'Waiting for confirmation...', tx }
      await tx.wait()
      
      // success
      emit('reprogrammed')
      status.value = { type: 'success', msg: 'your turmite was reprogrammed!' }
    } catch (e) {
      console.error(e)
      // show error to user
      status.value = { type: 'error', msg: 'Error - ' + (e.reason || e.message || e) }
    }
  }
</script>