import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import toastOnce from '../utils/toastOnce.js'
import RateLimitUI from '../components/RateLimitUI'

const API_BASE = 'http://localhost:5001/api'

const SignUp = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [isRateLimited, setIsRateLimited] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/dashboard', { replace: true })
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toastOnce('signup_required_fields', 'error', 'Name, email, and password are required')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      }
      const { data } = await axios.post(`${API_BASE}/auth/signup`, payload)

      if (data?.success && data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toastOnce('signup_success', 'success', 'Account created successfully')
        navigate('/dashboard', { replace: true })
      } else {
        toastOnce('signup_failed_generic', 'error', data?.message || 'Signup failed')
      }
      setIsRateLimited(false)
    } catch (error) {
      const status = error?.response?.status
      if (status === 429) {
        setIsRateLimited(true)
        toastOnce('signup_rate_limited', 'error', 'Rate limit exceeded. Please try again later.')
        return
      }

      const message = error.response?.data?.message || 'Signup failed'
      toastOnce('signup_failed_error', 'error', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {isRateLimited && <RateLimitUI />}
      {!isRateLimited && (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
          <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Create an account</h2>
              <p className="opacity-70">Start sending and receiving transfers</p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input input-bordered"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-control mt-2">
                  <button className="btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </button>
                </div>
              </form>

              <div className="pt-4 text-sm opacity-80">
                <span>Already have an account? </span>
                <Link to="/login" className="link link-primary">Login</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SignUp