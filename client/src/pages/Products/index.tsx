"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Card from "../../components/Card"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProducts, setFilter } from "../../store/slices/productSlice"
import "./Products.scss"

const categories = ["All", "men's clothing", "women's clothing", "baby's clothing", "accessory"]
const sizes = ["All", "small", "medium", "large"]
const colors = ["All", "multi-colored", "black", "green", "red", "white", "blue", "gray", "brown"]

function Products() {
  const dispatch = useAppDispatch()
  const { items, filteredItems, loading, filters } = useAppSelector((state) => state.products)
  const [openFilter, setOpenFilter] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    if (searchQuery) {
      dispatch(setFilter({ key: "search", value: searchQuery }))
    }
  }, [searchParams, dispatch])

  const toggleFilterDropdown = (filterType: string) => {
    setOpenFilter((prev) => (prev === filterType ? "" : filterType))
  }

  const handleFilterChange = (value: string, filterType: string) => {
    dispatch(setFilter({ key: filterType, value }))
    setOpenFilter("")
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
    const value = Number.parseInt(e.target.value)
    setPriceRange((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const applyPriceFilter = () => {
    dispatch(setFilter({ key: "priceMin", value: priceRange.min.toString() }))
    dispatch(setFilter({ key: "priceMax", value: priceRange.max.toString() }))
  }

  const resetFilters = () => {
    dispatch(setFilter({ key: "category", value: "All" }))
    dispatch(setFilter({ key: "size", value: "All" }))
    dispatch(setFilter({ key: "color", value: "All" }))
    dispatch(setFilter({ key: "priceMin", value: "0" }))
    dispatch(setFilter({ key: "priceMax", value: "1000" }))
    dispatch(setFilter({ key: "search", value: "" }))
    setPriceRange({ min: 0, max: 200 })
    setSearchParams({})
  }

  return (
    <div className="products">
      <div className="products__header">
        <h1 className="products__title">Products</h1>
        <div className="products__breadcrumb">
          <Link to="/" className="products__breadcrumb-link">
            Home
          </Link>
          <span className="products__breadcrumb-separator"></span>
          <Link to="/products" className="products__breadcrumb-link">
            Products
          </Link>
        </div>
      </div>

      <div className="products__content">
        <div className="products__sidebar">
          <div className="products__filters">
            <div className="products__filter-header">
              <h3>Filters</h3>
              <button className="products__filter-reset" onClick={resetFilters}>
                Reset All
              </button>
            </div>

            <div className="products__filter products__filter--price">
              <h4 className="products__filter-title">Price Range</h4>
              <div className="products__price-inputs">
                <div className="products__price-field">
                  <label>Min ($)</label>
                  <input type="number" min="0" value={priceRange.min} onChange={(e) => handlePriceChange(e, "min")} />
                </div>
                <div className="products__price-field">
                  <label>Max ($)</label>
                  <input type="number" min="0" value={priceRange.max} onChange={(e) => handlePriceChange(e, "max")} />
                </div>
              </div>
              <button className="products__price-apply" onClick={applyPriceFilter}>
                Apply
              </button>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilterDropdown("category")}>
                <span className="products__filter-title">
                  {filters.category !== "All" ? filters.category : `Select Category`}
                </span>
                <span className={`products__filter-icon ${openFilter === "category" ? "open" : ""}`}>
                  {openFilter === "category" ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              <ul className={`products__filter-dropdown ${openFilter === "category" ? "open" : ""}`}>
                {categories.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleFilterChange(item, "category")}
                    className={`products__filter-option ${filters.category === item ? "active" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilterDropdown("size")}>
                <span className="products__filter-title">{filters.size !== "All" ? filters.size : `Select Size`}</span>
                <span className={`products__filter-icon ${openFilter === "size" ? "open" : ""}`}>
                  {openFilter === "size" ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              <ul className={`products__filter-dropdown ${openFilter === "size" ? "open" : ""}`}>
                {sizes.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleFilterChange(item, "size")}
                    className={`products__filter-option ${filters.size === item ? "active" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilterDropdown("color")}>
                <span className="products__filter-title">
                  {filters.color !== "All" ? filters.color : `Select Color`}
                </span>
                <span className={`products__filter-icon ${openFilter === "color" ? "open" : ""}`}>
                  {openFilter === "color" ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              <ul className={`products__filter-dropdown ${openFilter === "color" ? "open" : ""}`}>
                {colors.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleFilterChange(item, "color")}
                    className={`products__filter-option ${filters.color === item ? "active" : ""}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="products__grid">
          {loading ? (
            <div className="products__loading">Loading products...</div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map((product) => (
              <Card
                key={product.id}
                id={product.id}
                name={product.name}
                img={product.img}
                price={product.price}
                withoutDiscount={product.withoutDiscount}
                product={product}
              />
            ))
          ) : (
            <div className="products__empty">No products found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
