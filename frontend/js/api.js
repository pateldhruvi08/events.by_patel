const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
// On Vercel, requests to /api are proxied to the backend. Locally, we point to the backend server running on port 8000.
// If you use `vercel dev` locally, you can just use '/api' for both, but we keep this fallback for simple local servers.
const API_URL = isLocalhost ? 'http://localhost:8000/api' : '/api';

class Api {
    static async handleAuthError(response) {
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
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

// // --- Save Contact Modal Logic ---
function initSaveContactModal() {
    // Prevent double initialization
    if (document.getElementById('saveContactModal')) return;

    // 1. Inject the Modal HTML into the body
    const modalHTML = `
    <div id="saveContactModal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:10000; justify-content:center; align-items:center;">
        <div class="contact-modal-content" style="background:#fff; padding:30px; border-radius:16px; width:90%; max-width:420px; box-shadow:0 15px 40px rgba(0,0,0,0.25); position:relative; font-family:inherit;">
            <span id="closeContactModal" style="position:absolute; top:15px; right:20px; font-size:1.8rem; cursor:pointer; color:#94a3b8; line-height:1; transition:color 0.2s;">&times;</span>
            <h3 style="margin-top:0; margin-bottom:20px; color:#1e293b; font-size:1.4rem; display:flex; align-items:center; gap:10px;">
                <i class="fab fa-whatsapp" style="color:#25D366; font-size:1.6rem;"></i> Contact Admin
            </h3>
            <p style="color:#64748b; font-size:0.95rem; margin-bottom:20px; line-height:1.5;">Fill out the details below. We'll save your information and open a direct WhatsApp chat with us.</p>
            <form id="saveContactForm">
                <div class="form-group" style="margin-bottom:15px;">
                    <label for="waName" style="display:block; margin-bottom:6px; font-weight:600; color:#475569; font-size:0.9rem;">Your Name <span style="color:#ef4444;">*</span></label>
                    <input type="text" id="waName" required placeholder="John Doe" style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; outline:none; font-family:inherit; font-size:0.95rem; box-sizing:border-box; transition:border-color 0.2s;">
                </div>
                <div class="form-group" style="margin-bottom:25px;">
                    <label for="waMessage" style="display:block; margin-bottom:6px; font-weight:600; color:#475569; font-size:0.9rem;">Message <span style="color:#ef4444;">*</span></label>
                    <textarea id="waMessage" rows="4" required placeholder="Hi, I'm interested in planning an event..." style="width:100%; padding:12px; border-radius:8px; border:1px solid #cbd5e1; outline:none; font-family:inherit; font-size:0.95rem; box-sizing:border-box; resize:vertical; transition:border-color 0.2s;"></textarea>
                </div>
                <button type="submit" style="width:100%; padding:14px; font-size:1.05rem; background-color:#25D366; color:#fff; border:none; border-radius:8px; cursor:pointer; font-weight:600; display:flex; justify-content:center; align-items:center; gap:10px; transition:all 0.3s ease; box-shadow:0 4px 12px rgba(37, 211, 102, 0.3); font-family:inherit;">
                    <i class="fab fa-whatsapp" style="font-size:1.2rem;"></i> Open WhatsApp
                </button>
            </form>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('saveContactModal');
    const closeBtn = document.getElementById('closeContactModal');
    const form = document.getElementById('saveContactForm');
    const nameInput = document.getElementById('waName');
    const msgInput = document.getElementById('waMessage');

    // Focus input styling
    [nameInput, msgInput].forEach(input => {
        input.addEventListener('focus', () => input.style.borderColor = '#25D366');
        input.addEventListener('blur', () => input.style.borderColor = '#cbd5e1');
    });

    // 2. Add click listeners to all buttons (since navbar can be copied)
    const openBtns = document.querySelectorAll('.header-save-contact-btn');
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Pre-fill if user has saved data previously
            const savedName = localStorage.getItem('savedContactName');
            if(savedName) nameInput.value = savedName;
            
            modal.style.display = 'flex';
            setTimeout(() => nameInput.focus(), 100);
        });
    });

    // 3. Close modal logic
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 4. Form Submission Logic
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const message = msgInput.value.trim();

        // "Save the contact information entered in the form"
        localStorage.setItem('savedContactName', name);
        localStorage.setItem('savedContactMessage', message);

        // Pre-filled message for WhatsApp
        const whatsappNumber = '916351985104'; // Admin's number without +
        const text = `Hello, my name is ${name}. \n${message}`;
        const encodedText = encodeURIComponent(text);

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');

        // Close modal
        closeModal();
    });
}

// Run initialization safely
function initializeApp() {
    initSaveContactModal();
    initMobileMenu();
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
