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

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // For now, just clear the form and redirect to main.html
    console.log('Login submitted with username:', username);
    
    // Redirect to main.html
    window.location.href = 'html/main.html';
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();
    
    // Get form values
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const jwtToken = document.getElementById('jwtToken').value;
    
    // For now, just clear the form and redirect to main.html
    console.log('Register submitted with username:', username);
    
    // Redirect to main.html
    window.location.href = 'html/main.html';
}
