document.addEventListener('DOMContentLoaded', () => {
    // Select all the service cards on the homepage
    const serviceCards = document.querySelectorAll('.service-home-card');

    // Options for the Intersection Observer
    const observerOptions = {
        root: null, // use the viewport
        rootMargin: '0px',
        threshold: 0.05 // trigger when just a little bit (5%) of the card is visible
    };

    // Create the Intersection Observer
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            // If the card has entered the viewport
            if (entry.isIntersecting) {
                // Add the animation trigger class
                entry.target.classList.add('animate-show');

                // Stop observing the card once it has animated in
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Attach observer to each card and stagger delays dynamically
    serviceCards.forEach((card, index) => {
        // Add a slight delay based on the card's index for a cascading effect
        card.style.transitionDelay = `${index * 0.1}s`;

        observer.observe(card);

        // Remove the transition delay after the entrance animation completes 
        // to prevent sluggish hover effects later
        setTimeout(() => {
            card.style.transitionDelay = '0s';
        }, 1000 + (index * 100));
    });
});
