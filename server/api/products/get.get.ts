import productModel from "../models/product.model"

export default defineEventHandler(async (event) => { 
  const query = getQuery(event)
  const keys=Object.keys(query)
  const obj={}
  obj[keys[0]]=query[keys[0]]
  return await productModel.find(obj)

})
