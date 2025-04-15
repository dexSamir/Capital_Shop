"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { CiSearch } from "react-icons/ci"
import { LuUser } from "react-icons/lu"
import { SlBasket } from "react-icons/sl"
import { IoIosLogOut } from "react-icons/io"
import { LoginContext } from "../App"
import Tooltip from "./Tooltip"
import logo from "../assets/images/logo.png"

function Header() {
  const { isLogin, setIsLogin, isAdmin } = useContext(LoginContext)

  return (
    <>
      <div className="flex h-[100px] w-full items-center justify-between px-20">
        <div className="logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </Link>
        </div>
        <div className="middle">
          <ul className="flex items-center justify-center list-none">
            <li className="mx-8">
              <Link
                to="/"
                className="text-base font-extrabold text-[#292621] transition-all duration-300 hover:text-red-600 no-underline"
              >
                Home
              </Link>
            </li>
            <li className="mx-8">
              <Link
                to="/products"
                className="text-base font-extrabold text-[#292621] transition-all duration-300 hover:text-red-600 no-underline"
              >
                Products
              </Link>
            </li>
            <li className="mx-8">
              <Link
                to="/contact"
                className="text-base font-extrabold text-[#292621] transition-all duration-300 hover:text-red-600 no-underline"
              >
                Contact
              </Link>
            </li>
            {isAdmin ? (
              <li className="mx-8">
                <Link
                  to="/admin/dashboard"
                  className="text-base font-extrabold text-[#292621] transition-all duration-300 hover:text-red-600 no-underline"
                >
                  Table
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <Tooltip TooltipText="Search">
            <CiSearch className="mx-[0.8rem] cursor-pointer text-3xl transition-all duration-300 hover:text-red-600" />
          </Tooltip>
          <Link to={isLogin ? "/logout" : "/login"} className="text-[#16151a]">
            <Tooltip TooltipText={isLogin ? "Logout" : "Login"}>
              {isLogin ? (
                <IoIosLogOut className="mx-[0.8rem] cursor-pointer text-3xl transition-all duration-300 hover:text-red-600" />
              ) : (
                <LuUser className="mx-[0.8rem] cursor-pointer text-3xl transition-all duration-300 hover:text-red-600" />
              )}
            </Tooltip>
          </Link>
          <Tooltip TooltipText="Basket">
            <Link to="/basket" className="text-[#16151a]">
              <SlBasket className="mx-[0.8rem] cursor-pointer text-3xl transition-all duration-300 hover:text-red-600" />
            </Link>
          </Tooltip>
        </div>
      </div>
      <div className="flex h-[50px] cursor-pointer items-center justify-center bg-[#16151a] text-base text-white">
        Sale Up To 50% Biggest Discounts. Hurry! Limited Perriod Offer{" "}
        <Link className="ml-1 text-[#cdbd9c] transition-all duration-300 hover:tracking-wider" to="/products">
          Shop Now
        </Link>
      </div>
    </>
  )
}

export default Header
