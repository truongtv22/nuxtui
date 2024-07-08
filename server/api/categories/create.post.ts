import categoryModel from "../models/category.model";
import {z} from 'zod'

const categorySchema=z.object({
    title:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>categorySchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await categoryModel.create([
            {
                title:body.title,
                images:{
                    normal:body.images,
                    medium:body.imagesMedium,
                    small:body.imagesSmall
                },
                description:body.description,
                note:body.note,
                tags:body.tags,
                created_by:body.createdBy,
                edited_by:body.updatedBy,
                created_at:now,
                edited_at:now
            }
        ])
        return result
    }
    return validate
})