<template>
  <UContainer class="grid grid-cols-6 gap-4 my-4">
    <section class="col-span-4">
      <NuxtImg
        :src="currentProduct?.image"
        :alt="currentProduct?.name"
        class="w-full h-175 object-cover"
        loading="lazy"
        :placeholder="true"
      />

      <ProductContainer
        container-type="Display"
        label="Other Products"
        :display-cols-size="4"
        :products="relatedProducts"
        :is-loading="isRelatedProductsLoading"
      />
    </section>

    <section class="col-span-2">
      <UCard class="grid grid-cols-1 gap-2">
        <div class="mb-2 grid gap-1">
          <div class="flex justify-between">
            <h2 class="text-2xl font-bold">
              Rp{{ currentProduct?.price }}
            </h2>

            <UButton
              variant="link"
              color="neutral"
              class="cursor-pointer"
              @click="toggleFavorite"
            >
              <font-awesome-icon
                :icon="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                :style="{ color: isFavorite ? '#ff0000' : '#9ca3af' }"
                size="lg"
              />
            </UButton>
          </div>

          <h1 class="">
            {{ currentProduct?.name }}
          </h1>

          <div class="flex items-center text-muted">
            <p>{{ currentProduct?.size }}</p>
            <UIcon name="i-lucide-dot" />
            <p>{{ currentProduct?.condition }}</p>
            <UIcon name="i-lucide-dot" />
            <p>Denpasar</p>
          </div>
        </div>

        <USeparator />

        <div class="my-2">
          <h3 class="text-muted text-sm mb-2">
            Item Description
          </h3>
          <p>{{ currentProduct?.description }}</p>

          <dl class="grid grid-cols-2 my-4">
            <dt>Category</dt>
            <dd>{{ currentProduct?.category }}</dd>
            <dt>Size</dt>
            <dd>{{ currentProduct?.size }}</dd>
            <dt>Condition</dt>
            <dd>{{ currentProduct?.condition }}</dd>
            <dt>Color</dt>
            <dd>{{ currentProduct?.color }}</dd>
            <dt>Uploaded</dt>
            <dd>{{ currentProduct?.createdAt ? formatTimeAgo(currentProduct?.createdAt) : '' }}</dd>
            <dt>Shipping</dt>
            <dd>Rp{{ currentProduct?.shippingFee }}</dd>
          </dl>
        </div>

        <USeparator />

        <div class="mt-4 grid gap-2">
          <UButton
            label="Buy Now"
            size="xl"
            class="cursor-pointer"
            @click="handleBuyNow"
          />
          <UButton
            label="Add to Cart"
            size="xl"
            variant="outline"
            class="cursor-pointer"
            @click="handleAddToCart"
          />
        </div>
      </UCard>
    </section>

    <CartAddSuccess
      :is-open="showCartSuccessModal"
      :product-name="addedProductName"
      @close="closeCartSuccessModal"
    />
  </UContainer>
</template>

<script setup lang="ts">
import CartAddSuccess from '~/components/cart/CartAddSuccess.vue'
import { useTimeFormat } from '~/composables/useTimeFormat'

const productStore = useProductStore()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const { formatTimeAgo } = useTimeFormat()

const route = useRoute()
const toast = useToast()

const productId = computed(() => route.params.id as string)

// State untuk modal konfirmasi
const showCartSuccessModal = ref(false)
const addedProductName = ref('')

const handleAddToCart = async () => {
  const currentProduct = productStore.currentProduct
  if (!currentProduct) return

  if (!cartStore.isInitialized) {
    await cartStore.initializeCart()
  }

  addedProductName.value = currentProduct.name

  await cartStore.addToCart(currentProduct, 1)

  showCartSuccessModal.value = true
}

const closeCartSuccessModal = () => {
  showCartSuccessModal.value = false
}

const handleBuyNow = async () => {
  const currentProduct = productStore.currentProduct
  if (!currentProduct) return

  if (!cartStore.isInitialized) {
    await cartStore.initializeCart()
  }

  await cartStore.addToCart(currentProduct, 1)

  // Redirect to checkout page
  await navigateTo('/checkout')
}

const toggleFavorite = async () => {
  const currentProduct = productStore.currentProduct
  if (!currentProduct) return

  try {
    await favoritesStore.toggleFavorite(currentProduct.id)

    // Show feedback to user
    if (favoritesStore.isFavorite(currentProduct.id)) {
      toast.add({
        title: 'Added to Favorites',
        description: `${currentProduct.name} has been added to your favorites`,
        color: 'success'
      })
    } else {
      toast.add({
        title: 'Removed from Favorites',
        description: `${currentProduct.name} has been removed from your favorites`,
        color: 'neutral'
      })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to update favorites. Please try again.',
      color: 'error'
    })
  }
}

const isFavorite = computed(() => {
  const currentProduct = productStore.currentProduct
  return currentProduct ? favoritesStore.isFavorite(currentProduct.id) : false
})

const { data: currentProduct, pending: _isProductLoading, error: _productError } = await useAsyncData(
  `product-${productId.value}`,
  async () => {
    if (productId.value) {
      return await productStore.fetchProductById(productId.value)
    }
    return null
  },
  { watch: [productId] }
)

const { data: relatedProducts, pending: isRelatedProductsLoading, error: _relatedProductsError } = await useAsyncData(
  `related-products-${productId.value}`,
  async () => {
    if (currentProduct.value) {
      return await productStore.fetchRelatedProducts(
        productId.value,
        currentProduct.value.brand,
        currentProduct.value.category
      )
    }
    return []
  },
  { watch: [productId, currentProduct], default: () => [] }
)
// Handle errors
watchEffect(() => {
  if (_productError.value) {
    toast.add({
      title: 'Error',
      description: productStore.error || 'Error fetching product',
      color: 'error'
    })
  }
})

useSeoMeta({
  title: () => currentProduct.value?.name || 'Product Details',
  description: () => currentProduct.value?.description || 'View Product Details'
})
</script>
