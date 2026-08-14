document.addEventListener('DOMContentLoaded', async () => {
    await fetchServices();
    setupModal();
});

const FALLBACK_SERVICES = [
    { id: 1, name: "Wedding Planning", description: "Complete wedding decoration including floral arrangements, stage setup, and lighting.", price: 5000.0, category: "Wedding" },
    { id: 2, name: "Corporate Events", description: "Professional setup for corporate events, including podiums, backdrops, and seating.", price: 2500.0, category: "Corporate" },
    { id: 3, name: "Birthday Decoration", description: "Colorful and fun decorations for birthday parties of all ages.", price: 800.0, category: "Birthday" },
    { id: 4, name: "Baby Shower", description: "Celebrate the arrival of your little one with themed decorations and games.", price: 1200.0, category: "Baby Shower" },
    { id: 5, name: "Anniversary", description: "Timeless and romantic decorations for your special milestone.", price: 1500.0, category: "Anniversary" },
    { id: 6, name: "Home Decor", description: "Add festive charm to your home for pujas, festivals, and gatherings.", price: 2000.0, category: "Home Decor" }
];

async function fetchServices() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    grid.innerHTML = '<p style="text-align:center; width: 100%;">Loading services...</p>';

    let services = [];
    try {
        // Fetch from backend with a 4-second timeout for serverless cold starts
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
        services = await Promise.race([Api.get('/services/'), timeoutPromise]);
    } catch (error) {
        console.warn('Backend fetch failed or timed out. Using fallback services.', error);
    }

    if (!services || services.length === 0) {
        services = FALLBACK_SERVICES;
    }

        function getServiceImage(service) {
            if (service.image_url) {
                return service.image_url.startsWith('http') ? service.image_url : (service.image_url.startsWith('static/') ? API_URL + '/' + service.image_url : service.image_url);
            }
            const name = service.name || '';
            const category = service.category || '';
            const lowerName = (name + ' ' + category).toLowerCase();
            if (lowerName.includes('kanku')) return 'images/kanku pagla/img06.jpeg';
            if (lowerName.includes('eng') || lowerName.includes('engagement')) return 'images/wedding/img4.jpeg';
            if (lowerName.includes('chhatthi') || lowerName.includes('chatthi')) return 'images/chhatthi pooja/img3.jpeg';
            if (lowerName.includes('wedding')) return 'images/wedding/img4.jpeg';
            if (lowerName.includes('birthday')) return 'images/birthday/img28.jpeg';
            if (lowerName.includes('corporate')) return 'images/corporate/img35.jpeg';
            if (lowerName.includes('baby')) return 'images/baby-shower/img20.jpeg'; // Baby Shower
            if (lowerName.includes('anniversary')) return 'images/anniversery/img27.jpeg';
            if (lowerName.includes('decor') || lowerName.includes('home')) return 'images/home-decor-welcome/img78.jpeg';
            return 'images/wedding/img1.jpeg'; // Default fallback
        }

        grid.innerHTML = services.map(service => {
            const imgSrc = getServiceImage(service);
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


}

const modal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');

function openBookingModal(serviceId, serviceName) {
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

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Processing...';
        submitBtn.disabled = true;

        try {
            const serviceId = document.getElementById('service-id').value;
            const serviceName = document.getElementById('service-name').value;
            const customerName = document.getElementById('customer-name').value;
            const customerPhone = document.getElementById('customer-phone').value;
            
            const eventDate = document.getElementById('event-date').value;
            const eventTime = document.getElementById('event-time').value;
            const eventLocation = document.getElementById('event-location').value;
            const eventPackage = document.getElementById('event-package').value;
            const specialRequests = document.getElementById('special-requests').value;

            // Combine date and time for backend datetime
            const eventDateTime = new Date(`${eventDate}T${eventTime || '00:00'}`).toISOString();
            const combinedRequests = `Customer: ${customerName} (${customerPhone}). Requests: ${specialRequests}`;

            // 2. Store booking in database via API (Public Endpoint)
            await Api.post('/bookings/', {
                service_id: parseInt(serviceId),
                event_date: eventDateTime,
                time: eventTime,
                location: eventLocation,
                package: eventPackage,
                special_requests: combinedRequests
            }, false);

            // 3. Construct enriched WhatsApp Message
            let message = `Hello! I would like to book a service with Event's By Patel.\n\n`;
            message += `*Customer Details:*\n`;
            message += `- Name: ${customerName}\n`;
            message += `- Phone: ${customerPhone}\n\n`;
            
            message += `*Booking Details:*\n`;
            message += `- Service: ${serviceName}\n`;
            message += `- Date: ${eventDate}\n`;
            message += `- Time: ${eventTime}\n`;
            message += `- Location: ${eventLocation}\n`;
            message += `- Package: ${eventPackage}\n`;
            if (specialRequests) {
                message += `- Special Requests: ${specialRequests}\n`;
            }

            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = "916351985104"; // Admin's WhatsApp number
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');

            alert('Booking stored successfully! Redirecting you to WhatsApp to complete your booking.');
            closeModal();
            bookingForm.reset();
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Failed to process booking. Please try again or contact support.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}
