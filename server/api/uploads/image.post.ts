import { resolve } from "chart.js/helpers";

export default defineEventHandler(async (event) => {
  const body=await readMultipartFormData(event)
  const data=new FormData()
  body?.forEach(item=>{
    const blob = new Blob([item.data], { type: item.type });
    data.append(item.name, blob)
  })
  const promise=new Promise(async (resolve,reject)=>{
    await $fetch('https://banhang.shopee.vn/api/v3/general/upload_image/?SPC_CDS=d0b4cb2d-aa9d-456a-9651-b11b4d581a0a&SPC_CDS_VER=2&ratio=',{
      method:'POST',
      body:data,
      headers:{
        'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0',
        'cookie':"SPC_CDS=d0b4cb2d-aa9d-456a-9651-b11b4d581a0a; SPC_SC_SA_TK=; SPC_SC_SA_UD=; SPC_SC_OFFLINE_TOKEN=; SC_SSO=-; SC_SSO_U=-; SPC_SC_SESSION=1be108585643f887e57d9c17b98eac10_1_68760542; SPC_R_T_IV=WU5PWmIxVHJ4aVNSRU0yeQ==; SPC_T_ID=tYNfb1ZJUPI6ljXc5YzJ/9OwGODkFB3bajCHbhKQ0cpKIMCUfyMPXqIFTC8wHmCngy+5KOI4C0N+xerSKLOUgj6e/ILP0fkChwrKcFbgYUWj7ScTZN74pmAR6h15M05JKpvZYfEei1mX2CBu+sC5rd8Dek9B67ZIMsF478RH21I=; SPC_T_IV=WU5PWmIxVHJ4aVNSRU0yeQ==; SPC_SI=4BqFZgAAAABVWDRQcUJ6ay9IVQAAAAAAaWdJVUJaTWs=; SPC_R_T_ID=tYNfb1ZJUPI6ljXc5YzJ/9OwGODkFB3bajCHbhKQ0cpKIMCUfyMPXqIFTC8wHmCngy+5KOI4C0N+xerSKLOUgj6e/ILP0fkChwrKcFbgYUWj7ScTZN74pmAR6h15M05JKpvZYfEei1mX2CBu+sC5rd8Dek9B67ZIMsF478RH21I=; SPC_F=BoFmchdAc4AeMzudETyWxJ9WjvBxEyxz; REC_T_ID=9c6fc7af-3c5c-11ef-a729-5a147af1947e; _gcl_au=1.1.571968216.1720355394; _ga_4GPP1ZXG63=GS1.1.1720355394.1.0.1720355403.51.0.0; _ga=GA1.1.856201491.1720355395; _fbp=fb.1.1720355395236.9097492053072923; SPC_ST=.QXhKSDBaUk02czYzRFJXcyHIrIGgGowElGFSmCZgAz5XiEEZtbvT24JxaS/WxnQw4fDkGKOdAX3ymo/WUEq2KYiRuSqVCRJ/AReJPtqsu7q8CboyyQnE5QWDzB9khu7YA7nREFyNg2TB6MuYoxDw+KJDjSIlyw3rAqdkETHfo2XzYU6RaTjBtcaBJf6+/VJSfFAqp38goy/x18CXfLLJ+A==; SPC_CLIENTID=Qm9GbWNoZEFjNEFlimcnwcvbpedgfiiy; SPC_EC=.QXhKSDBaUk02czYzRFJXcyHIrIGgGowElGFSmCZgAz5XiEEZtbvT24JxaS/WxnQw4fDkGKOdAX3ymo/WUEq2KYiRuSqVCRJ/AReJPtqsu7q8CboyyQnE5QWDzB9khu7YA7nREFyNg2TB6MuYoxDw+KJDjSIlyw3rAqdkETHfo2XzYU6RaTjBtcaBJf6+/VJSfFAqp38goy/x18CXfLLJ+A==; SPC_SC_TK=dba5da35faafafa5f2cce52d62a336a5; SPC_SC_UD=68760542; SPC_STK=8vHhgAxtznL2wACSDvLL7hV8WW4J89m5TCKWJGLCxjPmZ3PyTU76/nc4AsJMl7EGkuCus3JCfC5FQACsaigzWkbnPXUQSUVMMeoxm4PIQvMNyELB+PWW2SCl9J9BaZIsivcfv96ili+nVqNee2KbUn+5o1R2CbJWvdzKHhrUXnFGq7AtrU/rbXLwus6Xi4dC+pAz8MEr9BRYyqZ4cX7S1g==; SC_DFP=vQhrfxjzypYxSRuiTsTEGWOakFfyiwyi; CTOKEN=94nlwDxcEe%2BPq%2BJenAymgw%3D%3D; SPC_CDS_CHAT=9df22c82-c389-432b-a371-40101457c6f5; _QPWSDCXHZQA=ea3a334c-aac7-41a0-dcde-92be4f1395bf; REC7iLP4Q=c5bea516-48e6-4ae5-8348-1389189ecb4c; shopee_webUnique_ccd=1lcLVU1GpwNSgHpqLOV4vA%3D%3D%7CNCIjvGU7HpC4U3HgIGXXmhAhWrVaf9k6SgyXQyyHhDXDer1a%2BWvBQMJvEMb%2Fpjowu5cihZSHX%2BPcig%3D%3D%7C9839DJlUKHgMwCTn%7C08%7C3; ds=bd403fea93c946967e1445cf7fdd04ac; web-seller-affiliate-region=vn; MOCK_TYPE=; language=vi; web-seller-affiliate_language=vi; _sapid=9fbeef490f34652f56f15808cd95adcc1ccfa015316df1823f283212"
      }
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
      
      
    }).catch(error=>{
      const obj={
        'status':'error',
        'data':error
      }
      resolve(obj)
    })
  })
  return promise
})
