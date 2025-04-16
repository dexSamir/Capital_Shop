import type { ReactNode } from "react"
import Sidebar from "../components/Sidebar"
import "./Layout.scss"

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__content">{children}</div>
    </div>
  )
}

export default Layout
