import { defineStore } from 'pinia'

export const useMyShopeeStore = defineStore({
  id: 'myShopeeStore',
  state: () => ({
    header:null
   }),
  actions: {
    async login(){
      let headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
        'Sec-Fetch-Site': 'same-origin',
        }
      let url='https://shopee.vn/api/v4/account/basic/get_account_info'
      await $fetch(url,{
        method:"GET",
        headers:headers
      }).then(res=>{
        console.log(res)
      })
    }
  }
})
