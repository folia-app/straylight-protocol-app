<template lang="pug">
<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio><path stroke-linecap="round" stroke-linejoin="round" :stroke-width="strokeWidth" d="M19 9l-7 7-7-7"></path></svg>
</template>

<script>
export default {
  name: 'SvgChevronDown',
  props: {
    strokeWidth: { type: String, default: '2' }
  }
}
</script>

<style>
</style>
