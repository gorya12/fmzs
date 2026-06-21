from flask import Flask, jsonify, request, send_from_directory, render_template_string
from flask_cors import CORS
import sqlite3
import os
from models import init_db, News, Project, Offer

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Разрешаем кросс-доменные запросы

# Инициализация базы данных при запуске
try:
    init_db()
    print("База данных готова к работе")
except Exception as e:
    print(f"Ошибка при инициализации базы данных: {e}")

# Функция для получения соединения с БД
def get_db_connection():
    conn = sqlite3.connect('database/database.db')
    conn.row_factory = sqlite3.Row  # Позволяет обращаться к колонкам по имени
    return conn

# Главная страница
@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

# Админ-панель (раздаём статику из frontend/admin/)
@app.route('/admin/')
def admin_index():
    return send_from_directory('../frontend/admin', 'index.html')

@app.route('/admin/<path:path>')
def admin_static(path):
    return send_from_directory('../frontend/admin', path)

# Обработка статических файлов CSS
@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('../frontend/css', path)

# Обработка статических файлов JS
@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('../frontend/js', path)

# Обработка статических файлов из assets
@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('../frontend/assets', path)

# API endpoints
@app.route('/api/news', methods=['GET'])
def get_news():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news ORDER BY date DESC')
        rows = cursor.fetchall()
        conn.close()
        
        news_list = []
        for row in rows:
            news = News(
                id=row['id'],
                title=row['title'],
                content=row['content'],
                date=row['date'],
                image_url=row['image_url']
            )
            news_list.append(news.to_dict())
        
        return jsonify(news_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/news/<int:news_id>', methods=['GET'])
def get_news_detail(news_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM news WHERE id = ?', (news_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            news = News(
                id=row['id'],
                title=row['title'],
                content=row['content'],
                date=row['date'],
                image_url=row['image_url']
            )
            return jsonify(news.to_dict())
        return jsonify({'error': 'Новость не найдена'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM projects')
        rows = cursor.fetchall()
        conn.close()
        
        projects_list = []
        for row in rows:
            project = Project(
                id=row['id'],
                title=row['title'],
                description=row['description'],
                image_url=row['image_url']
            )
            projects_list.append(project.to_dict())
        
        return jsonify(projects_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/offers', methods=['GET'])
def get_offers():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM special_offers')
        rows = cursor.fetchall()
        conn.close()
        
        offers_list = []
        for row in rows:
            offer = Offer(
                id=row['id'],
                title=row['title'],
                description=row['description']
            )
            offers_list.append(offer.to_dict())
        
        return jsonify(offers_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.json
        # Здесь можно добавить логику отправки email или сохранения в БД
        print(f"Получено сообщение от: {data.get('name', 'Не указано')}")
        print(f"Email: {data.get('email', 'Не указан')}")
        print(f"Сообщение: {data.get('message', 'Пусто')}")
        
        return jsonify({
            'message': 'Сообщение успешно отправлено',
            'status': 'success'
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK', 'message': 'Сервер работает'}), 200

if __name__ == '__main__':
    print("="*50)
    print("Запуск сервера Формоза-Сервис...")
    print("="*50)
    print("Сайт доступен по адресу: http://localhost:5000")
    print("API доступно по адресу: http://localhost:5000/api/")
    print("Для проверки API: http://localhost:5000/api/health")
    print("="*50)
    print("Для остановки сервера нажмите Ctrl+C")
    print("="*50)
    app.run(debug=True, port=5000)