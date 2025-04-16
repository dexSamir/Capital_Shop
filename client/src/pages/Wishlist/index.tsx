import { Link } from "react-router-dom"
import Card from "../../components/Card"
import { useAppSelector } from "../../store/hooks"
import "./Wishlist.scss"

function Wishlist() {
  const { items } = useAppSelector((state) => state.wishlist)

  return (
    <div className="wishlist">
      <div className="wishlist__header">
        <h1 className="wishlist__title">Wishlist</h1>
        <div className="wishlist__breadcrumb">
          <Link to="/" className="wishlist__breadcrumb-link">
            Home
          </Link>
          <span className="wishlist__breadcrumb-separator"></span>
          <Link to="/wishlist" className="wishlist__breadcrumb-link">
            Wishlist
          </Link>
        </div>
      </div>

      <div className="wishlist__content">
        {items.length > 0 ? (
          <div className="wishlist__grid">
            {items.map((product) => (
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
        ) : (
          <div className="wishlist__empty">
            <p>Your wishlist is empty.</p>
            <Link to="/products" className="wishlist__shop-link">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
