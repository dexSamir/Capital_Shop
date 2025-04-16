import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import "./AdminLayout.scss"

function AdminLayout() {
  return (
    <div className="admin-layout">
      <Navbar />
      <Header />
      <main className="admin-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AdminLayout
