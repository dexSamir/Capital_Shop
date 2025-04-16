"use client"

import type React from "react"

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { createContext, useState } from "react"
import { routes } from "./routers/routes"
import Layout from "./layout"
import "./styles/App.scss"

const router = createBrowserRouter(routes)

interface LoginContextType {
  isLogin: boolean
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>
  isAdmin: boolean
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>
  isInWishlist: boolean
  setIsInWishlist: React.Dispatch<React.SetStateAction<boolean>>
  isInCart: boolean
  setIsInCart: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoginContext = createContext<LoginContextType>({
  isLogin: false,
  setIsLogin: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
  isInWishlist: false,
  setIsInWishlist: () => {},
  isInCart: false,
  setIsInCart: () => {},
})

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isInCart, setIsInCart] = useState(false)

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        setIsLogin,
        isAdmin,
        setIsAdmin,
        isInWishlist,
        setIsInWishlist,
        isInCart,
        setIsInCart,
      }}
    >
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </LoginContext.Provider>
  )
}

export default App
