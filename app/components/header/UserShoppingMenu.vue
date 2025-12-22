<template>
  <div class="flex gap-1 items-center">
    <NuxtLink
      to="/cart"
      :tabindex="-1"
    >
      <div class="relative inline-block">
        <UButton
          variant="link"
          color="neutral"
          icon="i-lucide-shopping-cart"
          size="xl"
          class="cursor-pointer"
        />

        <UBadge
          v-if="cartStore.items.length > 0"
          color="error"
          variant="solid"
          class="absolute -top-1 -right-1 rounded-full"
          size="sm"
        >
          {{ cartStore.getTotalItems }}
        </UBadge>
      </div>
    </NuxtLink>

    <NuxtLink
      to="/favorite"
      :tabindex="-1"
    >
      <div class="relative inline-block">
        <UButton
          variant="link"
          color="neutral"
          icon="i-lucide-heart"
          size="xl"
          class="cursor-pointer"
        />

        <UBadge
          v-if="favoritesStore.favoriteCount > 0"
          color="error"
          variant="solid"
          class="absolute -top-1 -right-1 rounded-full"
          size="sm"
        >
          {{ favoritesStore.favoriteCount }}
        </UBadge>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()

onMounted(async () => {
  await cartStore.initializeCart()
})
</script>
