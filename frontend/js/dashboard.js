document.addEventListener('DOMContentLoaded', async () => {
    checkAuth();
    await fetchUserProfile();
    await fetchUserBookings();
    await fetchUserLikes();
});

function checkAuth() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    if (role === 'admin') {
        window.location.href = 'admin.html';
        return;
    }
}

async function fetchUserProfile() {
    try {
        const user = await Api.get('/users/me', true);
        document.getElementById('user-name-display').textContent = user.username;
        document.getElementById('user-email-display').textContent = user.email;
        document.querySelector('.avatar-circle').textContent = user.profile_photo ? '' : user.username.charAt(0).toUpperCase();

        // Also populate forms in settings tab
        const usernameInput = document.getElementById('setting-username');
        if (usernameInput) {
            usernameInput.value = user.username || '';
            document.getElementById('setting-email').value = user.email || '';
            document.getElementById('setting-phone').value = user.phone_number || '';
            document.getElementById('setting-notif-email').checked = user.notification_email !== false; // defaults to true
            document.getElementById('setting-notif-sms').checked = user.notification_sms === true; // defaults to false
        }
    } catch (error) {
        console.error('Failed to fetch profile', error);
        logout();
    }
}

async function fetchUserBookings() {
    const list = document.getElementById('bookings-list');
    try {
        const bookings = await Api.get('/bookings/', true);

        if (bookings.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666; font-size: 1.1em; padding: 20px;">No bookings yet.</p>';
            return;
        }

        list.innerHTML = bookings.map(booking => {
            const eventDateStr = new Date(booking.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

            let cancelBtnHtml = '';
            const isFuture = new Date(booking.event_date) > new Date();
            if ((booking.status === 'pending' || booking.status === 'confirmed') && isFuture) {
                cancelBtnHtml = `<button onclick="cancelBooking(${booking.id})" class="btn" style="background:#dc3545; color:#fff; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-size:0.9em; transition:0.3s; margin-top:10px;">Cancel Booking</button>`;
            }

            return `
            <div class="booking-card" style="border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div class="booking-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                    <h4 style="margin: 0; font-size: 1.25rem; color: var(--primary-color);">Event: ${booking.service.name}</h4>
                    <span class="status-badge status-${booking.status}" style="padding: 5px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em; text-transform: capitalize; background-color: ${booking.status === 'confirmed' ? '#d4edda' : booking.status === 'completed' ? '#cce5ff' : booking.status === 'cancelled' ? '#f8d7da' : '#fff3cd'}; color: ${booking.status === 'confirmed' ? '#155724' : booking.status === 'completed' ? '#004085' : booking.status === 'cancelled' ? '#721c24' : '#856404'};">${booking.status}</span>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <p style="margin: 0;"><strong><i class="far fa-calendar-alt" style="color: #666; width: 20px;"></i> Date:</strong> <span style="color: #333;">${eventDateStr}</span></p>
                    <p style="margin: 0;"><strong><i class="far fa-clock" style="color: #666; width: 20px;"></i> Time:</strong> <span style="color: #333;">${booking.time || 'Not specified'}</span></p>
                    <p style="margin: 0;"><strong><i class="fas fa-map-marker-alt" style="color: #666; width: 20px;"></i> Location:</strong> <span style="color: #333;">${booking.location || 'Not specified'}</span></p>
                    <p style="margin: 0;"><strong><i class="fas fa-box" style="color: #666; width: 20px;"></i> Package:</strong> <span style="color: #333;">${booking.package || 'Not specified'}</span></p>
                </div>
                ${booking.special_requests ? `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #eee;"><p style="margin: 0; color: #555;"><strong>Note:</strong> ${booking.special_requests}</p></div>` : ''}
                <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>${cancelBtnHtml}</div>
                    <div style="text-align: right; font-size: 0.8rem; color: #999;">
                        Booked on: ${new Date(booking.created_at).toLocaleDateString()}
                    </div>
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Failed to fetch bookings', error);
        list.innerHTML = '<p style="color: red;">Error loading bookings.</p>';
    }
}

async function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            const response = await Api.patch(`/bookings/${bookingId}/cancel`, null, true);
            if (response.ok) {
                alert('Booking has been cancelled.');
                fetchUserBookings(); // Refresh the list
            } else {
                const data = await response.json();
                alert('Failed to cancel: ' + (data.detail || 'Error'));
            }
        } catch (e) {
            console.error(e);
            alert('Error trying to cancel booking');
        }
    }
}

