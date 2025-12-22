import React from 'react'
import { Routes, Route } from 'react-router'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transfer from './pages/Transfer.jsx'
import Landing from './pages/Landing.jsx'

const App = () => {
  return( <div data-theme="dark">
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transfer" element={<Transfer />} />
      <Route path="/" element={<Landing />} />
    </Routes>
  </div>
  )
}

export default App