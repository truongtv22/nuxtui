import productModel from "../models/product.model";
import {z} from 'zod'

const productSchema=z.object({
    _id:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>productSchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const properties=Object.keys(body)
        const obj={}
        properties.forEach(item=>{
          if(item!='_id'){
            obj[item]=body[item]
          }
        })
        obj['edited_at']=now
        const result=await productModel.updateOne(
          {
            _id:body._id
          },
          {
            $set:obj
          }
        )
        return result
    }
    return validate
})