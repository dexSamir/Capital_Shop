"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { IoIosHeartEmpty, IoIosHeart, IoMdCheckmarkCircleOutline } from "react-icons/io"
import {
  FaShareAlt,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaExchangeAlt,
  FaShieldAlt,
  FaInfoCircle,
  FaRuler,
  FaCheck,
  FaRegClock,
  FaRegCalendarAlt,
  FaRegQuestionCircle,
  FaPlay,
  FaCamera,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
} from "react-icons/fa"
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

// Mock reviews
const reviews = [
  {
    id: 1,
    name: "John Doe",
    rating: 5,
    date: "2023-05-15",
    comment:
      "Great product! The quality is excellent and it fits perfectly. I would definitely recommend it to anyone looking for a stylish and comfortable piece.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    verified: true,
    images: [
      "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest1.jpg",
      "https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest2.jpg",
    ],
    likes: 12,
    dislikes: 2,
    size: "M",
    color: "Black",
  },
  {
    id: 2,
    name: "Jane Smith",
    rating: 4,
    date: "2023-04-22",
    comment:
      "I really like this product. The material is good quality and the design is beautiful. The only reason I'm giving 4 stars instead of 5 is because the color is slightly different from what I expected.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    verified: true,
    images: [],
    likes: 8,
    dislikes: 1,
    size: "S",
    color: "White",
  },
  {
    id: 3,
    name: "Michael Brown",
    rating: 5,
    date: "2023-03-10",
    comment:
      "Absolutely love it! Fast shipping and the product exceeded my expectations. Will definitely buy from this store again.",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    verified: false,
    images: ["https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest3.jpg"],
    likes: 15,
    dislikes: 0,
    size: "L",
    color: "Blue",
  },
  {
    id: 4,
    name: "Emily Johnson",
    rating: 3,
    date: "2023-02-18",
    comment:
      "The product is okay, but I expected better quality for the price. The stitching is a bit loose in some areas, and it doesn't feel as durable as I hoped. The design is nice though.",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    verified: true,
    images: [],
    likes: 5,
    dislikes: 3,
    size: "XL",
    color: "Red",
  },
  {
    id: 5,
    name: "David Wilson",
    rating: 5,
    date: "2023-01-05",
    comment:
      "Perfect fit and excellent quality! I've been using this product for a month now and it still looks brand new. The material is breathable and comfortable for all-day wear.",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    verified: true,
    images: ["https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest4.jpg"],
    likes: 20,
    dislikes: 1,
    size: "M",
    color: "Black",
  },
]

const productSpecifications = {
  material: "95% Cotton, 5% Elastane",
  weight: "0.5 kg",
  dimensions: "25 × 15 × 5 cm",
  colors: ["Black", "White", "Red", "Blue"],
  sizes: ["S", "M", "L", "XL"],
  careInstructions: ["Machine wash cold", "Do not bleach", "Tumble dry low", "Iron on low heat", "Do not dry clean"],
  countryOfOrigin: "Italy",
  manufacturer: "Fashion Brand Inc.",
  model: "FB-2023-001",
  warranty: "1 year manufacturer warranty",
  packaging: "Eco-friendly packaging",
  certifications: ["OEKO-TEX Standard 100", "Fair Trade Certified"],
}

const productFAQs = [
  {
    question: "Is this product true to size?",
    answer:
      "Yes, this product is true to size. We recommend ordering your regular size. If you're between sizes, we suggest sizing up for a more comfortable fit.",
  },
  {
    question: "How do I care for this product?",
    answer:
      "For best results, machine wash cold with like colors, do not bleach, tumble dry low, and iron on low heat if needed. Do not dry clean.",
  },
  {
    question: "Is this product suitable for sensitive skin?",
    answer:
      "Yes, this product is made with hypoallergenic materials and has been certified by OEKO-TEX Standard 100, which ensures it's free from harmful substances.",
  },
  {
    question: "Can I return this product if it doesn't fit?",
    answer:
      "Yes, we offer a 30-day return policy. The product must be unworn, unwashed, and in its original packaging with all tags attached.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3-5 business days. Express shipping (additional fee) takes 1-2 business days. International shipping may take 7-14 business days.",
  },
]

