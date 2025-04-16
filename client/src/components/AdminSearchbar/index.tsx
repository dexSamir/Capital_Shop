"use client"

import type React from "react"
import "./AdminSearchbar.scss"

interface SearchbarProps {
  search: string
  onSearch: (value: string) => void
  onhandleSortByPrice: (value: string) => void
  onhandleSortByName: (value: string) => void
  onhandleSortByDiscount: (value: string) => void
}

function AdminSearchbar({
  search,
  onSearch,
  onhandleSortByPrice,
  onhandleSortByName,
  onhandleSortByDiscount,
}: SearchbarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handleSortOrderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onhandleSortByName(event.target.value)
  }

  const handleSortPriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onhandleSortByPrice(event.target.value)
  }

  const handleSortDiscountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onhandleSortByDiscount(event.target.value)
  }

  return (
    <div className="admin-searchbar">
      <input placeholder="Search..." className="admin-searchbar__input" value={search} onChange={handleInputChange} />
      <div className="admin-searchbar__filters">
        <select placeholder="Name" className="admin-searchbar__select" onChange={handleSortOrderChange}>
          <option value="SortByName">Sort by Name</option>
          <option value="AtoZ">A to Z</option>
          <option value="ZtoA">Z to A</option>
        </select>

        <select placeholder="Price" className="admin-searchbar__select" onChange={handleSortPriceChange}>
          <option value="sortByPrice">Sort by Price</option>
          <option value="MintoMax">Min. to Max.</option>
          <option value="MaxtoMin">Max. to Min.</option>
        </select>

        <select placeholder="Discount" className="admin-searchbar__select" onChange={handleSortDiscountChange}>
          <option value="sortByDiscount">Sort by Discount</option>
          <option value="MintoMax">Min. to Max.</option>
          <option value="MaxtoMin">Max. to Min.</option>
        </select>
      </div>
    </div>
  )
}

export default AdminSearchbar
