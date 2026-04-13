// --- Auth guard ---
(function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.replace('/user/auth.html');
    }
})();

// --- Translations ---
const translations = {
    en: {
        profileTitle: 'Profile',
        langTitle: 'Language',
        waTitle: 'WhatsApp Support',
        waLabel: 'Show WhatsApp contact button',
        waDesc: 'A floating button that lets visitors reach us via WhatsApp.',
        logout: 'Log Out'
    },
    de: {
        profileTitle: 'Profil',
        langTitle: 'Sprache',
        waTitle: 'WhatsApp-Support',
        waLabel: 'WhatsApp-Kontaktschaltfläche anzeigen',
        waDesc: 'Eine schwebende Schaltfläche, um uns per WhatsApp zu erreichen.',
        logout: 'Abmelden'
    },
    ru: {
        profileTitle: 'Профиль',
        langTitle: 'Язык',
        waTitle: 'Поддержка WhatsApp',
        waLabel: 'Показать кнопку WhatsApp',
        waDesc: 'Плавающая кнопка для связи с нами через WhatsApp.',
        logout: 'Выйти'
    }
};

function applyTranslations(lang) {
    const t = translations[lang] || translations.en;

    const profileTitle = document.getElementById('card-title-profile');
    const langTitle = document.getElementById('card-title-lang');
    const waTitle = document.getElementById('card-title-wa');
    const waLabel = document.getElementById('wa-label');
    const waDesc = document.getElementById('wa-desc');
    const logoutBtn = document.getElementById('logout-btn');

    if (profileTitle) profileTitle.childNodes[1].nodeValue = ' ' + t.profileTitle;
    if (langTitle) langTitle.childNodes[1].nodeValue = ' ' + t.langTitle;
    if (waTitle) waTitle.childNodes[1].nodeValue = ' ' + t.waTitle;
    if (waLabel) waLabel.textContent = t.waLabel;
    if (waDesc) waDesc.textContent = t.waDesc;
    if (logoutBtn) logoutBtn.childNodes[logoutBtn.childNodes.length - 1].nodeValue = ' ' + t.logout;

    if (window.i18n) window.i18n.apply(lang);
}

// --- Avatar ---
function getAvatarKey() {
    const user = localStorage.getItem('currentUser') || 'guest';
    return 'userAvatarDataURL_' + user;
}

function handleAvatarUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showMsg('Please select an image file.', 'error');
        return;
    }
    if (file.size > 2 * 1024 * 1024) {
        showMsg('Image must be smaller than 2 MB.', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = e.target.result;
        localStorage.setItem(getAvatarKey(), dataUrl);
        const preview = document.getElementById('avatarPreview');
        if (preview) preview.src = dataUrl;
        showMsg('Profile picture updated.', 'success');
    };
    reader.readAsDataURL(file);
}

// --- Language ---
function setLanguage(lang) {
    // Use the new i18n system that handles cookies + localStorage
    if (window.i18n && typeof window.i18n.changeLanguage === 'function') {
        window.i18n.changeLanguage(lang);
    } else {
        // Fallback for backwards compatibility
        localStorage.setItem('preferredLanguage', lang);
        if (typeof CookieManager !== 'undefined') {
            CookieManager.set('family-steam-lang', lang, 365, '/');
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    applyTranslations(lang);
    showMsg('Language saved.', 'success');
}

// --- WhatsApp toggle ---
function handleWaToggle(checked) {
    localStorage.setItem('whatsappEnabled', checked ? 'true' : 'false');

    // Update the floating FAB if present in the current DOM
    const fab = document.getElementById('whatsapp-fab');
    if (fab) fab.style.display = checked ? 'flex' : 'none';
}

// --- Logout ---
function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.replace('/index.html');
}

// --- Message helper ---
let msgTimer = null;
function showMsg(text, type) {
    const el = document.getElementById('settingsMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'settings-msg ' + type;
    el.style.display = 'block';
    clearTimeout(msgTimer);
    msgTimer = setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    // Set username
    const username = localStorage.getItem('currentUser') || '';
    const usernameEl = document.getElementById('profileUsername');
    if (usernameEl) usernameEl.textContent = username;

    // Set avatar
    const avatarData = localStorage.getItem(getAvatarKey());
    const avatarPreview = document.getElementById('avatarPreview');
    if (avatarPreview && avatarData) avatarPreview.src = avatarData;

    // Wire avatar input
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) avatarInput.addEventListener('change', handleAvatarUpload);

    // Set language
    const lang = (window.i18n && typeof window.i18n.getLang === 'function') 
        ? window.i18n.getLang() 
        : (localStorage.getItem('preferredLanguage') || 'en');
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    applyTranslations(lang);

    // Set WhatsApp toggle
    const waToggle = document.getElementById('waToggle');
    const waEnabled = localStorage.getItem('whatsappEnabled');
    if (waToggle) {
        waToggle.checked = waEnabled !== 'false';
        waToggle.addEventListener('change', () => handleWaToggle(waToggle.checked));
    }

    // Wire logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Load user inbox if logged in
    const token = localStorage.getItem('authToken');
    if (token) loadUserInbox();
});

