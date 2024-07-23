import {Nitro} from 'nitropack'
import mongoose from 'mongoose'
import login from './login'
export default async(_nitroApp:Nitro)=>{
    const rs=await login()
    if(rs){
        await useStorage().setItem('headers',rs)
    }
    const config=useRuntimeConfig()
    const DB_OPTIONS={
        dbName:config.name,
        user:config.userName,
        pass:config.password
    }
    try{
        await mongoose.connect(config.mongodbUri,DB_OPTIONS)
        console.log('\n✅ mongoo database connected\n'.toUpperCase())
    }catch(e){
        console.error('Error:'+e)
    }
    
}