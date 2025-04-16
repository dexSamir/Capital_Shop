import type { ReactNode } from "react"
import "./Layout.scss"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <div className="layout__content">{children}</div>
    </div>
  )
}

export default Layout
