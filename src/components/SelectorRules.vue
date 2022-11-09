<template>
  <div class="selector-rules lowercase text-smm relative z-20 flex justify-between">
    <Combobox ref="comboboxRef" v-model="selected" class="w-64" v-slot="{ activeOption }">
      <div class="relative mt-1">
        <!-- input -->
        <div
          class="relative w-full cursor-default overflow-hidden rounded-lg border text-left"
        >
          <ComboboxInput
            class="selector-rules__input w-full border-none py-2 pl-3 pr-10  leading-5 focus_bg-accent2 focus_text-accent1 lowercase"
            :displayValue="(rule) => rule.nickname || rule.name || rule.rule"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2 focus_ring-0"
          >
            <ChevronUpDownIcon class="h-5 w-5 text-inherit " aria-hidden="true" />
          </ComboboxButton>
        </div>

        <!-- dropdown -->
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute mt-1 max-h-80 w-full overflow-auto rounded-md bg-accent2 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus_outline-none text-left"
          >
            <div
              v-if="fileteredRules.length === 0 && query !== ''"
              class="relative cursor-default select-none py-2 px-4"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="rule in fileteredRules"
              as="template"
              :key="rule.id"
              :value="rule"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-black-a08 rounded-lg text-accent1': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ rule.nickname || rule.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-whiteff': active, 'text-teal-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>

        <!-- bootleg activeOption emitter -->
        <img v-show="false" :key="activeOption ? activeOption.rule : 'empty'" :src="'/fail.jpg'" @error="emit('activeOptionChanged', activeOption)" />

      </div>
    </Combobox>

    <!-- refresh button -->
    <button class="px-4 rounded-full flex items-center" @click.prevent.stop="randomRule">
      <arrow-path-icon class="h-6 w-6 transform scale-110 origin-center"></arrow-path-icon>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/24/solid'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'
import rules from '../../contracts/rulesSelected.js'

const props = defineProps(['modelValue', 'initRule', 'autoFocus'])
const emit = defineEmits(['update:modelValue', 'activeOptionChanged'])

const selected = ref({})
const query = ref('')
const comboboxRef = ref()

onMounted(() => console.log(comboboxRef.value.$slots.activeOption))


const fileteredRules = computed(() =>
  query.value === ''
    ? rules
    : rules.filter((rule) =>
        (rule.nickname || rule.name)
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, ''))
      )
)

const randomRule = () => {
  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  selected.value = rules[randInt(0, rules.length - 1)]
}

const setIntialValue = () => {
  if (props.initRule) {
    const ruleset = rules.find(set => set.rule === props.initRule)
    if (ruleset) {
      selected.value = ruleset
      return
    }
  }
  randomRule()
}

setIntialValue()
// emit init value
emit('update:modelValue', selected.value)

// emit updates
watch(selected, () => {
  emit('update:modelValue', selected.value)
})
</script>

<style>
.selector-rules__input:focus + button{
  @apply text-accent1
}
</style>
