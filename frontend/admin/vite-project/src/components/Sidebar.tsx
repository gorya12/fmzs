import { Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const menuItems = [
  { path: '/dashboard', label: '📊 Дашборд' },
  { path: '/news', label: '📰 Новости' },
  { path: '/offers', label: '🏷️ Акции' },
  { path: '/users', label: '👥 Пользователи' },
  { path: '/applications', label: '📋 Заявки' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>Формоза</h2>
        <span>Админ-панель</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
