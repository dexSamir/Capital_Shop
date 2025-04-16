import { Link } from "react-router-dom"
import { GoHome } from "react-icons/go"
import { IoIosTabletPortrait } from "react-icons/io"
import { CiMail } from "react-icons/ci"
import "./Contact.scss"

function Contact() {
  return (
    <div className="contact">
      <div className="contact__header">
        <h1 className="contact__title">Contact</h1>
        <div className="contact__breadcrumb">
          <Link to="/" className="contact__breadcrumb-link">
            Home
          </Link>
          <hr className="contact__breadcrumb-separator" />
          <Link to="/contact" className="contact__breadcrumb-link">
            Contact
          </Link>
        </div>
      </div>
      <div className="contact__map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d202070.14578583458!2d49.690151611573064!3d40.394475512847436!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d6bd6211cf9%3A0x343f6b5e7ae56c6b!2zQmFrw7w!5e1!3m2!1str!2saz!4v1726509429462!5m2!1str!2saz"
          loading="lazy"
          className="contact__map"
        ></iframe>
      </div>
      <div className="contact__content">
        <div className="contact__form-container">
          <h1 className="contact__form-title">Get in Touch</h1>
          <form className="contact__form">
            <textarea placeholder="Enter Message" className="contact__textarea"></textarea>
            <div className="contact__input-row">
              <input type="text" placeholder="Enter your name" className="contact__input" />
              <input type="text" placeholder="Enter your email address" className="contact__input" />
            </div>
            <input type="text" placeholder="Enter your subject" className="contact__input" />
            <button className="contact__button">Send</button>
          </form>
        </div>
        <div className="contact__info">
          <div className="contact__info-item">
            <GoHome className="contact__info-icon" />
            <div className="contact__info-content">
              <h4 className="contact__info-title">Buttonwood, California.</h4>
              <p className="contact__info-text">Rosemead, CA 91770</p>
            </div>
          </div>
          <div className="contact__info-item">
            <IoIosTabletPortrait className="contact__info-icon" />
            <div className="contact__info-content">
              <h4 className="contact__info-title">+1 253 565 2365</h4>
              <p className="contact__info-text">Mon to Fri 9am to 6pm</p>
            </div>
          </div>
          <div className="contact__info-item">
            <CiMail className="contact__info-icon" />
            <div className="contact__info-content">
              <h4 className="contact__info-title">support@colorlib.com</h4>
              <p className="contact__info-text">Send us your query anytime!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
