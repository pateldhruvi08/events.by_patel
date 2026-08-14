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

        if (tabId === 'dashboard') fetchStats();
        if (tabId === 'services') fetchServices();
        if (tabId === 'gallery') fetchGallery();
        if (tabId === 'bookings') fetchBookings();
        if (tabId === 'users') fetchUsers();
    };

    switchTab('dashboard'); // Default tab


    // Logout
    window.logout = function () {
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    };

    setupModals();
});

async function checkAdmin() {
    // Login check bypassed for direct access
    return;
}


// --- DASHBOARD STATS ---
async function fetchStats() {
    const grid = document.getElementById('admin-stats-grid');
    const recentGrid = document.getElementById('admin-recent-uploads');
    if (!grid) return;

    grid.innerHTML = '<p>Loading stats...</p>';
    recentGrid.innerHTML = '';
    
    try {
        const stats = await Api.get('/admin/stats', true);
        grid.innerHTML = `
            <div class="stat-card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
                <i class="fas fa-images" style="font-size:2rem; color:var(--primary-color); margin-bottom:10px;"></i>
                <h3 style="margin:0; font-size:1.2rem; color:#555;">Total Images</h3>
                <p style="font-size:2rem; font-weight:bold; margin:10px 0 0 0; color:#333;">${stats.total_images}</p>
            </div>
            <div class="stat-card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
                <i class="fas fa-calendar-alt" style="font-size:2rem; color:var(--primary-color); margin-bottom:10px;"></i>
                <h3 style="margin:0; font-size:1.2rem; color:#555;">Total Bookings</h3>
                <p style="font-size:2rem; font-weight:bold; margin:10px 0 0 0; color:#333;">${stats.total_bookings}</p>
            </div>
            <div class="stat-card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
                <i class="fas fa-users" style="font-size:2rem; color:var(--primary-color); margin-bottom:10px;"></i>
                <h3 style="margin:0; font-size:1.2rem; color:#555;">Total Users</h3>
                <p style="font-size:2rem; font-weight:bold; margin:10px 0 0 0; color:#333;">${stats.total_users}</p>
            </div>
            <div class="stat-card" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
                <i class="fas fa-concierge-bell" style="font-size:2rem; color:var(--primary-color); margin-bottom:10px;"></i>
                <h3 style="margin:0; font-size:1.2rem; color:#555;">Services</h3>
                <p style="font-size:2rem; font-weight:bold; margin:10px 0 0 0; color:#333;">${stats.total_services}</p>
            </div>
        `;
        
        if (stats.recent_uploads.length > 0) {
            recentGrid.innerHTML = stats.recent_uploads.map(img => `
                <div style="background:#fff; padding:10px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <img src="${img.image_url.startsWith('http') || img.image_url.startsWith('data:') ? img.image_url : (img.image_url.startsWith('static/') ? API_URL + '/' + img.image_url : '../' + img.image_url)}" style="width:100%; height:100px; object-fit:cover; border-radius:4px;">
                    <p style="font-size:0.8rem; text-align:center; margin:5px 0 0 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${img.title || 'Untitled'}</p>
                </div>
            `).join('');
        } else {
            recentGrid.innerHTML = '<p style="color:#777; grid-column: 1 / -1;">No recent uploads.</p>';
        }
    } catch (e) {
        grid.innerHTML = '<p style="color:red;">Failed to load statistics.</p>';
        console.error("Stats Error:", e);
    }
}

