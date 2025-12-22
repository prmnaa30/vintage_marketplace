<template>
  <div class="relative">
    <NuxtLink :to="'/product/' + product.id">
      <div class="w-50 h-74 p-2 rounded-md flex flex-col justify-between hover:bg-accented transition-colors duration-200">
        <div>
          <NuxtImg
            :src="product.image"
            :alt="product.name"
            class="h-45 w-full object-cover"
            loading="lazy"
            :placeholder="true"
          />

          <h1 class="text-primary mt-1">
            Rp{{ product.price }}
          </h1>

          <h2 class="text-sm text-neutral-500">
            {{ product.name }}
          </h2>
        </div>

        <div class="w-full flex justify-between text-neutral-500">
          <UBadge
            :ui="{ base: 'text-neutral-500 bg-transparent p-0' }"
          >
            {{ product.size }}
          </UBadge>
          <div class="relative">
            <!-- Placeholder for the favorite button to maintain layout -->
          </div>
        </div>
      </div>
    </NuxtLink>

    <!-- Favorite button positioned absolutely on top of the card -->
    <div class="absolute bottom-1 right-2 z-10">
      <UTooltip
        :delay-duration="250"
        text="Add to favorites"
        :content="{
          align: 'center',
          side: 'top'
        }"
      >
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          class="cursor-pointer text-muted"
          @click="toggleFavorite"
        >
          <font-awesome-icon
            :icon="isFavorite(product.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
            :style="{ color: isFavorite(product.id) ? '#ff0000' : '#9ca3af' }"
          />

          {{ currentLikesCount }}
        </UButton>
      </UTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCardType } from '~/types'

const props = defineProps<{
  product: ProductCardType
}>()

const favoritesStore = useFavoritesStore()
const toast = useToast()

// Use a local ref to track the current likes count that updates immediately for better UX
const currentLikesCount = ref(props.product.likesCount)

const isFavorite = computed(() => (productId: string) => {
  return favoritesStore.isFavorite(productId)
})

const toggleFavorite = async () => {
  try {
    // Update the local likes count immediately for better UX
    if (isFavorite.value(props.product.id)) {
      // Removing from favorites - decrement likes count
      currentLikesCount.value = Math.max(0, currentLikesCount.value - 1)
    } else {
      // Adding to favorites - increment likes count
      currentLikesCount.value = currentLikesCount.value + 1
    }

    await favoritesStore.toggleFavorite(props.product.id)

    // Show feedback to user
    if (favoritesStore.isFavorite(props.product.id)) {
      toast.add({
        title: 'Added to Favorites',
        description: `${props.product.name} has been added to your favorites`,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Removed from Favorites',
        description: `${props.product.name} has been removed from your favorites`,
        color: 'neutral'
      })
    }
  } catch (error) {
    // If there's an error, revert the local likes count
    currentLikesCount.value = props.product.likesCount
    console.error('Error toggling favorite:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update favorites. Please try again.',
      color: 'error'
    })
  }
}
</script>
