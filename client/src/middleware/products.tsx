import axios from "axios"
import { base_url } from "../data/Data"

export async function getAllproducts() {
  let result
  result = axios(base_url + "products").then((res) => {
    return res.data
  })
  return result
}

export async function deleteProducts(id: string | number) {
  let result
  result = axios.delete(base_url + "products/" + id).then(() => {
    console.log("removed")
  })
  return result
}
