"use client"

import { Link } from "react-router-dom"

function Logout() {


  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-[700px] bg-white p-[55px_60px_50px_50px] shadow-[0px_10px_30px_0px_rgba(13,12,13,0.2)]">
        <div className="text-center">
          <h1 className="mb-4 text-[30px] font-semibold text-[#140c40]">Logout</h1>
          <p className="mb-[15px] text-base font-normal leading-relaxed text-[#301a22]">You are already logged in.</p>
        </div>
        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="group relative mr-4 overflow-hidden rounded-[50px] bg-[#ff2020] px-[26px] py-[15px] text-sm font-medium text-white no-underline"
          >
            Home
            <div className="absolute left-[-100%] top-0 z-[-1] h-full w-full bg-white transition-all duration-500 group-hover:left-0"></div>
          </Link>
          <Link
            to="/products"
            className="group relative mr-4 overflow-hidden rounded-[50px] bg-[#ff2020] px-[26px] py-[15px] text-sm font-medium text-white no-underline"
          >
            Products
            <div className="absolute left-[-100%] top-0 z-[-1] h-full w-full bg-white transition-all duration-500 group-hover:left-0"></div>
          </Link>
          <Link
            className="group relative overflow-hidden rounded-[50px] bg-[#ff2020] px-[26px] py-[15px] text-sm font-medium text-white no-underline"
            to="/login"
          >
            Logout
            <div className="absolute left-[-100%] top-0 z-[-1] h-full w-full bg-white transition-all duration-500 group-hover:left-0"></div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Logout
