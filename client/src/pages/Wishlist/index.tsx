"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../../components/Card"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
}

function Wishlist() {
  const [wishlistArr, setWishlistArr] = useState<Product[]>([])

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setWishlistArr(storedWishlist)
  }, [])

  return (
    <div>
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center bg-[#f3ebd8]">
        <h1 className="mb-3 text-[35px] font-semibold text-[#292621]">Wishlist</h1>
        <div className="flex">
          <Link
            to="/"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Home
          </Link>
          <hr className="h-5 w-[1px] rotate-0 border-none border-l border-[#74706b] font-semibold" />
          <Link
            to="/wishlist"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Wishlist
          </Link>
        </div>
      </div>
      <div className="mt-12 flex w-full justify-center gap-5 px-20">
        {wishlistArr.length > 0 ? (
          wishlistArr.map((elem) => (
            <Card
              key={elem.id}
              id={elem.id}
              name={elem.name}
              img={elem.img}
              price={elem.price}
              withoutDiscount={elem.withoutDiscount}
              products={wishlistArr}
            />
          ))
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  )
}

export default Wishlist
