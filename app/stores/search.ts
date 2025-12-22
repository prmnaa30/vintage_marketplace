export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: ''
  }),

  actions: {
    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    resetSearchQuery() {
      this.searchQuery = ''
    }
  }
})
