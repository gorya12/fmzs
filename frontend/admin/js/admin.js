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

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getInitials(name) {
    const cleanName = String(name || '').trim();
    if (!cleanName) return 'A';

    return cleanName
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join('');
}

function getSidebarItems() {
    const items = [
        {
            id: 'index',
            label: 'Дашборд',
            href: 'index.html',
            visible: true,
            icon: '<path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z"/>'
        },
        {
            id: 'applications',
            label: 'Заявки',
            href: 'applications.html',
            visible: isSupport(),
            icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z"/>'
        },
        {
            id: 'news',
            label: 'Новости',
            href: 'news.html',
            visible: isManager(),
            icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>'
        },
        {
            id: 'offers',
            label: 'Акции',
            href: 'offers.html',
            visible: isManager(),
            icon: '<path d="M20.59 13.41 11.17 4H4v7.17l9.41 9.42a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"/><path d="M7.5 7.5h.01"/>'
        },
        {
            id: 'users',
            label: 'Пользователи',
            href: 'users.html',
            visible: isSuperadmin(),
            icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
        },
        {
            id: 'settings',
            label: 'Настройки',
            href: 'settings.html',
            visible: true,
            icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1.06V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1.06-.33H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1.06V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.3.21.64.33 1 .33H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>'
        }
    ];

    return items.filter(item => item.visible);
}

function renderSidebar(activePage = 'index') {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const user = getUser() || {};
    const displayName = user.full_name || user.username || 'Администратор';
    const role = formatRole(user.role || 'superadmin');
    const items = getSidebarItems();

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <a href="index.html" class="sidebar-logo">
                <img src="../assets/images/logo.png" alt="Формоза-Сервис">
                <span>Админ-панель</span>
            </a>
        </div>
        <nav class="sidebar-nav" aria-label="Навигация админ-панели">
            <ul>
                <li class="nav-section">
                    <div class="nav-section-title">Управление</div>
                </li>
                ${items.map(item => `
                    <li>
                        <a href="${item.href}" class="nav-link ${item.id === activePage ? 'active' : ''}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.icon}</svg>
                            <span>${item.label}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        </nav>
        <div class="sidebar-footer">
            <div class="user-info">
                <div class="user-avatar">${escapeHTML(getInitials(displayName))}</div>
                <div class="user-details">
                    <div class="user-name">${escapeHTML(displayName)}</div>
                    <div class="user-role">${escapeHTML(role)}</div>
                </div>
                <button class="logout-btn" type="button" onclick="logout()" title="Выйти" aria-label="Выйти">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

document.addEventListener('click', (event) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.sidebar-toggle');

    if (!sidebar || !sidebar.classList.contains('open')) return;
    if (sidebar.contains(event.target) || toggle?.contains(event.target)) return;

    sidebar.classList.remove('open');
});

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
