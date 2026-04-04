// Update this to your deployed Render/Railway backend URL
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:' || window.location.hostname === '';
const API_URL = isLocalhost ? 'http://localhost:8000' : 'https://events-by-patel.onrender.com';

class Api {
    static async handleAuthError(response) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            if (!window.location.href.includes('login.html')) {
                window.location.href = 'login.html?expired=1';
            }
        }
        return response;
    }

    static async get(endpoint, requireAuth = false) {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'GET',
                headers: headers
            });
            await Api.handleAuthError(response);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Get Error:', error);
            throw error;
        }
    }

    static async post(endpoint, data, requireAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            return await Api.handleAuthError(response);
        } catch (error) {
            console.error('API Post Error:', error);
            throw error;
        }
    }

    static async put(endpoint, data, requireAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            });
            return await Api.handleAuthError(response);
        } catch (error) {
            console.error('API Put Error:', error);
            throw error;
        }
    }

    static async patch(endpoint, data, requireAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PATCH',
                headers: headers,
                body: data ? JSON.stringify(data) : null
            });
            return await Api.handleAuthError(response);
        } catch (error) {
            console.error('API Patch Error:', error);
            throw error;
        }
    }

    static async delete(endpoint, requireAuth = false) {
        const headers = { 'Content-Type': 'application/json' };
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });
            return await Api.handleAuthError(response);
        } catch (error) {
            console.error('API Delete Error:', error);
            throw error;
        }
    }
}
