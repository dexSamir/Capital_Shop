"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "../../store/hooks"
import { logout } from "../../store/slices/authSlice"
import "./Sidebar.scss"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const mainNavItems = [
    {
      name: "Home",
      path: "/",
      icon: "🏠",
    },
    {
      name: "Products",
      path: "/products",
      icon: "🛍️",
    },
    {
      name: "Wishlist",
      path: "/wishlist",
      icon: "❤️",
    },
    {
      name: "Contact",
      path: "/contact",
      icon: "📞",
    },
  ]

  const accountNavItems = [
    {
      name: isAuthenticated ? "Logout" : "Login",
      path: isAuthenticated ? "/logout" : "/login",
      icon: isAuthenticated ? "🚪" : "👤",
    },
    ...(user?.isAdmin ? [{ name: "Admin Dashboard", path: "/admin/dashboard", icon: "⚙️" }] : []),
  ]

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    if (isAuthenticated) {
      dispatch(logout())
    }
  }

  return (
    <>
      <div className="sidebar-toggle">
        <button onClick={toggleSidebar}>{isOpen ? "✕" : "☰"}</button>
      </div>

      <div className={`sidebar-overlay ${isOpen ? "active" : ""}`} onClick={toggleSidebar} />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar__container">
          <div className="sidebar__logo">
            <Link to="/">eShop</Link>
          </div>

          <nav className="sidebar__nav">
            <div className="sidebar__section">
              <h3 className="sidebar__section-title">Main</h3>
              {mainNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`sidebar__link ${location.pathname === item.path ? "active" : ""}`}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="sidebar__section">
              <h3 className="sidebar__section-title">Account</h3>
              {accountNavItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`sidebar__link ${location.pathname === item.path ? "active" : ""}`}
                  onClick={item.name === "Logout" ? handleLogout : undefined}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          <div className="sidebar__footer">
            <Link to="/basket" className="sidebar__cart-button">
              <span className="sidebar__icon">🛒</span>
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
