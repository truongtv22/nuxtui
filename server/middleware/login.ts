export default defineEventHandler(async (event) => {
  let headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
    'Sec-Fetch-Site': 'same-origin',
    }
  let url='https://shopee.vn/api/v4/account/basic/get_account_info'
  let requests=new Request(url)
  fetch(requests,{
    method:"GET",
    headers:headers
  }).then(res=>{
     //headers['cookies']=res.headers.getSetCookie().join(';')
    console.log(headers)
    //requests=new Request('https://shopee.vn/api/v4/account/login_by_password')
    let data={"phone": '84975960293',
      "password": 'bcb1bac5908e6224e4264074451c22ec21ea82fc69665036e90766ec28cbc164',
      "support_ivs": true,
      "client_identifier": {
          "security_device_fingerprint": 'alA+vxbCzDDRuhLl69Kzdw==|VFZBQTmg3CgxM0vJ4uaT4mz2LUlSLMJaQBNaxDyxW7pcuZQ0DKTseP0+cBr5Gdxd3tWwUx96AVq6+rYYeGc=|DiBVPYnweAl5jjsn|08|3'
      }
      }
      fetch(new Request('https://shopee.vn/api/v4/account/login_by_password',{
        method:'post',
        body:JSON.stringify(data)
      })).then(res=>{
        console.log(res)
      })
      
  })
})
