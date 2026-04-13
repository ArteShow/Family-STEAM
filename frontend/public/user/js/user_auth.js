function resolveAuthApiBaseUrl() {
    const fromWindow = window.__API_BASE_URL__;
    if (typeof fromWindow === 'string' && fromWindow.trim() !== '') {
        return fromWindow.replace(/\/$/, '');
    }

    const host = window.location.hostname;
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(host);
    const isPrivateIPv4 = /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host);
    const isDevLikeHost = isLocalHost || isPrivateIPv4 || host.endsWith('.local');

    if (isDevLikeHost) {
        return `${window.location.protocol}//${host}:8000/api/v1`;
    }

    return `${window.location.origin}/api/v1`;
}

const API_BASE_URL = resolveAuthApiBaseUrl();

async function postAuth(path, payload) {
    const request = function (baseUrl) {
        return fetch(`${baseUrl}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    };

    const firstRes = await request(API_BASE_URL);
    if (firstRes.status !== 405 || /:8000\//.test(API_BASE_URL)) {
        return firstRes;
    }

    // Fallback for dev servers that serve static pages on a non-API port.
    const fallbackBase = `${window.location.protocol}//${window.location.hostname}:8000/api/v1`;
    return request(fallbackBase);
}

let isRegisterSubmitting = false;

// --- Auth state guard: redirect to settings if already logged in ---
(function () {
    const token = localStorage.getItem('authToken');
    if (token) {
        window.location.replace('/user/settings.html');
    }
})();

// --- Tab switching ---
function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    const formId = tab === 'login' ? 'loginForm' : 'registerForm';
    const tabId  = tab === 'login' ? 'loginTab'  : 'registerTab';

    const formEl = document.getElementById(formId);
    const tabEl  = document.getElementById(tabId);
    if (formEl) formEl.classList.add('active');
    if (tabEl)  tabEl.classList.add('active');
    clearMsg();
}

// --- Show/hide password toggle ---
function togglePw(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.innerHTML = isText
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
}

// --- Message helper ---
function showMsg(text, type) {
    // Show message in the currently-active form's message div
    const activeForm = document.querySelector('.auth-form.active');
    const el = activeForm
        ? activeForm.querySelector('.auth-msg')
        : document.getElementById('loginMsg');
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-msg ' + type;
    el.style.display = 'block';
}

function clearMsg() {
    document.querySelectorAll('.auth-msg').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// --- Login ---
async function handleLogin(event) {
    event.preventDefault();
    clearMsg();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showMsg('Please fill in all fields.', 'error');
        return;
    }

    try {
        const res = await postAuth('/auth/login', { username, password });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showMsg(data.message || data.error || 'Login failed. Check your credentials.', 'error');
            return;
        }

        localStorage.setItem('authToken', data.token || '');
        localStorage.setItem('currentUser', username);
        window.location.replace('/user/settings.html');
    } catch {
        showMsg('Network error. Please try again.', 'error');
    }
}

// --- Register ---
async function handleRegister(event) {
    event.preventDefault();
    if (isRegisterSubmitting) return;

    clearMsg();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (!username || !password || !confirm) {
        showMsg('Please fill in all fields.', 'error');
        return;
    }

    if (password !== confirm) {
        showMsg('Passwords do not match.', 'error');
        return;
    }

    if (password.length < 6) {
        showMsg('Password must be at least 6 characters.', 'error');
        return;
    }

    isRegisterSubmitting = true;

    try {
        const res = await postAuth('/auth/user-register', { username, password });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            showMsg(data.message || data.error || 'Registration failed. Username may already exist.', 'error');
            return;
        }

        showMsg('Account created! You can now sign in.', 'success');
        setTimeout(() => switchTab('login'), 1500);
    } catch {
        showMsg('Network error. Please try again.', 'error');
    } finally {
        isRegisterSubmitting = false;
    }
}

// --- Wire up tab buttons ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab buttons use inline onclick="switchTab('login')" but also handle data-tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab) {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        }
    });
    // Forms use inline onsubmit handlers in auth.html, so we intentionally
    // avoid adding extra submit listeners here to prevent duplicate requests.
});
