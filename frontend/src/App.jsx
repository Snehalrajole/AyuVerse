import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import ExplorePlants from './pages/ExplorePlants'
import PlantDetail from './pages/PlantDetail'
import HerbalChatbot from './pages/HerbalChatbot'
import VirtualTour from './pages/VirtualTour'
import Visualizer3D from './pages/Visualizer3D'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import './App.css'

function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <Router>
      <div className="App">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/explore-plants" element={<ExplorePlants />} />
          <Route path="/plant/:slug" element={<PlantDetail />} />
          <Route path="/herbal-chatbot" element={<HerbalChatbot />} />
          <Route path="/3d-visualizer" element={<Visualizer3D />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
