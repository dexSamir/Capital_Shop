import { apiClient } from "../api/client"

export async function getAllproducts() {
  const response = await apiClient.get("/Products/GetAllAsync")
  const data = response.data as Array<{
    id: number
    title: string
    coverImage: string
    sellPrice: number
    discount: number
    categoryId: number
  }>

  return data.map((p) => {
    const price = Number(p.sellPrice)
    const discount = p.discount || 0
    const withoutDiscount =
      discount > 0 && discount < 100
        ? Number((price / (1 - discount / 100)).toFixed(2))
        : price

    return {
      id: p.id,
      name: p.title,
      price,
      withoutDiscount,
      img: p.coverImage,
      category: `Category ${p.categoryId}`,
    }
  })
}

export async function deleteProducts(id: string | number) {
  await apiClient.delete(`/Products/Delete/Hard`, {
    params: { ids: id },
  })
}
