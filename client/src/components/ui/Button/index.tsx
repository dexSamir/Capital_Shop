import type React from "react"
import { cn } from "../lib/utils"
import "./Button.scss"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = "primary", size = "md", ...props }) => {
  return (
    <button className={cn("button", `button--${variant}`, `button--${size}`, className)} {...props}>
      {children}
    </button>
  )
}

export default Button
