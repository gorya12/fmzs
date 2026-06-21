# Formosa deploy

## Быстрый деплой через Docker Compose

1. Скопируйте проект на сервер.
2. Создайте `.env` из примера:

```bash
cp .env.example .env
```

3. В `.env` обязательно замените `JWT_SECRET` на длинную случайную строку.
4. Запустите:

```bash
docker compose up -d --build
```

Сайт будет доступен на `http://SERVER_IP/`, админка - на `http://SERVER_IP/admin/login.html`, API - на `/api`.

При первом старте контейнер применяет миграции и заполняет базу начальными данными, если таблица пользователей пустая. После первого входа смените стандартные пароли в админке.

## Полезные команды

```bash
docker compose ps
docker compose logs -f api
docker compose exec api npm run migrate
docker compose down
```

Данные SQLite хранятся в volume `formosa_data`, загрузки - в `formosa_uploads`.
