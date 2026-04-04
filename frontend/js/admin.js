// API_URL is provided globally by api.js

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    // Tab switching
    window.switchTab = function (tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
        document.getElementById(tabId + '-tab').style.display = 'block';

        document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
        // Find links calling switchTab with this id (simple selector)
        // Or specific logic. Just make current one active.

        if (tabId === 'services') fetchServices();
        if (tabId === 'gallery') fetchGallery();
        if (tabId === 'bookings') fetchBookings();
        if (tabId === 'users') fetchUsers();
    };

    switchTab('services'); // Default tab


    // Logout
    window.logout = function () {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    };

    setupModals();
});

async function checkAdmin() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (role !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }
}

// --- SERVICES ---
async function fetchServices() {
    const list = document.getElementById('admin-services-list');
    list.innerHTML = 'Loading...';
    try {
        const services = await Api.get('/services/');
        function getServiceImage(name, category, providedUrl) {
            if (providedUrl && providedUrl.startsWith('images/')) return providedUrl;
            const lowerName = (name + ' ' + (category || '')).toLowerCase();
            if (lowerName.includes('wedding')) return 'images/wedding/img4.jpeg';
            if (lowerName.includes('birthday')) return 'images/birthday/img28.jpeg';
            if (lowerName.includes('corporate')) return 'images/corporate/img35.jpeg';
            if (lowerName.includes('baby')) return 'images/baby-shower/img20.jpeg';
            if (lowerName.includes('anniversary')) return 'images/anniversery/img27.jpeg';
            if (lowerName.includes('decor') || lowerName.includes('home')) return 'images/home-decor-welcome/img78.jpeg';
            return 'images/wedding/img1.jpeg';
        }

        list.innerHTML = services.map(s => {
            const imgSrc = getServiceImage(s.name, s.category, s.image_url);
            return `
            <div class="admin-card" style="background:#fff; padding:15px; border:1px solid #ddd; border-radius:8px;">
                <img src="${imgSrc}" style="width:100%; height:150px; object-fit:cover; border-radius:4px; margin-bottom:10px;">
                <h4>${s.name}</h4>
                <button class="btn" style="padding:5px 10px; font-size:0.8rem;" onclick="deleteService(${s.id})">Delete</button>
            </div>
            `;
        }).join('');
    } catch (e) {
        list.innerHTML = 'Error loading services.';
        console.error(e);
    }
}

async function deleteService(id) {
    if (!confirm('Delete this service?')) return;
    try {
        // We assumed Api object exists from api.js
        // Need DELETE method in api.js? Check step 510/228.
        // Assuming Api.delete doesn't exist, use fetch directly with token
        await secureFetch(`/services/${id}`, 'DELETE');
        fetchServices();
    } catch (e) {
        alert('Failed to delete');
    }
}

// --- GALLERY ---
async function fetchGallery() {
    const grid = document.getElementById('admin-gallery-grid');
    grid.innerHTML = 'Loading...';
    try {
        const items = await Api.get('/gallery/');
        grid.innerHTML = items.map(item => `
            <div class="admin-card" style="position:relative;">
                <img src="${item.image_url}" style="width:100%; height:150px; object-fit:cover; border-radius:4px;">
                <button onclick="deleteGalleryItem(${item.id})" style="position:absolute; top:5px; right:5px; background:red; color:white; border:none; border-radius:50%; width:25px; height:25px; cursor:pointer;">&times;</button>
                <p style="text-align:center; font-size:0.8rem; margin-top:5px;">${item.title || ''}</p>
            </div>
        `).join('');
    } catch (e) {
        grid.innerHTML = 'Error loading gallery.';
    }
}

async function deleteGalleryItem(id) {
    if (!confirm('Delete image?')) return;
    try {
        await secureFetch(`/gallery/${id}`, 'DELETE');
        fetchGallery();
    } catch (e) {
        alert('Failed to delete');
    }
}

// --- BOOKINGS ---
async function fetchBookings() {
    const tbody = document.getElementById('admin-bookings-table');
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Loading...</td></tr>';
    try {
        const bookings = await Api.get('/admin/bookings', true);
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding: 20px;">No bookings found yet.</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${b.id}</td>
                <td style="padding:10px;">User #${b.user_id}</td>
                <td style="padding:10px;">${b.service ? b.service.name : 'Unknown Service'}</td>
                <td style="padding:10px;">${new Date(b.event_date).toLocaleDateString()}</td>
                <td style="padding:10px;">${b.time || '-'}</td>
                <td style="padding:10px;">${b.location || '-'}</td>
                <td style="padding:10px;">${b.package || '-'}</td>
                <td style="padding:10px;">
                    <select onchange="updateBookingStatus(${b.id}, this.value)" style="padding:5px; border-radius:4px; border:1px solid #ccc;">
                        <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                        <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
            </tr>
            ${b.special_requests ? `<tr><td colspan="8" style="padding:5px 10px 15px 10px; color:#555; border-bottom:1px solid #eee; font-size:0.9em;"><strong>Note:</strong> ${b.special_requests}</td></tr>` : ''}
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red;">Error loading bookings (Are you Admin?)</td></tr>';
    }
}

