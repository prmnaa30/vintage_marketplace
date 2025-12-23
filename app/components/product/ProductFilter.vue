<template>
  <USelectMenu
    v-model="selectedValue"
    :multiple="selectionType === 'multiple'"
    :items="items"
    :placeholder="placeholder"
    :search-input="{
      placeholder: 'Filter...',
      icon: 'i-lucide-search'
    }"
    :ui="{ content: 'min-w-fit' }"
  >
    <template #item-label="{ item }">
      {{ item }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
const selectedValue = defineModel<string | string[]>()

defineProps<{
  selectionType: 'single' | 'multiple'
  items: string[]
  placeholder: string
}>()
</script>
