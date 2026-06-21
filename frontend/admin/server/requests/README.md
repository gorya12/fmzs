# Архитектура валидации и контроллеров

## Структура папок

```
frontend/admin/server/
├── controllers/
│   ├── offersController.js
│   ├── newsController.js
│   ├── usersController.js
│   └── ... (другие контроллеры)
├── requests/
│   ├── CreatePromotionRequest.js
│   ├── UpdatePromotionRequest.js
│   ├── CreateNewsRequest.js
│   └── ... (другие request классы)
└── database.js
```

## Паттерн валидации

### 1. Как это работает

```javascript
// Контроллер использует класс валидации
router.post('/', asyncHandler(async (req, res) => {
    // 1. Создаём экземпляр Request класса
    const request = new CreatePromotionRequest(req.body);
    
    // 2. Запускаем валидацию
    if (!request.validate()) {
        // Если ошибки - возвращаем их
        return res.status(422).json({
            error: 'Ошибка валидации',
            errors: request.getErrors(),  // Все ошибки
            message: request.getFirstError()  // Первая ошибка
        });
    }
    
    // 3. Получаем очищенные данные
    const cleanData = request.sanitized();
    
    // 4. Используем данные в БД
    const id = await db.createOffer(cleanData);
    
    // 5. Возвращаем успешный ответ
    res.status(201).json({
        success: true,
        message: 'Успешно создано',
        data: { id, ...cleanData }
    });
}));
```

### 2. Класс валидации (Request класс)

```javascript
class CreatePromotionRequest {
    constructor(data) {
        this.data = data;  // Исходные данные из req.body
        this.errors = {};  // Объект с ошибками
    }

    // ОБЯЗАТЕЛЬНЫЙ метод - запуск всех валидаций
    validate() {
        this.validateTitle();
        this.validateDescription();
        this.validatePrices();
        return Object.keys(this.errors).length === 0;  // true если нет ошибок
    }

    // ОБЯЗАТЕЛЬНЫЙ метод - получить ошибки
    getErrors() {
        return this.errors;  // { title: "Ошибка...", price: "Ошибка..." }
    }

    // ОБЯЗАТЕЛЬНЫЙ метод - получить первую ошибку
    getFirstError() {
        const keys = Object.keys(this.errors);
        if (keys.length === 0) return null;
        return this.errors[keys[0]];
    }

    // ОБЯЗАТЕЛЬНЫЙ метод - получить очищенные данные
    sanitized() {
        return {
            title: this.data.title?.trim() || '',
            description: this.data.description?.trim() || ''
            // ... остальные поля
        };
    }

    // Приватные методы валидации
    validateTitle() {
        // Здесь вся логика проверки title
        if (!this.data.title) {
            this.errors.title = 'Title required';
        }
    }

    validateDescription() {
        // Здесь вся логика проверки description
    }
}
```

### 3. Ответы валидации

#### При ошибке валидации (422):
```json
{
    "error": "Ошибка валидации",
    "message": "Заголовок должен быть минимум 3 символа",
    "errors": {
        "title": "Заголовок должен быть минимум 3 символа",
        "description": "Описание обязательно"
    }
}
```

#### При успехе (201):
```json
{
    "success": true,
    "message": "Акция успешно создана",
    "data": {
        "id": 5,
        "title": "Летняя скидка",
        "description": "Скидка 30%",
        "created_by": 1,
        "created_at": "2026-05-24T10:30:00Z"
    }
}
```

## Типы Request классов

### 1. Create Request
Для создания новых записей. Требует все обязательные поля.

```javascript
// CreatePromotionRequest.js
class CreatePromotionRequest {
    validate() {
        this.validateTitle();          // Обязательно
        this.validateDescription();    // Обязательно
        this.validatePrices();         // Опционально
        this.validateFeatures();       // Опционально
    }
}

// Использование
const request = new CreatePromotionRequest(req.body);
if (!request.validate()) return res.status(422).json(...);
```

### 2. Update Request
Для обновления существующих записей. Поддерживает частичное обновление.

```javascript
// UpdatePromotionRequest.js
class UpdatePromotionRequest {
    validate() {
        if (this.data.title !== undefined) this.validateTitle();
        if (this.data.description !== undefined) this.validateDescription();
        // ... проверяем только переданные поля
    }
}

// Использование
const request = new UpdatePromotionRequest(req.body, offerId);
if (!request.validate()) return res.status(422).json(...);
```

### 3. Filter/Query Request
Для валидации параметров фильтрации/поиска (если нужно).

```javascript
class FilterPromotionsRequest {
    validate() {
        if (this.data.minPrice) this.validateMinPrice();
        if (this.data.maxPrice) this.validateMaxPrice();
        if (this.data.search) this.validateSearch();
    }
}
```

## Чек-лист для создания Request класса

- [ ] Конструктор принимает `data`
- [ ] Свойство `errors = {}`
- [ ] Метод `validate()` который возвращает boolean
- [ ] Метод `getErrors()` возвращает объект ошибок
- [ ] Метод `getFirstError()` возвращает первую ошибку
- [ ] Метод `sanitized()` возвращает очищенные данные
- [ ] Методы валидации для каждого поля
- [ ] Методы валидации проверяют тип данных
- [ ] Методы валидации проверяют пустоту
- [ ] Методы валидации проверяют длину
- [ ] Методы валидации проверяют формат
- [ ] Методы валидации проверяют бизнес-логику

## Примеры использования в контроллерах

### Пример 1: Create (offersController.js)

```javascript
router.post('/', asyncHandler(async (req, res) => {
    const createRequest = new CreatePromotionRequest(req.body);
    
    if (!createRequest.validate()) {
        return res.status(422).json({
            error: 'Ошибка валидации',
            errors: createRequest.getErrors(),
            message: createRequest.getFirstError()
        });
    }
    
    const cleanData = createRequest.sanitized();
    const id = await db.createOffer({ ...cleanData, created_by: req.user.id });
    
    res.status(201).json({
        success: true,
        message: 'Акция создана',
        data: { id, ...cleanData }
    });
}));
```

### Пример 2: Update (offersController.js)

```javascript
router.patch('/:id', asyncHandler(async (req, res) => {
    const updateRequest = new UpdatePromotionRequest(req.body, req.params.id);
    
    if (!updateRequest.validate()) {
        return res.status(422).json({
            error: 'Ошибка валидации',
            errors: updateRequest.getErrors(),
            message: updateRequest.getFirstError()
        });
    }
    
    const cleanData = updateRequest.sanitized();
    await db.updateOffer(req.params.id, cleanData);
    
    res.json({
        success: true,
        message: 'Акция обновлена',
        data: cleanData
    });
}));
```

## Преимущества этого паттерна

1. **Разделение ответственности** - валидация отделена от контроллера
2. **Переиспользование** - один Request класс может использоваться в разных местах
3. **Тестирование** - легко тестировать валидацию отдельно
4. **Поддерживаемость** - изменения в правилах валидации в одном месте
5. **Консистентность** - одинаковые сообщения об ошибках везде
6. **Масштабируемость** - добавлять новые проверки просто
7. **Безопасность** - очищенные данные гарантируют правильный формат

## Следующие Request классы для реализации

- [ ] `CreateUserRequest` - для создания пользователей
- [ ] `UpdateUserRequest` - для обновления пользователей
- [ ] `CreateApplicationRequest` - для создания заявок
- [ ] `UpdateApplicationRequest` - для обновления статуса заявок
- [ ] `UpdateProfileRequest` - для обновления профиля
- [ ] `CreateProjectRequest` - для создания проектов
- [ ] `UpdateProjectRequest` - для обновления проектов
