<template lang="pug">
.profile-activity.relative
  //- (loading)
  template(v-if="!loaded")
    .px-6.lg_px-22.animate-pulse.text-sm.text-accent3 loading...

  template(v-else-if="activity && !activity.length")
    p.text-smm.px-6.lg_pl-22.text-accent3 no #[b activity] found on #[b {{ $route.params.networkName }}] network

  //- (activity)
  template(v-else)
    activity-list.mb-6(:activity="activity", :fromHidden="true",)
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import { useRoute } from 'vue-router';
import ActivityList from '@/components/ActivityList.vue'

const props = defineProps(['tokenIds'])
const route = useRoute()

const loaded = ref(0)

const moves = ref([])
const mints = ref([])

const activity = computed(() => {
  let activity = [...moves.value, ...mints.value]
  activity.sort((a, b) => b.blockNumber - a.blockNumber)
  return activity
})

const getMoves = async ({ cached = false }) => {
  try {
    moves.value = await store.dispatch('getMoves', { cached, filter: ['tokenId', props.tokenIds], network: { name: route.params.networkName } })
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const getMints = async ({ cached = false }) => {
  try {
    mints.value = await store.dispatch('getMints', { cached, filter: ['tokenId', props.tokenIds], network: { name: route.params.networkName } })  
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

getMints({ cached: true })
getMoves({ cached: true })
</script>