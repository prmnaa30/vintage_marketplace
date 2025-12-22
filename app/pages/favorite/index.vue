<template>
  <UContainer>
    <ProductContainer
      container-type="Full"
      label="Favorites"
      :href="{
        type: 'badge',
        text: favoriteProducts.length + ' items'
      }"
      :products="favoriteProducts"
      :is-loading="favoritesStore.isLoading"
    >
      <template #empty>
        <FavoriteEmpty />
      </template>
    </ProductContainer>
  </UContainer>
</template>

<script setup lang="ts">
import type { Product } from '~/types'
import FavoriteEmpty from '~/components/favorite/FavoriteEmpty.vue'

definePageMeta({
  middleware: ['auth']
})

const favoritesStore = useFavoritesStore()

const favoriteProducts = ref<Product[]>([])

// Fetch favorites on component mount
onMounted(async () => {
  await favoritesStore.fetchFavorites()
  const products = await favoritesStore.getFavoriteProducts()
  favoriteProducts.value = products as Product[]
})

// Watch for changes in favorites and update the displayed products
watch(() => favoritesStore.favoriteItems, async () => {
  const products = await favoritesStore.getFavoriteProducts()
  favoriteProducts.value = products as Product[]
}, { deep: true })

// Set page title
useSeoMeta({
  title: 'Favorite Products - Vintage Marketplace'
})
</script>
