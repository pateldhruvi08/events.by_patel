document.addEventListener('DOMContentLoaded', () => {
    updateNav();
});

async function updateNav() {
    const token = localStorage.getItem('token');
    const navAuth = document.querySelector('.nav-auth');

    if (navAuth) {
        if (token) {
            let isAdmin = false;
            try {
                // If api.js is loaded
                if (typeof Api !== 'undefined') {
                    const user = await Api.get('/users/me', true);
                    isAdmin = user.is_superuser;
                } else {
                    const API_URL = 'http://localhost:8000';
                    const userResponse = await fetch(`${API_URL}/users/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        isAdmin = userData.is_superuser;
                    }
                }
            } catch (e) {
                console.error(e);
            }

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
        const errorMsg = document.getElementById('error-msg');

        try {
            const params = new URLSearchParams();
            params.append('username', username);
            params.append('password', password);

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

                // Check if user is admin
                try {
                    const userResponse = await fetch(`${API_URL}/users/me`, {
                        headers: { 'Authorization': `Bearer ${data.access_token}` }
                    });
                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        if (userData.is_superuser) {
                            window.location.href = 'admin.html';
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Failed to fetch user role", e);
                }

                window.location.href = 'dashboard.html';
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
            }
        } catch (error) {
            console.error('Login Error:', error);
            errorMsg.textContent = 'An error occurred: ' + error.message;
            errorMsg.style.display = 'block';
        }
    });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
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
