"use client"

import { useState, type ReactNode } from "react"
import "./Tooltip.scss"

interface TooltipProps {
  children: ReactNode
  TooltipText: string
}

function Tooltip({ children, TooltipText }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const ShowTooltip = () => {
    setIsVisible(true)
  }

  const HideTooltip = () => {
    setIsVisible(false)
  }

  return (
    <div className="tooltip-container" onMouseEnter={ShowTooltip} onMouseLeave={HideTooltip}>
      {children}
      {isVisible && (
        <div className="tooltip">
          {TooltipText}
          <div className="tooltip__arrow"></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
