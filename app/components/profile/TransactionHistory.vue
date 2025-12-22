<template>
  <UCard>
    <div class="mb-4">
      <UInput
        v-model="searchQuery"
        placeholder="Search transactions..."
        icon="i-lucide-search"
        size="md"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-3 px-2">
              Order ID
            </th>
            <th class="text-left py-3 px-2">
              Date
            </th>
            <th class="text-left py-3 px-2">
              Status
            </th>
            <th class="text-left py-3 px-2">
              Total Amount
            </th>
            <th class="text-left py-3 px-2">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in filteredOrders"
            :key="order.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="py-3 px-2">
              #{{ order.id }}
            </td>
            <td class="py-3 px-2">
              {{ formatDate(order.createdAt) }}
            </td>
            <td class="py-3 px-2">
              <UBadge
                :color="getStatusColor(order.status)"
                variant="solid"
              >
                {{ order.status }}
              </UBadge>
            </td>
            <td class="py-3 px-2">
              Rp{{ order.totalAmount.toLocaleString() }}
            </td>
            <td class="py-3 px-2">
              <UButton
                label="View Details"
                size="xs"
                variant="ghost"
                @click="viewOrderDetails(order)"
              />
            </td>
          </tr>
          <tr v-if="filteredOrders.length === 0">
            <td
              colspan="5"
              class="text-center py-8 px-2 text-gray-500"
            >
              No transactions found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-sm text-gray-500">
        Showing {{ startIndex }} to {{ endIndex }} of {{ filteredOrders.length }} results
      </div>
      <div class="flex space-x-2">
        <UButton
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          Previous
        </UButton>
        <UButton
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          Next
        </UButton>
      </div>
    </div>
  </UCard>

  <!-- Order Detail Modal -->
  <OrderDetailModal
    v-model="showDetailModal"
    :order="selectedOrder"
    @close="showDetailModal = false"
  />
</template>

<script setup lang="ts">
import type { Order } from '~/stores/order'
import OrderDetailModal from './OrderDetailModal.vue'

const orderStore = useOrderStore()
const toast = useToast()

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

// State untuk detail modal
const showDetailModal = ref(false)
const selectedOrder = ref<Order | null>(null)

// Ambil pesanan dari store
const orders = computed(() => orderStore.orders)

// Filter pesanan berdasarkan pencarian
const filteredOrders = computed(() => {
  if (!searchQuery.value) {
    return orders.value
  }

  const query = searchQuery.value.toLowerCase()
  return orders.value.filter(order =>
    order.id.toLowerCase().includes(query)
    || order.status.toLowerCase().includes(query)
    || order.totalAmount.toString().includes(query)
  )
})

// Hitung pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredOrders.value.length))

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

// Fungsi untuk melihat detail pesanan
const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
  showDetailModal.value = true
}

// Ambil semua pesanan pengguna saat komponen dimuat
onMounted(async () => {
  try {
    const user = useCurrentUser()
    if (user?.value) {
      await orderStore.fetchUserOrders(user.value.uid)
    }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    toast.add({
      title: 'Error',
      description: 'Failed to load transaction history',
      color: 'error'
    })
  }
})
</script>
