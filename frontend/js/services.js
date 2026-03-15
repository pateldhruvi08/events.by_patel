document.addEventListener('DOMContentLoaded', async () => {
    await fetchServices();
    setupModal();
});

async function fetchServices() {
    const grid = document.getElementById('services-grid');
    const token = localStorage.getItem('token');

    if (!token) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px;">
                <i class="fas fa-lock fa-3x" style="color: #ccc; margin-bottom: 20px;"></i>
                <h3 style="color: var(--secondary-color); margin-bottom: 10px;">Access Restricted</h3>
                <p style="font-size: 1.1rem; color: #666; max-width: 600px; margin: 0 auto 20px auto;">
                    You need to log in to access our Services and Gallery sections. Please <a href="login.html" style="color: var(--primary-color); text-decoration: underline; font-weight: bold;">log in</a> to continue.
                </p>
            </div>`;
        return;
    }

    grid.innerHTML = '<p style="text-align:center; width: 100%;">Loading services...</p>';

    try {
        const services = await Api.get('/services/');

        if (!services || services.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center;"><p>No services found.</p></div>';
            return;
        }

        function getServiceImage(name, category) {
            const lowerName = (name + ' ' + category).toLowerCase();
            if (lowerName.includes('wedding')) return 'images/wedding/img4.jpeg';
            if (lowerName.includes('birthday')) return 'images/birthday/img28.jpeg';
            if (lowerName.includes('corporate')) return 'images/corporate/img35.jpeg';
            if (lowerName.includes('baby')) return 'images/baby-shower/img20.jpeg'; // Baby Shower
            if (lowerName.includes('anniversary')) return 'images/anniversery/img27.jpeg';
            if (lowerName.includes('decor') || lowerName.includes('home')) return 'images/home-decor-welcome/img78.jpeg';
            return 'images/wedding/img1.jpeg'; // Default fallback
        }

        grid.innerHTML = services.map(service => {
            const imgSrc = getServiceImage(service.name, service.category);
            return `
            <div class="service-card">
                <div class="service-img-container">
                    <img src="${imgSrc}" alt="${service.name}" class="service-real-img">
                </div>
                <div class="service-content">
                    <h3 class="service-title">${service.name}</h3>
                    <p class="service-category" style="color: #888; font-size: 0.9em; text-transform: capitalize;">${service.category}</p>
                    <p class="service-desc">${service.description || 'No description available.'}</p>
                    <button class="btn" style="width: 100%; margin-top: 10px;" onclick="openBookingModal(${service.id}, '${service.name}')">Book Now</button>
                </div>
            </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error fetching services:', error);
        grid.innerHTML = '<p>Error loading services. Please populate the database.</p>';
    }
}

const modal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');

function openBookingModal(serviceId, serviceName) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to book a service.');
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('service-id').value = serviceId;
    document.getElementById('service-name').value = serviceName;
    modal.style.display = 'flex';
}

function closeModal() {
    modal.style.display = 'none';
}

function setupModal() {
    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const serviceId = document.getElementById('service-id').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;
        const eventLocation = document.getElementById('event-location').value;
        const eventPackage = document.getElementById('event-package').value;
        const specialRequests = document.getElementById('special-requests').value;

        // Construct event_date string (ISO format for FastAPI)
        const combinedDateTime = `${eventDate}T${eventTime}:00`;

        try {
            const response = await Api.post('/bookings/', {
                service_id: parseInt(serviceId),
                event_date: combinedDateTime,
                time: eventTime,
                location: eventLocation,
                package: eventPackage,
                special_requests: specialRequests
            }, true); // true = requireAuth

            if (response.ok) {
                alert('Booking Confirmed! You can view it in your dashboard.');
                closeModal();
                bookingForm.reset();
            } else {
                const data = await response.json();
                alert('Booking Failed: ' + (data.detail || 'Unknown error'));
            }
        } catch (error) {
            alert('An error occurred during booking.');
            console.error(error);
        }
    });
}
