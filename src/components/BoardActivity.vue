<template lang="pug">
.board-activity.relative.mt-px
  observer(v-if="loaded < 2", @visible="onVisible")
  //- (loading)
  template(v-if="loaded < 1")
    .h-72.animate-pulse.text-smm.p-3.leading-none.rounded-lg.text-accent3.flex.items-center.justify-center.router-link-exact-active
      .absolute.overlay.rounded-lg.bg-accent3.opacity-20
      | loading activity...

  //- (activity)
  template(v-else)
    activity-list.mt-8.mb-6(:activity="activity")
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import ActivityList from '@/components/ActivityList.vue'
import Observer from '@/components/Observer.vue'

const props = defineProps(['boardId', 'networkName', 'cached'])

const loaded = ref(0)

const moves = ref([])
const mints = ref([])
const reprograms = ref([])

const activity = computed(() => {
  let activity = [...moves.value, ...mints.value, ...reprograms.value]
  activity.sort((a, b) => b.blockNumber - a.blockNumber)
  return activity
})

const getMoves = async ({ cached = false }) => {
  try {
    moves.value = await store.dispatch('getMoves', { cached, filter: ['boardId', props.boardId], network: { name: props.networkName }})
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const getMints = async ({ cached = false }) => {
  try {
    mints.value = await store.dispatch('getMints', { cached, filter: ['boardId', props.boardId], network: { name: props.networkName }})  
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const getReprograms = async ({ cached = false }) => {
  try {
    reprograms.value = await store.dispatch('getReprograms', { cached, filter: ['boardId', props.boardId], network: { name: props.networkName }})  
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const onVisible = () => {
  const cached = props.cached ?? false
  getMints({ cached })
  getMoves({ cached })
  getReprograms({ cached })
}
</script>