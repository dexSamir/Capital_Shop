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
import { fetchProductReviews, likeReview, dislikeReview, deleteReview, type ReviewDto } from "../../api/reviews"
import { getImageUrl } from "../../api/client"
import "./Reviews.scss"

function Reviews() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { selectedProduct, loading } = useAppSelector((state) => state.products)
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const [reviewsRaw, setReviewsRaw] = useState<ReviewDto[]>([])

  const reviews = reviewsRaw.map((r) => ({
    id: r.id,
    userId: r.userId,
    name: r.userName,
    rating: r.rating || 0,
    date: new Date(r.createdTime).toLocaleDateString(),
    comment: r.comment,
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    verified: true,
    images: r.images ? r.images.map(img => getImageUrl(img)) : [],
    likes: r.likes || 0,
    dislikes: r.dislikes || 0,
    userReaction: r.userReaction,
    size: "M",
    color: "Black",
  }))
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
      fetchProductReviews(Number(id)).then(setReviewsRaw).catch(console.error)
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

  const handleLikeReview = async (reviewId: number) => {
    try {
      await likeReview(reviewId);
      const newReviews = await fetchProductReviews(Number(id));
      setReviewsRaw(newReviews);
    } catch (err) {
      alert("Failed to like the review. Make sure you are logged in.");
    }
  }

  const handleDislikeReview = async (reviewId: number) => {
    try {
      await dislikeReview(reviewId);
      const newReviews = await fetchProductReviews(Number(id));
      setReviewsRaw(newReviews);
    } catch (err) {
      alert("Failed to dislike the review. Make sure you are logged in.");
    }
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviewsRaw(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert("Failed to delete review. You may not have permission.");
    }
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
                        <button className={`reviews__item-action ${review.userReaction === 'Like' ? 'active' : ''}`} style={{ color: review.userReaction === 'Like' ? 'blue' : 'inherit' }} onClick={() => handleLikeReview(review.id)}>
                          <FaThumbsUp /> Helpful ({review.likes})
                        </button>
                        <button className={`reviews__item-action ${review.userReaction === 'Dislike' ? 'active' : ''}`} style={{ color: review.userReaction === 'Dislike' ? 'red' : 'inherit' }} onClick={() => handleDislikeReview(review.id)}>
                          <FaThumbsDown /> Not Helpful ({review.dislikes})
                        </button>
                        <button className="reviews__item-action" onClick={() => handleReportReview(review.id)}>
                          <FaFlag /> Report
                        </button>
                        {currentUser && (currentUser.id === review.userId || currentUser.isAdmin) && (
                          <button
                            className="reviews__item-action"
                            onClick={() => handleDeleteReview(review.id)}
                            style={{ color: 'red', border: '1px solid currentColor', padding: '0.2rem 0.6rem', borderRadius: '4px' }}
                          >
                            Delete
                          </button>
                        )}
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
