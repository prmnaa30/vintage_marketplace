export const useProductFetch = () => {
  const productStore = useProductStore()
  const route = useRoute()

  // Get currents query parameters helper func
  const getCurrentParams = () => {
    const search = route.query.q?.toString()
    const brand = route.query.brand?.toString()

    let categories: string[] = []
    if (route.query.categories) {
      if (typeof route.query.categories === 'string') {
        categories = route.query.categories ? route.query.categories.split(',') : []
      } else {
        categories = route.query.categories as string[]
      }
    }

    return {
      search, brand, categories
    }
  }

  const fetchProductsWrapper = async (params: { search?: string, brand?: string, categories?: string[] } = {}, isLoadMore = false) => {
    productStore.error = null

    try {
      await productStore.fetchProducts(params, isLoadMore)
    } catch (error) {
      console.error('Error fetching products:', error)
      productStore.error = error instanceof Error ? error.message : 'An unknown error occurred'
    }
  }

  const initializeProducts = async () => {
    await productStore.fetchProductMetadata()
    await fetchProductsWrapper(getCurrentParams(), false)
  }

  const loadMoreProducts = async () => {
    await fetchProductsWrapper(getCurrentParams(), true)
  }

  return {
    productStore,
    fetchProductsWrapper,
    initializeProducts,
    loadMoreProducts
  }
}
