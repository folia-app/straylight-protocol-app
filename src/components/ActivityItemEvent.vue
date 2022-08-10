<template lang="pug">
observer.activity-item-event.flex.justify-evenly.w-full(@visible="getInfo")
  div {{ timestamp || props.event.blockNumber }}
  div {{ from ? from : '0x...' }}
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Observer from '@/components/Observer.vue'
const props = defineProps(['event'])

const timestamp = ref()
const from = ref()

const getInfo = () => {
  props.event.getBlock()
    .then(block => timestamp.value = new Date(block.timestamp))
    .catch(console.error)

  props.event.getReceipt()
    .then(receipt => from.value = receipt.from)
    .catch(console.error)
}
</script>