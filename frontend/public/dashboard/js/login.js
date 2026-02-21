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

const API_BASE_URL = '/api/v1/auth';

function showMessage(message) {
    alert(message);
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
        await requestJSON(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken.trim()}`
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        showMessage('Registration successful. Please login.');
        switchForm('login');
        document.getElementById('loginUsername').value = username;
        document.getElementById('loginPassword').value = '';
    } catch (error) {
        showMessage(error.message || 'Registration failed');
    }
}
