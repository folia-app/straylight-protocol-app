<template lang="pug">
.board-activity.relative
  observer(v-if="loaded < 2", @visible="onVisible")
  //- (loading)
  template(v-if="loaded < 1")
    .h-36.animate-pulse.text-smm.p-3.leading-none.border.rounded-lg.text-accent3.flex.items-center.justify-center
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

const props = defineProps(['boardId'])

const loaded = ref(0)

const moves = ref([])
const boardMints = ref([])

const activity = computed(() => [...moves.value, ...boardMints.value])

const getMoves = async ({ cached = false }) => {
  try {
    moves.value = await store.dispatch('getMoves', { cached, filter: ['boardId', props.boardId] })
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const getBoardMints = async ({ cached = false }) => {
  try {
    boardMints.value = await store.dispatch('getMints', { cached, filter: ['boardId', props.boardId] })  
    loaded.value++
  } catch (e) {
    console.error(e)
  }
}

const onVisible = () => {
  getBoardMints({ cached: false })
  getMoves({ cached: false })
}
</script>