<template lang="pug">
network-resolver(@resolved="onResolved")
</template>

<script setup>
import { useRouter } from 'vue-router'
import NetworkResolver from '@/components/NetworkResolver.vue'

const router = useRouter()

const onResolved = (networkName) => {
  router.replace({name: 'profile-network__worlds', params: { networkName }})
}
</script>