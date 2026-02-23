document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.gallery-scroll-container');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const items = document.querySelectorAll('.gallery-scroll-item');

    // Auto-scroll logic
    let scrollInterval;
    let isHovering = false;
    let autoScrollSpeed = 2; // Pixels per frame

    function autoScroll() {
        if (!isHovering && scrollContainer) {
            // Check if reached end
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1) {
                // Reset to start smoothly or instantly? Instant loop is hard without cloning.
                // Let's scroll back to start
                scrollContainer.scrollLeft = 0;
            } else {
                scrollContainer.scrollLeft += 1; // Slow scroll
            }
        }
    }

    // Optional: Enable auto-scroll (Commented out for now as user asked for "optional auto-scroll animation", simpler is button click scroll)
    // To make it smooth continuous loop requires cloning.
    // For simple "auto-scroll animation", maybe just scroll every X seconds to next item?

    // Let's implement button navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const itemWidth = items[0].offsetWidth + 20; // Width + gap
            scrollContainer.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const itemWidth = items[0].offsetWidth + 20;
            scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });
    }

    // Auto-scroll every 3 seconds
    setInterval(() => {
        if (!isHovering && window.innerWidth > 768) { // Only on desktop
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            if (scrollContainer.scrollLeft >= maxScroll - 10) {
                scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const itemWidth = items[0].offsetWidth + 20;
                scrollContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }
    }, 4000);

    // Pause on hover
    if (scrollContainer) {
        scrollContainer.addEventListener('mouseenter', () => isHovering = true);
        scrollContainer.addEventListener('mouseleave', () => isHovering = false);

        // Touch events for mobile to pause
        scrollContainer.addEventListener('touchstart', () => isHovering = true);
        scrollContainer.addEventListener('touchend', () => setTimeout(() => isHovering = false, 2000));
    }

    // Lightbox functionality for home gallery
    const galleryImages = Array.from(items).map(item => item.querySelector('img').src);
    let currentLightboxIndex = 0;

    // Create lightbox DOM
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
        <div class="lightbox-content">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
            <img src="" alt="Lightbox View" class="lightbox-img">
        </div>
        <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrevBtn = lightbox.querySelector('.lightbox-prev');
    const lightboxNextBtn = lightbox.querySelector('.lightbox-next');

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = galleryImages[currentLightboxIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent scrolling behind
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }

    function showNext() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    }

    function showPrev() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex];
    }

    // Attach click events to highlight images
    items.forEach((item, index) => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Close when clicking outside of the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
