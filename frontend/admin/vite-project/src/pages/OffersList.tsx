import { useEffect, useState } from 'react'
import './OffersList.css'

interface Offer {
  id: number
  title: string
  price_old: string
  price_new: string
  is_active: number
}

export default function OffersList() {
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    // TODO: загрузка акций с API
    setOffers([
      { id: 1, title: 'Диагностика бесплатно', price_old: '2500', price_new: '0', is_active: 1 },
      { id: 2, title: 'Скидка 20% на ремонт', price_old: '10000', price_new: '8000', is_active: 1 },
    ])
  }, [])

  return (
    <div className="offers-list">
      <div className="page-header">
        <h1>🏷️ Акции</h1>
        <button className="btn-primary">+ Добавить акцию</button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Старая цена</th>
            <th>Новая цена</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {offers.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.price_old} ₽</td>
              <td>{item.price_new} ₽</td>
              <td>
                <span className={`status-badge ${item.is_active ? 'active' : 'inactive'}`}>
                  {item.is_active ? 'Активна' : 'Неактивна'}
                </span>
              </td>
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
