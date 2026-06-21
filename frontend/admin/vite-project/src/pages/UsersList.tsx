import { useEffect, useState } from 'react'
import './UsersList.css'

interface User {
  id: number
  username: string
  full_name: string
  role: string
  last_login: string | null
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // TODO: загрузка пользователей с API
    setUsers([
      { id: 1, username: 'admin', full_name: 'Администратор', role: 'superadmin', last_login: '2025-01-20' },
      { id: 2, username: 'manager1', full_name: 'Иванов И.И.', role: 'manager', last_login: '2025-01-19' },
    ])
  }, [])

  return (
    <div className="users-list">
      <div className="page-header">
        <h1>👥 Пользователи</h1>
        <button className="btn-primary">+ Добавить пользователя</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>ФИО</th>
            <th>Роль</th>
            <th>Последний вход</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              <td>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </td>
              <td>{user.last_login || '—'}</td>
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
