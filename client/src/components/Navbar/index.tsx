import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa"
import { IoLogoInstagram } from "react-icons/io"
import "./Navbar.scss"

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar__left">
        <ul className="navbar__nav">
          <li className="navbar__item">
            <Link to="/user" className="navbar__link">
              About Us
            </Link>
          </li>
          <li className="navbar__item">
            <Link to="/user" className="navbar__link">
              Privacy
            </Link>
          </li>
          <li className="navbar__item">
            <Link to="/user" className="navbar__link">
              FAQ
            </Link>
          </li>
          <li className="navbar__item">
            <Link to="/user" className="navbar__link">
              Careers
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar__right">
        <div className="navbar__wishlist">
          <Link className="navbar__link" to="/wishlist">
            My Wishlist
          </Link>
        </div>
        <div className="navbar__order">
          <Link className="navbar__link">Track Your Order</Link>
        </div>
        <div className="navbar__social">
          <FaFacebook className="navbar__social-icon" />
          <IoLogoInstagram className="navbar__social-icon" />
          <FaTwitter className="navbar__social-icon" />
          <FaLinkedinIn className="navbar__social-icon" />
          <FaYoutube className="navbar__social-icon" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
