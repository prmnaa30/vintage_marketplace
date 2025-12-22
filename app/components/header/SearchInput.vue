<template>
  <UInput
    v-model="searchValue"
    icon="i-lucide-search"
    size="lg"
    variant="outline"
    placeholder="Search for items..."
    class="w-200"
    @input="debounceInput"
  />
</template>

<script setup lang="ts">
const searchStore = useSearchStore()
const router = useRouter()

const searchValue = computed({
  get: () => searchStore.searchQuery,
  set: value => searchStore.setSearchQuery(value)
})

const sanitizeSearchQuery = (query: string) => {
  return query.replaceAll(/[?&=#]/g, '')
}

let timeoutId: NodeJS.Timeout

const debounceInput = (e: InputEvent) => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    const rawQuery = (e.target as HTMLInputElement).value
    const sanitizedQuery = sanitizeSearchQuery(rawQuery)

    searchStore.setSearchQuery(sanitizedQuery)

    router.push(`/products?q=${encodeURIComponent(sanitizedQuery)}`)
  }, 500)
}

watch(
  () => searchStore.searchQuery,
  (newValue) => {
    const sanitizedValue = sanitizeSearchQuery(newValue)
    if (sanitizedValue !== newValue) {
      searchStore.setSearchQuery(sanitizedValue)
    }
  }
)
</script>
