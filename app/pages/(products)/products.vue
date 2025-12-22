<template>
  <UContainer class="mb-12 grid">
    <ProductContainer
      container-type="Full"
      label="Items"
      :is-loading="productStore.isLoading"
      :products="productStore.products"
    />

    <UButton
      v-if="productStore.products.length > 0"
      :label="productStore.hasMore && productStore.products.length > 0 ? 'Load More Items' : 'You\'ve reach the end'"
      :disabled="!productStore.hasMore && productStore.products.length === 0"
      :ui="{
        base: 'w-full flex justify-center'
      }"
      class="w-80 mx-auto cursor-pointer"
      @click="loadMoreProducts"
    />
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const searchStore = useSearchStore()
const { productStore, initializeProducts, loadMoreProducts } = useProductFetch()

const searchInput = ref(route.query.q?.toString() || '')
const _selectedBrand = computed({
  get: () => route.query.brand?.toString() || '',
  set: val => updateFilter('brand', val)
})
const _selectedCategories = computed({
  get: () => {
    const c = route.query.categories
    if (!c) return []
    return typeof c === 'string' ? c.split(',') : (c as string[])
  },
  set: val => updateFilter('categories', val)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateFilter = (key: 'brand' | 'categories' | 'q', value: any) => {
  const newQuery = { ...route.query }

  if (key === 'categories') {
    newQuery[key] = value.length === 0 ? undefined : value.join(',')
  } else {
    newQuery[key] = value || undefined
  }

  router.push({ query: newQuery })
}

const _resetFilter = () => {
  searchStore.resetSearchQuery()
  searchInput.value = ''
  router.push('/products')
}

// Watch for route changes and fetch products accordingly
watch(
  () => route.query,
  async (newQuery, oldQuery) => {
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      if (route.query.q !== searchInput.value) {
        searchInput.value = route.query.q?.toString() || ''
      }

      // Reinitialize products when route changes
      await initializeProducts()
    }
  },
  { deep: true }
)

// Initialize products on mount
onMounted(async () => {
  await initializeProducts()
})
</script>
