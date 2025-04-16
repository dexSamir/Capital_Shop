"use client"

import { useState, useEffect, useContext } from "react"
import Slider from "../../components/Slider"
import Trend from "../../components/Trend"
import MayLike from "../../components/MayLike"
import News from "../../components/News"
import Services from "../../components/Services"
import { getAllproducts } from "../../middleware/products"
import { LoginContext } from "../../App"

interface Product {
  id: number
  name: string
  price: number
  withoutDiscount: number
  img: string
  category: string
}

function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const { isAdmin } = useContext(LoginContext)

  useEffect(() => {
    getAllproducts().then((res) => {
      setProducts(res)
    })
  }, [])

  return (
    <div>
      <Slider />
      <Trend />
      <MayLike products={products} />
      <News />
      <Services />
    </div>
  )
}

export default Home
