import categoryRole from "../models/category.model"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return await categoryRole.find({ title: query['title'] })

})
