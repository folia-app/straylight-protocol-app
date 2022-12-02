<template lang="pug">
modal(@close="close")
  <DialogTitle class="uppercase text-lg font-bold">#[span.text-accent4.uppercase Reprogram] Turmite_{{ props.tokenId }}</DialogTitle>
  
  <DialogDescription class="mt-6">select a new <a href="/patterns" class="border-b border-dashed mouse_hover_border-solid font-bold" target="_blank">pattern</a><span style="font-size:0.75em">↗</span> for your turmite.</DialogDescription>

  form(@submit.prevent="submit")
    figure.mt-12.px-4.flex.justify-center.w-full(v-if="previewOption")
      .w-full(style="max-width:300px")
        .aspect-square.border.border-gray-700.relative
          .absolute.overlay.flex.items-center.justify-center.animate-pulse.text-sm.text-accent3 loading...
          img.absolute.overlay.object-contain.object-center(:src="$store.getters.docsLink(`/_images/turmites/${previewOption.nickname}_0.png`)", :key="previewOption.nickname")
    
    .mt-4.w-full.flex.justify-center.items-center
      label.block.mr-4.text-smm.mt-2px.sr-only pattern:
      <SelectorRules v-model="selection" class="-mr-10" @activeOptionChanged="val => { activeOption = val }" />
    
    .mt-8.text-xxs.flex.justify-center
      button.border-b.border-dashed.text-accent4.pb-1.mouse_hover_border-solid(@click.prevent="simulateSelection")
        | preview in the simulator &rarr;
      //- button.pl-10.pr-6.border.border-accent4.text-accent4.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2(type="submit", :disabled="!selection") SIMULATE &rarr;

    .mt-12.w-full.grid.grid-cols-2.gap-3
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2(@click.prevent="close") {{ hasReprogrammed ? 'CLOSE' : 'CANCEL' }}
      button.bg-accent3.text-accent1.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2(type="submit", :disabled="!selection") REPROGRAM
      //- div
      //- button.mt-2.border.border-accent3.text-accent3.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.font-bold.text-md.focus-visible_ring-accent2 PREVIEW
  
  template(v-if="status")
    div.mt-6.text-center.text-xs.pt-2.text-accent3(:class="{'animate-pulse': status.msg.includes('...') }", v-html="status.msg")
  
  template(v-if="isWrongNetwork")
    switch-network-prompt.mt-8(@switched="isWrongNetwork = false")
</template>

<script setup>
  import Modal from '@/components/Modal.vue'
  import { DialogTitle, DialogDescription } from '@headlessui/vue'
  import { ref, computed } from 'vue'
  import SelectorRules from '@/components/SelectorRules.vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'
  import SwitchNetworkPrompt from '@/components/SwitchNetworkPrompt.vue'

  const props = defineProps(['tokenId'])
  const emit = defineEmits(['close', 'reprogrammed', 'simulateRule'])
  const route = useRoute()
  
  const selection = ref()
  const activeOption = ref()
  const status = ref()
  const isWrongNetwork = ref(false)

  const hasReprogrammed = ref(false)

  const previewOption = computed(() => {
    return activeOption.value || selection.value
  })

  const simulateSelection = () => {
    emit('simulateRule', previewOption.value.rule)
    emit('close')
  }

  const close = () => emit('close')
  
  const submit = async () => {
    try {
      // TODO - check wallet is on correct network!!!
      status.value = { msg: 'confirm transaction in your wallet...' }
      
      const tx = await store.dispatch('reprogramTurmite', { tokenId: props.tokenId, rule: selection.value.rule, network: { name: route.params.networkName } })
      
      // wait for confirmation...
      status.value = { msg: `
        waiting for <a href="${store.getters.etherscanLink({ hash: tx.hash, networkName: route.params.networkName })}" target="_blank" rel="noopener noreferrer" class="border-b">tx</a> confirmation...
        `,
        tx
      }
      await tx.wait()
      
      // success
      emit('reprogrammed')
      hasReprogrammed.value = true
      status.value = { type: 'success', msg: 'your turmite was reprogrammed!' }
    } catch (e) {
      console.error(e)
      
      if (e.message === 'WALLET IS WRONG NETWORK' || e.reason === 'underlying network changed') {
        status.value = undefined
        isWrongNetwork.value = true
        return
      }
      
      // show error to user
      status.value = { type: 'error', msg: 'ERROR - ' + (e.reason || e.message || e) }
    }
  }
</script>