"use client"

import { useState, useEffect } from "react"
import AdminSearchbar from "../../components/AdminSearchbar"
import AdminTable from "../../components/AdminTable"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProducts, deleteProduct, setFilter } from "../../store/slices/productSlice"
import "./AdminDashboard.scss"

function Dashboard() {
  const dispatch = useAppDispatch()
  const { items, filteredItems, loading, error } = useAppSelector((state) => state.products)
  const [search, setSearch] = useState("")

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleSearch = (search: string) => {
    setSearch(search)
    dispatch(setFilter({ key: "search", value: search }))
  }

  const handleSortByDiscount = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "discount" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleSortByName = (order: string) => {
    if (order === "AtoZ") {
      dispatch(setFilter({ key: "sortBy", value: "name" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "ZtoA") {
      dispatch(setFilter({ key: "sortBy", value: "name" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleSortByPrice = (order: string) => {
    if (order === "MintoMax") {
      dispatch(setFilter({ key: "sortBy", value: "price" }))
      dispatch(setFilter({ key: "sortOrder", value: "asc" }))
    } else if (order === "MaxtoMin") {
      dispatch(setFilter({ key: "sortBy", value: "price" }))
      dispatch(setFilter({ key: "sortOrder", value: "desc" }))
    }
  }

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id))
  }

  return (
    <div className="admin-dashboard">
      <AdminSearchbar
        search={search}
        onSearch={handleSearch}
        onhandleSortByPrice={handleSortByPrice}
        onhandleSortByName={handleSortByName}
        onhandleSortByDiscount={handleSortByDiscount}
      />

      {loading ? (
        <div className="admin-dashboard__loading">Loading products...</div>
      ) : error ? (
        <div className="admin-dashboard__error">Error: {error}</div>
      ) : (
        <AdminTable onDelete={handleDelete} datas={filteredItems} />
      )}
    </div>
  )
}

export default Dashboard
