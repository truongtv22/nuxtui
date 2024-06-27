import { defineStore } from 'pinia'

export const useMyHistoryStore = defineStore({
  id: 'myHistoryStore',
  state: () => ({ 
    search:{
      products:[],
      suppliers:[]
    }
  }),
  actions: {
    insertSearch(type,item){
          this.search[`${type}`].push(item)
    }
  }
})
