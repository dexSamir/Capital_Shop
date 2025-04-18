"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaRegCalendarAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaFilter,
  FaSearch,
} from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchProductById } from "../../store/slices/productSlice"
import "./Reviews.scss"

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
  {
    id: 6,
    name: "Sarah Johnson",
    rating: 4,
    date: "2022-12-15",
    comment:
      "I'm very happy with this purchase. The product arrived quickly and was exactly as described. The quality is good for the price point.",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    verified: true,
    images: [],
    likes: 7,
    dislikes: 0,
    size: "S",
    color: "Blue",
  },
  {
    id: 7,
    name: "Robert Garcia",
    rating: 2,
    date: "2022-11-28",
    comment:
      "Disappointed with this purchase. The product doesn't match the description and the quality is poor. Would not recommend.",
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    verified: true,
    images: [],
    likes: 3,
    dislikes: 8,
    size: "L",
    color: "Black",
  },
  {
    id: 8,
    name: "Jennifer Lee",
    rating: 5,
    date: "2022-10-17",
    comment:
      "Absolutely perfect! The quality exceeds my expectations and the fit is great. I've already received many compliments on it.",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    verified: false,
    images: ["https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest2.jpg"],
    likes: 18,
    dislikes: 1,
    size: "M",
    color: "White",
  },
  {
    id: 9,
    name: "Thomas Wright",
    rating: 3,
    date: "2022-09-05",
    comment:
      "It's an average product. Not bad, but not great either. The material is decent but I've seen better for this price range.",
    avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    verified: true,
    images: [],
    likes: 4,
    dislikes: 2,
    size: "XL",
    color: "Red",
  },
  {
    id: 10,
    name: "Lisa Martinez",
    rating: 5,
    date: "2022-08-22",
    comment:
      "I love everything about this product! The design is beautiful, the quality is excellent, and it's very comfortable. Highly recommend!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    verified: true,
    images: ["https://preview.colorlib.com/theme/capitalshop/assets/img/gallery/latest4.jpg"],
    likes: 25,
    dislikes: 0,
    size: "S",
    color: "Black",
  },
]

