"use client"

import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"
import Card from "../Card"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import "./MayLike.scss"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
}

interface MayLikeProps {
  products: Product[]
}

const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="may-like__arrow may-like__arrow--left" onClick={onClick}>
      <FaChevronLeft />
    </button>
  )
}

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button className="may-like__arrow may-like__arrow--right" onClick={onClick}>
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

function MayLike({ products }: MayLikeProps) {
  const accessoryProducts = products.filter((item) => item.category === "accessory")

  return (
    <div className="may-like">
      <h1 className="may-like__title">You May Like</h1>
      <div className="may-like__carousel">
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={2000}
          pauseOnHover={true}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {accessoryProducts.map((item) => (
            <div className="may-like__card-wrapper" key={item.id}>
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
      </div>
    </div>
  )
}

export default MayLike
