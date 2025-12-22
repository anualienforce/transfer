import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import toastOnce from '../utils/toastOnce.js'
import RateLimitUI from '../components/RateLimitUI'

const API_BASE = 'http://localhost:5001/api'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
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
    if (!form.email || !form.password) {
      toastOnce('login_required_fields', 'error', 'Email and password are required')
      return
    }
    try {
      setLoading(true)
      const { data } = await axios.post(`${API_BASE}/auth/login`, form)
      if (data?.success && data?.token) {
        console.log(data)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        toastOnce('login_success', 'success', 'Logged in successfully')
        navigate('/dashboard', { replace: true })
      } else {
        toastOnce('login_failed_generic', 'error', data?.message || 'Login failed')
      }
    } catch (error) {
        if(error.response?.status === 429){
            setIsRateLimited(true)
        }
      const message = error.response?.data?.message || 'Login failed'
      toastOnce('login_failed_error', 'error', message)
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
          <h2 className="card-title text-2xl">Welcome back</h2>
          <p className="opacity-70">Login to access your dashboard</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="pt-4 text-sm opacity-80">
            <span>New here? </span>
            <Link to="/signup" className="link link-primary">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  )
}

export default Login