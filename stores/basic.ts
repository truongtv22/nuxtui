import { defineStore } from 'pinia'

export const useMyBasicStore = defineStore({
  id: 'myBasicStore',
  state: () => ({ 
    screenSize:{
      w:null,
      h:null,
      name:null
    }
  }),
  actions: {
    updateSizeScreen(screen){
      this.screenSize.w=screen.w
      this.screenSize.h=screen.h
      if(screen.w>=640 && screen.w<768){
        this.screenSize.name='sm'
      }
      else if(screen.w>=768 && screen.w<1024){
        this.screenSize.name='md'
      }
      else if(screen.w>=1024 && screen.w<1280){
        this.screenSize.name='lg'
      }
      else if(screen.w>=1280 && screen.w<1536){
        this.screenSize.name='xl'
      }
      else if(screen.w>=1536){
        this.screenSize.name='2xl'
      }
      else if(screen.w<640){
        this.screenSize.name='xs'
      }
    }
  }
})
