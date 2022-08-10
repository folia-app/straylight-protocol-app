<template lang="pug">
li.turmite-detail.flex.flex-col

  .px-5.pt-4.pb-4.flex.flex-col.rounded-lg.bg-accent1(:class="{'bg-accent2 text-accent1 border-none': isOwner}")
    //- title
    .flex.justify-between.items-end.leading-none.pb-5
      .flex(:class="{'opacity-30': !owner, '-mb-1': isOwner}")
        | turmite_{{ props.label }}
      .flex.items-center.opacity-30.ml-4.text-smm(v-if="owner")
        | \#{{ props.tokenId }} 
        span.ml-2(style="font-size:0.75em") ↗
    
    //- (owner, moves)
    template(v-if="owner")
      .flex.flex-wrap.items-end
        .flex-1.text-smm
          //- owner
          .h-8.flex.items-center
            .inline-block.opacity-30(style="min-width:3.5em") owner
            .inline-block
              template(v-if="owner === undefined")
                span.animate-pulse ...
              template(v-else)
                .flex.items-center
                  addr(:address="owner", :youOn="true")
                  span.ml-2.opacity-20(style="font-size:0.75em") ↗
          .h-8.flex.items-center
            .inline-block.opacity-30(style="min-width:3.5em") pattern
            .inline-block.lowercase 
              | {{ ruleNickname || '...' }}
              span.ml-2.opacity-20(style="font-size:0.75em") ↗

        //- (owner actions)
        template(v-if="isOwner")
          button.h-8.rounded-full.px-6.text-sm.borderff.flex.items-center.pb-1.bg-accent3.font-bold(@click="moveFormVisible = !moveFormVisible") {{ moveFormVisible ? 'cancel' : 'move' }}
    
    //- ("join/mint")
    template(v-else)
      .h-18.flex.items-start
        router-link.w-full.block.border.border-dashed.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.animate-pulse.font-bold.mouse_hover_bg-accent2.mouse_hover_text-accent1.text-md(to="/mint") JOIN / MINT

  //- (move form)
  template(v-if="moveFormVisible")
    .p-4.pb-5.rounded-lg.my-px.bg-accent3.text-accent1.lg_order-first
      turmite-move-form(:tokenId="props.tokenId", @moved="emit('moved')")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import Addr from '@/components/Addr.vue'
import TurmiteMoveForm from '@/components/TurmiteMoveForm.vue'
import rules from '../../contracts/rulesSelected.js'

const props = defineProps(['tokenId', 'label'])
const emit = defineEmits(['moved'])

const owner = ref()
const isOwner = computed(() => store.getters.isConnectedAddr(owner.value))

const moveFormVisible = ref(false)

const getOwner = async () => {
  try {
    owner.value = await store.dispatch('getNFTOwnerByTokenId', props.tokenId)  
    if (owner.value) getAttr()
  } catch (e) {
    console.error(e)
    owner.value = '??'
  }
}

const attributes = ref()
const ruleNickname = computed(() => attributes.value && (rules.find(row => row.rule === attributes.value[1].value))?.nickname)

const getAttr = async () => {
  try {
    const contract = await store.dispatch('getNFTContract')
    const data = await contract.tokenURI(props.tokenId)
    // convert from base64
    const json = JSON.parse(atob(data.split(',')[1]))
    attributes.value = json.attributes
  } catch (e) {
    rule.value = '??'
  }
}

getOwner()
</script>

<style lang="postcss">
.turmite-detail .addr--is-you{
  @apply bg-accent1 text-accent2 rounded-lg px-2 py-1 leading-none uppercase font-bold;
}
</style>