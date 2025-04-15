"use client"

import { useState, useEffect } from "react"
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import Card from "./Card"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import { testimonials } from "../data/Data"
import { getAllproducts } from "../middleware/products"

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
    <button
      className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded border-none bg-[rgba(0,0,0,0.5)] px-4 py-8 text-2xl text-white transition-all duration-200 hover:bg-[rgba(0,0,0,0.9)]"
      onClick={onClick}
    >
      <FaChevronLeft />
    </button>
  )
}

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="absolute right-[15px] top-1/2 z-10 -translate-y-1/2 rounded border-none bg-[rgba(0,0,0,0.5)] px-4 py-8 text-2xl text-white transition-all duration-200 hover:bg-[rgba(0,0,0,0.9)]"
      onClick={onClick}
    >
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

  useEffect(() => {
    getAllproducts().then((res) => {
      setProducts(res)
    })
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
  }

  return (
    <div className="mt-16">
      <div className="flex h-24 w-full items-center justify-between border-b border-[#eeeff3] px-20">
        <div>
          <h1 className="text-[34px] font-medium leading-tight text-[#292621]">Trending This Week</h1>
        </div>
        <div>
          <ul className="flex items-center justify-center list-none">
            <li>
              <a
                href=""
                className="mr-[15px] border-b-4 border-transparent pb-0 pt-0 px-3 text-base font-semibold text-[#292621] no-underline transition-all duration-300 hover:border-[#ff2020]"
              >
                Men
              </a>
            </li>
            <li>
              <a
                href=""
                className="mr-[15px] border-b-4 border-transparent pb-0 pt-0 px-3 text-base font-semibold text-[#292621] no-underline transition-all duration-300 hover:border-[#ff2020]"
              >
                Women
              </a>
            </li>
            <li>
              <a
                href=""
                className="mr-[15px] border-b-4 border-transparent pb-0 pt-0 px-3 text-base font-semibold text-[#292621] no-underline transition-all duration-300 hover:border-[#ff2020]"
              >
                Baby
              </a>
            </li>
            <li>
              <a
                href=""
                className="mr-[15px] border-b-4 border-transparent pb-0 pt-0 px-3 text-base font-semibold text-[#292621] no-underline transition-all duration-300 hover:border-[#ff2020]"
              >
                Fashion
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full px-20">
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
              <Card
                key={item.id}
                id={item.id}
                name={item.name}
                img={item.img}
                price={item.price}
                withoutDiscount={item.withoutDiscount}
                products={products}
              />
            ))}
        </Carousel>
      </div>
      <div className="mt-28 rounded-[10px] bg-[#f3ead8] p-20 text-center">
        <Slider {...settings}>
          {testimonials &&
            testimonials.map((testimonial, index) => (
              <div key={index} className="mx-auto max-w-[800px] p-5 text-center">
                <h1 className="mb-[30px] whitespace-nowrap font-['Jost',sans-serif] text-[34px] font-semibold text-[#292621]">
                  Customer Testimonial
                </h1>
                <p className="mx-auto mb-8 max-w-[600px] text-lg font-normal leading-relaxed text-[#292621]">
                  {testimonial.text}
                </p>
                <div className="mt-8 flex items-center justify-center">
                  <div className="mr-4 h-[60px] w-[60px] overflow-hidden rounded-full">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xl font-bold text-[#302f2b]">{testimonial.name}</span>
                    <p className="mt-[0.2rem] text-[0.9rem] text-[#76726f]">{testimonial.specialty}</p>
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
