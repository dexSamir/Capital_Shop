import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/scrollbar"
import { Link } from "react-router-dom"
import hero1 from "../../assets/images/h1_hero1.jpg"
import hero2 from "../../assets/images/h1_hero2.jpg"
import item1 from "../../assets/images/items1.jpg"
import item2 from "../../assets/images/items2.jpg"
import item3 from "../../assets/images/items3.jpg"

function Slider() {
  return (
    <>
      <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]} spaceBetween={100} slidesPerView={1} navigation>
        <SwiperSlide>
          <div className="relative">
            <div className="absolute left-20 top-60 flex w-[30rem] flex-col items-center justify-between">
              <span className="mb-[1px] font-['Clicker_Script',cursive] text-5xl font-normal leading-tight text-[#ff2020]">
                Fashion Sale
              </span>
              <h1 className="mb-[2px] text-5xl font-semibold leading-tight text-[#292621]">Minimal Menz Style</h1>
              <p className="mb-[31px] px-[50px] text-center text-lg font-normal leading-8 text-[#74706b] [animation-delay:0.4s]">
                Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos
                facilis neque nulla earum.
              </p>
              <Link
                to="/products"
                className="inline-block border border-[#292621] bg-[#292621] px-[47px] py-[15px] text-sm font-medium uppercase leading-4 text-white no-underline transition-all duration-300 [animation-delay:0.7s] hover:bg-transparent hover:text-[#292621]"
              >
                Shop Now
              </Link>
            </div>
            <img src={hero1 || "/placeholder.svg"} alt="Hero 1" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="relative">
            <div className="absolute right-20 top-60 flex w-[30rem] flex-col items-center justify-between">
              <span className="mb-[1px] font-['Clicker_Script',cursive] text-5xl font-normal leading-tight text-[#ff2020]">
                Fashion Sale
              </span>
              <h1 className="mb-[2px] text-5xl font-semibold leading-tight text-[#292621]">Minimal Menz Style</h1>
              <p className="mb-[31px] px-[50px] text-center text-lg font-normal leading-8 text-[#74706b] [animation-delay:0.4s]">
                Consectetur adipisicing elit. Laborum fuga incidunt laboriosam voluptas iure, delectus dignissimos
                facilis neque nulla earum.
              </p>
              <Link
                to="/products"
                className="inline-block border border-[#292621] bg-[#292621] px-[47px] py-[15px] text-sm font-medium uppercase leading-4 text-white no-underline transition-all duration-300 [animation-delay:0.7s] hover:bg-transparent hover:text-[#292621]"
              >
                Shop Now
              </Link>
            </div>
            <img src={hero2 || "/placeholder.svg"} alt="Hero 2" />
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="mt-[30px] flex w-full items-center justify-center gap-5 px-20">
        <div className="relative overflow-hidden">
          <h1 className="absolute bottom-[30px] z-[2] w-full text-center text-2xl font-semibold text-white transition-all duration-300 ease-in-out">
            Men's Fashion
          </h1>
          <Link
            to="/products"
            className="absolute bottom-0 z-[2] w-full cursor-pointer text-center text-[#cebd9c] opacity-0 transition-all duration-300 ease-in-out hover:tracking-wider"
          >
            Shop Now
          </Link>
          <img src={item1 || "/placeholder.svg"} alt="Men's Fashion" />
          <div className="absolute bottom-0 z-[1] h-[40%] w-full bg-gradient-to-b from-[rgba(41,38,33,0)] to-[#292621] opacity-0 transition-opacity duration-300 ease-in-out"></div>
        </div>
        <div className="relative overflow-hidden hover:before:opacity-100">
          <h1 className="absolute bottom-[30px] z-[2] w-full text-center text-2xl font-semibold text-white transition-all duration-300 ease-in-out">
            Women's Fashion
          </h1>
          <Link
            to="/products"
            className="absolute bottom-0 z-[2] w-full cursor-pointer text-center text-[#cebd9c] opacity-0 transition-all duration-300 ease-in-out hover:tracking-wider"
          >
            Shop Now
          </Link>
          <img src={item2 || "/placeholder.svg"} alt="Women's Fashion" />
          <div className="absolute bottom-0 z-[1] h-[40%] w-full bg-gradient-to-b from-[rgba(41,38,33,0)] to-[#292621] opacity-0 transition-opacity duration-300 ease-in-out"></div>
        </div>
        <div className="relative overflow-hidden hover:before:opacity-100">
          <h1 className="absolute bottom-[30px] z-[2] w-full text-center text-2xl font-semibold text-white transition-all duration-300 ease-in-out">
            Baby Fashion
          </h1>
          <Link
            to="/products"
            className="absolute bottom-0 z-[2] w-full cursor-pointer text-center text-[#cebd9c] opacity-0 transition-all duration-300 ease-in-out hover:tracking-wider"
          >
            Shop Now
          </Link>
          <img src={item3 || "/placeholder.svg"} alt="Baby Fashion" />
          <div className="absolute bottom-0 z-[1] h-[40%] w-full bg-gradient-to-b from-[rgba(41,38,33,0)] to-[#292621] opacity-0 transition-opacity duration-300 ease-in-out"></div>
        </div>
      </div>
    </>
  )
}

export default Slider
