<template lang="pug">
.activity
  //- header.px-5
    .text-5xl activity
  ul.whitespace-nowrap.overflow-x-scroll.scrollbars-hidden
    li.flex(v-for="item in activity")
      activity-item-event(:key="item.id", :event="item", v-bind="$attrs")
</template>

<script setup>
import { computed } from 'vue'
import ActivityItemEvent from '@/components/ActivityItemEvent.vue'

const props = defineProps({
  activity: { type: Array, default: () => ([]) },
  includeWorld: { type: Boolean, default: false } 
})

const activitySorted = computed(() => props.activity.sort((a,b) => a.blockNumber - b.blockNumber))
</script>