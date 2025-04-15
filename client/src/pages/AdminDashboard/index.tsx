"use client"

import { useState, useEffect } from "react"
import { getAllproducts, deleteProducts } from "../../../middleware/products"
import AdminSearchbar from "../../../components/admin/AdminSearchbar"
import AdminTable from "../../../components/admin/AdminTable"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
}

function Dashboard() {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [sortByName, setSortByName] = useState("")
  const [sortByPrice, setSortByPrice] = useState("")
  const [sortByDiscount, setSortByDiscount] = useState("")

  useEffect(() => {
    getAllproducts().then((res) => setProducts(res))
  }, [])

  const handleSearch = (search: string) => {
    setSearch(search)
  }

  const handleSortByDiscount = (order: string) => {
    setSortByDiscount(order)
  }

  const handleSortByName = (order: string) => {
    setSortByName(order)
  }

  const handleSortByPrice = (order: string) => {
    setSortByPrice(order)
  }

  const filteredProducts = products
    .filter((item) => {
      const machesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      return machesSearch
    })
    .sort((a, b) => {
      if (sortByName === "SortByName") return a.id - b.id
      if (sortByName === "AtoZ") return a.name.localeCompare(b.name)
      if (sortByName === "ZtoA") return b.name.localeCompare(a.name)
      return 0
    })
    .sort((a, b) => {
      if (sortByPrice === "sortByPrice") return a.id - b.id
      if (sortByPrice === "MintoMax") return a.price - b.price
      if (sortByPrice === "MaxtoMin") return b.price - a.price
      return 0
    })
    .sort((a, b) => {
      if (sortByDiscount === "sortByDiscount") return a.id - b.id
      if (sortByDiscount === "MintoMax")
        return (b.price / b.withoutDiscount) * 100 - (a.price / a.withoutDiscount) * 100
      if (sortByDiscount === "MaxtoMin")
        return (a.price / a.withoutDiscount) * 100 - (b.price / b.withoutDiscount) * 100
      return 0
    })

  const handleDelete = (id: number) => {
    let arr = [...products]
    arr = arr.filter((item) => item.id !== id)
    setProducts(arr)
    deleteProducts(id)
  }

  return (
    <div>
      <AdminSearchbar
        search={search}
        onSearch={handleSearch}
        onhandleSortByPrice={handleSortByPrice}
        onhandleSortByName={handleSortByName}
        onhandleSortByDiscount={handleSortByDiscount}
      />
      <AdminTable onDelete={handleDelete} datas={filteredProducts} />
    </div>
  )
}

export default Dashboard
