<template lang="pug">
.profile-activity.relative
  //- (loading)
  template(v-if="!loaded")
    .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 loading...

  //- (activity)
  template(v-else)
    activity-list.mt-8.mb-6.pb-24(:activity="activity", :includeWorld="true")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import ActivityList from '@/components/ActivityList.vue'

const props = defineProps(['tokenIds'])

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
    moves.value = await store.dispatch('getMoves', { cached, filter: ['tokenId', props.tokenIds] })
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const getMints = async ({ cached = false }) => {
  try {
    mints.value = await store.dispatch('getMints', { cached, filter: ['tokenId', props.tokenIds] })  
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

getMints({ cached: true })
getMoves({ cached: true })
</script>