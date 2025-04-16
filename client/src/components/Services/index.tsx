import "./Services.scss"

function Services() {
  return (
    <div className="services">
      <div className="services__item">
        <img
          src="https://preview.colorlib.com/theme/capitalshop/assets/img/icon/services1.svg"
          alt="Fast Delivery"
          className="services__icon"
        />
        <h1 className="services__title">Fast & Free Delivery</h1>
        <p className="services__description">Free delivery on all orders</p>
      </div>
      <div className="services__item">
        <img
          src="https://preview.colorlib.com/theme/capitalshop/assets/img/icon/services2.svg"
          alt="Secure Payment"
          className="services__icon"
        />
        <h1 className="services__title">Secure Payment</h1>
        <p className="services__description">Free delivery on all orders</p>
      </div>
      <div className="services__item">
        <img
          src="https://preview.colorlib.com/theme/capitalshop/assets/img/icon/services3.svg"
          alt="Money Back"
          className="services__icon"
        />
        <h1 className="services__title">Money Back Guarantee</h1>
        <p className="services__description">Free delivery on all orders</p>
      </div>
      <div className="services__item services__item--last">
        <img
          src="https://preview.colorlib.com/theme/capitalshop/assets/img/icon/services4.svg"
          alt="Online Support"
          className="services__icon"
        />
        <h1 className="services__title">Online Support</h1>
        <p className="services__description">Free delivery on all orders</p>
      </div>
    </div>
  )
}

export default Services
