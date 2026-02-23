document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // Add cache busting
    grid.innerHTML = '<p style="text-align:center; width:100%;">Loading gallery...</p>';

    try {
        const items = await Api.get('/gallery/');

        if (!items || items.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">Gallery is empty. Add images via Admin Dashboard.</p>';
            return;
        }

        grid.innerHTML = items.map(item => `
            <div class="gallery-item" style="border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <img src="${item.image_url}" alt="${item.title || 'Event'}" style="width: 100%; height: 250px; object-fit: cover; display: block;">
                <div style="padding: 15px; text-align: center;">
                    <h3>${item.title || 'Event'}</h3>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Gallery Error:', error);
        grid.innerHTML = '<p style="text-align:center; width:100%;">Error loading gallery.</p>';
    }
});
