import { Link } from "react-router-dom"
import { TfiFaceSad } from "react-icons/tfi"

function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="mb-5 text-2xl text-[#333333]">
        <span className="text-[96px] font-bold text-[#ff5722]">4</span>
        <TfiFaceSad className="text-[70px] font-extrabold text-[#ff5722]" />
        <span className="text-[96px] font-bold text-[#ff5722]">4</span> Page Not Found.
      </div>
      <div className="mb-[30px] text-base text-[#666666]">Oops! The page you're looking for cannot be found.</div>
      <div className="cursor-pointer rounded bg-[#2196f3] px-5 py-[10px] text-base transition-colors duration-300 ease-in-out hover:opacity-80">
        <Link to="/" className="text-white no-underline">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
