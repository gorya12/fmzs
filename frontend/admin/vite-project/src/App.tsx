import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import NewsList from './pages/NewsList'
import OffersList from './pages/OffersList'
import UsersList from './pages/UsersList'
import ApplicationsList from './pages/ApplicationsList'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/offers" element={<OffersList />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/applications" element={<ApplicationsList />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  )
}

export default App
