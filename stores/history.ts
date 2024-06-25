import { defineStore } from 'pinia'

export const useMyHistoryStore = defineStore({
  id: 'myHistoryStore',
  state: () => ({ 
    search:[]
  }),
  actions: {
    insertSearch(item){
      this.search.push(item)
    }
  }
})
