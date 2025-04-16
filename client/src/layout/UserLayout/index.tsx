import { Outlet } from "react-router-dom"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import "./UserLayout.scss"

function UserLayout() {
  return (
    <div className="user-layout">
      <Navbar />
      <Header />
      <main className="user-layout__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default UserLayout
