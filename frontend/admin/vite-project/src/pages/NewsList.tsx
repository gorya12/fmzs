import { useEffect, useState } from 'react'
import './NewsList.css'

interface NewsItem {
  id: number
  title: string
  category: string
  excerpt: string
  created_at: string
}

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    // TODO: загрузка новостей с API
    setNews([
      { id: 1, title: 'Новое оборудование', category: 'Сервис', excerpt: 'Закупили новое оборудование...', created_at: '2025-01-15' },
      { id: 2, title: 'Расширение сети', category: 'Новости', excerpt: 'Открыли новый центр...', created_at: '2025-01-10' },
    ])
  }, [])

  return (
    <div className="news-list">
      <div className="page-header">
        <h1>📰 Новости</h1>
        <button className="btn-primary">+ Добавить новость</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Заголовок</th>
            <th>Категория</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {news.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td><span className="tag">{item.category}</span></td>
              <td>{item.created_at}</td>
              <td>
                <button className="btn-sm">✏️</button>
                <button className="btn-sm btn-danger">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
