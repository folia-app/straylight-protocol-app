<template lang="pug">
article.index-worlds
  h1.sr-only Worlds
  minted-results
</template>

<script setup>
import MintedResults from '@/components/MintedResults.vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import store from '@/store'

const route = useRoute()

useMeta(store.getters.meta({
  title: `worlds :: ${route.params.networkName.toUpperCase()}`
}))
</script>