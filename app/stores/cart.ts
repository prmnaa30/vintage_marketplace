import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import type { Product, CartItem } from '~/types'
import { useCurrentUser } from 'vuefire'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    error: null as string | null,
    isLoading: false,
    isInitialized: false
  }),

  getters: {
    getTotalItems(): number {
      return this.items.reduce((total, item) => total + item.quantity, 0)
    },

    getTotalPrice(): number {
      return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },

    getProductQuantity: (state) => {
      return (productId: string) => {
        const item = state.items.find(item => item.productId === productId)
        return item ? item.quantity : 0
      }
    },

    isProductInCart: (state) => {
      return (productId: string) => {
        return state.items.some(item => item.productId === productId)
      }
    }
  },

  actions: {
    async initializeCart() {
      if (this.isInitialized) return

      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user || !user.value) {
          this.items = []
          this.isInitialized = true
          return
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)

        const cartRef = doc(db, 'carts', user.value.uid)
        const cartSnap = await getDoc(cartRef)

        if (cartSnap.exists()) {
          const cartData = cartSnap.data()
          this.items = cartData.items || []
        } else {
          await setDoc(cartRef, { items: [], userId: user.value.uid, createdAt: new Date() })
          this.items = []
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error occurred while fetching cart data.', err)
        this.error = err.message
        this.items = []
        this.isInitialized = false
      } finally {
        this.isLoading = false
      }
    },

    async saveCart() {
      try {
        const user = useCurrentUser()

        if (!user?.value) {
          console.warn('User is not authenticated')
          return
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)

        const cartRef = doc(db, 'carts', user.value.uid)
        await setDoc(cartRef, {
          items: this.items,
          updatedAt: new Date(),
          userId: user.value.uid
        }, { merge: true })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async addToCart(product: Product, quantity: number = 1) {
      const toast = useToast()

      if (!this.isInitialized) {
        await this.initializeCart()
      }

      if (!this.validateStock(product, quantity)) {
        toast.add({
          title: 'Error',
          description: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
          color: 'error'
        })

        return
      }

      const existingItemIndex = this.items.findIndex(item => item.productId === product.id)

      if (existingItemIndex >= 0) {
        const newQuantity = this.items[existingItemIndex]!.quantity + quantity
        if (this.validateStock(product, newQuantity)) {
          this.items[existingItemIndex]!.quantity = newQuantity
        } else {
          toast.add({
            title: 'Error',
            description: `Adding ${quantity} more would exceed available stock for ${product.name}. Available: ${product.stock}`,
            color: 'error'
          })

          return
        }
      } else {
        const cartItem: CartItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: product.size,
          color: product.color,
          stock: product.stock,
          shippingFee: product.shippingFee,
          quantity
        }
        this.items.push(cartItem)
      }

      await this.saveCart()
    },

    async updateQuantity(productId: string, quantity: number) {
      if (!this.isInitialized) {
        await this.initializeCart()
      }

      if (quantity <= 0) {
        await this.removeItem(productId)
        return
      }

      const itemIndex = this.items.findIndex(item => item.productId === productId)
      if (itemIndex !== -1) {
        const item = this.items[itemIndex]
        if (item && quantity > item.stock) {
          const toast = useToast()
          toast.add({
            title: 'Error',
            description: `Insufficient stock for ${item.name}. Available: ${item.stock}`,
            color: 'error'
          })
          return
        }

        this.items[itemIndex]!.quantity = quantity
        await this.saveCart()
      }
    },

    async removeItem(productId: string) {
      if (!this.isInitialized) {
        await this.initializeCart()
      }

      this.items = this.items.filter(item => item.productId !== productId)
      await this.saveCart()
    },

    async clearCart() {
      if (!this.isInitialized) {
        await this.initializeCart()
      }

      this.items = []
      await this.saveCart()
    },

    validateStock(product: Product, requestedQuantity: number): boolean {
      return product?.stock >= requestedQuantity
    },

    async handleAuthStateChange() {
      this.isInitialized = false
      await this.initializeCart()
    }
  }
})
