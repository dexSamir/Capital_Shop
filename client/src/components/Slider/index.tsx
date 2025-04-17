"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import hero1 from "../../assets/images/h1_hero1.jpg"
import hero2 from "../../assets/images/h1_hero2.jpg"
import item1 from "../../assets/images/items1.jpg"
import item2 from "../../assets/images/items2.jpg"
import item3 from "../../assets/images/items3.jpg"
import "./Slider.scss"

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const slides = [
    {
      id: 1,
      image: hero1,
      subtitle: "Fashion Sale",
      title: "Minimal Menz Style",
      description:
        "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum.",
      position: "left",
    },
    {
      id: 2,
      image: hero2,
      subtitle: "Fashion Sale",
      title: "Minimal Menz Style",
      description:
        "Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos facilis neque nulla earum.",
      position: "right",
    },
  ]

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [currentSlide])

  return (
    <>
      <div className="custom-slider">
        <div className="custom-slider__container" ref={sliderRef}>
          <div className="custom-slider__track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={slide.id} className="custom-slider__slide">
                <div className="custom-slider__hero">
                  <div className={`custom-slider__content custom-slider__content--${slide.position}`}>
                    <span className="custom-slider__subtitle">{slide.subtitle}</span>
                    <h1 className="custom-slider__title">{slide.title}</h1>
                    <p className="custom-slider__description">{slide.description}</p>
                    <Link to="/products" className="custom-slider__button">
                      Shop Now
                    </Link>
                  </div>
                  <img
                    src={slide.image || "/placeholder.svg"}
                    alt={`Hero ${index + 1}`}
                    className="custom-slider__image"
                  />
                </div>
              </div>
            ))}
          </div>

          <button className="custom-slider__arrow custom-slider__arrow--left" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="custom-slider__arrow custom-slider__arrow--right" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          <div className="custom-slider__pagination">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`custom-slider__pagination-bullet ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="category-section">
        <div className="container">
          <div className="category-section__grid">
            <div className="category-section__item">
              <h1 className="category-section__title">Men's Fashion</h1>
              <Link to="/products" className="category-section__link">
                Shop Now
              </Link>
              <img src={item1 || "/placeholder.svg"} alt="Men's Fashion" className="category-section__image" />
              <div className="category-section__overlay"></div>
            </div>
            <div className="category-section__item">
              <h1 className="category-section__title">Women's Fashion</h1>
              <Link to="/products" className="category-section__link">
                Shop Now
              </Link>
              <img src={item2 || "/placeholder.svg"} alt="Women's Fashion" className="category-section__image" />
              <div className="category-section__overlay"></div>
            </div>
            <div className="category-section__item">
              <h1 className="category-section__title">Baby Fashion</h1>
              <Link to="/products" className="category-section__link">
                Shop Now
              </Link>
              <img src={item3 || "/placeholder.svg"} alt="Baby Fashion" className="category-section__image" />
              <div className="category-section__overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Slider