/* ─── User Inbox ─────────────────────────────────────────────────────────── */

function _resolveApiBaseUrl() {
    const fromWindow = window.__API_BASE_URL__;
    if (typeof fromWindow === 'string' && fromWindow.trim() !== '') {
        return fromWindow.replace(/\/$/, '');
    }

    return `${window.location.origin}/api/v1`;
}

const _MSG_API = `${_resolveApiBaseUrl()}/message`;
let _userThreads = [];
let _activeUserThreadId = null;

function _inboxRequest(url, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = { ...(options.headers || {}) };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, { ...options, headers });
}

async function loadUserInbox() {
    try {
        const res  = await _inboxRequest(`${_MSG_API}/userInbox`, { method: 'GET' });
        const data = await res.json();
        _userThreads = data.threads || [];
        renderUserThreadsList();
    } catch (err) {
        console.error('Failed to load inbox:', err);
    }
}

function renderUserThreadsList() {
    const container = document.getElementById('userInboxThreadsList');
    if (!container) return;

    if (_userThreads.length === 0) {
        container.innerHTML = '<p class="settings-desc">No messages yet.</p>';
        return;
    }

    container.innerHTML = _userThreads.map(t => `
        <div class="user-thread-item" onclick="openUserThread('${_esc(t.thread_id)}')">
            <div class="user-thread-header">
                <strong>${_esc(t.subject)}</strong>
                <span>${_relTime(t.last_at)}</span>
            </div>
            <p class="user-thread-preview">${_esc((t.last_message || '').slice(0, 70))}${(t.last_message || '').length > 70 ? '…' : ''}</p>
        </div>
    `).join('');
}

async function openUserThread(threadId) {
    _activeUserThreadId = threadId;

    try {
        const res  = await _inboxRequest(`${_MSG_API}/userThread`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thread_id: threadId })
        });
        const data = await res.json();
        renderUserThreadView(data.messages || []);

        // Mark as read
        await _inboxRequest(`${_MSG_API}/markRead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thread_id: threadId })
        });
    } catch (err) {
        console.error('Failed to open thread:', err);
    }
}

function renderUserThreadView(messages) {
    const listEl = document.getElementById('userInboxThreadsList');
    const viewEl = document.getElementById('userInboxThreadView');
    if (listEl) listEl.style.display = 'none';
    if (viewEl) viewEl.style.display = 'block';

    const msgsEl = document.getElementById('userThreadMessages');
    if (!msgsEl) return;

    const username = localStorage.getItem('currentUser') || '';
    msgsEl.innerHTML = messages.map(msg => `
        <div class="message-bubble ${msg.sender_id === username ? 'outgoing' : 'incoming'}">
            <div class="bubble-meta">
                <strong>${_esc(msg.sender_name)}</strong>
                <span>${_relTime(msg.created_at)}</span>
            </div>
            <div class="bubble-content">${_esc(msg.content)}</div>
        </div>
    `).join('');
    msgsEl.scrollTop = msgsEl.scrollHeight;
}

function closeUserThread() {
    _activeUserThreadId = null;
    const listEl = document.getElementById('userInboxThreadsList');
    const viewEl = document.getElementById('userInboxThreadView');
    if (listEl) listEl.style.display = 'block';
    if (viewEl) viewEl.style.display = 'none';
    const replyEl = document.getElementById('userReplyContent');
    if (replyEl) replyEl.value = '';
}

async function sendUserReply() {
    const content = document.getElementById('userReplyContent')?.value.trim();
    if (!content || !_activeUserThreadId) return;

    const btn = document.getElementById('userReplyBtn');
    if (btn) btn.disabled = true;

    try {
        await _inboxRequest(`${_MSG_API}/userReply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ thread_id: _activeUserThreadId, content })
        });
        const replyEl = document.getElementById('userReplyContent');
        if (replyEl) replyEl.value = '';
        await openUserThread(_activeUserThreadId);
    } catch (err) {
        console.error('Failed to send reply:', err);
    } finally {
        if (btn) btn.disabled = false;
    }
}

/* Helpers */
function _esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function _relTime(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'Just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

