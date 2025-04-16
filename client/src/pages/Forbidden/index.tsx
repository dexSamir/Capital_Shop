import { Link } from "react-router-dom"
import { TfiFaceSad } from "react-icons/tfi"
import "./Forbidden.scss"

function Forbidden() {
  return (
    <div className="forbidden">
      <div className="forbidden__error">
        <span className="forbidden__code">4</span>
        <TfiFaceSad className="forbidden__icon" />
        <span className="forbidden__code">3</span>
        <span className="forbidden__message">Access Denied</span>
      </div>
      <div className="forbidden__text">Sorry! You don't have permission to access this page.</div>
      <div className="forbidden__action">
        <Link to="/" className="forbidden__button">
          Go to Home
        </Link>
      </div>
    </div>
  )
}

export default Forbidden
