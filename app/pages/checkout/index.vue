<template>
  <UContainer class="grid grid-cols-6 gap-6 my-8">
    <section class="grid grid-cols-1 col-span-4">
      <!-- order detail -->
      <UCard class="mb-4">
        <h2 class="text-lg font-bold mb-4">
          Order Details
        </h2>
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="flex justify-between items-center py-3 border-b"
        >
          <div class="flex items-center">
            <NuxtImg
              :src="item.image"
              :alt="item.name"
              class="w-16 h-16 object-cover rounded mr-4"
            />
            <div>
              <h3 class="font-semibold">
                {{ item.name }}
              </h3>
              <p class="text-sm text-muted">
                {{ item.size }} / {{ item.color }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold">
              Rp{{ (item.price * item.quantity).toLocaleString() }}
            </p>
            <p class="text-sm text-muted">
              {{ item.quantity }}x
            </p>
          </div>
        </div>
      </UCard>

      <UCard>
        <h2 class="text-lg font-bold mb-4">
          Delivery Address
        </h2>
        <div class="space-y-4 flex flex-col">
          <UInput
            v-model="addressForm.recipient"
            label="Recipient Name"
            placeholder="Enter recipient name"
            required
          />
          <UInput
            v-model="addressForm.phone"
            label="Phone Number"
            placeholder="Enter phone number"
            type="tel"
            required
          />
          <UTextarea
            v-model="addressForm.address"
            label="Address"
            placeholder="Enter full address"
            required
          />
          <UInput
            v-model="addressForm.city"
            label="City"
            placeholder="Enter city"
            required
          />
          <UInput
            v-model="addressForm.postalCode"
            label="Postal Code"
            placeholder="Enter postal code"
            required
          />
        </div>
      </UCard>
    </section>

    <UCard
      class="col-span-2 h-fit"
      as="section"
    >
      <h2 class="text-lg font-bold mb-4">
        Order Summary
      </h2>
      <div class="mb-4">
        <div class="flex justify-between font-bold">
          <h3>Subtotal ({{ cartStore.getTotalItems }} items)</h3>
          <p>Rp{{ cartStore.getTotalPrice.toLocaleString() }}</p>
        </div>

        <div class="flex justify-between text-sm text-muted">
          <p>Protection fee</p>
          <p>Rp{{ protectionFee.toLocaleString() }}</p>
        </div>

        <div class="flex justify-between text-sm text-muted">
          <p>Shipping</p>
          <p>Rp{{ totalShippingFee.toLocaleString() }}</p>
        </div>
      </div>

      <USeparator class="mb-4" />

      <div>
        <div class="flex justify-between font-bold text-lg mb-4">
          <h3>Total to pay</h3>
          <p>Rp{{ totalAmount.toLocaleString() }}</p>
        </div>

        <UButton
          label="Order now"
          size="lg"
          class="w-full"
          :disabled="cartStore.getTotalItems === 0 || isOrdering || !isAddressComplete"
          @click="handleOrder"
        />
      </div>
    </UCard>

    <!-- Success Modal -->
    <CheckoutSuccess
      :is-open="showSuccessModal"
      @close="showSuccessModal = false"
    />
  </UContainer>
</template>

<script setup lang="ts">
import CheckoutSuccess from '~/components/checkout/CheckoutSuccess.vue'
import { useOrderStore } from '~/stores/order'

const cartStore = useCartStore()
const orderStore = useOrderStore()
const toast = useToast()

// State untuk form alamat
const addressForm = reactive({
  recipient: '',
  phone: '',
  address: '',
  city: '',
  postalCode: ''
})

// State untuk modal dan loading
const showSuccessModal = ref(false)
const isOrdering = ref(false)

// Biaya tetap
const protectionFee = 100

// Total biaya pengiriman berdasarkan produk
const totalShippingFee = computed(() => {
  return cartStore.items.reduce((total, item) => {
    // Pastikan shippingFee adalah angka sebelum dijumlahkan
    const shippingFee = typeof item.shippingFee === 'number' ? item.shippingFee : 0
    return total + shippingFee * item.quantity
  }, 0)
})

// Total harga
const totalAmount = computed(() => {
  return cartStore.getTotalPrice + protectionFee + totalShippingFee.value
})

// Cek apakah semua field alamat telah diisi
const isAddressComplete = computed(() => {
  return addressForm.recipient.trim() !== ''
    && addressForm.phone.trim() !== ''
    && addressForm.address.trim() !== ''
    && addressForm.city.trim() !== ''
    && addressForm.postalCode.trim() !== ''
})

// Inisialisasi cart
onMounted(async () => {
  if (!cartStore.isInitialized) {
    await cartStore.initializeCart()
  }
})

// Fungsi untuk menangani proses order
const handleOrder = async () => {
  if (!addressForm.recipient || !addressForm.phone || !addressForm.address || !addressForm.city || !addressForm.postalCode) {
    toast.add({
      title: 'Error',
      description: 'Please fill in all address fields',
      color: 'error'
    })
    return
  }

  isOrdering.value = true

  try {
    // Ambil user yang sedang login
    const user = useCurrentUser()
    if (!user?.value) {
      toast.add({
        title: 'Error',
        description: 'User not authenticated',
        color: 'error'
      })
      return
    }

    // Struktur order
    const orderData = {
      items: cartStore.items,
      address: { ...addressForm },
      totalAmount: totalAmount.value,
      status: 'pending' as const,
      createdAt: new Date(),
      userId: user.value.uid,
      email: user.value.email || ''
    }

    // Buat order baru menggunakan order store
    await orderStore.createOrder(orderData)

    // Kosongkan keranjang setelah checkout berhasil
    await cartStore.clearCart()

    // Tampilkan modal sukses
    showSuccessModal.value = true
  } catch (error) {
    console.error('Checkout error:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to place order. Please try again.',
      color: 'error'
    })
  } finally {
    isOrdering.value = false
  }
}
</script>
