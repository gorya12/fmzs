# Шаблон для создания Request классов

## Быстрый старт

### Шаг 1: Создать файл Request класса

Файл: `frontend/admin/server/requests/CreateXxxRequest.js`

```javascript
class CreateXxxRequest {
    constructor(data) {
        this.data = data;
        this.errors = {};
    }

    validate() {
        this.validateField1();
        this.validateField2();
        // ... остальные поля
        
        return Object.keys(this.errors).length === 0;
    }

    getErrors() {
        return this.errors;
    }

    getFirstError() {
        const keys = Object.keys(this.errors);
        if (keys.length === 0) return null;
        return this.errors[keys[0]];
    }

    sanitized() {
        return {
            field1: this.data.field1?.trim() || '',
            field2: this.data.field2 ? String(this.data.field2).trim() : '',
            // ... остальные поля
        };
    }

    // ВАЛИДАЦИЯ ПОЛЕЙ
    
    validateField1() {
        const field = this.data.field1;
        
        if (!field) {
            this.errors.field1 = 'Поле обязательно';
            return;
        }
        
        if (typeof field !== 'string') {
            this.errors.field1 = 'Поле должно быть строкой';
            return;
        }
        
        const trimmed = field.trim();
        
        if (trimmed.length < 3) {
            this.errors.field1 = 'Минимум 3 символа';
            return;
        }
        
        if (trimmed.length > 100) {
            this.errors.field1 = 'Максимум 100 символов';
        }
    }

    validateField2() {
        const field = this.data.field2;
        
        if (!field) {
            this.errors.field2 = 'Поле обязательно';
            return;
        }
        
        if (isNaN(field) || field < 0) {
            this.errors.field2 = 'Должно быть положительным числом';
        }
    }
}

module.exports = CreateXxxRequest;
```

### Шаг 2: Использовать в контроллере

```javascript
const CreateXxxRequest = require('../requests/CreateXxxRequest');

router.post('/', asyncHandler(async (req, res) => {
    // 1. ВАЛИДАЦИЯ
    const request = new CreateXxxRequest(req.body);
    
    if (!request.validate()) {
        return res.status(422).json({
            error: 'Ошибка валидации',
            errors: request.getErrors(),
            message: request.getFirstError()
        });
    }

    // 2. ПОЛУЧЕНИЕ ДАННЫХ
    const cleanData = request.sanitized();

    // 3. СОХРАНЕНИЕ
    const id = await db.create({ ...cleanData, created_by: req.user.id });

    // 4. ОТВЕТ
    res.status(201).json({
        success: true,
        message: 'Успешно создано',
        data: { id, ...cleanData }
    });
}));
```

## Типовые валидации

### Валидация строк

```javascript
validateTitle() {
    const title = this.data.title;
    
    if (!title) {
        this.errors.title = 'Заголовок обязателен';
        return;
    }
    
    if (typeof title !== 'string') {
        this.errors.title = 'Заголовок должен быть строкой';
        return;
    }
    
    const trimmed = title.trim();
    
    if (trimmed.length === 0) {
        this.errors.title = 'Заголовок не может быть пустым';
        return;
    }
    
    if (trimmed.length < 3) {
        this.errors.title = 'Минимум 3 символа';
        return;
    }
    
    if (trimmed.length > 100) {
        this.errors.title = 'Максимум 100 символов';
    }
}
```

### Валидация чисел

```javascript
validatePrice() {
    const price = this.data.price;
    
    if (!price) {
        this.errors.price = 'Цена обязательна';
        return;
    }
    
    if (isNaN(price)) {
        this.errors.price = 'Должно быть числом';
        return;
    }
    
    if (price < 0) {
        this.errors.price = 'Не может быть отрицательной';
        return;
    }
    
    if (price > 1000000) {
        this.errors.price = 'Не может быть больше 1,000,000';
    }
}
```

### Валидация enum (выбор из списка)

```javascript
validateStatus() {
    const status = this.data.status;
    const validStatuses = ['active', 'inactive', 'pending'];
    
    if (!status) {
        this.errors.status = 'Статус обязателен';
        return;
    }
    
    if (!validStatuses.includes(String(status).toLowerCase())) {
        this.errors.status = `Должен быть: ${validStatuses.join(', ')}`;
    }
}
```

### Валидация массивов

