"use client"

import type React from "react"

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
    <div className="mx-auto mt-20 flex w-[70%] items-center justify-between gap-2">
      <input
        placeholder="Search..."
        className="flex-grow rounded-md border border-[#eeeeee] p-4 text-[#888] outline-none"
        value={search}
        onChange={handleInputChange}
      />
      <div className="flex items-center">
        <select
          placeholder="Name"
          className="mr-2 cursor-pointer rounded-md bg-[#f5f5f5] p-4 text-[#333] hover:border-[#888] focus:border-[#3182ce] focus:outline-none"
          onChange={handleSortOrderChange}
        >
          <option value="SortByName">Sort by Name</option>
          <option value="AtoZ">A to Z</option>
          <option value="ZtoA">Z to A</option>
        </select>

        <select
          placeholder="Price"
          className="mr-2 cursor-pointer rounded-md bg-[#f5f5f5] p-4 text-[#333] hover:border-[#888] focus:border-[#3182ce] focus:outline-none"
          onChange={handleSortPriceChange}
        >
          <option value="sortByPrice">Sort by Price</option>
          <option value="MintoMax">Min. to Max.</option>
          <option value="MaxtoMin">Max. to Min.</option>
        </select>

        <select
          placeholder="Discount"
          className="cursor-pointer rounded-md bg-[#f5f5f5] p-4 text-[#333] hover:border-[#888] focus:border-[#3182ce] focus:outline-none"
          onChange={handleSortDiscountChange}
        >
          <option value="sortByDiscount">Sort by Discount</option>
          <option value="MintoMax">Min. to Max.</option>
          <option value="MaxtoMin">Max. to Min.</option>
        </select>
      </div>
    </div>
  )
}

export default AdminSearchbar
