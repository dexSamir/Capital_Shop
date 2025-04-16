"use client"

import { useState, useEffect, useContext } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { base_url } from "../../data/Data"
import Swal from "sweetalert2"
import { LoginContext } from "../../App"

interface User {
  id: number
  email: string
  password: string
  fullname: string
  isAdmin: boolean
}

function Login() {
  const { isLogin, setIsLogin, isAdmin, setIsAdmin } = useContext(LoginContext)
  const [submitCount, setSubmitCount] = useState(0)
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(base_url + "users").then((res) => setUsers(res.data))
  }, [])

  const handleSubmitCount = () => {
    setSubmitCount((prevCount) => prevCount + 1)
  }

  const validationSchema = Yup.object().shape({
    firstInput: Yup.string().required("Required!").email("Please enter a valid email address!"),
    password: Yup.string()
      .required("Required!")
      .min(6, "Password must be at least 6 characters long!")
      .matches(
        /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
      ),
  })

  const formik = useFormik({
    initialValues: {
      firstInput: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const { firstInput, password } = values
      const user = users.find((user) => user.email === firstInput && user.password === password)

      if (user) {
        setIsLogin(true)
        if (user.isAdmin) {
          setIsAdmin(true)
          navigate("/admin/dashboard")
        } else {
          navigate("/")
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid Email address or password",
        })
      }
    },
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="min-w-[700px] bg-white p-[55px_60px_50px_50px] shadow-[0px_10px_30px_0px_rgba(13,12,13,0.2)]">
        <div className="text-center">
          <h1 className="mb-4 block text-[30px] font-semibold capitalize text-[#140c40]">Logout</h1>
          <p className="mb-[15px] text-base font-normal leading-relaxed text-[#301a22]">You are already logged in.</p>
        </div>
        <div className="form">
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-5">
              <label
                htmlFor="firstInput"
                className="mb-[6px] block text-[17px] font-medium capitalize text-[#140c40] text-left"
              >
                Email Address
              </label>
              <input
                placeholder="Email address"
                className="h-[50px] w-full border border-[#c9c9c9] p-[0_25px] text-black focus:outline-none"
                type="text"
                id="firstInput"
                name="firstInput"
                onChange={formik.handleChange}
                value={formik.values.firstInput}
                style={formik.errors.firstInput && submitCount > 0 ? { border: "2px solid red" } : undefined}
              />
              {submitCount > 0 && formik.errors.firstInput && (
                <div className="text-sm text-red-600">{formik.errors.firstInput}</div>
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
                placeholder="Password"
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
            <div className="mt-5 flex items-center justify-between text-[17px]">
              <div className="flex items-center">
                <input type="checkbox" />
                <label className="ml-[5px] mb-[6px] text-[17px] font-medium capitalize text-[#140c40] text-left">
                  Keep me logged in
                </label>
              </div>
              <Link className="text-sm font-normal text-[#ff2020] no-underline">Forgot Password?</Link>
            </div>
            <div className="mt-[75px] flex items-center justify-between">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-sm font-normal text-[#ff2020] no-underline">
                  Sign Up
                </Link>{" "}
                here
              </p>
              <button
                className="h-[60px] cursor-pointer border-0 bg-[#ff2020] px-[43px] py-[10px] text-base capitalize text-white"
                onClick={handleSubmitCount}
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
