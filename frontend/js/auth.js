document.addEventListener('DOMContentLoaded', () => {
    updateNav();

    // Show session expired message if redirected
    if (window.location.href.includes('login.html?expired=1')) {
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) {
            errorMsg.textContent = 'Your session has expired or is invalid. Please log in again.';
            errorMsg.style.display = 'block';
            
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Load CAPTCHA if on login page
    if (document.getElementById('captcha-question')) {
        loadCaptcha();
    }
});

async function loadCaptcha() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`${API_URL}/auth/captcha?t=${timestamp}`, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (response.ok) {
            const data = await response.json();
            document.getElementById('captcha-question').textContent = data.question;
            const tokenInput = document.getElementById('captcha-token');
            if (tokenInput) tokenInput.value = data.token;
            const answerInput = document.getElementById('captcha-answer');
            if (answerInput) answerInput.value = ''; // clear previous answer
        }
    } catch (error) {
        console.error('Failed to load CAPTCHA:', error);
    }
}

async function updateNav() {
    const token = localStorage.getItem('token');
    const navAuth = document.querySelector('.nav-auth');

    if (navAuth) {
        if (token) {
            let isAdmin = localStorage.getItem('role') === 'admin';

            navAuth.innerHTML = `
                <div class="profile-menu">
                    <div class="profile-icon" onclick="toggleDropdown()">
                        <i class="fas fa-user-circle"></i> Profile
                    </div>
                    <div id="profileDropdown" class="dropdown-content">
                        <a href="${isAdmin ? 'admin.html' : 'dashboard.html'}"><i class="fas fa-columns"></i> ${isAdmin ? 'Admin Panel' : 'Dashboard'}</a>
                        <a href="#" onclick="logout(); return false;"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
        } else {
            navAuth.innerHTML = `
                <a href="login.html" class="btn">Login</a>
                <a href="register.html" class="btn btn-secondary">Register</a>
            `;
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Clear captcha state specifically
    const tokenInput = document.getElementById('captcha-token');
    const answerInput = document.getElementById('captcha-answer');
    if (tokenInput) tokenInput.value = '';
    if (answerInput) answerInput.value = '';
    
    // Attempt to clear browser cache if supported
    if ('caches' in window) {
        caches.keys().then(names => {
            for (let name of names) caches.delete(name);
        });
    }

    window.location.href = 'index.html';
}

window.toggleDropdown = function () {
    const dropdown = document.getElementById("profileDropdown");
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

window.onclick = function (event) {
    if (!event.target.closest('.profile-icon')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const captchaAnswer = document.getElementById('captcha-answer').value;
        const captchaToken = document.getElementById('captcha-token').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);
            params.append('captcha_answer', captchaAnswer);
            params.append('captcha_token', captchaToken);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('role', data.role);

                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                const data = await response.json();
                let message = 'Login failed';
                if (data.detail) {
                    if (Array.isArray(data.detail)) {
                        message = data.detail.map(err => err.msg).join(', ');
                    } else {
                        message = data.detail;
                    }
                }
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
                loadCaptcha(); // Reload CAPTCHA on failure
            }
        } catch (error) {
            console.error('Login Error:', error);
            if (error.message.includes('Failed to fetch')) {
                errorMsg.textContent = 'Server unreachable. If testing locally, ensure backend is running. If on Render, please wait up to 50 seconds for it to wake up!';
            } else {
                errorMsg.textContent = 'An error occurred: ' + error.message;
            }
            errorMsg.style.display = 'block';
        }
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            const response = await Api.post('/auth/register', {
                username,
                email,
                password
            });

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                const data = await response.json();
                let message = 'Registration failed';
                if (data.detail) {
                    if (Array.isArray(data.detail)) {
                        message = data.detail.map(err => err.msg).join(', ');
                    } else {
                        message = data.detail;
                    }
                }
                errorMsg.textContent = message;
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error('Registration Error:', error);
            errorMsg.textContent = 'An error occurred: ' + error.message;
            errorMsg.style.display = 'block';
        }
    });
}

// Real Google OAuth Handler
window.handleGoogleLogin = async function(response) {
    const errorMsg = document.getElementById('error-msg');
    try {
        const res = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: response.credential })
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('role', data.role);

            if (data.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } else {
            const data = await res.json();
            errorMsg.textContent = 'Google Login failed: ' + (data.detail || 'Unknown error. Check backend Client ID config.');
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Google Login Error:', error);
        errorMsg.textContent = 'Server unreachable. Ensure backend is running.';
        errorMsg.style.display = 'block';
    }
}
