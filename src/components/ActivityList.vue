<template lang="pug">
.activity.mt-24
  header.px-5
    .text-5xl activity
  ul
    li.flex(v-for="item in activity")
      activity-item-event(:event="item")
</template>

<script setup>
import { computed } from 'vue'
import ActivityItemEvent from '@/components/ActivityItemEvent.vue'
const props = defineProps({
  activity: { type: Array, default: () => ([]) }
})

const activitySorted = computed(() => props.activity.sort((a,b) => a.blockNumber - b.blockNumber))
</script>