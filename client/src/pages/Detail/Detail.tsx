"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { FaThumbsUp, FaThumbsDown, FaCheck, FaRegCalendarAlt } from "react-icons/fa"

interface Review {
  id: string
  name: string
  avatar: string
  verified: boolean
  date: string
  rating: number
  size: string
  color: string
  comment: string
  images: string[]
  likes: number
  dislikes: number
}

interface DetailProps {
  id: string
  reviews: Review[]
  handleReviewImageClick: (image: string) => void
}

const Detail: React.FC<DetailProps> = ({ id, reviews, handleReviewImageClick }) => {
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i}>&#9733;</span>) 
      } else {
        stars.push(<span key={i}>&#9734;</span>) 
      }
    }
    return stars
  }

  return (
    <div className="detail__review-list">
      {reviews.length > 0 ? (
        <>
          <div className="detail__review-filters">
            <h4>Filter Reviews</h4>
            <div className="detail__review-filter-options">
              <select className="detail__review-filter-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="most-helpful">Most Helpful</option>
              </select>
              <div className="detail__review-filter-checkboxes">
                <label className="detail__review-filter-label">
                  <input type="checkbox" /> With Photos
                </label>
                <label className="detail__review-filter-label">
                  <input type="checkbox" /> Verified Purchases
                </label>
              </div>
            </div>
          </div>

          <div className="detail__review-items">
            {reviews.slice(0, 3).map((review) => (
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
                      <div key={index} className="detail__review-image" onClick={() => handleReviewImageClick(image)}>
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
                  <button className="detail__review-report">Report</button>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 && (
            <div className="detail__review-see-all">
              <Link to={`/reviews/${id}`} className="detail__review-see-all-button">
                See All {reviews.length} Reviews
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="detail__review-empty">
          <p>No reviews yet. Be the first to review this product.</p>
        </div>
      )}
    </div>
  )
}

export default Detail
