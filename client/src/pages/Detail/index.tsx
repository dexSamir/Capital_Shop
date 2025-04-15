"use client"

import type React from "react"

import { useState, useEffect, useContext } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io"
import { FaShareAlt } from "react-icons/fa"
import { base_url } from "../data/Data"
import { LoginContext } from "../App"

interface Product {
  id: number
  price: number
  withoutDiscount: number
  category: string
  name: string
  img: string
  color?: string
  count?: number
}

function Detail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const { isInWishlist, setIsInWishlist, isInCart, setIsInCart } = useContext(LoginContext)

  useEffect(() => {
    if (id) {
      axios(`${base_url}products/${id}`).then((res) => {
        setProduct(res.data)
      })
    }
  }, [id])

  useEffect(() => {
    if (id) {
      const wishlistArr = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const inWishlist = wishlistArr.some((elem: Product) => elem.id.toString() === id)
      const cartArr = JSON.parse(localStorage.getItem("basket") || "[]")
      const inCart = cartArr.some((elem: Product) => elem.id.toString() === id)
      setIsInWishlist(inWishlist)
      setIsInCart(inCart)
    }
  }, [id, setIsInWishlist, setIsInCart])

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!product || !id) return

    let wishlistArr = JSON.parse(localStorage.getItem("wishlist") || "[]")
    if (isInWishlist) {
      wishlistArr = wishlistArr.filter((item: Product) => item.id.toString() !== id)
    } else {
      wishlistArr.push(product)
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlistArr))
    setIsInWishlist(!isInWishlist)
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product || !id) return

    const cartArr = JSON.parse(localStorage.getItem("basket") || "[]")
    const existingProduct = cartArr.find((elem: Product) => elem.id.toString() === id)

    if (existingProduct) {
      existingProduct.count = (existingProduct.count || 1) + 1
    } else {
      cartArr.push({ ...product, count: 1 })
    }

    localStorage.setItem("basket", JSON.stringify(cartArr))
    setIsInCart(true)
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex min-h-[150px] w-full flex-col items-center justify-center bg-[#f3ebd8]">
        <h1 className="mb-3 text-[35px] font-semibold text-[#292621]">Product Detail</h1>
        <div className="flex">
          <Link
            to="/"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Home
          </Link>
          <hr className="h-5 w-[1px] rotate-0 border-none border-l border-[#74706b] font-semibold" />
          <Link
            to="/contact"
            className="border-none px-2 text-sm font-normal capitalize leading-none text-[#74706b] no-underline"
          >
            Product Detail
          </Link>
        </div>
      </div>
      {product ? (
        <div className="w-full px-20 py-12">
          <div className="flex w-full items-center justify-start bg-[#ff1f1f] p-8 px-20">
            <div className="w-full max-w-[15rem]">
              <img src={product.img || "/placeholder.svg"} alt={product.name} className="w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 bg-transparent pl-8">
              <div className="flex flex-col items-start justify-center bg-transparent">
                <h3 className="text-4xl font-normal leading-tight text-white">
                  {product.name.charAt(0).toUpperCase() + product.name.slice(1)}
                </h3>
                <p className="text-left text-sm text-white">
                  Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </p>
              </div>
              <div className="mb-[30px] text-sm text-white">
                <span>
                  Color: {product.color ? product.color.charAt(0).toUpperCase() + product.color.slice(1) : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-start">
                <h1 className="mr-12 inline overflow-hidden text-ellipsis whitespace-nowrap text-3xl font-medium text-white">
                  ${product.price}
                </h1>
                <span className="text-xl text-[#cebd9c] line-through">${product.withoutDiscount}</span>
              </div>
              <div className="flex items-center justify-start">
                <Link
                  className="relative z-[1] mr-4 cursor-pointer overflow-hidden rounded-[50px] bg-white px-[26px] py-[15px] text-sm font-medium capitalize text-[#222222] no-underline transition-colors duration-400 hover:text-white hover:shadow-[0px_3px_31px_2px_rgba(207,207,207,0.7)]"
                  onClick={handleCartClick}
                >
                  <span className="relative z-[1]">Add To Cart</span>
                  <div className="absolute left-[-100%] top-0 z-[-1] h-full w-full bg-[#ff2020] transition-all duration-300"></div>
                </Link>
                <div
                  className="relative z-[1] mr-4 flex h-[50px] w-[53px] cursor-pointer items-center justify-center overflow-hidden rounded-[50%] border border-white bg-[#ff2020] text-2xl font-medium text-white transition-colors duration-400 hover:text-[#ff2020] hover:shadow-[0px_3px_31px_2px_rgba(207,207,207,0.7)]"
                  onClick={handleWishlistClick}
                >
                  {isInWishlist ? <IoIosHeart /> : <IoIosHeartEmpty />}
                  <div className="absolute left-0 top-[-101%] z-[-1] h-[101%] w-[101%] bg-white transition-transform duration-500"></div>
                </div>
                <Link className="relative z-[1] flex h-[50px] w-[53px] cursor-pointer items-center justify-center overflow-hidden rounded-[50%] border border-white bg-[#ff2020] text-base font-medium text-white transition-colors duration-400 hover:text-[#ff2020] hover:shadow-[0px_3px_31px_2px_rgba(207,207,207,0.7)]">
                  <FaShareAlt />
                  <div className="absolute left-0 top-[-101%] z-[-1] h-[101%] w-[101%] bg-white transition-transform duration-500"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="p-8 text-center">Product not found</p>
      )}
    </div>
  )
}

export default Detail
