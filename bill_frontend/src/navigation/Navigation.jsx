import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import NavBar from '../component/Navbar'
import Home from '../pages/Home'

function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default Navigation
