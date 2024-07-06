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
          data.color='green'
          break
        case 'warning':
          data.icon='i-material-symbols-light-warning-outline-rounded'
          data.color='orange'
          break
        case 'error':
          data.icon='i-material-symbols-light-chat-error-outline-rounded'
          data.color='red'
          break
      }
      useToast().add(data)
    }
  }
})
