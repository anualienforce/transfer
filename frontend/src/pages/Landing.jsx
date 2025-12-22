import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router'
import { useState } from 'react'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1 px-6">
          <span className="text-2xl font-bold">Transfer App</span>
        </div>
        <div className="flex-none gap-2 pr-6">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/signup" className="btn btn-ghost">Sign Up</Link>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl font-bold mb-6">Welcome to Transfer App</h1>
          <p className="text-lg opacity-80 mb-8">
            Secure peer-to-peer fund transfers with real-time balance updates and complete transaction history.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Landing