function Reviews() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedProduct, loading } = useAppSelector((state) => state.products)
  const [selectedReviewImage, setSelectedReviewImage] = useState("")
  const [showReviewImages, setShowReviewImages] = useState(false)
  const [filters, setFilters] = useState({
    rating: "all",
    sort: "newest",
    hasImages: false,
    verified: false,
    search: "",
    size: "all",
    color: "all",
  })
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
  }, [dispatch, id])

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleReviewImageClick = (image: string) => {
    setSelectedReviewImage(image)
    setShowReviewImages(true)
  }

  const closeReviewImages = () => {
    setShowReviewImages(false)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleLikeReview = (reviewId: number) => {
    console.log(`Liked review ${reviewId}`)
  }

  const handleDislikeReview = (reviewId: number) => {
    console.log(`Disliked review ${reviewId}`)
  }

  const handleReportReview = (reviewId: number) => {
    console.log(`Reported review ${reviewId}`)
  }

  const getFilteredReviews = () => {
    let filtered = [...reviews]

    if (filters.rating !== "all") {
      const ratingValue = Number.parseInt(filters.rating)
      filtered = filtered.filter((review) => Math.floor(review.rating) === ratingValue)
    }

    if (filters.hasImages) {
      filtered = filtered.filter((review) => review.images && review.images.length > 0)
    }

    if (filters.verified) {
      filtered = filtered.filter((review) => review.verified)
    }

    if (filters.size !== "all") {
      filtered = filtered.filter((review) => review.size === filters.size)
    }

    if (filters.color !== "all") {
      filtered = filtered.filter((review) => review.color === filters.color)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (review) =>
          review.name.toLowerCase().includes(searchLower) || review.comment.toLowerCase().includes(searchLower),
      )
    }

    switch (filters.sort) {
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
      case "most-helpful":
        filtered.sort((a, b) => b.likes - a.likes)
        break
      default:
        break
    }

    return filtered
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="reviews__rating-star" />)
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="reviews__rating-star" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="reviews__rating-star reviews__rating-star--empty" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="reviews">
        <div className="reviews__loading">
          <div className="reviews__loading-spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  const filteredReviews = getFilteredReviews()
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <div className="reviews">
      <div className="reviews__header">
        <div className="reviews__breadcrumb">
          <Link to="/" className="reviews__breadcrumb-link">
            Home
          </Link>
          <span className="reviews__breadcrumb-separator"></span>
          <Link to="/products" className="reviews__breadcrumb-link">
            Products
          </Link>
          <span className="reviews__breadcrumb-separator"></span>
          {selectedProduct && (
            <>
              <Link to={`/detail/${id}`} className="reviews__breadcrumb-link">
                {selectedProduct.name}
              </Link>
              <span className="reviews__breadcrumb-separator"></span>
            </>
          )}
          <span className="reviews__breadcrumb-current">Reviews</span>
        </div>

        <h1 className="reviews__title">Customer Reviews {selectedProduct && `for ${selectedProduct.name}`}</h1>
      </div>

      <div className="reviews__content">
        <div className="reviews__summary">
          <div className="reviews__summary-rating">
            <div className="reviews__summary-average">{averageRating.toFixed(1)}</div>
            <div className="reviews__summary-stars">{renderStars(averageRating)}</div>
            <div className="reviews__summary-count">Based on {reviews.length} reviews</div>
          </div>

          <div className="reviews__summary-breakdown">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((review) => Math.floor(review.rating) === star).length
              const percentage = (count / reviews.length) * 100

              return (
                <div key={star} className="reviews__summary-bar">
                  <div className="reviews__summary-bar-label">{star} Star</div>
                  <div className="reviews__summary-bar-container">
                    <div className="reviews__summary-bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="reviews__summary-bar-count">{count}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="reviews__main">
          <div className="reviews__filter-toggle">
            <button onClick={toggleFilters} className="reviews__filter-toggle-button">
              <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            <div className="reviews__results-count">
              Showing {filteredReviews.length} of {reviews.length} reviews
            </div>
          </div>

          <div className="reviews__container">
            {showFilters && (
              <div className="reviews__filters">
                <div className="reviews__filters-header">
                  <h3>Filter Reviews</h3>
                </div>

                <div className="reviews__filters-search">
                  <div className="reviews__filters-search-input">
                    <input
                      type="text"
                      placeholder="Search reviews..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                    <FaSearch className="reviews__filters-search-icon" />
                  </div>
                </div>

                <div className="reviews__filters-group">
                  <h4>Rating</h4>
                  <div className="reviews__filters-options">
                    <label className="reviews__filters-radio">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === "all"}
                        onChange={() => handleFilterChange("rating", "all")}
                      />
                      <span>All Ratings</span>
                    </label>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <label key={star} className="reviews__filters-radio">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === star.toString()}
                          onChange={() => handleFilterChange("rating", star.toString())}
                        />
                        <span>{star} Stars</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="reviews__filters-group">
                  <h4>Sort By</h4>
                  <select
                    className="reviews__filters-select"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                    <option value="most-helpful">Most Helpful</option>
                  </select>
                </div>

                <div className="reviews__filters-group">
                  <h4>Size</h4>
                  <select
                    className="reviews__filters-select"
                    value={filters.size}
                    onChange={(e) => handleFilterChange("size", e.target.value)}
                  >
                    <option value="all">All Sizes</option>
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">X-Large (XL)</option>
                  </select>
                </div>

                <div className="reviews__filters-group">
                  <h4>Color</h4>
                  <select
                    className="reviews__filters-select"
                    value={filters.color}
                    onChange={(e) => handleFilterChange("color", e.target.value)}
                  >
                    <option value="all">All Colors</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                  </select>
                </div>

                <div className="reviews__filters-group">
                  <h4>Other Filters</h4>
                  <div className="reviews__filters-checkboxes">
                    <label className="reviews__filters-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.hasImages}
                        onChange={(e) => handleFilterChange("hasImages", e.target.checked)}
                      />
                      <span>With Photos</span>
                    </label>
                    <label className="reviews__filters-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => handleFilterChange("verified", e.target.checked)}
                      />
                      <span>Verified Purchases</span>
                    </label>
                  </div>
                </div>

                <button
                  className="reviews__filters-reset"
                  onClick={() =>
                    setFilters({
                      rating: "all",
                      sort: "newest",
                      hasImages: false,
                      verified: false,
                      search: "",
                      size: "all",
                      color: "all",
                    })
                  }
                >
                  Reset Filters
                </button>
              </div>
            )}

            <div className="reviews__list">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <div key={review.id} className="reviews__item">
                    <div className="reviews__item-header">
                      <div className="reviews__item-author">
                        <img
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          className="reviews__item-avatar"
                        />
                        <div className="reviews__item-author-info">
                          <div className="reviews__item-author-name">
                            {review.name}
                            {review.verified && (
                              <span className="reviews__item-verified">
                                <FaCheck /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="reviews__item-date">
                            <FaRegCalendarAlt className="reviews__item-date-icon" /> {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="reviews__item-rating">{renderStars(review.rating)}</div>
                    </div>

                    <div className="reviews__item-content">
                      <p>{review.comment}</p>
                    </div>

                    <div className="reviews__item-meta">
                      <div className="reviews__item-details">
                        <span>Size: {review.size}</span>
                        <span>Color: {review.color}</span>
                      </div>

                      {review.images && review.images.length > 0 && (
                        <div className="reviews__item-images">
                          {review.images.map((image, index) => (
                            <div
                              key={index}
                              className="reviews__item-image"
                              onClick={() => handleReviewImageClick(image)}
                            >
                              <img src={image || "/placeholder.svg"} alt={`Review by ${review.name}`} />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="reviews__item-actions">
                        <button className="reviews__item-action" onClick={() => handleLikeReview(review.id)}>
                          <FaThumbsUp /> Helpful ({review.likes})
                        </button>
                        <button className="reviews__item-action" onClick={() => handleDislikeReview(review.id)}>
                          <FaThumbsDown /> Not Helpful ({review.dislikes})
                        </button>
                        <button className="reviews__item-action" onClick={() => handleReportReview(review.id)}>
                          <FaFlag /> Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="reviews__empty">
                  <p>No reviews match your current filters.</p>
                  <button
                    className="reviews__empty-button"
                    onClick={() =>
                      setFilters({
                        rating: "all",
                        sort: "newest",
                        hasImages: false,
                        verified: false,
                        search: "",
                        size: "all",
                        color: "all",
                      })
                    }
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReviewImages && (
        <div className="reviews__modal">
          <div className="reviews__modal-content">
            <button className="reviews__modal-close" onClick={closeReviewImages}>
              ×
            </button>
            <div className="reviews__modal-image">
              <img src={selectedReviewImage || "/placeholder.svg"} alt="Review" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reviews
