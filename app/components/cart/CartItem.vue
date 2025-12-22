<template>
  <div class="flex flex-col gap-2 pt-2 pb-4">
    <div class="h-30 w-80 flex gap-4">
      <NuxtImg
        :src="cartItem.image"
        :alt="cartItem.name"
        class="h-full object-cover"
      />
      <div class="flex flex-col justify-between">
        <h2 class="mb-0">
          {{ cartItem.name }}
        </h2>
        <p class="text-sm text-muted">
          {{ cartItem.size }} / {{ cartItem.color }}
        </p>

        <p class="mt-auto font-semibold">
          Rp{{ cartItem.price.toLocaleString() }}
        </p>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <UButton
        label="Remove"
        variant="link"
        class="cursor-pointer"
        :ui="{
          base: 'text-red-400 hover:text-red-500 p-0'
        }"
        @click="removeItem"
      />

      <UInputNumber
        v-model="localQuantity"
        :min="1"
        :max="cartItem.stock"
        color="neutral"
        variant="outline"
        class="w-25"
        @update:model-value="updateQuantity"
      />
    </div>
  </div>

  <USeparator size="xl" />
</template>

<script setup lang="ts">
import type { CartItem } from '~/types'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()
const toast = useToast()

// Gunakan reactive reference untuk quantity
const localQuantity = ref(props.item.quantity)

// Gunakan computed untuk mengakses cart item
const cartItem = computed(() => props.item)

// Fungsi untuk mengupdate quantity di store
const updateQuantity = async (newQuantity: number | null) => {
  // Jika newQuantity null atau <= 0, jangan lakukan apa-apa
  if (newQuantity === null || newQuantity <= 0) {
    // Kembalikan ke nilai sebelumnya jika null
    if (newQuantity === null) {
      localQuantity.value = cartItem.value.quantity
    }
    return
  }

  try {
    await cartStore.updateQuantity(cartItem.value.productId, newQuantity)
    localQuantity.value = newQuantity
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err.message)
    // Kembalikan nilai jika gagal
    localQuantity.value = cartItem.value.quantity
    toast.add({
      title: 'Error',
      description: 'Failed to update quantity',
      color: 'error'
    })
  }
}

// Fungsi untuk menghapus item dari cart
const removeItem = async () => {
  try {
    await cartStore.removeItem(cartItem.value.productId)
    toast.add({
      title: 'Success',
      description: 'Item removed from cart',
      color: 'success'
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err)
    toast.add({
      title: 'Error',
      description: 'Failed to remove item',
      color: 'error'
    })
  }
}

// Sinkronkan perubahan dari store
watch(() => cartItem.value.quantity, (newQuantity) => {
  if (localQuantity.value !== newQuantity) {
    localQuantity.value = newQuantity
  }
})
</script>
