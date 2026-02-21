// Tab switching functionality
document.getElementById('loginTab').addEventListener('click', function() {
    switchForm('login');
});

document.getElementById('registerTab').addEventListener('click', function() {
    switchForm('register');
});

function switchForm(formType) {
    // Hide all forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');

    if (formType === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000/api/v1/auth`;

function showMessage(message, type = 'error') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.minWidth = '260px';
    toast.style.maxWidth = '360px';
    toast.style.padding = '12px 14px';
    toast.style.borderRadius = '12px';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.color = '#fff';
    toast.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
    toast.style.transition = 'all 0.25s ease';
    toast.style.background = type === 'success'
        ? 'linear-gradient(135deg, #1e9f5d, #24c26a)'
        : 'linear-gradient(135deg, #d84a4a, #ff6b6b)';

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-8px)';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}

async function requestJSON(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    const text = await response.text();
    if (!text) {
        return null;
    }

    return JSON.parse(text);
}

// Handle login form submission
async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const data = await requestJSON(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!data || !data.token) {
            throw new Error('Missing token in login response');
        }

        localStorage.setItem('authToken', data.token);
        localStorage.setItem('currentUser', username);
        window.location.href = 'html/main.html';
    } catch (error) {
        showMessage(error.message || 'Login failed');
    }
}

// Handle register form submission
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const jwtToken = document.getElementById('jwtToken').value;

    if (!jwtToken.trim()) {
        showMessage('JWT token is required for registration');
        return;
    }

    try {
                await requestJSON(`${API_BASE_URL}/register?jwt=${encodeURIComponent(jwtToken.trim())}`, {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        showMessage('Registration successful. Please login.', 'success');
        switchForm('login');
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = '';
    } catch (error) {
        showMessage(error.message || 'Registration failed');
    }
}
