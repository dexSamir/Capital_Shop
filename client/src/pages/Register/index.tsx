"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { base_url } from "../../data/Data"
import axios from "axios"
import Swal from "sweetalert2"
import "./Register.scss"

function Register() {
  const [submitCount, setSubmitCount] = useState(0)
  const navigate = useNavigate()

  const handleSubmitCount = () => {
    setSubmitCount((prevCount) => prevCount + 1)
  }

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .required("Required!")
      .min(3, "Full name must be at least 3 characters long!")
      .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed!"),
    email: Yup.string().required("Required!").email("Please enter a valid email address!"),
    password: Yup.string()
      .required("Required!")
      .min(6, "Password must be at least 6 characters long!")
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
      ),
    confirmPassword: Yup.string()
      .required("Required!")
      .oneOf([Yup.ref("password"), null], "Passwords must match!"),
  })

  const formik = useFormik({
    initialValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post(`${base_url}users/`, {
          fullname: values.fullname,
          email: values.email,
          password: values.password,
          isAdmin: false,
        })
        console.log(response.data)
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Account has been saved",
          showConfirmButton: false,
          timer: 1000,
        })
        navigate("/login")
      } catch (error) {
        console.error(error)
      }
    },
  })

  return (
    <div className="register">
      <div className="register__container">
        <div className="register__header">
          <h1 className="register__title">Sign Up</h1>
          <p className="register__subtitle">Create your account to get full access</p>
        </div>
        <div className="register__form">
          <form onSubmit={formik.handleSubmit}>
            <div className="register__form-group">
              <label htmlFor="fullname" className="register__label">
                Full Name
              </label>
              <input
                placeholder="Enter full name"
                className={`register__input ${formik.errors.fullname && submitCount > 0 ? "register__input--error" : ""}`}
                type="text"
                id="fullname"
                name="fullname"
                onChange={formik.handleChange}
                value={formik.values.fullname}
              />
              {submitCount > 0 && formik.errors.fullname && (
                <div className="register__error">{formik.errors.fullname}</div>
              )}
            </div>
            <div className="register__form-group">
              <label htmlFor="email" className="register__label">
                Email Address
              </label>
              <input
                placeholder="Enter email address"
                className={`register__input ${formik.errors.email && submitCount > 0 ? "register__input--error" : ""}`}
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {submitCount > 0 && formik.errors.email && <div className="register__error">{formik.errors.email}</div>}
            </div>
            <div className="register__form-group">
              <label htmlFor="password" className="register__label">
                Password
              </label>
              <input
                placeholder="Enter Password"
                className={`register__input ${formik.errors.password && submitCount > 0 ? "register__input--error" : ""}`}
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {submitCount > 0 && formik.errors.password && (
                <div className="register__error">{formik.errors.password}</div>
              )}
            </div>
            <div className="register__form-group">
              <label htmlFor="confirmPassword" className="register__label">
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                className={`register__input ${
                  formik.errors.confirmPassword && submitCount > 0 ? "register__input--error" : ""
                }`}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              {submitCount > 0 && formik.errors.confirmPassword && (
                <div className="register__error">{formik.errors.confirmPassword}</div>
              )}
            </div>
            <div className="register__actions">
              <p className="register__login-text">
                Already have an account?{" "}
                <Link to="/login" className="register__login-link">
                  Login
                </Link>{" "}
                here
              </p>
              <button className="register__button" onClick={handleSubmitCount} type="submit">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