```javascript
validateTags() {
    const tags = this.data.tags;
    
    // Опционально
    if (!tags) return;
    
    if (!Array.isArray(tags)) {
        this.errors.tags = 'Теги должны быть массивом';
        return;
    }
    
    if (tags.length > 10) {
        this.errors.tags = 'Максимум 10 тегов';
        return;
    }
    
    for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        
        if (typeof tag !== 'string') {
            this.errors.tags = `Тег ${i + 1} должен быть строкой`;
            return;
        }
        
        if (tag.trim().length > 50) {
            this.errors.tags = `Тег ${i + 1} не может быть больше 50 символов`;
            return;
        }
    }
}
```

### Валидация email

```javascript
validateEmail() {
    const email = this.data.email;
    
    if (!email) {
        this.errors.email = 'Email обязателен';
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        this.errors.email = 'Некорректный email адрес';
    }
}
```

### Валидация URL

```javascript
validateImageUrl() {
    const url = this.data.image_url;
    
    if (!url) return; // Опционально
    
    try {
        new URL(url);
    } catch (e) {
        this.errors.image_url = 'Некорректный URL';
    }
}
```

### Валидация даты

```javascript
validateDate() {
    const date = this.data.date;
    
    if (!date) {
        this.errors.date = 'Дата обязательна';
        return;
    }
    
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
        this.errors.date = 'Некорректный формат даты';
        return;
    }
    
    if (parsedDate < new Date()) {
        this.errors.date = 'Дата не может быть в прошлом';
    }
}
```

### Валидация зависимостей между полями

```javascript
validatePrices() {
    const { price_old, price_new } = this.data;
    
    // Если обе цены установлены, проверяем логику
    if (price_old && price_new) {
        if (Number(price_new) >= Number(price_old)) {
            this.errors.price_new = 'Новая цена должна быть меньше старой';
        }
    }
}
```

## Лучшие практики

### ✅ DO

```javascript
// 1. Всегда проверяй типы
validateName() {
    if (typeof this.data.name !== 'string') {
        this.errors.name = 'Должно быть строкой';
        return;
    }
}

// 2. Удаляй пробелы
const trimmed = this.data.title?.trim() || '';

// 3. Проверяй пустоту после trim
if (trimmed.length === 0) {
    this.errors.title = 'Не может быть пустым';
}

// 4. Используй ранние возвраты
if (!field) {
    this.errors.field = 'Required';
    return;  // Выходим, не проверяем дальше
}

// 5. Добавляй полезные сообщения об ошибках
this.errors.password = 'Пароль должен быть минимум 8 символов и содержать букву и цифру';
```

### ❌ DON'T

```javascript
// 1. Не проверяй типы после trim (может быть undefined)
const title = this.data.title.trim();  // ❌ Может быть ошибка

// 2. Не используй магические числа
if (price > 9999) { }  // ❌ Откуда 9999?

// 3. Не добавляй бизнес-логику в валидацию
if (price < competitor_price) { }  // ❌ Это не валидация

// 4. Не забывай про опциональные поля
validateOptionalField() {
    if (!this.data.optional_field) {
        this.errors.optional_field = 'Required';  // ❌ Если оно опционально
    }
}

// 5. Не пропускай сообщения об ошибках
if (name.length < 3) {
    this.errors.name = true;  // ❌ Юзер не поймёт что не так
}
```

## Контрольный список

Перед тем как создать новый Request класс:

- [ ] Есть ли у класса все 5 обязательных методов?
  - `validate()`
  - `getErrors()`
  - `getFirstError()`
  - `sanitized()`
  - `constructor(data)`

- [ ] Валидируются ли все обязательные поля?
- [ ] Валидируются ли типы данных?
- [ ] Очищаются ли строки (trim)?
- [ ] Проверяются ли минимальные/максимальные значения?
- [ ] Проверяются ли форматы (email, URL, телефон)?
- [ ] Проверяются ли зависимости между полями?
- [ ] Сообщения об ошибках понятны на русском?
- [ ] Опциональные поля не требуют обязательного значения?
- [ ] Method `sanitized()` возвращает чистые, безопасные данные?

## Следующие шаги

1. Создать `UpdateNewsRequest.js` - для обновления новостей
2. Создать `CreateUserRequest.js` - для создания пользователей
3. Создать `UpdateUserRequest.js` - для обновления пользователей
4. Создать `UpdateApplicationRequest.js` - для изменения статуса заявок
5. Создать `UpdateProfileRequest.js` - для обновления профиля

Каждый Request класс улучшает безопасность и качество API! 🎯
