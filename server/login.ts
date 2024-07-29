async function genDeviceId(){
  const url='https://df.infra.sz.shopee.vn/v2/shpsec/web/report'
  const headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    } 
  const data='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'
  return await $fetch.raw(url,{
    method:"POST",
    headers,
    body:JSON.stringify(data)
  }).then(res=>{
    res=res._data
    if(res['code']==0){
      const js=res
      return js['data']['riskToken']
    }
    return false
  })
}
export default async ()=>{
  let deviceId=await genDeviceId()
  let headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    'Sec-Fetch-Site': 'same-origin',
    }
  let url='https://shopee.vn/api/v4/account/basic/get_account_info'
  let requests=new Request(url)
    let data={"phone": '84352568944',
      "password": 'bcb1bac5908e6224e4264074451c22ec21ea82fc69665036e90766ec28cbc164',
      "support_ivs": true,
      "client_identifier": {
          "security_device_fingerprint": deviceId
      }
      }
    const rs=await $fetch.raw('https://shopee.vn/api/v4/account/login_by_password',{
      method:'post',
      body:JSON.stringify(data)
    }).then(async (rs0)=>{
      let js=rs0._data
      if(js['error']==0){
        headers['cookie']=''
        rs0.headers.getSetCookie().forEach(item=>{
          headers['cookie']+=item.split(';')[0]+';'
        })
        const rss=await $fetch.raw('https://banhang.shopee.vn/api/v2/login/?SPC_CDS=1',{headers}).then(rs1=>{
          rs1.headers.getSetCookie().forEach(item=>{
            item=item.split(';')[0]
            if(headers['cookie'].indexOf(item.split('=')[0])==-1){
              headers['cookie']+=item+';'
            }
          })
          headers.cookie+='SPC_CDS=1;'
          return headers
        })
        console.log("✅ SHOPEE LOGGED")
        return rss
      }
      else if(js['error']==98){
        const ivsToken=rs0['data']['ivs_token'],
        ivsFlow=rs0['data']['ivs_flow_no']
        let data = {"event": 1, "u_token": ivsToken}
        const rs1=await $fetch.raw('https://shopee.vn/api/v4/anti_fraud/ivs/methods',{headers,method:'post',body:JSON.stringify(data)}).then(async (rs2)=>{
          if(rs2.status<400){
            js=rs2._data
            const vToken = js['data'][0]['v_token']
            url = 'https://shopee.vn/api/v4/anti_fraud/ivs/link/email_verify'
            data = {
              "v_token": vToken,
              "request_id": ivsToken,
              "new_sender_meta": {
                  "security_device_fingerprint": deviceId
              }
            }
            const rs22=await $fetch.raw(url,{method:'post',headers,body:JSON.stringify(data)}).then(async (rs3)=>{
              if(rs3.status<400){
                js=rs3._data//
                const email=js['data']['email']
                console.log(`Please verify email begin ${email}`)
                const rToken = js['data']['r_token']
                url = 'https://shopee.vn/api/v4/anti_fraud/ivs/link/get_status'
                data = {'r_token': rToken}
                let stop = false
                const promise=new Promise((resolve,reject)=>{
                    const myInterval=setInterval(async ()=>{
                      console.log(new Date())
                      rs3=await $fetch.raw(url,{headers,method:'post',body:JSON.stringify(data)}).then(rs4=>{
                        if(rs4.status<400){
                          js=rs4._data
                          if(js['data']['link_status']==2){
                            stop=true
                            console.log(`${email} verified success`)
                            clearInterval(myInterval)
                            resolve()
                          }
                        }
                      })
                    },1000)
                })
                const rsxx=promise.then(async (rsx)=>{
                  url = 'https://shopee.vn/api/v4/anti_fraud/ivs/token/verify'
                  data = {
                      "method_name": 8,
                      "event": 1,
                      "u_token": ivsToken, "r_token": rToken, "v_token": vToken,
                      "misc": {
                          "operation": 0
                      }
                  }
                  rs3=await $fetch.raw(url,{method:'post',headers,body:JSON.stringify(data)}).then(async (rs4)=>{
                    if(rs4.status<400){
                      js=rs4._data
                      const signature = js['signature']
                      url = 'https://shopee.vn/api/v4/account/basic/login_ivs'
                      data = {
                          "is_user_login": true,
                          "is_web": true,
                          "ivs_flow_no": ivsFlow,
                          "ivs_signature": signature,
                          "ivs_method": 8,
                          "device_sz_fingerprint": deviceId
                      }
                      rs4=await $fetch.raw(url,{method:'post',headers,body:JSON.stringify(data)}).then(async (rs5)=>{
                        if(rs5.status<400){
                          js=rs5._data
                          if(js['error']==0){
                            rs5.headers.getSetCookie().forEach(item=>{
                              headers['cookie']+=item+';'
                            })
                            url = 'https://banhang.shopee.vn/api/v2/login/'
                            rs5=await $fetch.raw(url,{headers}).then(rs6=>{
                              if(rs6.status<400){
                                js=rs6._data
                                if(Object.hasOwn(js,'errorCode') && js['errorCode']==0){
                                  rs6.headers.getSetCookie().forEach(item=>{
                                    headers['cookie']+=item+';'
                                  })
                                  headers['cookie']+='SPC_CDS=1;'
                                  console.log("✅ SHOPEE LOGGED")
                                }
                                return headers
                              }
                              return null
                            })
                            return rs5
                          }
                          return null
                        }
                        return null
                      })
                      return rs4
                    }
                    return null
                  })
                  return rs3
                })
                return rsxx
              }
              return null
            })
            return rs22
          }
          return null
          })
        return rs1
      }
      
    })
  return rs
}
