import { defineStore } from 'pinia'

export const useMyMenuItemsStore = defineStore({
  id: 'myMenuItemsStore',
  state: () => ({
    normal:[
      {
        label:'home',
        to:'/'
      },
      {
        label:'about',
        to:'/'
      },
      {
        label:'contact',
        to:'/'
      },
    ],
    admin:[{
        label: 'Dashboard',
        icon: 'i-heroicons-information-circle',
        to:'/administrator/'
        //defaultOpen: true,
        ///items:[]
      }, {
        label: 'Warehouse',
        icon: 'i-material-symbols-light-warehouse-outline-rounded',
        //disabled: true,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      },
      {
        label: 'Products',
        icon: 'i-material-symbols-light-grocery-sharp',
        //disabled: true,
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      },
       {
        label: 'Categories',
        icon: 'i-material-symbols-light-category-outline-rounded',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      }, {
        label: 'Customers',
        icon: 'i-material-symbols-light-perm-contact-calendar-outline-rounded',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      }, {
        label: 'Suppliers',
        icon: 'i-material-symbols-light-forklift-rounded',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      },
       {
        label: 'Utilities',
        icon: 'i-heroicons-wrench-screwdriver',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      },
      {
        label: 'Settings',
        icon: 'i-material-symbols-light-settings-rounded',
        to:'/administrator/settings'
        //content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
      }
      ]
    
   }),
  actions: {}
})
