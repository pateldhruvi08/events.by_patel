const galleryImages = [
    { src: 'images/wedding/img1.jpeg', category: 'wedding' },
    { src: 'images/wedding/img10.jpeg', category: 'wedding' },
    { src: 'images/wedding/img100.jpeg', category: 'wedding' },
    { src: 'images/wedding/img11.jpeg', category: 'wedding' },
    { src: 'images/wedding/img12.jpeg', category: 'wedding' },
    { src: 'images/wedding/img13.jpeg', category: 'wedding' },
    { src: 'images/wedding/img14.jpeg', category: 'wedding' },
    { src: 'images/wedding/img15.jpeg', category: 'wedding' },
    { src: 'images/wedding/img16.jpeg', category: 'wedding' },
    { src: 'images/wedding/img17.jpeg', category: 'wedding' },
    { src: 'images/wedding/img2.jpeg', category: 'wedding' },
    { src: 'images/wedding/img3.jpeg', category: 'wedding' },
    { src: 'images/wedding/img4.jpeg', category: 'wedding' },
    { src: 'images/wedding/img5.jpeg', category: 'wedding' },
    { src: 'images/wedding/img57.jpeg', category: 'wedding' },
    { src: 'images/wedding/img58.jpeg', category: 'wedding' },
    { src: 'images/wedding/img59.jpeg', category: 'wedding' },
    { src: 'images/wedding/img6.jpeg', category: 'wedding' },
    { src: 'images/wedding/img60.jpeg', category: 'wedding' },
    { src: 'images/wedding/img61.jpeg', category: 'wedding' },
    { src: 'images/wedding/img62.jpeg', category: 'wedding' },
    { src: 'images/wedding/img63.jpeg', category: 'wedding' },
    { src: 'images/wedding/img64.jpeg', category: 'wedding' },
    { src: 'images/wedding/img65.jpeg', category: 'wedding' },
    { src: 'images/wedding/img66.jpeg', category: 'wedding' },
    { src: 'images/wedding/img67.jpeg', category: 'wedding' },
    { src: 'images/wedding/img68.jpeg', category: 'wedding' },
    { src: 'images/wedding/img69.jpeg', category: 'wedding' },
    { src: 'images/wedding/img7.jpeg', category: 'wedding' },
    { src: 'images/wedding/img70.jpeg', category: 'wedding' },
    { src: 'images/wedding/img71.jpeg', category: 'wedding' },
    { src: 'images/wedding/img72.jpeg', category: 'wedding' },
    { src: 'images/wedding/img73.jpeg', category: 'wedding' },
    { src: 'images/wedding/img8.jpeg', category: 'wedding' },
    { src: 'images/wedding/img89.jpeg', category: 'wedding' },
    { src: 'images/wedding/img9.jpeg', category: 'wedding' },
    { src: 'images/wedding/img93.jpeg', category: 'wedding' },
    { src: 'images/wedding/img94.jpeg', category: 'wedding' },
    { src: 'images/corporate/img32.jpeg', category: 'corporate' },
    { src: 'images/corporate/img33.jpeg', category: 'corporate' },
    { src: 'images/corporate/img34.jpeg', category: 'corporate' },
    { src: 'images/corporate/img35.jpeg', category: 'corporate' },
    { src: 'images/corporate/img36.jpeg', category: 'corporate' },
    { src: 'images/corporate/img37.jpeg', category: 'corporate' },
    { src: 'images/corporate/img88.jpeg', category: 'corporate' },
    { src: 'images/birthday/img28.jpeg', category: 'birthday' },
    { src: 'images/birthday/img29.jpeg', category: 'birthday' },
    { src: 'images/birthday/img30.jpeg', category: 'birthday' },
    { src: 'images/birthday/img31.jpeg', category: 'birthday' },
    { src: 'images/birthday/img87.jpeg', category: 'birthday' },
    { src: 'images/birthday/img91.jpeg', category: 'birthday' },
    { src: 'images/birthday/img92.jpeg', category: 'birthday' },
    { src: 'images/birthday/img99.jpeg', category: 'birthday' },
    { src: 'images/birthday/WhatsApp Image 2026-02-19 at 10.43.35 PM.jpeg', category: 'birthday' },
    { src: 'images/birthday/WhatsApp Image 2026-02-19 at 10.45.25 PM.jpeg', category: 'birthday' },
    { src: 'images/baby shower/img18.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img19.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img20.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img22.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img23.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img24.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img25.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img26.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/img90.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/WhatsApp Image 2026-02-19 at 10.40.16 PM.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/WhatsApp Image 2026-02-19 at 10.43.35 PM.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/WhatsApp Image 2026-02-19 at 10.45.25 PM.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/WhatsApp Image 2026-02-19 at 10.45.26 PM.jpeg', category: 'baby-shower' },
    { src: 'images/baby shower/WhatsApp Image 2026-02-19 at 10.45.27 PM.jpeg', category: 'baby-shower' },
    { src: 'images/anniversery/img27.jpeg', category: 'anniversary' },
    { src: 'images/anniversery/img86.jpeg', category: 'anniversary' },
    { src: 'images/anniversery/img95.jpeg', category: 'anniversary' },
    { src: 'images/anniversery/img96.jpeg', category: 'anniversary' },
    { src: 'images/anniversery/img97.jpeg', category: 'anniversary' },
    { src: 'images/anniversery/img98.jpeg', category: 'anniversary' },
    { src: 'images/home decor&welcome/img74.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img75.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img76.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img77.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img78.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img79.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img81.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img82.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img83.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img84.jpeg', category: 'home-decor' },
    { src: 'images/home decor&welcome/img85.jpeg', category: 'home-decor' }
];

document.addEventListener('DOMContentLoaded', () => {
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
    let likedPhotos = [];
    const token = localStorage.getItem('token');

    // Function to render images
    async function renderGallery(category = 'all') {
        galleryGrid.innerHTML = ''; // Clear existing
        galleryGrid.style.opacity = '0'; // Fade out effect styling prep

        // Fetch likes if logged in
        if (token) {
            try {
                likedPhotos = await Api.get('/likes/me', true);
            } catch (e) {
                console.error("Failed to load likes from server", e);
            }
        } else {
            likedPhotos = JSON.parse(localStorage.getItem('liked_photos') || '[]');
        }

        currentImages = category === 'all'
            ? galleryImages
            : galleryImages.filter(img => img.category === category);

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
        if (!token) {
            alert("Please login or create an account to save your favorite photos to your profile!");
            // Still allow local toggling for demo
            if (likedPhotos.includes(src)) {
                likedPhotos = likedPhotos.filter(s => s !== src);
            } else {
                likedPhotos.push(src);
            }
            localStorage.setItem('liked_photos', JSON.stringify(likedPhotos));
        } else {
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
    renderGallery();

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