async function updateBookingStatus(id, newStatus) {
    try {
        const res = await secureFetch(`/admin/bookings/${id}/status`, 'PATCH', JSON.stringify({ status: newStatus }));
        if (res.ok) {
            alert('Status updated successfully');
        } else {
            alert('Failed to update status');
            fetchBookings(); // Revert back
        }
    } catch (e) {
        alert('Error updating status');
        fetchBookings(); // Revert back
    }
}

// --- MODALS & FORMS ---
const serviceModal = document.getElementById('service-modal');
const galleryModal = document.getElementById('gallery-modal');

window.openServiceModal = () => serviceModal.style.display = 'block';
window.closeServiceModal = () => serviceModal.style.display = 'none';
window.openGalleryModal = () => galleryModal.style.display = 'block';
window.closeGalleryModal = () => galleryModal.style.display = 'none';

function setupModals() {
    // Service Form
    document.getElementById('service-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('service-name').value;
        const category = document.getElementById('service-category').value;
        const price = document.getElementById('service-price').value;
        const desc = document.getElementById('service-desc').value;
        const urlInput = document.getElementById('service-image-url');

        let imageUrl = urlInput.value.trim();

        if (imageUrl !== '' && !imageUrl.startsWith('images/')) {
            alert('Error: Image path must start with "images/". Please use a path like "images/wedding/img1.jpeg"');
            return;
        }

        try {
            const data = { name, category, price: parseFloat(price), description: desc, image_url: imageUrl };
            await Api.post('/services/', data, true);

            closeServiceModal();
            fetchServices();
            e.target.reset();
        } catch (err) {
            alert('Error saving service: ' + err.message);
        }
    });

    // Gallery Form
    document.getElementById('gallery-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('gallery-title').value;
        const urlInput = document.getElementById('gallery-image-url');

        const imageUrl = urlInput.value.trim();

        if (!imageUrl.startsWith('images/')) {
            alert('Error: Image path must start with "images/". Please use a path like "images/wedding/img1.jpeg"');
            return;
        }

        try {
            await Api.post('/gallery/', { title, image_url: imageUrl }, true);

            closeGalleryModal();
            fetchGallery();
            e.target.reset();
        } catch (err) {
            alert('Error saving image: ' + err.message);
        }
    });

    // Close on outside click
    window.onclick = (e) => {
        if (e.target == serviceModal) closeServiceModal();
        if (e.target == galleryModal) closeGalleryModal();
    };
}

// --- HELPERS ---
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/admin/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.url;
}

async function secureFetch(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body
    });
    if (!res.ok) throw new Error('Request failed');
    return res;
}

// --- USERS ---
async function fetchUsers() {
    const tbody = document.getElementById('admin-users-table');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading...</td></tr>';
    try {
        const users = await Api.get('/admin/users', true);
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 20px;">No users found.</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(u => `
            <tr style="border-bottom:1px solid #eee;">
                <td style="padding:10px;">${u.id}</td>
                <td style="padding:10px;">${u.username}</td>
                <td style="padding:10px;">${u.email}</td>
                <td style="padding:10px;">${u.phone_number || '-'}</td>
                <td style="padding:10px;">
                    <span style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:0.8em; background:${u.is_superuser ? '#cce5ff' : '#eee'}; color:${u.is_superuser ? '#004085' : '#333'}">${u.is_superuser ? 'Admin' : 'Customer'}</span>
                </td>
                <td style="padding:10px;">
                    <span style="display:inline-block; padding:3px 8px; border-radius:12px; font-size:0.8em; background:${u.is_active ? '#d4edda' : '#f8d7da'}; color:${u.is_active ? '#155724' : '#721c24'}">${u.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td style="padding:10px;">
                    <button onclick="toggleUserRole(${u.id}, ${u.is_superuser})" class="btn" style="padding:5px 10px; font-size:0.8em; margin-right:5px; background:var(--primary-color);">Make ${u.is_superuser ? 'Customer' : 'Admin'}</button>
                    <button onclick="toggleUserStatus(${u.id}, ${u.is_active})" class="btn" style="padding:5px 10px; font-size:0.8em; margin-right:5px; background:#ffc107; color:#000;">${u.is_active ? 'Deactivate' : 'Activate'}</button>
                    <button onclick="deleteUser(${u.id})" class="btn" style="padding:5px 10px; font-size:0.8em; background:#dc3545; color:#fff;">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Error loading users (Are you Admin?)</td></tr>';
    }
}

async function toggleUserRole(id, currentIsSuperuser) {
    if (!confirm(`Are you sure you want to make this user a ${currentIsSuperuser ? 'Customer' : 'Admin'}?`)) return;
    try {
        await Api.put(`/admin/users/${id}`, { is_superuser: !currentIsSuperuser }, true);
        fetchUsers();
    } catch (e) {
        alert('Failed to update role');
    }
}

async function toggleUserStatus(id, currentIsActive) {
    if (!confirm(`Are you sure you want to ${currentIsActive ? 'deactivate' : 'activate'} this user?`)) return;
    try {
        await Api.put(`/admin/users/${id}`, { is_active: !currentIsActive }, true);
        fetchUsers();
    } catch (e) {
        alert('Failed to update status');
    }
}

async function deleteUser(id) {
    if (!confirm('Are you ABSOLUTELY sure you want to delete this user completely? This cannot be undone.')) return;
    try {
        await Api.delete(`/admin/users/${id}`, true);
        fetchUsers();
    } catch (e) {
        alert('Failed to delete user. Make sure you are not trying to delete your own account.');
    }
}
