import { resolve } from "chart.js/helpers";
import login from '../../login'

export default defineEventHandler(async (event) => {
  const headers=await useStorage().getItem('headers')
  const body=await readMultipartFormData(event)
  const data=new FormData()
  body?.forEach(item=>{
    const blob = new Blob([item.data], { type: item.type });
    data.append(item.name, blob)
  })
  const promise=new Promise(async (resolve,reject)=>{
    await $fetch('https://banhang.shopee.vn/api/v3/general/upload_image/?SPC_CDS=d0b4cb2d-aa9d-456a-9651-b11b4d581a0a&SPC_CDS_VER=2&ratio=1',{
      method:'POST',
      body:data,
      headers:headers
    }).then(res=>{
      if(res['code']==0){
        const obj={
          'status':'success',
          'data':{
            original:`https://cf.shopee.vn/file/${res['data']['resource_id']}`,
            small:`https://cf.shopee.vn/file/${res['data']['resource_id']}_tn`
          }
        }
        resolve(obj)
      }
      else{
        const obj={
          'status':'error',
          'data':null
        }
        resolve(obj)
      }
      
      
    }).catch(async (error)=>{
      const rs=await login()
      if(rs){
          await useStorage().setItem('headers',rs)
      }
      //console.log(error)
      const obj={
        'status':'error',
        'data':error
      }
      resolve(obj)
    })
  })
  return promise
})
