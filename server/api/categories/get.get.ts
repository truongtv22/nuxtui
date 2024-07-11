import categoryRole from "../models/category.model"

export default defineEventHandler(async (event) => { 
  const query = getQuery(event)
  const keys=Object.keys(query)
  const obj={}
  obj[keys[0]]=query[keys[0]]
  return await categoryRole.find(obj)

})
