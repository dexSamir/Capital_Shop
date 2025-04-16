"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { clearCart } from "../../store/slices/cartSlice";
import Swal from "sweetalert2";
import "./Checkout.scss";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

function Checkout() {
  const [activeStep, setActiveStep] = useState(1);
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const shippingValidationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    zipCode: Yup.string().required("ZIP code is required"),
    country: Yup.string().required("Country is required"),
  });

  const paymentValidationSchema = Yup.object().shape({
    cardName: Yup.string().required("Name on card is required"),
    cardNumber: Yup.string()
      .required("Card number is required")
      .matches(/^\d{16}$/, "Card number must be 16 digits"),
    expiryDate: Yup.string()
      .required("Expiry date is required")
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Expiry date must be in MM/YY format"
      ),
    cvv: Yup.string()
      .required("CVV is required")
      .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  });

  const shippingFormik = useFormik<ShippingInfo>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    validationSchema: shippingValidationSchema,
    onSubmit: () => {
      setActiveStep(2);
    },
  });

  const paymentFormik = useFormik<PaymentInfo>({
    initialValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
    validationSchema: paymentValidationSchema,
    onSubmit: () => {
      // Process payment and complete order
      Swal.fire({
        title: "Order Placed!",
        text: "Your order has been successfully placed.",
        icon: "success",
        confirmButtonText: "Continue Shopping",
      }).then(() => {
        dispatch(clearCart());
        navigate("/");
      });
    },
  });

  if (items.length === 0) {
    return (
      <div className="checkout">
        <div className="checkout__header">
          <h1 className="checkout__title">Checkout</h1>
          <div className="checkout__breadcrumb">
            <Link to="/" className="checkout__breadcrumb-link">
              Home
            </Link>
            <span className="checkout__breadcrumb-separator"></span>
            <Link to="/basket" className="checkout__breadcrumb-link">
              Cart
            </Link>
            <span className="checkout__breadcrumb-separator"></span>
            <span className="checkout__breadcrumb-current">Checkout</span>
          </div>
        </div>

        <div className="checkout__empty">
          <p>
            Your cart is empty. Please add items to your cart before proceeding
            to checkout.
          </p>
          <Link to="/products" className="checkout__continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout__header">
        <h1 className="checkout__title">Checkout</h1>
        <div className="checkout__breadcrumb">
          <Link to="/" className="checkout__breadcrumb-link">
            Home
          </Link>
          <span className="checkout__breadcrumb-separator"></span>
          <Link to="/basket" className="checkout__breadcrumb-link">
            Cart
          </Link>
          <span className="checkout__breadcrumb-separator"></span>
          <span className="checkout__breadcrumb-current">Checkout</span>
        </div>
      </div>

      <div className="checkout__content">
        <div className="checkout__steps">
          <div
            className={`checkout__step ${activeStep === 1 ? "active" : ""} ${
              activeStep > 1 ? "completed" : ""
            }`}
          >
            <div className="checkout__step-number">1</div>
            <div className="checkout__step-label">Shipping</div>
          </div>
          <div className="checkout__step-connector"></div>
          <div
            className={`checkout__step ${activeStep === 2 ? "active" : ""} ${
              activeStep > 2 ? "completed" : ""
            }`}
          >
            <div className="checkout__step-number">2</div>
            <div className="checkout__step-label">Payment</div>
          </div>
          <div className="checkout__step-connector"></div>
          <div className={`checkout__step ${activeStep === 3 ? "active" : ""}`}>
            <div className="checkout__step-number">3</div>
            <div className="checkout__step-label">Confirmation</div>
          </div>
        </div>

        <div className="checkout__main">
          <div className="checkout__form-container">
            {activeStep === 1 && (
              <form
                onSubmit={shippingFormik.handleSubmit}
                className="checkout__form"
              >
                <h2 className="checkout__form-title">Shipping Information</h2>

                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={shippingFormik.values.firstName}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.firstName &&
                        shippingFormik.errors.firstName
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.firstName &&
                      shippingFormik.errors.firstName && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.firstName}
                        </div>
                      )}
                  </div>

                  <div className="checkout__form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={shippingFormik.values.lastName}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.lastName &&
                        shippingFormik.errors.lastName
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.lastName &&
                      shippingFormik.errors.lastName && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.lastName}
                        </div>
                      )}
                  </div>
                </div>

                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={shippingFormik.values.email}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.email &&
                        shippingFormik.errors.email
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.email &&
                      shippingFormik.errors.email && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.email}
                        </div>
                      )}
                  </div>

                  <div className="checkout__form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingFormik.values.phone}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.phone &&
                        shippingFormik.errors.phone
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.phone &&
                      shippingFormik.errors.phone && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.phone}
                        </div>
                      )}
                  </div>
                </div>

                <div className="checkout__form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingFormik.values.address}
                    onChange={shippingFormik.handleChange}
                    onBlur={shippingFormik.handleBlur}
                    className={
                      shippingFormik.touched.address &&
                      shippingFormik.errors.address
                        ? "error"
                        : ""
                    }
                  />
                  {shippingFormik.touched.address &&
                    shippingFormik.errors.address && (
                      <div className="checkout__form-error">
                        {shippingFormik.errors.address}
                      </div>
                    )}
                </div>

                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingFormik.values.city}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.city &&
                        shippingFormik.errors.city
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.city &&
                      shippingFormik.errors.city && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.city}
                        </div>
                      )}
                  </div>

                  <div className="checkout__form-group">
                    <label htmlFor="state">State/Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={shippingFormik.values.state}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.state &&
                        shippingFormik.errors.state
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.state &&
                      shippingFormik.errors.state && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.state}
                        </div>
                      )}
                  </div>
                </div>

                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingFormik.values.zipCode}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.zipCode &&
                        shippingFormik.errors.zipCode
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.zipCode &&
                      shippingFormik.errors.zipCode && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.zipCode}
                        </div>
                      )}
                  </div>

                  <div className="checkout__form-group">
                    <label htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={shippingFormik.values.country}
                      onChange={shippingFormik.handleChange}
                      onBlur={shippingFormik.handleBlur}
                      className={
                        shippingFormik.touched.country &&
                        shippingFormik.errors.country
                          ? "error"
                          : ""
                      }
                    />
                    {shippingFormik.touched.country &&
                      shippingFormik.errors.country && (
                        <div className="checkout__form-error">
                          {shippingFormik.errors.country}
                        </div>
                      )}
                  </div>
                </div>

                <div className="checkout__form-actions">
                  <Link to="/basket" className="checkout__back-button">
                    Back to Cart
                  </Link>
                  <button type="submit" className="checkout__next-button">
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {activeStep === 2 && (
              <form
                onSubmit={paymentFormik.handleSubmit}
                className="checkout__form"
              >
                <h2 className="checkout__form-title">Payment Information</h2>

                <div className="checkout__form-group">
                  <label htmlFor="cardName">Name on Card</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentFormik.values.cardName}
                    onChange={paymentFormik.handleChange}
                    onBlur={paymentFormik.handleBlur}
                    className={
                      paymentFormik.touched.cardName &&
                      paymentFormik.errors.cardName
                        ? "error"
                        : ""
                    }
                  />
                  {paymentFormik.touched.cardName &&
                    paymentFormik.errors.cardName && (
                      <div className="checkout__form-error">
                        {paymentFormik.errors.cardName}
                      </div>
                    )}
                </div>

                <div className="checkout__form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentFormik.values.cardNumber}
                    onChange={paymentFormik.handleChange}
                    onBlur={paymentFormik.handleBlur}
                    className={
                      paymentFormik.touched.cardNumber &&
                      paymentFormik.errors.cardNumber
                        ? "error"
                        : ""
                    }
                    placeholder="1234 5678 9012 3456"
                  />
                  {paymentFormik.touched.cardNumber &&
                    paymentFormik.errors.cardNumber && (
                      <div className="checkout__form-error">
                        {paymentFormik.errors.cardNumber}
                      </div>
                    )}
                </div>

                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentFormik.values.expiryDate}
                      onChange={paymentFormik.handleChange}
                      onBlur={paymentFormik.handleBlur}
                      className={
                        paymentFormik.touched.expiryDate &&
                        paymentFormik.errors.expiryDate
                          ? "error"
                          : ""
                      }
                      placeholder="MM/YY"
                    />
                    {paymentFormik.touched.expiryDate &&
                      paymentFormik.errors.expiryDate && (
                        <div className="checkout__form-error">
                          {paymentFormik.errors.expiryDate}
                        </div>
                      )}
                  </div>

                  <div className="checkout__form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentFormik.values.cvv}
                      onChange={paymentFormik.handleChange}
                      onBlur={paymentFormik.handleBlur}
                      className={
                        paymentFormik.touched.cvv && paymentFormik.errors.cvv
                          ? "error"
                          : ""
                      }
                      placeholder="123"
                    />
                    {paymentFormik.touched.cvv && paymentFormik.errors.cvv && (
                      <div className="checkout__form-error">
                        {paymentFormik.errors.cvv}
                      </div>
                    )}
                  </div>
                </div>

                <div className="checkout__form-actions">
                  <button
                    type="button"
                    className="checkout__back-button"
                    onClick={() => setActiveStep(1)}
                  >
                    Back to Shipping
                  </button>
                  <button type="submit" className="checkout__next-button">
                    Place Order
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="checkout__summary">
            <h2 className="checkout__summary-title">Order Summary</h2>

            <div className="checkout__summary-items">
              {items.map((item) => (
                <div key={item.id} className="checkout__summary-item">
                  <div className="checkout__summary-item-image">
                    <img src={item.img || "/placeholder.svg"} alt={item.name} />
                  </div>
                  <div className="checkout__summary-item-details">
                    <h3 className="checkout__summary-item-name">{item.name}</h3>
                    <p className="checkout__summary-item-meta">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                    <div className="checkout__summary-item-price">
                      <span>${item.price}</span>
                      <span>x {item.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout__summary-totals">
              <div className="checkout__summary-row">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="checkout__summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="checkout__summary-row checkout__summary-total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
