"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Slider from "../../components/Slider"
import Trend from "../../components/Trend"
import MayLike from "../../components/MayLike"
import News from "../../components/News"
import Services from "../../components/Services"
import Card from "../../components/Card"
import { getAllproducts } from "../../middleware/products"
import "./Home.scss"

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
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAllproducts()
      .then((res) => {
        setProducts(res)
        // Get 4 random products for featured section
        const shuffled = [...res].sort(() => 0.5 - Math.random())
        setFeaturedProducts(shuffled.slice(0, 4))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="home">
      <Slider />

      <section className="home__featured">
        <div className="container">
          <h2 className="home__featured-title">Featured Products</h2>
          {loading ? (
            <div className="home__loading">
              <div className="home__loading-spinner"></div>
              <p>Loading featured products...</p>
            </div>
          ) : (
            <div className="home__featured-grid">
              {featuredProducts.map((product) => (
                <Card
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  img={product.img}
                  price={product.price}
                  withoutDiscount={product.withoutDiscount}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="home__banner">
        <div className="container">
          <div className="home__banner-content">
            <h2 className="home__banner-title">Special Summer Sale</h2>
            <p className="home__banner-text">Get up to 50% off on our summer collection. Limited time offer!</p>
            <Link to="/products" className="home__banner-button">
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      <div className="container">
        <Trend />
        <MayLike products={products} />
      </div>

      <News />
      <Services />
    </div>
  )
}

export default Home
