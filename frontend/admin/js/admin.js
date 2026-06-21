// Check auth
function checkAuth() {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get current user role
function getRole() {
    const user = getUser();
    return user ? user.role : null;
}

// Role checks
function isSuperadmin() { return getRole() === 'superadmin'; }
function isManager() { return getRole() === 'manager' || isSuperadmin(); }
function isSupport() { return getRole() === 'support' || isSuperadmin(); }

// Format date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

// Format role name
function formatRole(role) {
    const map = {
        'superadmin': 'Суперадмин',
        'manager': 'Менеджер',
        'support': 'Поддержка'
    };
    return map[role] || role;
}

// Format status
function formatStatus(status) {
    const map = {
        'new': { text: 'Новая', class: 'badge-new' },
        'in_progress': { text: 'В работе', class: 'badge-progress' },
        'completed': { text: 'Выполнена', class: 'badge-completed' },
        'closed': { text: 'Закрыта', class: 'badge-closed' }
    };
    return map[status] || { text: status, class: '' };
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
