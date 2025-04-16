"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../Card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: number;
  withoutDiscount: number;
  img: string;
  category: string;
}

interface MayLikeProps {
  products: Product[];
}

const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded border-none bg-[rgba(0,0,0,0.5)] px-4 py-8 text-2xl text-white transition-all duration-200 hover:bg-[rgba(0,0,0,0.9)]"
      onClick={onClick}
    >
      <FaChevronLeft />
    </button>
  );
};

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      className="absolute right-[15px] top-1/2 z-10 -translate-y-1/2 rounded border-none bg-[rgba(0,0,0,0.5)] px-4 py-8 text-2xl text-white transition-all duration-200 hover:bg-[rgba(0,0,0,0.9)]"
      onClick={onClick}
    >
      <FaChevronRight />
    </button>
  );
};

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
};

function MayLike({ products }: MayLikeProps) {
  return (
    <div className="mx-auto mt-20 w-full px-20">
      <h1 className="mb-[22px] block text-center text-[30px] font-medium leading-relaxed text-[#292621] font-['Jost',sans-serif]">
        You May Like
      </h1>
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
          products.map(
            (item) =>
              item.category === "accessory" && (
                <Card
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  img={item.img}
                  price={item.price}
                  withoutDiscount={item.withoutDiscount}
                  products={products}
                />
              )
          )}
      </Carousel>
    </div>
  );
}

export default MayLike;
