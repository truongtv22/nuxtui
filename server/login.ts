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
    let data={"phone": '84927857019',
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
        headers['cookie']=''
        rs0.headers.getSetCookie().forEach(item=>{
          headers['cookie']+=item.split(';')[0]+';'
        })
        const ivsToken=js['data']['ivs_token'],
        ivsFlow=js['data']['ivs_flow_no']
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
                      "u_token": ivsToken, 
                      "r_token": rToken, 
                      "v_token": vToken,
                      'security_device_fingerprint':deviceId,
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
                                if(Object.hasOwn(js,'errcode') && js['errcode']==0){
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
