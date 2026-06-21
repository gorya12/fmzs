import { useEffect, useState } from 'react'
import './Dashboard.css'

interface Stats {
  newsCount: number
  offersCount: number
  usersCount: number
  applicationsCount: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    newsCount: 0,
    offersCount: 0,
    usersCount: 0,
    applicationsCount: 0,
  })

  useEffect(() => {
    // TODO: загрузка статистики с API
    setStats({
      newsCount: 12,
      offersCount: 5,
      usersCount: 8,
      applicationsCount: 24,
    })
  }, [])

  return (
    <div className="dashboard">
      <h1>📊 Дашборд</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.newsCount}</span>
          <span className="stat-label">Новостей</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.offersCount}</span>
          <span className="stat-label">Акций</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.usersCount}</span>
          <span className="stat-label">Пользователей</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.applicationsCount}</span>
          <span className="stat-label">Заявок</span>
        </div>
      </div>
    </div>
  )
}
