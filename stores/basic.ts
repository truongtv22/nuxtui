import { defineStore } from 'pinia'

export const useMyBasicStore = defineStore({
  id: 'myBasicStore',
  state: () => ({ 
    screenSize:{
      w:null,
      h:null
    }
  }),
  actions: {
    updateSizeScreen(screen){
      this.screenSize=screen
    }
  }
})
