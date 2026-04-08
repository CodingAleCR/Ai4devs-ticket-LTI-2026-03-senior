import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AddCandidatePage from './pages/AddCandidatePage'
import RecruiterDashboard from './pages/RecruiterDashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<RecruiterDashboard />} />
      <Route path="/candidates/new" element={<AddCandidatePage />} />
    </Routes>
  )
}

export default App
