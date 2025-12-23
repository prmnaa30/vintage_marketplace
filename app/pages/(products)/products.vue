<template>
  <UContainer class="mb-12 grid relative">
    <ProductContainer
      container-type="Full"
      label="Items"
      :is-loading="productStore.isLoading"
      :products="productStore.products"
    />

    <div class="absolute top-8 right-8 flex gap-2">
      <ProductFilter
        v-model="selectedCategories"
        selection-type="multiple"
        placeholder="Select Categories"
        class="w-44"
        :items="productStore.availableCategories"
      />
      <ProductFilter
        v-model="selectedBrand"
        selection-type="single"
        placeholder="Select Brand"
        class="w-44"
        :items="productStore.availableBrands"
      />

      <UButton
        label="Reset"
        color="neutral"
        :disabled="!selectedBrand && selectedCategories.length === 0"
        class="cursor-pointer"
        @click="resetFilter"
      />
    </div>

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
import ProductFilter from '~/components/product/ProductFilter.vue'

const route = useRoute()
const router = useRouter()

const searchStore = useSearchStore()
const { productStore, initializeProducts, loadMoreProducts } = useProductFetch()

const searchInput = ref(route.query.q?.toString() || '')
const selectedBrand = computed({
  get: () => route.query.brand?.toString() || '',
  set: val => updateFilter('brand', val)
})
const selectedCategories = computed({
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

const resetFilter = () => {
  // Reset semua filter
  searchStore.resetSearchQuery()
  searchInput.value = ''

  // Hapus query parameter untuk brand dan categories
  const newQuery = { ...route.query }
  delete newQuery.brand
  delete newQuery.categories
  delete newQuery.q

  router.push({ path: '/products', query: newQuery })
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
