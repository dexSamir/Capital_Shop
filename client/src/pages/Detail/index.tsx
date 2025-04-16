"use client"

import type React from "react"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io"
import { FaShareAlt } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProductById, clearSelectedProduct } from "../../store/slices/productSlice"
import { addToCart } from "../../store/slices/cartSlice"
import { toggleWishlistItem } from "../../store/slices/wishlistSlice"
import "./Detail.scss"

function Detail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedProduct, loading, error } = useAppSelector((state) => state.products)
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = selectedProduct ? wishlistItems.some((item) => item.id === selectedProduct.id) : false

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }

    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id])

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedProduct) return

    dispatch(toggleWishlistItem(selectedProduct))
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedProduct) return

    dispatch(addToCart({ ...selectedProduct, count: 1 }))
    navigate("/basket")
  }

  if (loading) {
    return (
      <div className="detail">
        <div className="detail__loading">
          <div className="detail__loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="detail">
        <div className="detail__error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/products" className="detail__back-button">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedProduct) {
    return (
      <div className="detail">
        <div className="detail__not-found">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="detail__back-button">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="detail">
      <div className="detail__header">
        <h1 className="detail__title">Product Detail</h1>
        <div className="detail__breadcrumb">
          <Link to="/" className="detail__breadcrumb-link">
            Home
          </Link>
          <span className="detail__breadcrumb-separator"></span>
          <Link to="/products" className="detail__breadcrumb-link">
            Products
          </Link>
          <span className="detail__breadcrumb-separator"></span>
          <span className="detail__breadcrumb-current">{selectedProduct.name}</span>
        </div>
      </div>

      <div className="detail__content">
        <div className="detail__product">
          <div className="detail__image">
            <img src={selectedProduct.img || "/placeholder.svg"} alt={selectedProduct.name} />
          </div>
          <div className="detail__info">
            <h3 className="detail__product-name">
              {selectedProduct.name.charAt(0).toUpperCase() + selectedProduct.name.slice(1)}
            </h3>
            <p className="detail__product-category">
              Category: {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
            </p>
            <div className="detail__product-color">
              <span>
                Color:{" "}
                {selectedProduct.color
                  ? selectedProduct.color.charAt(0).toUpperCase() + selectedProduct.color.slice(1)
                  : "N/A"}
              </span>
            </div>
            <div className="detail__product-price">
              <h1 className="detail__price-current">${selectedProduct.price}</h1>
              <span className="detail__price-original">${selectedProduct.withoutDiscount}</span>
              <span className="detail__price-discount">
                {Math.round(
                  ((selectedProduct.withoutDiscount - selectedProduct.price) / selectedProduct.withoutDiscount) * 100,
                )}
                % OFF
              </span>
            </div>
            <div className="detail__actions">
              <button className="detail__add-to-cart" onClick={handleCartClick}>
                <span>Add To Cart</span>
              </button>
              <button className="detail__wishlist-button" onClick={handleWishlistClick}>
                {isInWishlist ? <IoIosHeart /> : <IoIosHeartEmpty />}
              </button>
              <button className="detail__share-button">
                <FaShareAlt />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
