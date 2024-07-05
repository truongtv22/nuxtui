import {Nitro} from 'nitropack'
import mongoose from 'mongoose'

export default async(_nitroApp:Nitro)=>{
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