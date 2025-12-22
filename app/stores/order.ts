import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getFirestore
} from 'firebase/firestore'
import type { CartItem } from '~/types'

export interface Order {
  id: string
  items: CartItem[]
  address: {
    recipient: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  totalAmount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date | string
  userId: string
  email?: string
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    getUserOrders: (state) => {
      return (userId: string) => {
        return state.orders.filter(order => order.userId === userId)
      }
    },

    getOrderById: (state) => {
      return (orderId: string) => {
        return state.orders.find(order => order.id === orderId) || null
      }
    },

    getTotalOrders: (state) => {
      return state.orders.length
    }
  },

  actions: {
    // Membuat order baru
    async createOrder(orderData: Omit<Order, 'id'>) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const db = getFirestore(app)

        // Tambahkan data order ke Firestore
        const ordersCollection = collection(db, 'orders')
        const docRef = await addDoc(ordersCollection, {
          ...orderData,
          createdAt: orderData.createdAt instanceof Date
            ? orderData.createdAt
            : new Date(orderData.createdAt)
        })

        // Tambahkan order ke state
        const newOrder: Order = {
          ...orderData,
          id: docRef.id
        }

        this.orders.push(newOrder)
        this.currentOrder = newOrder

        return newOrder
      } catch (err) {
        console.error('Error creating order:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Mendapatkan order berdasarkan ID
    async fetchOrderById(orderId: string) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const db = getFirestore(app)

        const orderDoc = doc(db, 'orders', orderId)
        const orderSnapshot = await getDoc(orderDoc)

        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data()
          const orderDate = orderData.createdAt
          const order: Order = {
            id: orderSnapshot.id,
            ...orderData,
            createdAt: orderDate instanceof Date ? orderDate : new Date(orderDate?.seconds * 1000 || orderDate)
          } as Order

          // Update state
          const existingIndex = this.orders.findIndex(o => o.id === orderId)
          if (existingIndex === -1) {
            this.orders.push(order)
          } else {
            this.orders[existingIndex] = order
          }

          this.currentOrder = order
          return order
        } else {
          throw new Error('Order not found')
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Mendapatkan semua order dari seorang pengguna
    async fetchUserOrders(userId: string) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const db = getFirestore(app)

        const ordersQuery = query(
          collection(db, 'orders'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )

        const ordersSnapshot = await getDocs(ordersQuery)
        const userOrders: Order[] = []

        ordersSnapshot.forEach((doc) => {
          const orderData = doc.data()
          const orderDate = orderData.createdAt
          const order: Order = {
            id: doc.id,
            items: orderData.items || [],
            address: orderData.address || {},
            totalAmount: orderData.totalAmount || 0,
            status: orderData.status || 'pending',
            createdAt: orderDate instanceof Date ? orderDate : new Date(orderDate?.seconds * 1000 || orderDate),
            userId: orderData.userId || '',
            email: orderData.email || ''
          }

          userOrders.push(order)
        })

        // Update state
        this.orders = userOrders
        return userOrders
      } catch (err) {
        console.error('Error fetching user orders:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    // Memperbarui status order
    async updateOrderStatus(orderId: string, status: Order['status']) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const db = getFirestore(app)

        const orderRef = doc(db, 'orders', orderId)
        await updateDoc(orderRef, { status })

        // Update state lokal
        const orderIndex = this.orders.findIndex(order => order.id === orderId)
        if (orderIndex >= 0) {
          this.orders[orderIndex]!.status = status
        }

        if (this.currentOrder?.id === orderId) {
          this.currentOrder.status = status
        }
      } catch (err) {
        console.error('Error updating order status:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    }
  }
})
