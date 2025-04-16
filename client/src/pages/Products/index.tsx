"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Card from "../../components/Card"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { getAllproducts } from "../../middleware/products"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
  size?: string
  color?: string
}

const categories = ["All", "men's clothing", "women's clothing", "baby's clothing", "accessory"]
const sizes = ["All", "small", "medium", "large"]
const colors = ["All", "multi-colored", "black", "green", "red", "white", "blue", "gray", "brown"]

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    category: "All",
    color: "All",
    size: "All",
  })
  const [openFilter, setOpenFilter] = useState("")

  const toggleFilterDropdown = (filterType: string) => {
    setOpenFilter((prev) => (prev === filterType ? "" : filterType))
  }

  const handleFilterChange = (value: string, filterType: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setOpenFilter("")
  }

  useEffect(() => {
    getAllproducts().then((res) => {
      setProducts(res)
    })
  }, [])

  const filteredProducts = products.filter((product) => {
    const categoryMatch = filters.category === "All" || product.category === filters.category
    const sizeMatch = filters.size === "All" || product.size === filters.size
    const colorMatch = filters.color === "All" || product.color === filters.color

    return categoryMatch && sizeMatch && colorMatch
  })

  return (
    <div className="w-full">
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center bg-[#f3ebd8]">
        <h1 className="mb-3 text-[35px] font-semibold text-[#292621]">Products</h1>
        <div className="flex">
          <Link
            to="/"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Home
          </Link>
          <hr className="h-5 w-[1px] rotate-0 border-none border-l border-[#74706b] font-semibold" />
          <Link
            to="/products"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Products
          </Link>
        </div>
      </div>
      <div className="mt-12 flex w-full justify-between gap-5 px-20">
        <div className="mb-[50px] h-[60rem] max-w-[25rem] border border-[#edeff2] p-[30px_19px_30px_16px]">
          <div className="content">
            <div className="categories">
              {["category", "size", "color"].map((filterType, index) => (
                <div className="mb-4 w-[250px] rounded-lg bg-white p-[15px]" key={index}>
                  <div className="relative cursor-pointer" onClick={() => toggleFilterDropdown(filterType)}>
                    <div className="flex items-center justify-between rounded-[40px] border border-[#ededef] p-[10px] pl-5">
                      <span>
                        {filters[filterType as keyof typeof filters] !== "All"
                          ? filters[filterType as keyof typeof filters]
                          : `Select ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
                      </span>
                      <span
                        className={`transition-transform duration-300 ${openFilter === filterType ? "rotate-180" : ""}`}
                      >
                        {openFilter === filterType ? (
                          <FaChevronUp style={{ color: "#bab9b5" }} />
                        ) : (
                          <FaChevronDown style={{ color: "#bab9b5" }} />
                        )}
                      </span>
                    </div>
                    <ul
                      className={`absolute top-[110%] left-0 z-[1000] m-0 w-[220px] list-none border border-[#f4f4f4] bg-white p-0 opacity-0 pointer-events-none transition-all duration-300 ${
                        openFilter === filterType
                          ? "translate-y-0 opacity-100 pointer-events-auto"
                          : "-translate-y-[10px]"
                      }`}
                    >
                      {(filterType === "category" ? categories : filterType === "size" ? sizes : colors).map(
                        (item, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              handleFilterChange(item, filterType)
                              toggleFilterDropdown(filterType)
                            }}
                            className={`cursor-pointer p-[15px] text-sm hover:bg-[#f1f1f1] ${
                              filters[filterType as keyof typeof filters] === item ? "bg-[#f1f1f1]" : ""
                            }`}
                          >
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => (
              <Card
                id={prod.id}
                key={prod.id}
                name={prod.name}
                img={prod.img}
                price={prod.price}
                withoutDiscount={prod.withoutDiscount}
                products={products}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
