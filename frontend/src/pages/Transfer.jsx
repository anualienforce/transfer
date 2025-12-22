import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import toastOnce from '../utils/toastOnce.js'

const API_BASE = 'http://localhost:5001/api'

const Transfer = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ receiverEmail: '', amount: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.receiverEmail || !form.amount) {
      toastOnce('transfer_required', 'error', 'Receiver and amount are required')
      return
    }
    const amt = Number(form.amount)
    if (!Number.isFinite(amt) || amt <= 0) {
      toastOnce('transfer_invalid_amount', 'error', 'Enter a valid positive amount')
      return
    }
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')
    if (!token || !userRaw) {
      toastOnce('transfer_not_authenticated', 'error', 'You must be logged in to make a transfer')
      return
    }
    const senderEmail = JSON.parse(userRaw)?.email
    if (!senderEmail) {
      toastOnce('transfer_missing_email', 'error', 'Sender email unavailable. Please re-login.')
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(
        `${API_BASE}/transfer`,
        {
          senderEmail,
          receiverEmail: form.receiverEmail,
          amount: amt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (data?.success) {
        toastOnce('transfer_success', 'success', 'Transfer successful')
      } else {
        toastOnce('transfer_failed', 'error', data?.message || 'Transfer failed')
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toastOnce('transfer_session_expired', 'error', 'Session expired. Please login again.')
        navigate('/login', { replace: true })
        return
      }
      const message = error.response?.data?.message || 'Transfer failed'
      toastOnce('transfer_failed_error', 'error', message)
    } finally {
      try {
        // Refresh user profile to update balance
        if (localStorage.getItem('token')) {
          const me = await axios.get(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
          if (me?.data?.success && me.data.user) {
            localStorage.setItem('user', JSON.stringify(me.data.user))
          }
        }
      } catch (_) {
        // silent refresh failure
      }
      setLoading(false)
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-2xl">New Transfer</h2>
            <Link to="/dashboard" className="btn btn-ghost btn-sm">Back</Link>
          </div>
          <p className="opacity-70">Send funds securely to another user.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Receiver Email</span>
              </label>
              <input
                type="email"
                name="receiverEmail"
                value={form.receiverEmail}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="receiver@example.com"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="100"
                required
              />
            </div>

            <div className="form-control mt-2">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Transfer