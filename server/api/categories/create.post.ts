import categoryModel from "../models/category.model";
import {z} from 'zod'

const categorySchema=z.object({
    name:z.string()
})
export default defineEventHandler(async (event)=>{
    const validate=await readValidatedBody(event,body=>categorySchema.safeParse(body))
    if(validate.success){
        const now=new Date()
        const body=await readBody(event)
        const result=await categoryModel.create([
            {
                name:body.name,
                images:{
                    original:body.images?.original,
                    medium:body.images?.medium,
                    small:body.images?.small
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