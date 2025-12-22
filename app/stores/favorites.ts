import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, getFirestore, increment } from 'firebase/firestore'

export interface FavoriteItem {
  productId: string
  addedAt: Date
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favoriteItems: [] as string[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    favoriteCount: state => state.favoriteItems.length,
    isFavorite: state => (productId: string) => state.favoriteItems.includes(productId)
  },

  actions: {
    async fetchFavorites() {
      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user?.value) {
          this.favoriteItems = []
          return
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)
        const authUser = user.value

        const userDocRef = doc(db, 'users', authUser.uid)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data()
          this.favoriteItems = userData.favorites || []
        } else {
          this.favoriteItems = []
        }
      } catch (err) {
        console.error('Error fetching favorites:', err)
        this.error = (err as Error).message
        this.favoriteItems = []
      } finally {
        this.isLoading = false
      }
    },

    async addToFavorites(productId: string) {
      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user?.value) {
          throw new Error('User not authenticated')
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)
        const authUser = user.value

        // Add to user's favorites in Firestore
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, {
          favorites: arrayUnion(productId)
        })

        // Update product's likes count
        const productDocRef = doc(db, 'products', productId)
        await updateDoc(productDocRef, {
          likesCount: increment(1)
        })

        // Update local state
        if (!this.favoriteItems.includes(productId)) {
          this.favoriteItems.push(productId)
        }
      } catch (err) {
        console.error('Error adding to favorites:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async removeFromFavorites(productId: string) {
      this.isLoading = true
      this.error = null

      try {
        const user = useCurrentUser()
        if (!user?.value) {
          throw new Error('User not authenticated')
        }

        const app = useFirebaseApp()
        const db = getFirestore(app)
        const authUser = user.value

        // Remove from user's favorites in Firestore
        const userDocRef = doc(db, 'users', authUser.uid)
        await updateDoc(userDocRef, {
          favorites: arrayRemove(productId)
        })

        // Update product's likes count
        const productDocRef = doc(db, 'products', productId)
        await updateDoc(productDocRef, {
          likesCount: increment(-1)
        })

        // Update local state
        this.favoriteItems = this.favoriteItems.filter(id => id !== productId)
      } catch (err) {
        console.error('Error removing from favorites:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async toggleFavorite(productId: string) {
      if (this.isFavorite(productId)) {
        await this.removeFromFavorites(productId)
      } else {
        await this.addToFavorites(productId)
      }
    },

    async getFavoriteProducts() {
      if (this.favoriteItems.length === 0) {
        return []
      }

      const app = useFirebaseApp()
      const db = getFirestore(app)

      // Get all favorite products
      const productPromises = this.favoriteItems.map(async (productId) => {
        const productDocRef = doc(db, 'products', productId)
        const productDocSnap = await getDoc(productDocRef)

        if (productDocSnap.exists()) {
          return {
            id: productDocSnap.id,
            ...productDocSnap.data()
          }
        }
        return null
      })

      const products = await Promise.all(productPromises)
      return products.filter(product => product !== null)
    }
  }
})
