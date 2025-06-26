import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/LandingPage.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className="font-sans antialiased text-gray-800">
          <LandingPage />
      </div>
  )
}

export default App
