"use client"

import { useState, useEffect } from "react"
import Carousel from "react-multi-carousel"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import Slider from "react-slick"
import { testimonials } from "../../data/Data"
import { getAllproducts } from "../../middleware/products"
import Card from "../Card"
import "./Trend.scss"
import "react-multi-carousel/lib/styles.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"


interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
}

const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="trend__arrow trend__arrow--left" onClick={onClick}>
      <FaChevronLeft />
    </button>
  )
}

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="trend__arrow trend__arrow--right" onClick={onClick}>
      <FaChevronRight />
    </button>
  )
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

function Trend() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllproducts()
      .then((res) => {
        setProducts(res)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  }

  return (
    <div className="trend">
      <div className="trend__header">
        <div className="trend__title-container">
          <h1 className="trend__title">Trending This Week</h1>
        </div>
        <div className="trend__categories">
          <ul className="trend__category-list">
            <li className="trend__category-item">
              <a href="#" className="trend__category-link">
                Men
              </a>
            </li>
            <li className="trend__category-item">
              <a href="#" className="trend__category-link">
                Women
              </a>
            </li>
            <li className="trend__category-item">
              <a href="#" className="trend__category-link">
                Baby
              </a>
            </li>
            <li className="trend__category-item">
              <a href="#" className="trend__category-link">
                Fashion
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="trend__carousel">
        {loading ? (
          <div className="trend__loading">
            <div className="trend__loading-spinner"></div>
            <p>Loading trending products...</p>
          </div>
        ) : (
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={2000}
            pauseOnHover={true}
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
          >
            {products &&
              products.map((item) => (
                <div className="trend__card-wrapper" key={item.id}>
                  <Card
                    id={item.id}
                    name={item.name}
                    img={item.img}
                    price={item.price}
                    withoutDiscount={item.withoutDiscount}
                    product={item}
                  />
                </div>
              ))}
          </Carousel>
        )}
      </div>
      <div className="trend__testimonials">
        <h2 className="trend__testimonials-title">What Our Customers Say</h2>
        <Slider {...settings}>
          {testimonials &&
            testimonials.map((testimonial, index) => (
              <div key={index} className="trend__testimonial">
                <p className="trend__testimonial-text">{testimonial.text}</p>
                <div className="trend__testimonial-author">
                  <div className="trend__testimonial-image-container">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="trend__testimonial-image"
                    />
                  </div>
                  <div className="trend__testimonial-info">
                    <span className="trend__testimonial-name">{testimonial.name}</span>
                    <p className="trend__testimonial-specialty">{testimonial.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  )
}

export default Trend
