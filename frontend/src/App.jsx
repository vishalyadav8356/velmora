import React from 'react'
import { AuthProvider } from './features/auth/utils/auth.context.jsx'
import {Routes, Route} from 'react-router-dom'
import Login from './features/auth/pages/Login.jsx'
import Register from './features/auth/pages/Register.jsx'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  )
}

export default App