const sizeGuide = {
  units: "cm",
  sizes: ["S", "M", "L", "XL"],
  measurements: [
    { name: "Chest", values: [92, 96, 100, 104] },
    { name: "Waist", values: [76, 80, 84, 88] },
    { name: "Hips", values: [96, 100, 104, 108] },
    { name: "Length", values: [68, 70, 72, 74] },
    { name: "Sleeve", values: [62, 63, 64, 65] },
  ],
}

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
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [showReviewImages, setShowReviewImages] = useState(false)
  const [selectedReviewImage, setSelectedReviewImage] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const zoomContainerRef = useRef<HTMLDivElement>(null)
  const zoomResultRef = useRef<HTMLDivElement>(null)
  const zoomLensRef = useRef<HTMLDivElement>(null)

  const [selectedRating, setSelectedRating] = useState(0)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const [reviewFilters, setReviewFilters] = useState({
    rating: "all",
    sort: "newest",
    hasImages: false,
    verified: false,
  })
  const [visibleReviews, setVisibleReviews] = useState(3)

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
    if (!zoomContainerRef.current || !zoomResultRef.current) return

    const zoomContainer = zoomContainerRef.current
    const zoomResult = zoomResultRef.current

    let lens = zoomLensRef.current
    if (!lens) {
      lens = document.createElement("div")
      lens.classList.add("detail__zoom-lens")
      zoomContainer.appendChild(lens)
      zoomLensRef.current = lens
    }

    const mainImage = zoomContainer.querySelector("img") as HTMLImageElement
    if (!mainImage) return

    zoomResult.style.backgroundImage = `url(${mainImage.src})`

    const cx = zoomResult.offsetWidth / lens.offsetWidth
    const cy = zoomResult.offsetHeight / lens.offsetHeight

    const getCursorPos = (e: MouseEvent) => {
      const rect = mainImage.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      return { x, y }
    }

    const moveLens = (e: MouseEvent) => {
      e.preventDefault()

      const pos = getCursorPos(e)

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

      zoomResult.style.backgroundPosition = `-${x * cx}px -${y * cy}px`
    }

    const handleMouseEnter = () => {
      lens.style.display = "block"
      zoomResult.style.display = "block"
    }

    const handleMouseLeave = () => {
      lens.style.display = "none"
      zoomResult.style.display = "none"
    }

    zoomContainer.addEventListener("mousemove", moveLens)
    zoomContainer.addEventListener("mouseenter", handleMouseEnter)
    zoomContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      zoomContainer.removeEventListener("mousemove", moveLens)
      zoomContainer.removeEventListener("mouseenter", handleMouseEnter)
      zoomContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mainImage])

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

  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide)
  }

  const toggleVideoModal = () => {
    setShowVideoModal(!showVideoModal)
  }

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  const handleReviewImageClick = (image: string) => {
    setSelectedReviewImage(image)
    setShowReviewImages(true)
  }

  const closeReviewImages = () => {
    setShowReviewImages(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 5 - uploadedImages.length
    if (remainingSlots <= 0) {
      alert("You can upload a maximum of 5 images")
      return
    }

    const newImages: string[] = []

    Array.from(files)
      .slice(0, remainingSlots)
      .forEach((file) => {
        if (file.size > 2 * 1024 * 1024) {
          alert("Image size should not exceed 2MB")
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push(e.target.result as string)
            if (newImages.length === Math.min(files.length, remainingSlots)) {
              setUploadedImages([...uploadedImages, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      })
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...uploadedImages]
    newImages.splice(index, 1)
    setUploadedImages(newImages)
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

  const handleFilterChange = (key: string, value: string | boolean) => {
    setReviewFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleShowAllReviews = () => {
    navigate(`/reviews/${id}`)
  }

  const getFilteredReviews = () => {
    let filtered = [...reviews]

    if (reviewFilters.rating !== "all") {
      const ratingValue = Number.parseInt(reviewFilters.rating)
      filtered = filtered.filter((review) => Math.floor(review.rating) === ratingValue)
    }

    if (reviewFilters.hasImages) {
      filtered = filtered.filter((review) => review.images && review.images.length > 0)
    }

    if (reviewFilters.verified) {
      filtered = filtered.filter((review) => review.verified)
    }

    switch (reviewFilters.sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating)
        break
      default:
        break
    }

    return filtered
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
          <Link to={`/products?category=${selectedProduct.category}`} className="detail__breadcrumb-link">
            {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
          </Link>
          <span className="detail__breadcrumb-separator"></span>
          <span className="detail__breadcrumb-current">{selectedProduct.name}</span>
        </div>
      </div>

      <div className="detail__content">
        <div className="detail__product">
          <div className="detail__gallery">
            <div className="detail__main-image" ref={zoomContainerRef}>
              <img src={mainImage || selectedProduct.img} alt={selectedProduct.name} />
              <div className="detail__zoom-result" ref={zoomResultRef}></div>
              <button className="detail__video-button" onClick={toggleVideoModal}>
                <FaPlay />
                <span>Watch Video</span>
              </button>
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
            <div className="detail__product-badges">
              {selectedProduct.id % 2 === 0 && <span className="detail__badge detail__badge--new">New</span>}
              {selectedProduct.price < selectedProduct.withoutDiscount && (
                <span className="detail__badge detail__badge--sale">Sale</span>
              )}
              {selectedProduct.id % 3 === 0 && <span className="detail__badge detail__badge--hot">Hot</span>}
            </div>

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

            <div className="detail__availability">
              <span className="detail__label">Availability:</span>
              <span className="detail__value detail__value--in-stock">
                <IoMdCheckmarkCircleOutline className="detail__in-stock-icon" /> In Stock
              </span>
              <span className="detail__stock-count">(Only {12 + (selectedProduct.id % 20)} left)</span>
            </div>

            <div className="detail__product-category">
              <span className="detail__label">Category:</span>
              <span className="detail__value">
                <Link to={`/products?category=${selectedProduct.category}`} className="detail__category-link">
                  {selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)}
                </Link>
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
                <div className="detail__option-header">
                  <span className="detail__label">Size:</span>
                  <button className="detail__size-guide-button" onClick={toggleSizeGuide}>
                    <FaRuler className="detail__size-guide-icon" /> Size Guide
                  </button>
                </div>
                <div className="detail__size-options">
                  {productSpecifications.sizes.map((size) => (
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
                  {productSpecifications.colors.map((color) => {
                    const colorCode =
                      color === "Black"
                        ? "#000"
                        : color === "White"
                          ? "#fff"
                          : color === "Red"
                            ? "#ff4040"
                            : color === "Blue"
                              ? "#4040ff"
                              : "#000"
                    return (
                      <button
                        key={color}
                        className={`detail__color-option ${selectedColor === color ? "active" : ""}`}
                        style={{ backgroundColor: colorCode }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      />
                    )
                  })}
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
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                {isInWishlist ? <IoIosHeart /> : <IoIosHeartEmpty />}
              </button>
              <button className="detail__share-button" title="Share Product">
                <FaShareAlt />
              </button>
            </div>

            <div className="detail__delivery-info">
              <div className="detail__delivery-item">
                <FaTruck className="detail__delivery-icon" />
                <div className="detail__delivery-text">
                  <h4>Free Shipping</h4>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="detail__delivery-item">
                <FaExchangeAlt className="detail__delivery-icon" />
                <div className="detail__delivery-text">
                  <h4>30 Days Return</h4>
                  <p>If goods have problems</p>
                </div>
              </div>
              <div className="detail__delivery-item">
                <FaShieldAlt className="detail__delivery-icon" />
                <div className="detail__delivery-text">
                  <h4>Secure Payment</h4>
                  <p>100% secure payment</p>
                </div>
              </div>
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
                  <Link to="/products?tag=premium" className="detail__tag">
                    premium
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
              className={`detail__tab-button ${activeTab === "specifications" ? "active" : ""}`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
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
            <button
              className={`detail__tab-button ${activeTab === "faq" ? "active" : ""}`}
              onClick={() => setActiveTab("faq")}
            >
              FAQ
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
                    <li>Premium quality materials for durability and comfort</li>
                    <li>Ergonomic design for a perfect fit</li>
                    <li>Versatile styling options for various occasions</li>
                    <li>Breathable fabric for all-day comfort</li>
                    <li>Easy care and maintenance</li>
                    <li>Eco-friendly manufacturing process</li>
                    <li>Available in multiple colors and sizes</li>
                    <li>Designed for long-lasting wear</li>
                  </ul>
                </div>

                <div className="detail__benefits">
                  <h4>Benefits:</h4>
                  <div className="detail__benefits-grid">
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Enhanced comfort for all-day wear</span>
                    </div>
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Stylish design that complements any outfit</span>
                    </div>
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Durable construction for long-lasting use</span>
                    </div>
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Easy to care for and maintain</span>
                    </div>
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Versatile for various occasions</span>
                    </div>
                    <div className="detail__benefit">
                      <FaCheck className="detail__benefit-icon" />
                      <span>Premium quality at an affordable price</span>
                    </div>
                  </div>
                </div>

                <div className="detail__usage">
                  <h4>Perfect For:</h4>
                  <p>
                    This {selectedProduct.category} is perfect for daily wear, casual outings, office settings, and
                    special occasions. Its versatile design makes it suitable for a wide range of activities and
                    environments. Whether you're heading to work, meeting friends for coffee, or attending a social
                    event, this piece will keep you looking stylish and feeling comfortable.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="detail__specifications">
                <h3>Product Specifications</h3>

                <div className="detail__specs-grid">
                  <div className="detail__specs-group">
                    <h4>General Information</h4>
                    <table className="detail__specs-table">
                      <tbody>
                        <tr>
                          <td>Material</td>
                          <td>{productSpecifications.material}</td>
                        </tr>
                        <tr>
                          <td>Weight</td>
                          <td>{productSpecifications.weight}</td>
                        </tr>
                        <tr>
                          <td>Dimensions</td>
                          <td>{productSpecifications.dimensions}</td>
                        </tr>
                        <tr>
                          <td>Country of Origin</td>
                          <td>{productSpecifications.countryOfOrigin}</td>
                        </tr>
                        <tr>
                          <td>Manufacturer</td>
                          <td>{productSpecifications.manufacturer}</td>
                        </tr>
                        <tr>
                          <td>Model</td>
                          <td>{productSpecifications.model}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="detail__specs-group">
                    <h4>Product Details</h4>
                    <table className="detail__specs-table">
                      <tbody>
                        <tr>
                          <td>Available Colors</td>
                          <td>{productSpecifications.colors.join(", ")}</td>
                        </tr>
                        <tr>
                          <td>Available Sizes</td>
                          <td>{productSpecifications.sizes.join(", ")}</td>
                        </tr>
                        <tr>
                          <td>Warranty</td>
                          <td>{productSpecifications.warranty}</td>
                        </tr>
                        <tr>
                          <td>Packaging</td>
                          <td>{productSpecifications.packaging}</td>
                        </tr>
                        <tr>
                          <td>Certifications</td>
                          <td>{productSpecifications.certifications.join(", ")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="detail__care-instructions">
                  <h4>Care Instructions</h4>
                  <ul className="detail__care-list">
                    {productSpecifications.careInstructions.map((instruction, index) => (
                      <li key={index} className="detail__care-item">
                        <FaInfoCircle className="detail__care-icon" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="detail__size-chart">
                  <h4>Size Chart</h4>
                  <table className="detail__size-table">
                    <thead>
                      <tr>
                        <th>Measurement (cm)</th>
                        {sizeGuide.sizes.map((size) => (
                          <th key={size}>{size}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sizeGuide.measurements.map((measurement, index) => (
                        <tr key={index}>
                          <td>{measurement.name}</td>
                          {measurement.values.map((value, i) => (
                            <td key={i}>{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

                  <div className="detail__review-breakdown">
                    <h4>Rating Breakdown</h4>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((review) => Math.floor(review.rating) === star).length
                      const percentage = (count / reviews.length) * 100

                      return (
                        <div key={star} className="detail__review-bar">
                          <div className="detail__review-bar-label">{star} Star</div>
                          <div className="detail__review-bar-container">
                            <div className="detail__review-bar-fill" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <div className="detail__review-bar-count">{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="detail__review-filters">
                  <h4>Filter & Sort Reviews</h4>
                  <div className="detail__review-filter-options">
                    <select
                      className="detail__review-filter-select"
                      value={reviewFilters.rating}
                      onChange={(e) => handleFilterChange("rating", e.target.value)}
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>

                    <select
                      className="detail__review-filter-select"
                      value={reviewFilters.sort}
                      onChange={(e) => handleFilterChange("sort", e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="highest">Highest Rated</option>
                      <option value="lowest">Lowest Rated</option>
                    </select>

                    <div className="detail__review-filter-checkboxes">
                      <label className="detail__review-filter-label">
                        <input
                          type="checkbox"
                          checked={reviewFilters.hasImages}
                          onChange={(e) => handleFilterChange("hasImages", e.target.checked)}
                        />
                        With Photos
                      </label>

                      <label className="detail__review-filter-label">
                        <input
                          type="checkbox"
                          checked={reviewFilters.verified}
                          onChange={(e) => handleFilterChange("verified", e.target.checked)}
                        />
                        Verified Purchases
                      </label>
                    </div>
                  </div>
                </div>

                <div className="detail__review-list">
                  {getFilteredReviews().slice(0, visibleReviews).length > 0 ? (
                    <div className="detail__review-grid">
                      {getFilteredReviews()
                        .slice(0, visibleReviews)
                        .map((review) => (
                          <div key={review.id} className="detail__review-item">
                            <div className="detail__review-header">
                              <div className="detail__review-author-info">
                                <img
                                  src={review.avatar || "/placeholder.svg"}
                                  alt={review.name}
                                  className="detail__review-avatar"
                                />
                                <div>
                                  <div className="detail__review-author">
                                    {review.name}
                                    {review.verified && (
                                      <span className="detail__review-verified">
                                        <FaCheck /> Verified Purchase
                                      </span>
                                    )}
                                  </div>
                                  <div className="detail__review-date">
                                    <FaRegCalendarAlt className="detail__review-date-icon" /> {review.date}
                                  </div>
                                </div>
                              </div>
                              <div className="detail__review-meta">
                                <div className="detail__review-rating">{renderStars(review.rating)}</div>
                                <div className="detail__review-purchase-info">
                                  <span>Size: {review.size}</span>
                                  <span>Color: {review.color}</span>
                                </div>
                              </div>
                            </div>
                            <div className="detail__review-content">{review.comment}</div>

                            {review.images && review.images.length > 0 && (
                              <div className="detail__review-images">
                                {review.images.map((image, index) => (
                                  <div
                                    key={index}
                                    className="detail__review-image"
                                    onClick={() => handleReviewImageClick(image)}
                                  >
                                    <img src={image || "/placeholder.svg"} alt={`Review by ${review.name}`} />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="detail__review-actions">
                              <button className="detail__review-helpful">
                                <FaThumbsUp /> Helpful ({review.likes})
                              </button>
                              <button className="detail__review-not-helpful">
                                <FaThumbsDown /> Not Helpful ({review.dislikes})
                              </button>
                              <button className="detail__review-report">
                                <FaFlag /> Report
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="detail__review-empty">
                      <p>No reviews match your current filters. Try adjusting your filters to see more reviews.</p>
                    </div>
                  )}

                  {getFilteredReviews().length > visibleReviews && (
                    <div className="detail__review-see-more">
                      <button
                        className="detail__review-see-more-button"
                        onClick={() => setVisibleReviews((prev) => prev + 3)}
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}

                  <div className="detail__review-see-all">
                    <button className="detail__review-see-all-button" onClick={handleShowAllReviews}>
                      See All Reviews ({reviews.length})
                    </button>
                  </div>
                </div>

                <div className="detail__review-form">
                  <h4>Write a Review</h4>
                  <form>
                    <div className="detail__form-group">
                      <label>Your Rating</label>
                      <div className="detail__rating-select">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`detail__rating-select-star ${star <= selectedRating ? "active" : ""}`}
                            onClick={() => setSelectedRating(star)}
                          />
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
                    <div className="detail__form-group">
                      <label>Add Photos (optional)</label>
                      <div className="detail__form-upload">
                        <input type="file" id="review-photos" multiple accept="image/*" onChange={handleImageUpload} />
                        <label htmlFor="review-photos" className="detail__upload-button">
                          <FaCamera className="detail__upload-icon" /> Choose Files
                        </label>
                        <span className="detail__upload-info">Maximum 5 images, 2MB each</span>
                      </div>

                      {uploadedImages.length > 0 && (
                        <div className="detail__upload-preview">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="detail__upload-image">
                              <img src={image || "/placeholder.svg"} alt={`Upload preview ${index + 1}`} />
                              <button
                                type="button"
                                className="detail__upload-remove"
                                onClick={() => handleRemoveImage(index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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
                  <div className="detail__shipping-section">
                    <h4>Delivery Options</h4>
                    <div className="detail__shipping-options">
                      <div className="detail__shipping-option">
                        <div className="detail__shipping-option-header">
                          <h5>Standard Shipping</h5>
                          <span className="detail__shipping-price">Free</span>
                        </div>
                        <p>
                          Delivery in 3-5 business days for orders over $50. Orders under $50 have a $4.99 shipping fee.
                        </p>
                        <div className="detail__shipping-estimate">
                          <FaRegClock className="detail__shipping-icon" />
                          <span>Estimated delivery: 3-5 business days</span>
                        </div>
                      </div>

                      <div className="detail__shipping-option">
                        <div className="detail__shipping-option-header">
                          <h5>Express Shipping</h5>
                          <span className="detail__shipping-price">$9.99</span>
                        </div>
                        <p>Expedited delivery in 1-2 business days. Order by 2 PM for same-day processing.</p>
                        <div className="detail__shipping-estimate">
                          <FaRegClock className="detail__shipping-icon" />
                          <span>Estimated delivery: 1-2 business days</span>
                        </div>
                      </div>

                      <div className="detail__shipping-option">
                        <div className="detail__shipping-option-header">
                          <h5>International Shipping</h5>
                          <span className="detail__shipping-price">From $14.99</span>
                        </div>
                        <p>Worldwide delivery available. Shipping rates and delivery times vary by country.</p>
                        <div className="detail__shipping-estimate">
                          <FaRegClock className="detail__shipping-icon" />
                          <span>Estimated delivery: 7-14 business days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="detail__shipping-section">
                    <h4>Returns & Exchanges</h4>
                    <p>
                      We want you to be completely satisfied with your purchase. If for any reason you're not happy with
                      your order, we offer a simple return and exchange policy.
                    </p>

                    <div className="detail__return-policy">
                      <div className="detail__return-item">
                        <h5>Return Policy</h5>
                        <ul>
                          <li>Returns accepted within 30 days of purchase</li>
                          <li>Items must be unused, unworn, and in original packaging</li>
                          <li>Original receipt or proof of purchase required</li>
                          <li>Refunds will be issued to the original payment method</li>
                          <li>Sale items can only be returned for store credit</li>
                        </ul>
                      </div>

                      <div className="detail__return-item">
                        <h5>Exchange Policy</h5>
                        <ul>
                          <li>Exchanges accepted within 30 days of purchase</li>
                          <li>Items must be unused, unworn, and in original packaging</li>
                          <li>Exchanges for different size or color only</li>
                          <li>
                            If the exchanged item has a different price, the difference will be charged or refunded
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="detail__return-process">
                      <h5>How to Return or Exchange</h5>
                      <ol>
                        <li>Contact our customer service team to initiate a return or exchange</li>
                        <li>Fill out the return form included with your order</li>
                        <li>Package the item securely in its original packaging</li>
                        <li>Ship the item using the provided return label or your preferred carrier</li>
                        <li>Refunds will be processed within 5-7 business days after receiving the returned item</li>
                      </ol>
                    </div>
                  </div>

                  <div className="detail__shipping-section">
                    <h4>Warranty Information</h4>
                    <p>
                      All our products come with a 1-year limited warranty against manufacturing defects. This warranty
                      covers defects in materials and workmanship under normal use.
                    </p>
                    <p>
                      The warranty does not cover damage from normal wear and tear, improper use, accidents, or
                      unauthorized repairs. To claim warranty service, please contact our customer service team with
                      your proof of purchase.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "faq" && (
              <div className="detail__faq">
                <h3>Frequently Asked Questions</h3>
                <div className="detail__faq-list">
                  {productFAQs.map((faq, index) => (
                    <div key={index} className={`detail__faq-item ${expandedFAQ === index ? "expanded" : ""}`}>
                      <div className="detail__faq-question" onClick={() => toggleFAQ(index)}>
                        <FaRegQuestionCircle className="detail__faq-icon" />
                        <h4>{faq.question}</h4>
                        <span className="detail__faq-toggle">{expandedFAQ === index ? "-" : "+"}</span>
                      </div>
                      <div className={`detail__faq-answer ${expandedFAQ === index ? "show" : ""}`}>
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="detail__faq-contact">
                  <h4>Still have questions?</h4>
                  <p>If you couldn't find the answer to your question, please contact our customer support team.</p>
                  <button className="detail__contact-button">Contact Support</button>
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

      {showSizeGuide && (
        <div className="detail__modal">
          <div className="detail__modal-content detail__modal-content--size-guide">
            <button className="detail__modal-close" onClick={toggleSizeGuide}>
              ×
            </button>
            <h3>Size Guide</h3>
            <div className="detail__size-guide">
              <div className="detail__size-guide-tabs">
                <button className="detail__size-guide-tab active">Centimeters (cm)</button>
                <button className="detail__size-guide-tab">Inches (in)</button>
              </div>
              <table className="detail__size-guide-table">
                <thead>
                  <tr>
                    <th>Measurement</th>
                    {sizeGuide.sizes.map((size) => (
                      <th key={size}>{size}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuide.measurements.map((measurement, index) => (
                    <tr key={index}>
                      <td>{measurement.name}</td>
                      {measurement.values.map((value, i) => (
                        <td key={i}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="detail__size-guide-info">
                <h4>How to Measure</h4>
                <div className="detail__size-guide-instructions">
                  <div className="detail__size-guide-instruction">
                    <h5>Chest</h5>
                    <p>Measure around the fullest part of your chest, keeping the measuring tape horizontal.</p>
                  </div>
                  <div className="detail__size-guide-instruction">
                    <h5>Waist</h5>
                    <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
                  </div>
                  <div className="detail__size-guide-instruction">
                    <h5>Hips</h5>
                    <p>Measure around the fullest part of your hips, keeping the tape horizontal.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVideoModal && (
        <div className="detail__modal">
          <div className="detail__modal-content detail__modal-content--video">
            <button className="detail__modal-close" onClick={toggleVideoModal}>
              ×
            </button>
            <h3>Product Video</h3>
            <div className="detail__video-container">
              <iframe
                width="100%"
                height="315"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Product Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {showReviewImages && (
        <div className="detail__modal">
          <div className="detail__modal-content detail__modal-content--images">
            <button className="detail__modal-close" onClick={closeReviewImages}>
              ×
            </button>
            <div className="detail__review-image-large">
              <img src={selectedReviewImage || "/placeholder.svg"} alt="Customer review" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Detail
