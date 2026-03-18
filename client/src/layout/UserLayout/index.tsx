import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchCartFromServer } from "../../store/slices/cartSlice"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import "./UserLayout.scss"

function UserLayout() {
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartFromServer())
    }
  }, [isAuthenticated, dispatch])

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
