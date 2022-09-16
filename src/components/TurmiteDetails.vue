<template lang="pug">
li.turmite-detail.flex.flex-col

  .rounded-lg.relative(:class="{'bg-accent2 text-accent1 border-none': isOwner}")
    //- (background)
    .absolute.overlay.bg-accent1.opacity-90.rounded-lg(v-if="!isOwner")
    
    .relative.z-10.px-5.pt-4.pb-4.flex.flex-col
      //- title
      .flex.items-end.pb-5
        .mr-3.mb-2px(:style="{width:'0.85rem', height:'0.85rem', background: colors[['W', 'N', 'S', 'E'].indexOf(props.label)]}")
        a.flex.justify-start.items-end.leading-none.group(:class="{'-mb-1': isOwner}", :href="$store.getters.marketplaceLink({ token: tokenId, networkName })", target="_blank", rel="noopener noreferrer")
          .flex(:class="{'opacity-30': !owner}")
            | turmite_{{ props.label }}
          .flex.items-end.opacity-30.ml-4.text-smmff.mouse_group-hover_text-accent3.mouse_group-hover_opacity-100(v-if="owner")
            | \#{{ props.tokenId }} 
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
              .inline-block.lowercase 
                | {{ ruleNickname || '...' }}
                //- span.ml-2.opacity-20(style="font-size:0.75em") &rarr;

          //- (owner actions)
          template(v-if="isOwner")
            button.w-full.md_w-auto.mt-2.h-9.rounded-full.px-6.text-sm.borderff.flex.items-center.justify-center.pb-1.bg-accent3.font-bold(@click="moveFormVisible = !moveFormVisible") {{ moveFormVisible ? 'cancel' : 'move' }}
      
      //- ("join/mint")
      template(v-else)
        .h-18.flex.items-start
          router-link.w-full.block.border.border-dashed.rounded-full.h-9.pb-px.flex.justify-center.items-center.leading-none.animate-pulse.font-bold.mouse_hover_bg-accent2.mouse_hover_text-accent1.text-md(:to="{ name: 'mint', query: { network: $route.params.networkName }}") JOIN / MINT

  //- (move form)
  .lg_my-px.lg_order-first
    template(v-if="moveFormVisible")
      .mt-px.lg_my-0.relative
        .lg_absolute.bottom-0.left-0.w-full.p-4.pb-5.rounded-lg.bg-accent3.text-accent1
          turmite-move-form(:tokenId="props.tokenId", :networkName="props.networkName", @moved="emit('moved')")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import Addr from '@/components/Addr.vue'
import TurmiteMoveForm from '@/components/TurmiteMoveForm.vue'
import rules from '../../contracts/rulesSelected.js'

const colors = ['red', '#03de00', '#0081ff', '#fa8700'] // match from '@/plugins/p5_turmites/sketch.js'

const props = defineProps(['tokenId', 'label', 'networkName'])
const emit = defineEmits(['moved'])

const owner = ref()
const isOwner = computed(() => store.getters.isConnectedAddr(owner.value))

const moveFormVisible = ref(false)

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
const ruleNickname = computed(() => attributes.value && (rules.find(row => row.rule === attributes.value[1].value))?.nickname)

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