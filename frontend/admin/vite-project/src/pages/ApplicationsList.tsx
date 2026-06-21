import { useEffect, useState } from 'react'
import './ApplicationsList.css'

interface Application {
  id: number
  name: string
  phone: string
  type: string
  status: string
  created_at: string
}

export default function ApplicationsList() {
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    // TODO: загрузка заявок с API
    setApplications([
      { id: 1, name: 'Петров А.В.', phone: '+7 999 123-45-67', type: 'contact', status: 'new', created_at: '2025-01-20' },
      { id: 2, name: 'ООО "СтройМастер"', phone: '+7 999 765-43-21', type: 'consultation', status: 'processed', created_at: '2025-01-19' },
    ])
  }, [])

  return (
    <div className="applications-list">
      <div className="page-header">
        <h1>📋 Заявки</h1>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Тип</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id}>
              <td>{app.id}</td>
              <td>{app.name}</td>
              <td>{app.phone}</td>
              <td>{app.type}</td>
              <td>
                <span className={`status-badge ${app.status}`}>
                  {app.status === 'new' ? 'Новая' : app.status === 'processed' ? 'Обработана' : 'Закрыта'}
                </span>
              </td>
              <td>{app.created_at}</td>
              <td>
                <button className="btn-sm">👁️</button>
                <button className="btn-sm">✏️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
