import type React from "react"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Card from "../../components/Card"
import { FaChevronDown, FaChevronUp, FaFilter, FaTimes } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProducts, setFilter } from "../../store/slices/productSlice"
import { getCategories, getBrands } from "../../middleware/products"
import "./Products.scss"

function Products() {
  const dispatch = useAppDispatch()
  const { items, filteredItems, loading, filters } = useAppSelector((state) => state.products)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 })
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState<string[]>(["category"])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [brands, setBrands] = useState<string[]>(["All"])

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

    if (filters.brand !== "All") {
      active.push({ key: "brand", value: filters.brand })
    }

    if (filters.priceMin !== "0" || filters.priceMax !== "1000") {
      active.push({ key: "price", value: `$${filters.priceMin} - $${filters.priceMax}` })
    }

    return active
  }

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories([
        "All",
        ...cats.map((c) => c.title || c.name || "").filter(Boolean),
      ])
    })
    getBrands().then((b) => {
      setBrands(["All", ...b.map((br) => br.title || br.name || "").filter(Boolean)])
    })
  }, [])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [filters, dispatch])

  useEffect(() => {
    const searchQuery = searchParams.get("search")
    const categoryQuery = searchParams.get("category")
    const brandQuery = searchParams.get("brand")

    if (searchQuery) {
      dispatch(setFilter({ key: "search", value: searchQuery }))
    }
    if (categoryQuery) {
      dispatch(setFilter({ key: "category", value: categoryQuery }))
    }
    if (brandQuery) {
      dispatch(setFilter({ key: "brand", value: brandQuery }))
    }
  }, [searchParams, dispatch])

  const handleFilterChange = (value: string, filterType: string) => {
    dispatch(setFilter({ key: filterType, value }))
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
    dispatch(setFilter({ key: "brand", value: "All" }))
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
        <div className={`products__sidebar ${showFilters ? "active" : ""}`}>
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
                  secondImg={product.secondImg}
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
