"use client"

import { useState, useEffect } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, useNavigate } from "react-router-dom"
import { apiClient } from "../../api/client"
import Swal from "sweetalert2"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { loginStart, loginSuccess, loginFailure } from "../../store/slices/authSlice"
import "./Login.scss"

function Login() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth)
  const [submitCount, setSubmitCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])

  const handleSubmitCount = () => {
    setSubmitCount((prevCount) => prevCount + 1)
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Required!").email("Please enter a valid email address!"),
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
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(loginStart())
      try {
        const response = await apiClient.post("/Auth/login", {
          emailOrUserName: values.email,
          password: values.password,
          rememberMe: true,
        })

        const data = response.data as {
          token: string
          id: string
          fullName: string
          email: string
          isAdmin: boolean
        }

        dispatch(
          loginSuccess({
            token: data.token,
            user: {
              id: data.id,
              fullName: data.fullName,
              email: data.email,
              isAdmin: data.isAdmin,
            },
          }),
        )

        if (data.isAdmin) {
          navigate("/admin/dashboard")
        } else {
          navigate("/")
        }
      } catch (error: any) {
        const message =
          error?.response?.status === 404 || error?.response?.status === 400
            ? "Invalid email or password"
            : "Login failed"

        dispatch(loginFailure(message))
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        })
      }
    },
  })

  return (
    <div className="login">
      <div className="login__container">
        <div className="login__header">
          <h1 className="login__title">Login</h1>
          <p className="login__subtitle">Sign in to your account</p>
        </div>
        <div className="login__form">
          <form onSubmit={formik.handleSubmit}>
            <div className="login__form-group">
              <label htmlFor="email" className="login__label">
                Email Address
              </label>
              <input
                placeholder="Email address"
                className={`login__input ${formik.errors.email && submitCount > 0 ? "login__input--error" : ""}`}
                type="text"
                id="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {submitCount > 0 && formik.errors.email && <div className="login__error">{formik.errors.email}</div>}
            </div>
            <div className="login__form-group">
              <label htmlFor="password" className="login__label">
                Password
              </label>
              <input
                placeholder="Password"
                className={`login__input ${formik.errors.password && submitCount > 0 ? "login__input--error" : ""}`}
                type="password"
                id="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {submitCount > 0 && formik.errors.password && (
                <div className="login__error">{formik.errors.password}</div>
              )}
            </div>
            <div className="login__options">
              <div className="login__remember">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" className="login__remember-label">
                  Keep me logged in
                </label>
              </div>
              <Link to="/forgot-password" className="login__forgot">
                Forgot Password?
              </Link>
            </div>
            {error && <div className="login__error login__error--general">{error}</div>}
            <div className="login__actions">
              <p className="login__register-text">
                Don't have an account?{" "}
                <Link to="/register" className="login__register-link">
                  Sign Up
                </Link>{" "}
                here
              </p>
              <button className="login__button" onClick={handleSubmitCount} type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
