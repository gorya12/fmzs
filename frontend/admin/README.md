# Панель управления Формоза-Сервис

## Запуск

```bash
cd frontend/admin/server
npm install
npm start
```

Сервер запустится на `http://localhost:3001`

## Доступ

Откройте `http://localhost:3001/login.html`

### Суперадмины (предустановлены)

| Логин | Пароль |
|-------|--------|
| `Aleksandra` | `FormozaAdmin2025!` |
| `Uvarov.A.V` | `ServiceMaster2025!` |

## Роли

- **Superadmin** — полный доступ: пользователи, заявки, новости, акции, настройки
- **Manager** — новости, акции, настройки
- **Support** — заявки, настройки

## API Endpoints

- `POST /api/auth/login` — вход
- `GET /api/stats` — статистика
- `GET /api/users` — список пользователей (superadmin)
- `POST /api/users` — создать пользователя (superadmin)
- `DELETE /api/users/:id` — удалить пользователя (superadmin)
- `GET /api/applications` — заявки (support/superadmin)
- `PATCH /api/applications/:id` — обновить заявку
- `DELETE /api/applications/:id` — удалить заявку (superadmin)
- `GET /api/news` — новости
- `POST /api/news` — создать новость (manager/superadmin)
- `PATCH /api/news/:id` — обновить новость
- `DELETE /api/news/:id` — удалить новость
- `GET /api/offers` — акции
- `POST /api/offers` — создать акцию (manager/superadmin)
- `PATCH /api/offers/:id` — обновить акцию
- `DELETE /api/offers/:id` — удалить акцию
- `GET /api/profile` — профиль
- `PATCH /api/profile` — обновить профиль
- `POST /api/contact` — публичная форма контактов
- `POST /api/consultation` — публичная форма консультации
