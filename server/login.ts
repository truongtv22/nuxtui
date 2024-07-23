
export default async ()=>{
  let headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    'Sec-Fetch-Site': 'same-origin',
    }
  let url='https://shopee.vn/api/v4/account/basic/get_account_info'
  let deviceId='feVMFlI/8OWk9qrA6s84ow==|uIaWTnQ2kyBnW6BhcdF4r+JXjx/FD/bXKrSbU6iidVg11gWdj9nw1UEiaklZVz0CVemf3jVokaJ0X3U=|WTA9Vjj2DVh0IL5+|08|3'
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