async function fetchUserLikes() {
    const list = document.getElementById('likes-grid');
    try {
        const likes = await Api.get('/likes/me', true);
        if (likes.length === 0) {
            list.innerHTML = '<p>You have not liked any images yet.</p>';
            return;
        }

        list.innerHTML = likes.map(url => `
            <div style="position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); height: 180px;">
                <img src="${url}" style="width: 100%; height: 100%; object-fit: cover;" alt="Liked Image">
                <button onclick="unlikeImage('${url}')" style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 35px; height: 35px; cursor: pointer; color: #e74c3c; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="Unlike Image">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Failed to fetch likes', error);
        list.innerHTML = '<p>Error loading liked images.</p>';
    }
}

async function unlikeImage(url) {
    if (!confirm("Are you sure you want to unlike this image?")) return;
    try {
        const response = await Api.post('/likes/toggle', { image_url: url }, true);
        if (response.ok) {
            // Also maintain local storage for gallery sync logic
            let localLikes = JSON.parse(localStorage.getItem('liked_photos') || '[]');
            localLikes = localLikes.filter(s => s !== url);
            localStorage.setItem('liked_photos', JSON.stringify(localLikes));

            fetchUserLikes(); // immediately refresh grid
        } else {
            alert('Failed to unlike image');
        }
    } catch (e) {
        console.error(e);
        alert('An error occurred');
    }
}


function switchTab(tab) {
    document.getElementById('tab-bookings').style.display = tab === 'bookings' ? 'block' : 'none';
    document.getElementById('tab-likes').style.display = tab === 'likes' ? 'block' : 'none';
    document.getElementById('tab-settings').style.display = tab === 'settings' ? 'block' : 'none';

    const navLinks = document.querySelectorAll('.sidebar-nav a');
    navLinks.forEach(link => link.classList.remove('active'));

    if (tab === 'bookings') {
        navLinks[0].classList.add('active');
    } else if (tab === 'likes') {
        navLinks[1].classList.add('active');
    } else if (tab === 'settings') {
        navLinks[2].classList.add('active');
    }
}

// Settings form submit
const settingsForm = document.getElementById('settings-form');
if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            username: document.getElementById('setting-username').value,
            email: document.getElementById('setting-email').value,
            phone_number: document.getElementById('setting-phone').value,
            notification_email: document.getElementById('setting-notif-email').checked,
            notification_sms: document.getElementById('setting-notif-sms').checked
        };

        try {
            const response = await Api.put('/users/me', payload, true);
            if (response.ok) {
                alert('Profile settings updated successfully!');
                fetchUserProfile(); // Refresh display
            } else {
                const data = await response.json();
                alert('Failed to update profile: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            console.error('Settings update error', error);
            alert('An error occurred while updating settings.');
        }
    });
}

const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const oldPwd = document.getElementById('current-password').value;
        const newPwd = document.getElementById('new-password').value;
        const statusMsg = document.getElementById('pwd-status-msg');
        const btn = e.target.querySelector('button');

        btn.textContent = 'Updating...';
        btn.disabled = true;

        try {
            const res = await Api.post('/auth/change-password', {
                old_password: oldPwd,
                new_password: newPwd
            }, true); // Send token using the 3rd argument 'true'

            if (res.ok) {
                statusMsg.textContent = "Password changed successfully!";
                statusMsg.style.display = 'block';
                statusMsg.style.backgroundColor = '#d4edda';
                statusMsg.style.color = '#155724';
                e.target.reset();
            } else {
                const data = await res.json();
                statusMsg.textContent = data.detail || "Failed to change password";
                statusMsg.style.display = 'block';
                statusMsg.style.backgroundColor = '#f8d7da';
                statusMsg.style.color = '#721c24';
            }
        } catch (error) {
            statusMsg.textContent = "An error occurred";
            statusMsg.style.display = 'block';
            statusMsg.style.backgroundColor = '#f8d7da';
            statusMsg.style.color = '#721c24';
        } finally {
            btn.textContent = 'Change Password';
            btn.disabled = false;
        }
    });
}

// Delete account function
async function deleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
        try {
            const response = await Api.delete('/users/me', true);
            if (response.ok) {
                alert('Your account has been successfully deleted.');
                logout();
            } else {
                alert('Failed to delete account.');
            }
        } catch (error) {
            alert('An error occurred during account deletion.');
            console.error(error);
        }
    }
}
