var API_BASE = window.FORMOSA_API_BASE || '';

function getToken() {
    return localStorage.getItem('admin_token');
}

function getUser() {
    const u = localStorage.getItem('admin_user');
    return u ? JSON.parse(u) : null;
}

function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = 'login.html';
}

async function api(url, options = {}) {
    const token = getToken();
    const res = await fetch(API_BASE + url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
            ...(options.headers || {})
        }
    });

    if (res.status === 401) {
        logout();
        return;
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.message || data.error || 'Ошибка запроса');
    }
    return data;
}

const apiClient = {
    get: (url) => api(url),
    post: (url, body) => api(url, { method: 'POST', body: JSON.stringify(body) }),
    patch: (url, body) => api(url, { method: 'PATCH', body: JSON.stringify(body) }),
    delete: (url) => api(url, { method: 'DELETE' })
};
