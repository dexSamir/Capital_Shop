import { Link } from "react-router-dom"
import { TfiFaceSad } from "react-icons/tfi"
import "./NotFound.scss"

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__error">
        <span className="not-found__code">4</span>
        <TfiFaceSad className="not-found__icon" />
        <span className="not-found__code">4</span>
        <span className="not-found__message">Page Not Found.</span>
      </div>
      <div className="not-found__text">Oops! The page you're looking for cannot be found.</div>
      <div className="not-found__action">
        <Link to="/" className="not-found__button">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
