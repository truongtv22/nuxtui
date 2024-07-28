import mongoose from 'mongoose'

const schema:mongoose.Schema=new mongoose.Schema({
    name:{
        type:String
    },
    barcode:{
      type:String
    },
    images:{
        original:{
            type:Array
        },
        medium:{
            type:Array
        },
        small:{
            type:Array
        }
    },
    categories:{ 
      type:Array
    },
    description:{
        type:String,
    },
    note:{
        type:String,
    },
    tags:{
        type:String,
    },
    created_by:{
        type:String
    },
    created_at:{
        type:Date
    },
    edited_by:{
        type:String
    },
    edited_at:{
        type:Date
    }
})
export default mongoose.model('Product',schema)