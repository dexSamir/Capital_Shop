"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Card from "../../components/Card"
import { FaChevronDown, FaChevronUp, FaFilter, FaTimes, FaCheck } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProducts, setFilter } from "../../store/slices/productSlice"
import "./Products.scss"

const categories = ["All", "men's clothing", "women's clothing", "baby's clothing", "accessory"]
const sizes = ["All", "small", "medium", "large", "x-large", "xx-large"]
const colors = [
  "All",
  "multi-colored",
  "black",
  "white",
  "red",
  "blue",
  "green",
  "yellow",
  "brown",
  "gray",
  "pink",
  "purple",
  "orange",
]
const brands = [
  "All",
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Under Armour",
  "New Balance",
  "Converse",
  "Vans",
  "Gucci",
  "Zara",
  "H&M",
]
const ratings = ["All", "4 & above", "3 & above", "2 & above", "1 & above"]

function Products() {
  const dispatch = useAppDispatch()
  const { items, filteredItems, loading, filters } = useAppSelector((state) => state.products)
  const [openFilter, setOpenFilter] = useState("")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["category"])

  const toggleFilter = (filterName: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterName) ? prev.filter((f) => f !== filterName) : [...prev, filterName],
    )
  }

  const isFilterExpanded = (filterName: string) => {
    return expandedFilters.includes(filterName)
  }

  const getActiveFilters = () => {
    const active = []

    if (filters.category !== "All") {
      active.push({ key: "category", value: filters.category })
    }

    if (filters.size !== "All") {
      active.push({ key: "size", value: filters.size })
    }

    if (filters.color !== "All") {
      active.push({ key: "color", value: filters.color })
    }

    if (filters.brand !== "All") {
      active.push({ key: "brand", value: filters.brand })
    }

    if (filters.rating !== "All") {
      active.push({ key: "rating", value: filters.rating })
    }

    if (filters.priceMin !== "0" || filters.priceMax !== "1000") {
      active.push({ key: "price", value: `$${filters.priceMin} - $${filters.priceMax}` })
    }

    return active
  }

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
    dispatch(setFilter({ key: "brand", value: "All" }))
    dispatch(setFilter({ key: "rating", value: "All" }))
    dispatch(setFilter({ key: "priceMin", value: "0" }))
    dispatch(setFilter({ key: "priceMax", value: "1000" }))
    dispatch(setFilter({ key: "search", value: "" }))
    setPriceRange({ min: 0, max: 200 })
    setSearchParams({})
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
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

            {getActiveFilters().length > 0 && (
              <div className="products__active-filters">
                {getActiveFilters().map((filter, index) => (
                  <div key={index} className="products__active-filters-tag">
                    <span>{filter.key === "price" ? filter.value : `${filter.key}: ${filter.value}`}</span>
                    <span
                      className="products__active-filters-tag-remove"
                      onClick={() => {
                        const filterKey = filter.key
                        if (filterKey === "price") {
                          dispatch(setFilter({ key: "priceMin", value: "0" }))
                          dispatch(setFilter({ key: "priceMax", value: "1000" }))
                        } else {
                          dispatch(setFilter({ key: filter.key, value: "All" }))
                        }
                      }}
                    >
                      <FaTimes />
                    </span>
                  </div>
                ))}
                <button className="products__active-filters-clear" onClick={resetFilters}>
                  Clear All
                </button>
              </div>
            )}

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("category")}>
                <h4>Category</h4>
                <span className={`products__filter-icon ${isFilterExpanded("category") ? "open" : ""}`}>
                  {isFilterExpanded("category") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("category") ? "open" : ""}`}>
                <div className="products__filter-options">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={`products__filter-option ${filters.category === category ? "active" : ""}`}
                      onClick={() => handleFilterChange(category, "category")}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("size")}>
                <h4>Size</h4>
                <span className={`products__filter-icon ${isFilterExpanded("size") ? "open" : ""}`}>
                  {isFilterExpanded("size") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("size") ? "open" : ""}`}>
                <div className="products__filter-options">
                  {sizes.map((size, index) => (
                    <div
                      key={index}
                      className={`products__filter-option ${filters.size === size ? "active" : ""}`}
                      onClick={() => handleFilterChange(size, "size")}
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("color")}>
                <h4>Color</h4>
                <span className={`products__filter-icon ${isFilterExpanded("color") ? "open" : ""}`}>
                  {isFilterExpanded("color") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("color") ? "open" : ""}`}>
                <div className="products__filter-color-options">
                  {colors.map((color, index) => {
                    const colorCode =
                      color.toLowerCase() === "black"
                        ? "#000"
                        : color.toLowerCase() === "white"
                          ? "#fff"
                          : color.toLowerCase() === "red"
                            ? "#ff4040"
                            : color.toLowerCase() === "blue"
                              ? "#4040ff"
                              : color.toLowerCase() === "green"
                                ? "#40ff40"
                                : color.toLowerCase() === "yellow"
                                  ? "#ffff40"
                                  : color.toLowerCase() === "brown"
                                    ? "#8B4513"
                                    : color.toLowerCase() === "gray"
                                      ? "#808080"
                                      : color.toLowerCase() === "pink"
                                        ? "#FFC0CB"
                                        : color.toLowerCase() === "purple"
                                          ? "#800080"
                                          : color.toLowerCase() === "orange"
                                            ? "#FFA500"
                                            : color.toLowerCase() === "multi-colored"
                                              ? "linear-gradient(45deg, red, blue, green, yellow)"
                                              : "#000"

                    return (
                      <div
                        key={index}
                        className={`products__filter-color ${filters.color === color ? "active" : ""}`}
                        style={{ background: colorCode }}
                        onClick={() => handleFilterChange(color, "color")}
                        title={color}
                      >
                        {filters.color === color && (
                          <FaCheck color={color.toLowerCase() === "white" ? "#000" : "#fff"} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("brand")}>
                <h4>Brand</h4>
                <span className={`products__filter-icon ${isFilterExpanded("brand") ? "open" : ""}`}>
                  {isFilterExpanded("brand") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("brand") ? "open" : ""}`}>
                <div className="products__filter-options">
                  {brands.map((brand, index) => (
                    <div
                      key={index}
                      className={`products__filter-option ${filters.brand === brand ? "active" : ""}`}
                      onClick={() => handleFilterChange(brand, "brand")}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("price")}>
                <h4>Price Range</h4>
                <span className={`products__filter-icon ${isFilterExpanded("price") ? "open" : ""}`}>
                  {isFilterExpanded("price") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("price") ? "open" : ""}`}>
                <div className="products__filter-price">
                  <div className="products__filter-price-range">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="products__price-range"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="products__price-range"
                    />
                  </div>
                  <div className="products__filter-price-inputs">
                    <div className="products__price-field">
                      <label>Min ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange(e, "min")}
                      />
                    </div>
                    <div className="products__price-field">
                      <label>Max ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange(e, "max")}
                      />
                    </div>
                  </div>
                  <div className="products__filter-actions">
                    <button className="products__filter-actions-apply" onClick={applyPriceFilter}>
                      Apply
                    </button>
                    <button
                      className="products__filter-actions-reset"
                      onClick={() => {
                        setPriceRange({ min: 0, max: 200 })
                        dispatch(setFilter({ key: "priceMin", value: "0" }))
                        dispatch(setFilter({ key: "priceMax", value: "1000" }))
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="products__filter">
              <div className="products__filter-header" onClick={() => toggleFilter("rating")}>
                <h4>Rating</h4>
                <span className={`products__filter-icon ${isFilterExpanded("rating") ? "open" : ""}`}>
                  {isFilterExpanded("rating") ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className={`products__filter-content ${isFilterExpanded("rating") ? "open" : ""}`}>
                <div className="products__filter-options">
                  {ratings.map((rating, index) => (
                    <div
                      key={index}
                      className={`products__filter-option ${filters.rating === rating ? "active" : ""}`}
                      onClick={() => handleFilterChange(rating, "rating")}
                    >
                      {rating}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="products__main">
          <div className="products__toggle-filters">
            <button onClick={toggleFilters} className="products__toggle-button">
              <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="products__results-count">
              Showing {filteredItems.length} of {items.length} products
            </div>
          </div>

          <div className="products__grid">
            {loading ? (
              <div className="products__loading">
                <div className="products__loading-spinner"></div>
                <p>Loading products...</p>
              </div>
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
              <div className="products__empty">
                <p>No products found matching your criteria.</p>
                <button onClick={resetFilters} className="products__reset-button">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
