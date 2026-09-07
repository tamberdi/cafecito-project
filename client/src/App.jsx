import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'
import Nav from './components/Nav.jsx'
import Landing from './pages/Landing.jsx'
import Browse from './pages/Browse.jsx'
import PartnerProfile from './pages/PartnerProfile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import SessionHistory from './pages/SessionHistory.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Nav />
        <div className="pb-16 sm:pb-0">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/partners/:id" element={<PartnerProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/sessions" element={<SessionHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App