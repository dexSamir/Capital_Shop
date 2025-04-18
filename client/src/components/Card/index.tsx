"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { PiShoppingCartLight } from "react-icons/pi"
import { IoIosHeartEmpty, IoIosHeart, IoIosSearch } from "react-icons/io"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { addToCart } from "../../store/slices/cartSlice"
import { toggleWishlistItem } from "../../store/slices/wishlistSlice"
import "./Card.scss"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
  count?: number
}

interface CardProps {
  name: string
  price: number
  withoutDiscount: number
  img: string
  id: number
  product: Product
}

function Card({ name, price, withoutDiscount, img, id, product }: CardProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = wishlistItems.some((item) => item.id === id)

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    dispatch(toggleWishlistItem(product))
    showNotification(isInWishlist ? "Removed from wishlist" : "Added to wishlist", "wishlist")
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(addToCart({ ...product, count: 1 }))
    showNotification("Added to cart", "cart")
  }

  const handleCardClick = () => {
    navigate(`/detail/${id}`)
  }

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/detail/${id}`)
  }

  const showNotification = (message: string, type: "cart" | "wishlist") => {
    const notification = document.createElement("div")
    notification.className = `global-notification ${type === "cart" ? "notification-cart" : "notification-wishlist"}`

    const icon = document.createElement("span")
    icon.className = "notification-icon"
    icon.innerHTML =
      type === "cart"
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>'

    const text = document.createElement("span")
    text.className = "notification-text"
    text.textContent = message

    notification.appendChild(icon)
    notification.appendChild(text)

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 10)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  const discountPercentage = Math.round(((withoutDiscount - price) / withoutDiscount) * 100)

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="card__tools">
        <div className="card__tool" onClick={handleCartClick} title="Add to cart">
          <PiShoppingCartLight className="card__tool-icon"/>
        </div>
        <div
          className="card__tool"
          onClick={handleWishlistClick}
          title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist ? <IoIosHeart className="card__tool-icon--active" /> : <IoIosHeartEmpty />}
        </div>
        <div className="card__tool" onClick={handleSearchClick} title="View details">
          <IoIosSearch className="card__tool-icon"/>
        </div>
      </div>
      <div className="card__image-container">
        {discountPercentage > 0 && <div className="card__discount-badge">-{discountPercentage}%</div>}
        <img src={img || "/placeholder.svg"} alt={name} className="card__image" />
      </div>
      <div className="card__content">
        <div className="card__category">{product.category}</div>
        <h3 className="card__title">{name}</h3>
        <div className="card__price">
          <div className="card__price-current">${price}</div>
          <div className="card__price-original">${withoutDiscount}</div>
        </div>
      </div>
    </div>
  )
}

export default Card
