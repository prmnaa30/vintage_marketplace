<template>
  <UModal
    :open="isOpen"
    :transition="true"
  >
    <template #header>
      <div class="flex w-full justify-between items-center">
        <h3 class="text-lg font-bold">
          Order #{{ order?.id }}
        </h3>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          @click="closeModal"
        />
      </div>
    </template>

    <template #body>
      <div v-if="order">
        <div class="mb-4">
          <h4 class="font-semibold mb-2">
            Order Status
          </h4>
          <UBadge
            :color="getStatusColor(order.status)"
            variant="solid"
          >
            {{ order.status }}
          </UBadge>
        </div>

        <div class="mb-4">
          <h4 class="font-semibold mb-2">
            Order Date
          </h4>
          <p>{{ formatDate(order.createdAt) }}</p>
        </div>

        <div class="mb-4">
          <h4 class="font-semibold mb-2">
            Items
          </h4>
          <div
            v-for="item in order.items"
            :key="item.productId"
            class="flex items-center py-2 border-b"
          >
            <NuxtImg
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded mr-4"
            />
            <div class="flex-1">
              <h5 class="font-medium">
                {{ item.name }}
              </h5>
              <p class="text-sm text-gray-500">
                {{ item.size }} / {{ item.color }}
              </p>
            </div>
            <div class="text-right">
              <p class="font-medium">
                Rp{{ item.price.toLocaleString() }}
              </p>
              <p class="text-sm text-gray-500">
                Qty: {{ item.quantity }}
              </p>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <h4 class="font-semibold mb-2">
            Shipping Address
          </h4>
          <p>{{ order.address.recipient }}</p>
          <p>{{ order.address.phone }}</p>
          <p>{{ order.address.address }}</p>
          <p>{{ order.address.city }}, {{ order.address.postalCode }}</p>
        </div>

        <div class="border-t pt-4">
          <div class="flex justify-between mb-1">
            <span>Subtotal</span>
            <span>Rp{{ calculateSubtotal().toLocaleString() }}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span>Shipping Fee</span>
            <span>Rp{{ calculateShippingFee().toLocaleString() }}</span>
          </div>
          <div class="flex justify-between mb-1">
            <span>Protection Fee</span>
            <span>Rp1,000</span>
          </div>
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>Rp{{ order.totalAmount.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Order } from '~/stores/order'

interface Props {
  modelValue: boolean
  order?: Order | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

// Fungsi untuk format tanggal
const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fungsi untuk warna status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'warning'
    case 'confirmed':
      return 'primary'
    case 'processing':
      return 'secondary'
    case 'shipped':
      return 'info'
    case 'delivered':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'neutral'
  }
}

// Calculate subtotal (items only, without fees)
const calculateSubtotal = () => {
  if (!props.order || !props.order.items) {
    return 0
  }

  // Calculate item total (price * quantity for each item)
  const itemTotal = props.order.items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0
    return sum + (itemPrice * itemQuantity)
  }, 0)

  return itemTotal
}

// Calculate total shipping fee
const calculateShippingFee = () => {
  if (!props.order || !props.order.items) {
    return 0
  }

  // Calculate shipping fees total (shippingFee * quantity for each item)
  const shippingFeeTotal = props.order.items.reduce((sum, item) => {
    const shippingFee = typeof item.shippingFee === 'number' ? item.shippingFee : 0
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0
    return sum + (shippingFee * itemQuantity)
  }, 0)

  return shippingFeeTotal
}
</script>
