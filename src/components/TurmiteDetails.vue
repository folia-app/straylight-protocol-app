<template lang="pug">
li.turmite-detail.flex.flex-col

  .rounded-lg.relative(:class="{'bg-accent2 text-accent1 border-none': isOwner}")
    //- (background)
    .absolute.overlay.bg-accent1.opacity-90.rounded-lg(v-if="!isOwner")
    
    .relative.z-10.px-5.pt-4.pb-4.flex.flex-col
      //- title
      .flex.items-end.pb-5
        .mr-3.mb-2px(:style="{width:'0.9rem', height:'0.9rem', background: colors[props.tokenIndex]}")
        a.flex.justify-start.items-end.leading-none.group(:class="{'-mb-1': isOwner}", :href="$store.getters.marketplaceLink({ token: tokenId, networkName })", target="_blank", rel="noopener noreferrer")
          .flex.font-bold(:class="{'opacity-30': !owner}")
            | turmite_{{ props.tokenId }}
            //- | turmite_{{ props.tokenIndex }}
          .flex.items-end.opacity-30.ml-1.text-smmff.mouse_group-hover_text-accent3.mouse_group-hover_opacity-100(v-if="owner")
            //- | \#{{ props.tokenId }} 
            span.ml-1(style="font-size:0.6em") ↗
      
      //- (owner, moves)
      template(v-if="owner")
        .flex.flex-wrap.items-end
          .flex-1.text-smm
            //- owner
            .h-9.flex.items-center
              .inline-block.opacity-30(style="min-width:3.5em") owner
              .inline-block
                template(v-if="owner === undefined")
                  span.animate-pulse ...
                template(v-else)
                  router-link.flex.items-center(:to="{name: 'profile-network__worlds', params: { address: owner, networkName: $route.params.networkName }}")
                    addr.font-bold.px-3px.rounded-lg.leading-tight(:address="owner", :youOn="true")
                    span.ml-2.opacity-20(style="font-size:0.75em") &rarr;
            //- pattern
            .h-9.flex.items-center
              .inline-block.opacity-30(style="min-width:3.5em") pattern
              template(v-if="ruleset")
                router-link.inline-block.lowercase(:to="{name: 'pattern', params: { pattern: ruleset.rule }, query: { network: $route.params.networkName }}")
                  span.font-bold {{ ruleset.nickname || '??' }}
                  span.ml-2.opacity-20(style="font-size:0.75em") &rarr;

          //- (owner actions)
          template(v-if="isOwner")
            .w-full.md_w-auto.grid.grid-cols-2.gap-1.mt-2
              button.mt-2.h-9.rounded-full.px-4.text-sm.borderff.flex.items-center.justify-center.pb-1.borderff.border-gray-600.font-bold(@click="reprogramModalVisible = true", class="bg-black/10")
                | reprogram
              button.mt-2.h-9.rounded-full.px-4.text-sm.borderff.flex.items-center.justify-center.pb-1.bg-accent3.font-bold(@click="toggleMoveForm")
                | {{ moveFormVisible ? 'cancel' : 'move' }}
              
      
      //- ("join/mint")
      template(v-else)
        .h-18.flex.items-start
          router-link.w-full.block.border.border-dashed.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.animate-pulse.font-bold.mouse_hover_bg-accent2.mouse_hover_text-accent1.text-md(:to="{ name: 'mint', query: { network: $route.params.networkName }}") JOIN / MINT

  //- (move form)
  .lg_my-px.lg_order-first
    template(v-if="moveFormVisible")
      .mt-px.lg_my-0.relative
        .lg_absolute.bottom-0.left-0.w-full.p-4.pb-5.rounded-lg.bg-accent3.text-accent1
          turmite-move-form(:tokenId="props.tokenId", :networkName="props.networkName", v-bind="$attrs", @reprogramClick="reprogramModalVisible = true")
  
  //- (reprogramm modal)
  modal-reprogram-turmite(v-if="reprogramModalVisible", @close="reprogramModalVisible = false", :tokenId="props.tokenId", @reporgrammed="onTurmiteReprogrammed")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import Addr from '@/components/Addr.vue'
import TurmiteMoveForm from '@/components/TurmiteMoveForm.vue'
import rules from '../../contracts/rulesSelected.js'
import ModalReprogramTurmite from '@/components/ModalReprogramTurmite.vue'
import colors from '@/colors'

const props = defineProps(['tokenId', 'tokenIndex', 'networkName'])
const emit = defineEmits(['moveFormOpened', 'reprogrammed'])

const owner = ref()
const isOwner = computed(() => store.getters.isConnectedAddr(owner.value))

const moveFormVisible = ref(false)
const reprogramModalVisible = ref(false)

const toggleMoveForm = () => {
  if (!moveFormVisible.value) {
    emit('moveFormOpened')
  }
  moveFormVisible.value = !moveFormVisible.value
}

const getOwner = async () => {
  try {
    owner.value = await store.dispatch('getNFTOwnerByTokenId', { tokenId: props.tokenId, network: { name: props.networkName }})  
    if (owner.value) getAttr()
  } catch (e) {
    console.error(e)
    owner.value = '??'
  }
}

const attributes = ref()

const getAttr = async () => {
  try {
    const contract = await store.dispatch('getNFTContract', { network: { name: props.networkName }})
    const data = await contract.tokenURI(props.tokenId)
    // convert from base64
    const json = JSON.parse(atob(data.split(',')[1]))
    attributes.value = json.attributes
  } catch (e) {
    rule.value = '??'
  }
}

const ruleset = computed(() => {
  return attributes.value && (rules.find(row => row.rule === attributes.value[1].value))
})

const onTurmiteReprogrammed = () => {
  getAttr()
  emit('reprogrammed')
}

getOwner()
</script>

<style lang="postcss">
.turmite-detail .addr{
  @apply bg-accent2 text-accent1;
  &.addr--is-you{
    @apply bg-accent1 text-accent2;
  }
}
</style>