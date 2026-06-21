import sqlite3
import os
from datetime import datetime

class News:
    def __init__(self, id=None, title=None, content=None, date=None, image_url=None):
        self.id = id
        self.title = title
        self.content = content
        self.date = date or datetime.now().strftime('%Y-%m-%d')
        self.image_url = image_url or '/assets/images/default-news.jpg'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'date': self.date,
            'image_url': self.image_url
        }

class Project:
    def __init__(self, id=None, title=None, description=None, image_url=None):
        self.id = id
        self.title = title
        self.description = description
        self.image_url = image_url or '/assets/images/default-project.jpg'
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'image_url': self.image_url
        }

class Offer:
    def __init__(self, id=None, title=None, description=None):
        self.id = id
        self.title = title
        self.description = description
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description
        }

def init_db():
    """Инициализация базы данных"""
    # Создаем директорию для базы данных если её нет
    os.makedirs('database', exist_ok=True)
    
    conn = sqlite3.connect('database/database.db')
    cursor = conn.cursor()
    
    # Создание таблицы новостей
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        date TEXT,
        image_url TEXT
    )
    ''')
    
    # Создание таблицы проектов
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT
    )
    ''')
    
    # Создание таблицы специальных предложений
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS special_offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
    )
    ''')
    
    # Проверяем, есть ли данные в таблицах
    cursor.execute('SELECT COUNT(*) FROM news')
    if cursor.fetchone()[0] == 0:
        # Добавление тестовых новостей
        sample_news = [
            ('Новая система безопасности', 'Мы разработали инновационную систему безопасности для промышленных объектов. Система включает в себя современные датчики и автоматизированное управление.', '2024-01-15', '/assets/images/news1.jpg'),
            ('Расширение штата', 'В нашей компании появились новые высококвалифицированные специалисты в области промышленной безопасности. Это позволит нам предлагать еще более качественные услуги.', '2024-01-10', '/assets/images/news2.jpg'),
            ('Сертификация ISO', 'Компания успешно прошла сертификацию и получила сертификат ISO 9001:2024, подтверждающий высокое качество наших услуг.', '2024-01-05', '/assets/images/news3.jpg'),
            ('Новый офис в Москве', 'Открытие нового современного офиса в центре Москвы для более удобного обслуживания клиентов.', '2024-01-20', '/assets/images/news4.jpg')
        ]
        cursor.executemany('INSERT INTO news (title, content, date, image_url) VALUES (?, ?, ?, ?)', sample_news)
        print("Добавлены тестовые новости")
    
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        # Добавление тестовых проектов
        sample_projects = [
            ('Газпром', 'Газпром является крупнейшим российским газораспределительным предприятием. Мы успешно реализовали проект по модернизации системы безопасности на объектах компании.', '/assets/images/gazprom.jpg'),
            ('Лукойл', 'Лукойл является ведущим поставщиком электроэнергии в России. Нашими специалистами была внедрена комплексная система противопожарной безопасности.', '/assets/images/lukoil.jpg'),
            ('РЖД', 'РЖД является крупнейшим железнодорожным транспортом России. Мы обеспечили надежную защиту критически важных объектов инфраструктуры.', '/assets/images/rjd.jpg'),
            ('Росатом', 'Реализация проекта по обеспечению безопасности на объектах атомной энергетики с использованием современных технологий.', '/assets/images/rosatom.jpg')
        ]
        cursor.executemany('INSERT INTO projects (title, description, image_url) VALUES (?, ?, ?)', sample_projects)
        print("Добавлены тестовые проекты")
    
    cursor.execute('SELECT COUNT(*) FROM special_offers')
    if cursor.fetchone()[0] == 0:
        # Добавление тестовых предложений
        sample_offers = [
            ('Скидка на обслуживание', 'Специальное предложение: скидка 15% на годовое обслуживание для новых клиентов'),
            ('Рассрочка на оборудование', 'Удобная рассрочка на приобретение оборудования безопасности без переплат'),
            ('Подарок на заказчика', 'При заключении договора на комплексное обслуживание - бесплатный аудит безопасности'),
            ('Бесплатная консультация', 'Первичная консультация специалиста абсолютно бесплатно')
        ]
        cursor.executemany('INSERT INTO special_offers (title, description) VALUES (?, ?)', sample_offers)
        print("Добавлены тестовые предложения")
    
    conn.commit()
    conn.close()
    print("База данных успешно инициализирована")