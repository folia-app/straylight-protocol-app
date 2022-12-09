<template lang="pug">
article.index-worlds
  h1.sr-only Worlds
  minted-results(:boardIdsUpdated="boardIdsByRecentlyUpdated", :sort="$route.query.sort", @contractEvent="getEvents(true)")
</template>

<script setup>
  import { ref, computed, watch } from 'vue'
  import MintedResults from '@/components/MintedResults.vue'
  import { useMeta } from 'vue-meta'
  import { useRoute, useRouter } from 'vue-router'
  import store from '@/store'

  const route = useRoute()
  const router = useRouter()

  useMeta(store.getters.meta({})) // use site default since root redirects here

  if (!route.query.sort) {
    // default sort
    router.replace({ query: { sort: 'updated' }})
  }

  const moves = ref([])
  const mints = ref([])

  const boardIdsByRecentlyUpdated = computed(() => {
    const events = [...moves.value, ...mints.value]
    events.sort((a, b) => b.blockNumber - a.blockNumber)
    return [...new Set(events.map(e => e.boardId))]
  })

  const getMoves = async ({ cached = true }) => {
    moves.value = await store.dispatch('getMoves', { cached, network: { name: route.params.networkName }})
  }

  const getMints = async ({ cached = true }) => {
    mints.value = await store.dispatch('getMints', { cached, network: { name: route.params.networkName }})
  }

  const getEvents = (force = false) => {
    if (route.query.sort === 'updated' && (!moves.value.length || !mints.value.length || force)) {
      getMoves({ cached: !force })
      getMints({ cached: !force })
    }
  }

  watch(route, () => {
    getEvents()
  })
  
  getEvents()
</script>