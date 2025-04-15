import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import "./Footer.scss";

function Footer() {
  return (
    <div className="footer">
      <div className="footer__newsletter">
        <div className="footer__newsletter-header">
          <h1 className="footer__newsletter-title">Subscribe Newsletter</h1>
          <p className="footer__newsletter-text">
            Subscribe newsletter to get 5% on all products.
          </p>
        </div>
        <div className="footer__newsletter-form">
          <input
            type="text"
            placeholder="Enter your email"
            className="footer__newsletter-input"
          />
          <button className="footer__newsletter-button">Subscribe</button>
        </div>
        <div className="footer__social">
          <FaFacebook className="footer__social-icon" />
          <FaInstagram className="footer__social-icon" />
          <FaYoutube className="footer__social-icon" />
        </div>
      </div>

      <div className="footer__links">
        <div className="footer__logo">
          <img
            src="https://preview.colorlib.com/theme/capitalshop/assets/img/logo/logo2_footer.png"
            alt="Logo"
          />
        </div>

        <div className="footer__category">
          <h4 className="footer__category-title">Shop Men</h4>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Clothing Fashion
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Winter
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Summer
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Formal
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Casual
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__category">
          <h4 className="footer__category-title">Shop Women</h4>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Clothing Fashion
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Winter
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Summer
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Formal
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Casual
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__category">
          <h4 className="footer__category-title">Baby Collection</h4>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Clothing Fashion
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Winter
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Summer
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Formal
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Casual
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__category">
          <h4 className="footer__category-title">Quick Links</h4>
          <ul className="footer__list">
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Track Your Order
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Support
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                FAQ
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Carrier
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                About
              </a>
            </li>
            <li className="footer__list-item">
              <a href="#" className="footer__link">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__copyright">
        <p className="footer__copyright-text">
          Copyright ©2024 All rights reserved | This template is made with Samir
          Habibov by Colorlib
        </p>
      </div>
    </div>
  );
}

export default Footer;
