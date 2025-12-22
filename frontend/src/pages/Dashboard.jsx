import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'
import toastOnce from '../utils/toastOnce.js'

const API_BASE = 'http://localhost:5001/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' or 'desc'

  const initRef = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }
    setUser(userData ? JSON.parse(userData) : null)
    if (!initRef.current) {
      initRef.current = true
      fetchAudits(token)
    }
  }, [navigate])

  const fetchAudits = async (token) => {
    
    try {
      setLoading(true)
      const { data } = await axios.get(`${API_BASE}/audit`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data?.success) {
        setAudits(data.audits || [])
      } else {
        toastOnce('audits_fetch_failed_generic', 'error', data?.message || 'Failed to fetch audits')
      }
      setIsRateLimited(false)
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        toastOnce('session_expired', 'error', 'Session expired. Please login again.')
        navigate('/login', { replace: true })
        return
      }
      if (status === 429) {
        toastOnce('rate_limited', 'error', 'Rate limit exceeded. Please try again later.')
        setIsRateLimited(true)
        return
      }
      const message = error.response?.data?.message || 'Failed to fetch audits'
      toastOnce('audits_fetch_failed_error', 'error', message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const sortedAudits = [...audits].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  return (
    <>
    {isRateLimited && (
      <div className="alert alert-warning rounded-none shadow-lg justify-center text-center">
        <div>Rate limit exceeded. Please try again later.</div>
      </div>
    )}

    {!isRateLimited && (

    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 px-4 md:px-6">
          <span className="text-xl md:text-2xl font-bold">Transfer Dashboard</span>
        </div>
        <div className="flex-none gap-2 pr-4 md:pr-6">
          <Link to="/transfer" className="btn btn-sm md:btn-md btn-primary">New Transfer</Link>
          <button className="btn btn-sm md:btn-md btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        {/* User Info Card */}
        <div className="card bg-base-100 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title">Account</h2>
            <div className="space-y-2">
              <p><span className="font-semibold">Name:</span> {user?.name || 'N/A'}</p>
              <p><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
              <p><span className="font-semibold">Balance:</span> ₹{user?.balance ?? '--'}</p>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title">Transaction History</h2>
              <button 
                onClick={toggleSortOrder} 
                className="btn btn-sm btn-ghost gap-2"
                title={`Sort by date: ${sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}`}
              >
                <span className="text-xs opacity-70">
                  {sortOrder === 'asc' ? '↑ Oldest' : '↓ Newest'}
                </span>
              </button>
            </div>
            {loading ? (
              <p className="opacity-70">Loading audits...</p>
            ) : audits.length === 0 ? (
              <p className="opacity-70">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-xs md:table-sm w-full">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Receiver</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAudits.map((audit) => (
                      <React.Fragment key={audit._id}>
                        <tr>
                          <td>{audit.senderEmail}</td>
                          <td>{audit.receiverEmail}</td>
                          <td>₹{audit.amount}</td>
                          <td>
                            <span className={`badge ${audit.status === 'SUCCESS' ? 'badge-success' : 'badge-error'}`}>
                              {audit.status}
                            </span>
                          </td>
                          
                          <td>{new Date(audit.createdAt).toLocaleString()}

                          </td>
                          <td>{audit.senderBalanceAfter !== null ? `₹${audit.senderBalanceAfter}` : '--'}</td>
                        </tr>
                        {audit.status === 'FAILED' && audit.reason && (
                          <tr>
                            <td colSpan="7" className="bg-base-200 px-4 py-2">
                              <span className="text-sm opacity-70"><span className="font-semibold">Reason:</span> {audit.reason}</span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  )
}

export default Dashboard