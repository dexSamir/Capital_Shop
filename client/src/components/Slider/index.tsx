import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { Link } from "react-router-dom"
import hero1 from "../../assets/images/h1_hero1.jpg"
import hero2 from "../../assets/images/h1_hero2.jpg"
import item1 from "../../assets/images/items1.jpg"
import item2 from "../../assets/images/items2.jpg"
import item3 from "../../assets/images/items3.jpg"
import "./Slider.scss"

function Slider() {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="slider__swiper"
      >
        <SwiperSlide>
          <div className="slider__hero">
            <div className="slider__content">
              <span className="slider__subtitle">Fashion Sale</span>
              <h1 className="slider__title">Minimal Menz Style</h1>
              <p className="slider__description">
                Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos
                facilis neque nulla earum.
              </p>
              <Link to="/products" className="slider__button">
                Shop Now
              </Link>
            </div>
            <img src={hero1 || "/placeholder.svg"} alt="Hero 1" className="slider__image" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slider__hero">
            <div className="slider__content slider__content--right">
              <span className="slider__subtitle">Fashion Sale</span>
              <h1 className="slider__title">Minimal Menz Style</h1>
              <p className="slider__description">
                Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos
                facilis neque nulla earum.
              </p>
              <Link to="/products" className="slider__button">
                Shop Now
              </Link>
            </div>
            <img src={hero2 || "/placeholder.svg"} alt="Hero 2" className="slider__image" />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="slider__categories">
        <div className="container">
          <div className="slider__categories-grid">
            <div className="slider__category">
              <h1 className="slider__category-title">Men's Fashion</h1>
              <Link to="/products" className="slider__category-link">
                Shop Now
              </Link>
              <img src={item1 || "/placeholder.svg"} alt="Men's Fashion" className="slider__category-image" />
              <div className="slider__category-overlay"></div>
            </div>
            <div className="slider__category">
              <h1 className="slider__category-title">Women's Fashion</h1>
              <Link to="/products" className="slider__category-link">
                Shop Now
              </Link>
              <img src={item2 || "/placeholder.svg"} alt="Women's Fashion" className="slider__category-image" />
              <div className="slider__category-overlay"></div>
            </div>
            <div className="slider__category">
              <h1 className="slider__category-title">Baby Fashion</h1>
              <Link to="/products" className="slider__category-link">
                Shop Now
              </Link>
              <img src={item3 || "/placeholder.svg"} alt="Baby Fashion" className="slider__category-image" />
              <div className="slider__category-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Slider
