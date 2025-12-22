<template>
  <div class="py-8">
    <div class="w-full flex mb-2 justify-between">
      <h1 class="text-lg font-bold">
        {{ label }}
      </h1>

      <NuxtLink
        v-show="href"
        :to="href?.link"
      >
        <UButton
          v-if="href?.type === 'link'"
          variant="link"
          label="See All"
          class="cursor-pointer"
        />

        <UButton
          v-else
          variant="outline"
          color="neutral"
          :label="href?.text"
        />
      </NuxtLink>
    </div>

    <USeparator
      v-show="containerType === 'Full'"
      class="mb-4"
    />

    <!-- FULL MODE -->
    <section v-if="containerType === 'Full'">
      <div class="grid grid-cols-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />

        <div
          v-if="isLoading"
          class="col-span-6"
        >
          <span class="w-full flex justify-center mt-8">
            <UIcon
              name="i-lucide-refresh-cw"
              size="20"
              class="text-info animate-spin"
            />
          </span>
        </div>

        <div
          v-else-if="products.length === 0"
          class="col-span-6 mt-12"
        >
          <slot
            v-if="$slots.empty"
            name="empty"
            :reset-keywords="resetKeywords"
          />
          <ProductNotFound
            v-else
            @reset-keywords="resetKeywords"
          />
        </div>
      </div>
    </section>

    <!-- DISPLAY MODE -->
    <div v-else>
      <div
        v-if="isLoading"
        class="col-span-6"
      >
        <span class="w-full flex justify-center mt-8">
          <UIcon
            name="i-lucide-refresh-cw"
            size="20"
            class="text-info animate-spin"
          />
        </span>
      </div>

      <div
        v-else-if="products.length === 0"
        class="col-span-6"
      >
        <slot
          v-if="$slots.empty"
          name="empty"
          :reset-keywords="resetKeywords"
        />
        <ProductNotFound
          v-else
          @reset-keywords="resetKeywords"
        />
      </div>

      <div
        v-else
        :class="['grid', `${displayColsSize ? 'grid-cols-'+ displayColsSize : 'grid-cols-4'}`]"
      >
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />

        <NuxtLink
          v-show="href"
          :to="href?.link"
          class="col-span-1"
        >
          <div class="w-full h-full flex items-center justify-center bg-secondary-50 hover:bg-secondary-100 transition-colors duration-200 rounded-md">
            <UButton
              variant="link"
              label="See All Products"
              class="cursor-pointer"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductCardType as ProductCard } from '~/types'

const searchStore = useSearchStore()
const router = useRouter()

defineProps<{
  products: ProductCard[]
  containerType: 'Full' | 'Display'
  isLoading: boolean
  label: string
  href?: {
    type?: 'link' | 'badge'
    link?: string
    text?: string
  }
  displayColsSize?: number
}>()

const resetKeywords = () => {
  searchStore.resetSearchQuery()
  router.push('/products')
}
</script>
