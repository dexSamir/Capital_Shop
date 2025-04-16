"use client"

import type React from "react"

import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { CiSearch } from "react-icons/ci"
import { LuUser } from "react-icons/lu"
import { SlBasket } from "react-icons/sl"
import { IoIosLogOut } from "react-icons/io"
import { useAppSelector } from "../../store/hooks"
import Tooltip from "../Tooltip"
import logo from "../../assets/images/logo.png"
import "./Header.scss"

function Header() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const cartItemsCount = useAppSelector((state) => state.cart.totalCount)
  const [searchActive, setSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearchClick = () => {
    setSearchActive(!searchActive)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setSearchActive(false)
    }
  }

  return (
    <div className="header">
      <div className="header__top">
        <div className="header__logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </Link>
        </div>
        <div className="header__nav">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <NavLink to="/" className={({ isActive }) => (isActive ? "header__nav-link active" : "header__nav-link")}>
                Home
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/products"
                className={({ isActive }) => (isActive ? "header__nav-link active" : "header__nav-link")}
              >
                Products
              </NavLink>
            </li>
            <li className="header__nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? "header__nav-link active" : "header__nav-link")}
              >
                Contact
              </NavLink>
            </li>
            {user?.isAdmin && (
              <li className="header__nav-item">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => (isActive ? "header__nav-link active" : "header__nav-link")}
                >
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="header__actions">
          <form onSubmit={handleSearchSubmit} className="header__search">
            <input
              type="text"
              className={`header__search-input ${searchActive ? "active" : ""}`}
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Tooltip TooltipText="Search">
              <CiSearch className="header__search-icon" onClick={handleSearchClick} />
            </Tooltip>
          </form>
          <Link to={isAuthenticated ? "/logout" : "/login"} className="header__action-link">
            <Tooltip TooltipText={isAuthenticated ? "Logout" : "Login"}>
              {isAuthenticated ? (
                <IoIosLogOut className="header__action-icon" />
              ) : (
                <LuUser className="header__action-icon" />
              )}
            </Tooltip>
          </Link>
          <Tooltip TooltipText="Basket">
            <Link to="/basket" className="header__action-link">
              <div className="header__cart">
                <SlBasket className="header__action-icon" />
                {cartItemsCount > 0 && <span className="header__cart-count">{cartItemsCount}</span>}
              </div>
            </Link>
          </Tooltip>
        </div>
      </div>
      <div className="header__banner">
        Sale Up To 50% Biggest Discounts. Hurry! Limited Period Offer{" "}
        <Link className="header__banner-link" to="/products">
          Shop Now
        </Link>
      </div>
    </div>
  )
}

export default Header
