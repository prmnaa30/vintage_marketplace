import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where
} from 'firebase/firestore'
import type {
  QueryConstraint,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import type { Product } from '~/types'

/**
 * Product store for managing product-related state and operations
 */
export const useProductStore = defineStore('product', {
  state: () => ({
    popularProducts: [] as Product[],
    newProducts: [] as Product[],
    products: [] as Product[],
    currentProduct: null as Product | null,
    relatedProducts: [] as Product[],
    randomProducts: [] as Product[],

    availableBrands: [] as string[],
    availableCategories: [] as string[],

    isLoading: false,
    error: null as string | null,

    lastDoc: null as QueryDocumentSnapshot | null,
    hasMore: true,
    pageSize: 18
  }),

  hydrate(storeState, _nuxtApp) {
    if (import.meta.client) {
      Object.assign(this, storeState)
    }
  },

  actions: {
    /**
     * * Fetches home page data including popular and new products
     */
    async fetchHomeData() {
      this.isLoading = true
      this.error = null

      const app = useFirebaseApp()
      const db = getFirestore(app)

      try {
        const popularProductsQry = query(
          collection(db, 'products'),
          orderBy('likesCount', 'desc'),
          limit(5)
        )
        const popularProductsSnap = await getDocs(popularProductsQry)
        this.popularProducts = popularProductsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]

        const newProductsQ = query(
          collection(db, 'products'),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
        const newProductsSnap = await getDocs(newProductsQ)
        this.newProducts = newProductsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Failed to load products: ', err)
        this.error = err.message

        throw err
      } finally {
        this.isLoading = false
      }
    },

    /**
     * * Fetches product metadata including available brands and categories
     */
    async fetchProductMetadata() {
      if (
        this.availableBrands.length > 0
        && this.availableCategories.length > 0
      ) {
        return
      }

      const app = useFirebaseApp()
      const db = getFirestore(app)

      try {
        const docRef = doc(db, 'metadata', 'attributes')
        const metadataSnap = await getDoc(docRef)

        if (metadataSnap.exists()) {
          const data = metadataSnap.data()
          if (data.brands) this.availableBrands = data.brands
          if (data.categories) this.availableCategories = data.categories
        }
      } catch (err) {
        console.error('Failed to load products metadata.', err)
      }
    },

    /**
     * ? Builds query constraints for product filtering
     * @param params - Filter parameters (search, brand, categories)
     * @param isLoadMore - Whether this is a load more request
     * @returns Object containing query constraints and flag for client-side filtering
     */
    buildQueryConstraints(params: { search?: string, brand?: string, categories?: string[] }, isLoadMore: boolean) {
      const constraints: QueryConstraint[] = []
      let runCategoryFilterOnClientSide = false

      if (params.brand) constraints.push(where('brand', '==', params.brand))

      if (params.search) {
        constraints.push(
          where(
            'searchKeywords',
            'array-contains',
            params.search.toLowerCase()
          )
        )

        if (params.categories && params.categories.length > 0) {
          runCategoryFilterOnClientSide = true
        }
      } else {
        if (params.categories && params.categories.length > 0) {
          constraints.push(where('category', 'in', params.categories))
        }

        constraints.push(orderBy('createdAt', 'desc'))
      }

      if (isLoadMore && this.lastDoc) {
        constraints.push(startAfter(this.lastDoc))
      }

      constraints.push(limit(this.pageSize))

      return { constraints, runCategoryFilterOnClientSide }
    },

    /**
     * * Fetches products based on provided parameters
     * @param params - Filter parameters (search, brand, categories)
     * @param isLoadMore - Whether to load more products (default: false)
     */
    async fetchProducts(
      params: {
        search?: string
        brand?: string
        categories?: string[]
      } = {},
      isLoadMore: boolean = false
    ) {
      if (!isLoadMore) {
        this.products = []
        this.lastDoc = null
        this.hasMore = true
      }

      if (isLoadMore && (!this.hasMore || this.isLoading)) return

      this.isLoading = true
      this.error = null

      const app = useFirebaseApp()
      const db = getFirestore(app)

      try {
        const productsRef = collection(db, 'products')

        const { constraints, runCategoryFilterOnClientSide } = this.buildQueryConstraints(params, isLoadMore)

        let querySnap
        if (constraints.length > 0) {
          const q = query(productsRef, ...constraints)
          querySnap = await getDocs(q)
        } else {
          querySnap = await getDocs(productsRef)
        }

        let results = querySnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[]

        if (runCategoryFilterOnClientSide && params.categories) {
          results = this.applyClientSideFilters(results, params.categories)
        }

        this.handlePagination(querySnap)

        if (isLoadMore) {
          this.products.push(...results)
        } else {
          this.products = results
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error occurred while fetching products: ', err)
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },

    /**
     * ? Helper function to applies client-side filters to the results
     * @param results - Array of products to filter
     * @param categories - Categories to filter by
     * @returns Filtered array of products
     */
    applyClientSideFilters(results: Product[], categories: string[]) {
      return results.filter(p => categories.includes(p.category))
    },

    /**
     * ? Helper function to handles pagination logic after fetching products
     * @param querySnap - Query snapshot from Firestore
     */
    handlePagination(querySnap: Awaited<ReturnType<typeof getDocs>>) {
      const lastVisibleProducts = querySnap.docs.at(-1)
      this.lastDoc = lastVisibleProducts as QueryDocumentSnapshot | null

      if (querySnap.docs.length < this.pageSize) {
        this.hasMore = false
      }
    },

    async fetchProductById(id: string) {
      const app = useFirebaseApp()
      const db = getFirestore(app)

      try {
        this.isLoading = true
        this.error = null

        const productRef = doc(db, 'products', id)
        const productSnap = await getDoc(productRef)

        if (productSnap.exists()) {
          const product = {
            id: productSnap.id,
            ...productSnap.data()
          } as Product

          this.currentProduct = product

          return product
        } else {
          this.error = 'Product not found'
          return null
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error occurred while fething data.', err)
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchRelatedProducts(currentProductId: string, brand?: string, category?: string) {
      const app = useFirebaseApp()
      const db = getFirestore(app)

      try {
        this.isLoading = true
        this.error = null

        const fetchedRelatedProducts = [] as Product[]

        if (category) {
          const categoryRef = query(
            collection(db, 'products'),
            where('category', '==', category),
            where('id', '!=', currentProductId),
            orderBy('createdAt', 'desc'),
            limit(4)
          )

          const categorySnap = await getDocs(categoryRef)
          const categoryProducts = categorySnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[]

          fetchedRelatedProducts.push(...categoryProducts)
        }

        if (brand) {
          const brandRef = query(
            collection(db, 'products'),
            where('brand', '==', brand),
            where('id', '!=', currentProductId),
            orderBy('createdAt', 'desc'),
            limit(4)
          )

          const brandSnap = await getDocs(brandRef)
          const brandProducts = brandSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[]

          const filteredBrandProducts = brandProducts.filter(brandProd =>
            !fetchedRelatedProducts.some(catProd => catProd.id === brandProd.id)
          )

          const remainingSlots = 8 - fetchedRelatedProducts.length
          fetchedRelatedProducts.push(...filteredBrandProducts.slice(0, remainingSlots))
        }

        if (fetchedRelatedProducts.length < 8) {
          const additionalProductsRef = query(
            collection(db, 'products'),
            where('id', '!=', currentProductId),
            orderBy('createdAt', 'desc'),
            limit(8 - fetchedRelatedProducts.length)
          )

          const additionalProductsSnap = await getDocs(additionalProductsRef)
          const additionalProducts = additionalProductsSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[]

          const filteredAdditionalProducts = additionalProducts.filter(addProd =>
            !fetchedRelatedProducts.some(relProd => relProd.id === addProd.id)
          )

          fetchedRelatedProducts.push(...filteredAdditionalProducts)
        }

        this.relatedProducts = fetchedRelatedProducts.slice(0, 8)

        return this.relatedProducts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error occurred while fetching related products', err)
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchRandomProducts(count: number) {
      this.isLoading = true
      this.error = null

      try {
        const app = useFirebaseApp()
        const db = getFirestore(app)

        const productsCollection = collection(db, 'products')
        const productsSnapshot = await getDocs(productsCollection)
        const totalProducts = productsSnapshot.size

        if (totalProducts <= count) {
          this.randomProducts = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[]
        } else {
          const randomIndices = this.generateRandomIndices(totalProducts, count)

          const selectedProducts: Product[] = []
          randomIndices.forEach((index) => {
            const doc = productsSnapshot.docs[index]
            selectedProducts.push({
              id: doc?.id,
              ...doc?.data()
            } as Product)
          })

          this.randomProducts = selectedProducts
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Error occurred while fetching random products', err)
        this.error = err.message
        throw err
      } finally {
        this.isLoading = false
      }
    },

    generateRandomIndices(total: number, count: number): number[] {
      const indices = new Set<number>()
      while (indices.size < count && indices.size < total) {
        const randomIndex = Math.floor(Math.random() * total)
        indices.add(randomIndex)
      }
      return Array.from(indices)
    }
  }
})
