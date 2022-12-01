<template lang="pug">
.index-activity.relative
  //- (loading)
  template(v-if="!loaded")
    .fixed.bottom-0.left-0.p-6.animate-pulse.text-sm.text-accent3 loading...

  //- (activity)
  template(v-else)
    template(v-if="activity.length === 0")
      p.mt-14.px-6.lg_px-22.text-sm.text-accent3
        | no activity found on #[b {{ $route.params.networkName }}] network<br>
        | #[router-link.border-b.border-dashed.mouse_hover_border-solid(:to="{ name: 'mint', query: { network: $route.params.networkName }}") mint]&nbsp;!
    
    template(v-else)
      activity-list.mt-8.mb-6.pb-24(:activity="activity", :includeWorld="true")

    contract-listener.fixed.bottom-0.right-0.z-30(@update="onContractEvent")
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import store from '@/store'
  import ActivityList from '@/components/ActivityList.vue'
  import { useMeta } from 'vue-meta'
  import ContractListener from '../components/ContractListener.vue'

  const route = useRoute()

  useMeta(store.getters.meta({ title: `activity :: ${route.params.networkName.toUpperCase()}` }))

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
      moves.value = await store.dispatch('getMoves', { cached, network: { name: route.params.networkName }})
      loaded.value++
    } catch (e) {
      console.error(e)
    }
  }

  const getMints = async ({ cached = false }) => {
    try {
      mints.value = await store.dispatch('getMints', { cached, network: { name: route.params.networkName }})  
      loaded.value++
    } catch (e) {
      console.error(e)
    }
  }

  const getReprograms = async ({ cached = false }) => {
    try {
      reprograms.value = await store.dispatch('getReprograms', { cached, network: { name: route.params.networkName }})  
      loaded.value++
    } catch (e) {
      console.error(e)
    }
  }

  const onContractEvent = ({ type }) => {
    return type === 'mint' ? getMints({ cached: false })
      : type === 'move' ? getMoves({ cached: false })
        : null
  }

  getReprograms({ cached: true })
  getMints({ cached: true })
  getMoves({ cached: true })
</script>