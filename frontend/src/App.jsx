import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import ExplorePlants from './pages/ExplorePlants'
import PlantDetail from './pages/PlantDetail'
import HerbalChatbot from './pages/HerbalChatbot'
import VirtualTour from './pages/VirtualTour'
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
          <Route path="/virtual-tour" element={<VirtualTour />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
