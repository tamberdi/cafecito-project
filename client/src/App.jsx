import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Nav from './components/Nav'
import DemoUserSwitcher from './components/DemoUserSwitcher'
import Landing from './pages/Landing'
import Browse from './pages/Browse'
import PartnerProfile from './pages/PartnerProfile'
import Dashboard from './pages/Dashboard'
import SessionHistory from './pages/SessionHistory'
import Profile from './pages/Profile'

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <DemoUserSwitcher />
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