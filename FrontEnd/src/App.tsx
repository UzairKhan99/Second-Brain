import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/dashboard'
import { Signin } from './components/signin'
import { Signup } from './components/signup'
import { useState } from 'react'


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
</>

  
  )
}

export default App