// --- SERVICES ---
async function fetchServices() {
    const list = document.getElementById('admin-services-list');
    list.innerHTML = 'Loading...';
    try {
        const services = await Api.get('/services/');
        function getServiceImage(name, category, providedUrl) {
            if (providedUrl && (providedUrl.startsWith('images/') || providedUrl.startsWith('static/') || providedUrl.startsWith('http') || providedUrl.startsWith('data:'))) {
                 if (providedUrl.startsWith('static/')) return API_URL + '/' + providedUrl;
                 if (providedUrl.startsWith('http') || providedUrl.startsWith('data:')) return providedUrl;
                 return '../' + providedUrl;
            }
            const lowerName = (name + ' ' + (category || '')).toLowerCase();
            if (lowerName.includes('kanku')) return '../images/kanku pagla/img06.jpeg';
            if (lowerName.includes('eng') || lowerName.includes('engagement')) return '../images/wedding/img4.jpeg';
            if (lowerName.includes('chhatthi') || lowerName.includes('chatthi')) return '../images/chhatthi pooja/img3.jpeg';
            if (lowerName.includes('wedding')) return '../images/wedding/img4.jpeg';
            if (lowerName.includes('birthday')) return '../images/birthday/img28.jpeg';
            if (lowerName.includes('corporate')) return '../images/corporate/img35.jpeg';
            if (lowerName.includes('baby')) return '../images/baby-shower/img20.jpeg';
            if (lowerName.includes('anniversary')) return '../images/anniversery/img27.jpeg';
            if (lowerName.includes('decor') || lowerName.includes('home')) return '../images/home-decor-welcome/img78.jpeg';
            return '../images/wedding/img1.jpeg';
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
        if (!items || items.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #777;">No images found in the gallery. Click "+ Add Image" to upload one.</p>';
            return;
        }
        grid.innerHTML = items.map(item => {
            const displayUrl = item.image_url.startsWith('http') || item.image_url.startsWith('data:') ? item.image_url : (item.image_url.startsWith('static/') ? API_URL + '/' + item.image_url : '../' + item.image_url);
            return `
            <div class="admin-card" style="position:relative; display:flex; flex-direction:column; background:#fff; border:1px solid #ddd; border-radius:8px; overflow:hidden;">
                <img src="${displayUrl}" style="width:100%; height:150px; object-fit:cover; border-bottom:1px solid #eee;">
                <div style="padding:10px;">
                    <p style="text-align:center; font-size:0.9rem; margin:0 0 10px 0; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.title || 'Untitled'}</p>
                    <div style="display:flex; gap:10px; justify-content:center;">
                        <button onclick="editGalleryItem(${item.id}, '${(item.title || '').replace(/'/g, "\'")}', '${item.image_url}')" class="btn" style="padding:5px 10px; font-size:0.8rem; flex:1;">Edit</button>
                        <button onclick="deleteGalleryItem(${item.id})" class="btn" style="padding:5px 10px; font-size:0.8rem; background:red; flex:1;">Delete</button>
                    </div>
                </div>
            </div>
        `}).join('');
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
                <td style="padding:10px;">${b.user_id ? 'User #' + b.user_id : 'Guest'}</td>
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

window.editGalleryItem = function(id, title, imageUrl) {
    document.getElementById('gallery-modal-title').textContent = 'Edit Image';
    document.getElementById('gallery-id').value = id;
    document.getElementById('gallery-title').value = title;
    document.getElementById('gallery-image-url').value = imageUrl;
    document.getElementById('gallery-image-file').value = '';
    
    const previewContainer = document.getElementById('gallery-preview-container');
    const previewImg = document.getElementById('gallery-preview');
    previewImg.src = imageUrl.startsWith('http') || imageUrl.startsWith('data:') ? imageUrl : (imageUrl.startsWith('static/') ? API_URL + '/' + imageUrl : '../' + imageUrl);
    previewContainer.style.display = 'block';
    
    document.getElementById('gallery-modal').style.display = 'block';
};

window.openGalleryModal = () => {
    document.getElementById('gallery-modal-title').textContent = 'Add Image';
    document.getElementById('gallery-form').reset();
    document.getElementById('gallery-id').value = '';
    document.getElementById('gallery-preview-container').style.display = 'none';
    document.getElementById('gallery-modal').style.display = 'block';
};

window.closeGalleryModal = () => galleryModal.style.display = 'none';

function setupModals() {
    // Service Form
    document.getElementById('service-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('service-name').value;
        const price = document.getElementById('service-price').value;
        const desc = document.getElementById('service-desc').value;
        const urlInput = document.getElementById('service-image-url');

        let imageUrl = urlInput.value.trim();

        if (imageUrl !== '' && !imageUrl.startsWith('images/')) {
            alert('Error: Image path must start with "images/". Please use a path like "images/wedding/img1.jpeg"');
            return;
        }

        try {
            const data = { name, price: parseFloat(price), description: desc, image_url: imageUrl };
            await Api.post('/services/', data, true);

            closeServiceModal();
            fetchServices();
            e.target.reset();
        } catch (err) {
            alert('Error saving service: ' + err.message);
        }
    });

    // Gallery Form
    const galleryFileInput = document.getElementById('gallery-image-file');
    const previewContainer = document.getElementById('gallery-preview-container');
    const previewImg = document.getElementById('gallery-preview');

    galleryFileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewContainer.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('gallery-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('gallery-submit-btn');
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        try {
            const id = document.getElementById('gallery-id').value;
            const title = document.getElementById('gallery-title').value;
            let imageUrl = document.getElementById('gallery-image-url').value.trim();
            const file = galleryFileInput.files[0];

            if (file) {
                // Upload file first
                submitBtn.textContent = 'Uploading...';
                imageUrl = await uploadImage(file);
                // Strip the starting slash if present to make it relative (or keep it depending on frontend config)
                // Actually the API returns /static/uploads/..., let's store it as is, or strip slash.
                // Actually the API now returns Base64 data:image/... URIs which we can store exactly as is!
                // Let's strip only if it's an old-style /static/ path
                if (imageUrl.startsWith('/') && !imageUrl.startsWith('data:')) {
                    imageUrl = imageUrl.substring(1); // 'static/uploads/...'
                }
            } else if (!imageUrl) {
                throw new Error("Please select a file to upload or provide an image path.");
            }

            const data = { title, image_url: imageUrl };

            if (id) {
                // Update
                await secureFetch(`/gallery/${id}`, 'PUT', JSON.stringify(data));
            } else {
                // Create
                await Api.post('/gallery/', data, true);
            }

            closeGalleryModal();
            fetchGallery();
            if(document.getElementById('dashboard-tab').style.display === 'block') fetchStats();
        } catch (err) {
            alert('Error saving image: ' + err.message);
        } finally {
            submitBtn.textContent = 'Save Image';
            submitBtn.disabled = false;
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
