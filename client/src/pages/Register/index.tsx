"use client"

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { base_url } from "../data/Data"
import axios from "axios"
import Swal from "sweetalert2"

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
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-[700px] bg-white p-[30px_60px_30px_50px] shadow-[0px_10px_30px_0px_rgba(13,12,13,0.2)]">
        <div className="text-center">
          <h1 className="mb-4 block text-[30px] font-semibold capitalize text-[#140c40]">Sign Up</h1>
          <p className="mb-[15px] text-base font-normal leading-relaxed text-[#301a22]">
            Create your account to get full access
          </p>
        </div>
        <div className="form">
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-5">
              <label
                htmlFor="fullname"
                className="mb-[6px] block text-[17px] font-medium capitalize text-[#140c40] text-left"
              >
                Full Name
              </label>
              <input
                placeholder="Enter full name"
                className="h-[50px] w-full border border-[#c9c9c9] p-[0_25px] text-black focus:outline-none"
                type="text"
                id="fullname"
                name="fullname"
                onChange={formik.handleChange}
                value={formik.values.fullname}
                style={formik.errors.fullname && submitCount > 0 ? { border: "2px solid red" } : undefined}
              />
              {submitCount > 0 && formik.errors.fullname && (
                <div className="text-sm text-red-600">{formik.errors.fullname}</div>
              )}
            </div>
            <div className="mt-5">
              <label
                htmlFor="email"
                className="mb-[6px] block text-[17px] font-medium capitalize text-[#140c40] text-left"
              >
                Email Address
              </label>
              <input
                placeholder="Enter email address"
                className="h-[50px] w-full border border-[#c9c9c9] p-[0_25px] text-black focus:outline-none"
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                style={formik.errors.email && submitCount > 0 ? { border: "2px solid red" } : undefined}
              />
              {submitCount > 0 && formik.errors.email && (
                <div className="text-sm text-red-600">{formik.errors.email}</div>
              )}
            </div>
            <div className="mt-5">
              <label
                htmlFor="password"
                className="mb-[6px] block text-[17px] font-medium capitalize text-[#140c40] text-left"
              >
                Password
              </label>
              <input
                placeholder="Enter Password"
                className="h-[50px] w-full border border-[#c9c9c9] p-[0_25px] text-black focus:outline-none"
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                style={formik.errors.password && submitCount > 0 ? { border: "2px solid red" } : undefined}
              />
              {submitCount > 0 && formik.errors.password && (
                <div className="text-sm text-red-600">{formik.errors.password}</div>
              )}
            </div>
            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="mb-[6px] block text-[17px] font-medium capitalize text-[#140c40] text-left"
              >
                Confirm Password
              </label>
              <input
                placeholder="Confirm Password"
                className="h-[50px] w-full border border-[#c9c9c9] p-[0_25px] text-black focus:outline-none"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                style={formik.errors.confirmPassword && submitCount > 0 ? { border: "2px solid red" } : undefined}
              />
              {submitCount > 0 && formik.errors.confirmPassword && (
                <div className="text-sm text-red-600">{formik.errors.confirmPassword}</div>
              )}
            </div>
            <div className="mt-[75px] flex items-center justify-between">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-[#ff2020] no-underline">
                  Login
                </Link>{" "}
                here
              </p>
              <button
                className="h-[60px] cursor-pointer border-0 bg-[#ff2020] px-[43px] py-[10px] text-base capitalize text-white"
                onClick={handleSubmitCount}
                type="submit"
              >
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
