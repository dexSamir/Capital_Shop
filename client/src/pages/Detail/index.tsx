"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { IoIosHeartEmpty, IoIosHeart } from "react-icons/io"
import { FaShareAlt, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProductById, clearSelectedProduct, fetchProducts } from "../../store/slices/productSlice"
import { addToCart } from "../../store/slices/cartSlice"
import { toggleWishlistItem } from "../../store/slices/wishlistSlice"
import "./Detail.scss"

const additionalImages = [
  "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest1.jpg",
  "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest2.jpg",
  "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest3.jpg",
  "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest4.jpg",
]

const reviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    date: "2023-05-15",
    comment:
      "Great product! The quality is excellent and it fits perfectly. I would definitely recommend it to anyone looking for a stylish and comfortable piece.",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    date: "2023-04-22",
    comment:
      "I really like this product. The material is good quality and the design is beautiful. The only reason I'm giving 4 stars instead of 5 is because the color is slightly different from what I expected.",
  },
  {
    id: 3,
    name: "Michael Brown",
    rating: 5,
    date: "2023-03-10",
    comment:
      "Absolutely love it! Fast shipping and the product exceeded my expectations. Will definitely buy from this store again.",
  },
]

function Detail() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedProduct, loading, error, items } = useAppSelector((state) => state.products)
  const wishlistItems = useAppSelector((state) => state.wishlist.items)
  const isInWishlist = selectedProduct ? wishlistItems.some((item) => item.id === selectedProduct.id) : false
  const [mainImage, setMainImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("Black")
  const [activeTab, setActiveTab] = useState("description")

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }

    if (items.length === 0) {
      dispatch(fetchProducts())
    }

    return () => {
      dispatch(clearSelectedProduct())
    }
  }, [dispatch, id, items.length])

  useEffect(() => {
    if (selectedProduct) {
      setMainImage(selectedProduct.img)
    }
  }, [selectedProduct])

  useEffect(() => {
    const mainImage = document.querySelector(".detail__main-image img") as HTMLImageElement
    const zoomContainer = document.querySelector(".detail__main-image") as HTMLDivElement

    if (mainImage && zoomContainer) {
      const lens = document.createElement("div")
      lens.classList.add("detail__zoom-lens")
      zoomContainer.appendChild(lens)

      const result = document.createElement("div")
      result.classList.add("detail__zoom-result")
      zoomContainer.appendChild(result)

      result.style.backgroundImage = `url(${mainImage.src})`

      const cx = result.offsetWidth / lens.offsetWidth
      const cy = result.offsetHeight / lens.offsetHeight

      zoomContainer.addEventListener("mousemove", (e) => {
        e.preventDefault()

        const pos = getCursorPos(e)

        // Calculate position
        let x = pos.x - lens.offsetWidth / 2
        let y = pos.y - lens.offsetHeight / 2

        if (x > mainImage.width - lens.offsetWidth) {
          x = mainImage.width - lens.offsetWidth
        }
        if (x < 0) {
          x = 0
        }
        if (y > mainImage.height - lens.offsetHeight) {
          y = mainImage.height - lens.offsetHeight
        }
        if (y < 0) {
          y = 0
        }

        lens.style.left = x + "px"
        lens.style.top = y + "px"

        result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`
      })

      zoomContainer.addEventListener("mouseenter", () => {
        lens.style.display = "block"
        result.style.display = "block"
      })

      zoomContainer.addEventListener("mouseleave", () => {
        lens.style.display = "none"
        result.style.display = "none"
      })

      function getCursorPos(e: MouseEvent) {
        const rect = mainImage.getBoundingClientRect()
        const x = e.pageX - rect.left - window.scrollX
        const y = e.pageY - rect.top - window.scrollY
        return { x, y }
      }
    }
  }, [mainImage, selectedProduct])

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!selectedProduct) return

    dispatch(toggleWishlistItem(selectedProduct))
    showNotification(isInWishlist ? "Removed from wishlist" : "Added to wishlist", "wishlist")
  }

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedProduct) return

    dispatch(
      addToCart({
        ...selectedProduct,
        count: quantity,
        size: selectedSize,
        color: selectedColor,
      }),
    )
    showNotification("Added to cart", "cart")
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

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change))
  }

  const handleImageClick = (image: string) => {
    setMainImage(image)
  }

  const similarProducts = items
    .filter((item) => selectedProduct && item.category === selectedProduct.category && item.id !== selectedProduct.id)
    .slice(0, 4)

  const favoritesCount = selectedProduct ? ((selectedProduct.id * 7) % 100) + 15 : 0

  const rating = selectedProduct ? Math.min(5, (selectedProduct.id % 5) + 3) : 0

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="detail__rating-star" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="detail__rating-star" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="detail__rating-star detail__rating-star--empty" />)
    }

    return stars
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
          <div className="detail__gallery">
            <div className="detail__main-image">
              <img src={mainImage || selectedProduct.img} alt={selectedProduct.name} />
            </div>
            <div className="detail__thumbnails">
              <div
                className={`detail__thumbnail ${mainImage === selectedProduct.img ? "active" : ""}`}
                onClick={() => handleImageClick(selectedProduct.img)}
              >
                <img src={selectedProduct.img || "/placeholder.svg"} alt={selectedProduct.name} />
              </div>
              {additionalImages.map((img, index) => (
                <div
                  key={index}
                  className={`detail__thumbnail ${mainImage === img ? "active" : ""}`}
                  onClick={() => handleImageClick(img)}
                >
                  <img src={img || "/placeholder.svg"} alt={`${selectedProduct.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="detail__info">
            <h1 className="detail__product-name">
              {selectedProduct.name.charAt(0).toUpperCase() + selectedProduct.name.slice(1)}
            </h1>

            <div className="detail__meta">
              <div className="detail__rating">
                <div className="detail__rating-stars">{renderStars(rating)}</div>
                <span className="detail__rating-count">({reviews.length} Reviews)</span>
              </div>

              <div className="detail__favorites">
                <span className="detail__favorites-count">{favoritesCount} people added to wishlist</span>
              </div>
            </div>

            <div className="detail__product-price">
              <h2 className="detail__price-current">${selectedProduct.price}</h2>
              <span className="detail__price-original">${selectedProduct.withoutDiscount}</span>
              <span className="detail__price-discount">
                {Math.round(
                  ((selectedProduct.withoutDiscount - selectedProduct.price) / selectedProduct.withoutDiscount) * 100,
                )}
                % OFF
              </span>
            </div>

            <div className="detail__product-category">
              <span className="detail__label">Category:</span>
              <span className="detail__value">
                {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
              </span>
            </div>

            <div className="detail__product-description">
              <p>
                This premium {selectedProduct.category} combines style and comfort for the modern individual. Made with
                high-quality materials, it ensures durability and a perfect fit for everyday wear.
              </p>
            </div>

            <div className="detail__product-options">
              <div className="detail__option">
                <span className="detail__label">Size:</span>
                <div className="detail__size-options">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button
                      key={size}
                      className={`detail__size-option ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="detail__option">
                <span className="detail__label">Color:</span>
                <div className="detail__color-options">
                  {[
                    { name: "Black", code: "#000" },
                    { name: "White", code: "#fff" },
                    { name: "Red", code: "#ff4040" },
                    { name: "Blue", code: "#4040ff" },
                  ].map((color) => (
                    <button
                      key={color.name}
                      className={`detail__color-option ${selectedColor === color.name ? "active" : ""}`}
                      style={{ backgroundColor: color.code }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div className="detail__option">
                <span className="detail__label">Quantity:</span>
                <div className="detail__quantity-control">
                  <button
                    className="detail__quantity-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="detail__quantity-value">{quantity}</span>
                  <button className="detail__quantity-btn" onClick={() => handleQuantityChange(1)}>
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="detail__actions">
              <button className="detail__add-to-cart" onClick={handleCartClick}>
                Add To Cart
              </button>
              <button
                className={`detail__wishlist-button ${isInWishlist ? "active" : ""}`}
                onClick={handleWishlistClick}
              >
                {isInWishlist ? <IoIosHeart /> : <IoIosHeartEmpty />}
              </button>
              <button className="detail__share-button">
                <FaShareAlt />
              </button>
            </div>

            <div className="detail__product-meta">
              <div className="detail__meta-item">
                <span className="detail__meta-label">SKU:</span>
                <span className="detail__meta-value">PRD-{selectedProduct.id.toString().padStart(4, "0")}</span>
              </div>
              <div className="detail__meta-item">
                <span className="detail__meta-label">Tags:</span>
                <span className="detail__meta-value">
                  <Link to={`/products?category=${selectedProduct.category}`} className="detail__tag">
                    {selectedProduct.category}
                  </Link>
                  <Link to="/products?tag=fashion" className="detail__tag">
                    fashion
                  </Link>
                  <Link to="/products?tag=style" className="detail__tag">
                    style
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail__tabs">
          <div className="detail__tab-buttons">
            <button
              className={`detail__tab-button ${activeTab === "description" ? "active" : ""}`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`detail__tab-button ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
            <button
              className={`detail__tab-button ${activeTab === "shipping" ? "active" : ""}`}
              onClick={() => setActiveTab("shipping")}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="detail__tab-content">
            {activeTab === "description" && (
              <div className="detail__description">
                <h3>Product Description</h3>
                <p>
                  Introducing our premium {selectedProduct.category}, a perfect blend of style and comfort for the
                  modern individual. This item is crafted with a meticulous composition of high-quality materials,
                  ensuring a soft and breathable fabric that feels gentle against the skin.
                </p>
                <p>
                  The design is as striking as it is comfortable. The product features a unique pattern that adds a
                  modern and eye-catching touch to your ensemble. The colors are carefully chosen to give a vibrant and
                  dynamic appearance, making this item stand out in any crowd.
                </p>
                <p>
                  Whether you prefer a casual, sporty, or chic look, this versatile piece allows you to style it to
                  match your individual fashion statement, making it a wardrobe essential for those who appreciate both
                  fashion and comfort.
                </p>

                <div className="detail__features">
                  <h4>Key Features:</h4>
                  <ul>
                    <li>Premium quality materials</li>
                    <li>Comfortable fit</li>
                    <li>Stylish design</li>
                    <li>Versatile for various occasions</li>
                    <li>Easy to care for</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="detail__reviews">
                <h3>Customer Reviews</h3>

                <div className="detail__review-summary">
                  <div className="detail__review-average">
                    <div className="detail__review-average-rating">{rating.toFixed(1)}</div>
                    <div className="detail__review-average-stars">{renderStars(rating)}</div>
                    <div className="detail__review-count">Based on {reviews.length} reviews</div>
                  </div>
                </div>

                <div className="detail__review-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="detail__review-item">
                      <div className="detail__review-header">
                        <div className="detail__review-author">{review.name}</div>
                        <div className="detail__review-date">{review.date}</div>
                      </div>
                      <div className="detail__review-rating">{renderStars(review.rating)}</div>
                      <div className="detail__review-content">{review.comment}</div>
                    </div>
                  ))}
                </div>

                <div className="detail__review-form">
                  <h4>Write a Review</h4>
                  <form>
                    <div className="detail__form-group">
                      <label>Your Rating</label>
                      <div className="detail__rating-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className="detail__rating-select-star" />
                        ))}
                      </div>
                    </div>
                    <div className="detail__form-group">
                      <label>Your Review</label>
                      <textarea placeholder="Write your review here..." rows={5}></textarea>
                    </div>
                    <div className="detail__form-row">
                      <div className="detail__form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your name" />
                      </div>
                      <div className="detail__form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Your email" />
                      </div>
                    </div>
                    <button type="submit" className="detail__submit-review">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="detail__shipping">
                <h3>Shipping Information</h3>
                <div className="detail__shipping-info">
                  <h4>Delivery</h4>
                  <p>
                    We offer free standard shipping on all orders over $50. Standard shipping typically takes 3-5
                    business days. For expedited shipping options, please select the appropriate option at checkout.
                  </p>

                  <h4>International Shipping</h4>
                  <p>
                    We ship to most countries worldwide. International shipping rates and delivery times vary depending
                    on the destination. Please note that international orders may be subject to customs duties and
                    taxes.
                  </p>

                  <h4>Returns & Exchanges</h4>
                  <p>
                    We accept returns within 30 days of purchase. Items must be unused, unworn, and in their original
                    packaging. To initiate a return, please contact our customer service team.
                  </p>

                  <h4>Warranty</h4>
                  <p>
                    All our products come with a 1-year warranty against manufacturing defects. This warranty does not
                    cover damage from normal wear and tear, improper use, or accidents.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail__similar">
          <h2 className="detail__similar-title">You May Also Like</h2>
          <div className="detail__similar-grid">
            {similarProducts.map((product) => (
              <div key={product.id} className="detail__similar-item" onClick={() => navigate(`/detail/${product.id}`)}>
                <div className="detail__similar-image">
                  <img src={product.img || "/placeholder.svg"} alt={product.name} />
                </div>
                <div className="detail__similar-info">
                  <h3 className="detail__similar-name">{product.name}</h3>
                  <div className="detail__similar-price">
                    <span className="detail__similar-current-price">${product.price}</span>
                    <span className="detail__similar-original-price">${product.withoutDiscount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
