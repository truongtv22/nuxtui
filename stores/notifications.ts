import { defineStore } from 'pinia'
export const useMyNotificationsStore = defineStore({
  id: 'myNotificationsStore',
  state: () => ({
    icon:null
   }),
  actions: {
    showNotification(data){
      switch( data.type){
        case 'success':
          data.icon='i-material-symbols-light-check-rounded'
          break
        case 'warning':
          data.icon='i-material-symbols-light-warning-outline-rounded'
          break
        case 'error':
          data.icon='i-material-symbols-light-chat-error-outline-rounded'
          break
      }
      useToast().add(data)
    }
  }
})
