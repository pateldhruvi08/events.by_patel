const API_URL = 'http://localhost:8000';

class Api {
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
            return response;
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
            return response;
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
            return response;
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
            return response;
        } catch (error) {
            console.error('API Delete Error:', error);
            throw error;
        }
    }
}
