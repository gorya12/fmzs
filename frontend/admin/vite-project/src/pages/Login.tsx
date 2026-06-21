import { useState } from 'react'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: авторизация через API
    console.log('Login:', { username, password })
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1>🔐 Вход в админ-панель</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Введите логин"
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>
          <button type="submit" className="btn-login">Войти</button>
        </form>
      </div>
    </div>
  )
}
