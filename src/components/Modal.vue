<template>
<Dialog :open="true" class="relative z-50 text-md">
  <!-- The backdrop, rendered as a fixed sibling to the panel container -->
  <div class="fixed inset-0 bg-black/70" aria-hidden="true" />

  <!-- Full-screen scrollable container -->
  <div class="fixed inset-0 overflow-y-auto cursor-pointer" @click="close()">
    <!-- Container to center the panel -->
    <div class="flex min-h-full items-center justify-center px-6 py-12">
      <!-- The actual dialog panel -->
      <DialogPanel class="w-full max-w-xl rounded bg-accent1 border border-gray-800 rounded-xl px-10 py-10 text-center cursor-default" @click.stop>
        <slot></slot>
      </DialogPanel>
    </div>
  </div>
</Dialog>
</template>

<script setup>
  import { Dialog, DialogPanel } from '@headlessui/vue'

  const emit = defineEmits(['close'])

  const close = () => emit('close')
</script>