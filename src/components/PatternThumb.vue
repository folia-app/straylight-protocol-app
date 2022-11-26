<template lang="pug">
router-link.pattern-thumb.block.aspect-square.border.border-gray-700.relative.text-xs.lg_text-sm.group.-mr-px.-mb-px(:to="{name: 'pattern', params: { pattern: props.rule.rule }}")
  //- (loading...)
  .absolute.overlay.flex.items-center.justify-center.text-accent3(v-if="!loaded || error", :class="{'animate-pulse': !error}")
    | {{ !error ? 'loading...' : 'error :(' }}
  //- (observer)
  observer(v-if="!loaded", @visible="load = true", :threshold="0.1")

  //- title
  h6.absolute.overlay.z-10.p-px.text-xs.leading-tight.lowercase.flex
    .h-9.px-3.flex.items-center.leading-none.rounded-full.pb-1.mouse_group-hover_bg-accent1 {{ props.rule.nickname }}

  //- (img)
  img.absolute.overlay.object-cover.object-center.transition.duration-150(v-if="load", :src="$store.getters.docsLink(`/_images/turmites/${props.rule.nickname}_0.png`)", @load="loaded = true", :class="{'opacity-0': !loaded}", @error="error = true")

  //- 
  .absolute.bottom-0.right-0.px-5.py-2.hidden.mouse_group-hover_block
    svg-eye.text-accent4
</template>

<script setup>
import { ref } from 'vue'
import Observer from '@/components/Observer.vue'
import SvgEye from '@/components/SVG-Eye.vue'

const props = defineProps(['rule'])

const load = ref(false)
const loaded = ref(false)
const error = ref(false)
</script>