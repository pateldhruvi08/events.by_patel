let galleryImages = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const items = await Api.get('/gallery/');
        if (items && items.length > 0) {
            galleryImages = items.map(item => {
                let cat = (item.title || '').toLowerCase().replace(/ /g, '-');
                if (cat.includes('eng')) cat = 'engagement-ceremony';
                if (cat.includes('chatthi') || cat.includes('chhatthi')) cat = 'chhatthi-pooja';
                if (cat.includes('kanku')) cat = 'kanku-pagla';
                if (cat.includes('welcome') || cat.includes('decor')) cat = 'home-decor';
                return {
                    src: item.image_url ? (item.image_url.startsWith('http') || item.image_url.startsWith('data:') ? item.image_url : (item.image_url.startsWith('static/') ? API_URL + '/' + item.image_url : item.image_url)) : '',
                    category: cat
                };
            });
        }
    } catch (e) {
        console.error("Failed to fetch gallery images from server", e);
    }
    const galleryGrid = document.querySelector('.gallery-filter-grid');
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');

    if (!galleryGrid) return; // Exit if gallery not present

    let currentImages = [];
    let currentLightboxIndex = 0;

    // Lightbox DOM Elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
        <div class="lightbox-content">
            <button class="lightbox-close"><i class="fas fa-times"></i></button>
            <img src="" alt="Lightbox Image" class="lightbox-img">
        </div>
        <button class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');

    // Likes management
    let likedPhotos = JSON.parse(localStorage.getItem('guestLikedPhotos')) || [];
    const token = localStorage.getItem('token');

    // Function to render images
    async function renderGallery(category = 'all') {

        galleryGrid.innerHTML = ''; // Clear existing
        galleryGrid.style.opacity = '0'; // Fade out effect styling prep

        // Fetch likes if logged in
        if (token) {
            try {
                const serverLikes = await Api.get('/likes/me', true);
                // Keep server source of truth if logged in
                likedPhotos = serverLikes;
            } catch (e) {
                console.error("Failed to load likes from server", e);
            }
        }

        if (category === 'liked') {
            currentImages = galleryImages.filter(img => likedPhotos.includes(img.src));
            if (currentImages.length === 0) {
                galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; font-size: 1.1rem; margin-top: 40px; height: 300px;">No liked photos yet. Click the heart icon on any photo to save it here!</p>';
                galleryGrid.style.opacity = '1';
                return;
            }
        } else {
            currentImages = category === 'all'
                ? galleryImages
                : galleryImages.filter(img => img.category === category);
        }

        currentImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-filter-item';

            // Create image element
            const image = document.createElement('img');
            image.src = img.src;
            image.alt = `${img.category} event`;
            image.loading = 'lazy'; // Performance

            // Overlay for hover
            const overlay = document.createElement('div');
            overlay.className = 'gallery-item-overlay';
            const icon = document.createElement('i');
            icon.className = 'fas fa-search-plus';
            overlay.appendChild(icon);

            // Click overlay to open lightbox
            overlay.addEventListener('click', (e) => {
                // Prevent bubbling if like button was clicked
                if (e.target.closest('.like-btn')) return;
                openLightbox(index);
            });

            // Like Button
            const likeBtn = document.createElement('button');
            const isLiked = likedPhotos.includes(img.src);
            likeBtn.className = `like-btn ${isLiked ? 'liked' : ''}`;
            likeBtn.innerHTML = `<i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>`;

            likeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await toggleLike(img.src, likeBtn);
            });

            overlay.appendChild(likeBtn);

            item.appendChild(image);
            item.appendChild(overlay);
            galleryGrid.appendChild(item);
        });

        // Fade in animation
        setTimeout(() => {
            galleryGrid.style.opacity = '1';
        }, 50);
    }

    async function toggleLike(src, btn) {
        if (token) {
            try {
                const res = await Api.post('/likes/toggle', { image_url: src }, true);
                if (!res.ok) throw new Error("Failed to toggle like");
                if (likedPhotos.includes(src)) {
                    likedPhotos = likedPhotos.filter(s => s !== src);
                } else {
                    likedPhotos.push(src);
                }
            } catch (e) {
                console.error(e);
                alert("Failed to save like.");
                return;
            }
        } else {
            // Guest mode: save to localStorage
            if (likedPhotos.includes(src)) {
                likedPhotos = likedPhotos.filter(s => s !== src);
            } else {
                likedPhotos.push(src);
            }
            localStorage.setItem('guestLikedPhotos', JSON.stringify(likedPhotos));
        }

        const icon = btn.querySelector('i');
        if (likedPhotos.includes(src)) {
            btn.classList.add('liked');
            icon.classList.remove('far');
            icon.classList.add('fas');
        } else {
            btn.classList.remove('liked');
            icon.classList.remove('fas');
            icon.classList.add('far');
            
            // If we are currently in the 'liked' tab, hide the image immediately
            const activeBtn = document.querySelector('.gallery-filter-btn.active');
            if (activeBtn && activeBtn.getAttribute('data-filter') === 'liked') {
                const item = btn.closest('.gallery-filter-item');
                if (item) {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => item.style.display = 'none', 300);
                }
            }
        }
    }

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        if (currentImages.length > 0) {
            lightboxImg.src = currentImages[currentLightboxIndex].src;
        }
    }

    // Lightbox Event Listeners
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % currentImages.length;
        updateLightboxImage();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });

    // Initial render
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter') || 'all';

    // Set correct active button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-filter') === filterParam) {
            btn.classList.add('active');
        }
    });

    renderGallery(filterParam);

    // Filter click events
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            renderGallery(filterValue);
        });
    });
});
