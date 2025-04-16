"use client"

import { FiSun, FiMoon } from "react-icons/fi"
import { useTheme } from "../../context/ThemeContext"
import "./ThemeToggle.scss"

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <FiMoon className="theme-toggle__icon" /> : <FiSun className="theme-toggle__icon" />}
    </button>
  )
}

export default ThemeToggle
