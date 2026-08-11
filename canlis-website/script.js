/* ==========================================
   THE MAGIC ENGINE: HEADER & FOOTER INJECTION
   ========================================== */

const headerHTML = `
    <header>
        <div class="container nav-wrapper">
            <a href="#" class="btn-reserve desktop-reserve">RESERVE</a>

            <a href="index.html" class="logo">CANLIS</a>

            <div class="nav-actions">
                <button class="explore-toggle desktop-explore" id="exploreToggle" aria-expanded="false" aria-haspopup="true">
                    EXPLORE ▾
                </button>
                <div class="explore-menu" id="exploreMenu" role="menu" aria-label="Explore">
                    <a href="menu/index.html">Menu</a>
                    <a href="story/index.html">Our Story</a>
                    <a href="wine/index.html">Wine</a>
                    <a href="lounge/index.html">The Lounge</a>
                    <a href="careers/index.html">Careers</a>
                    <a href="../giftcards.canlis.com/index.html">Gift Cards</a>
                    <a href="private-events/index.html">Private Events</a>
                </div>
            </div>

            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>

        <nav class="mobile-nav" id="mobileNav">
            <a href="menu/index.html">Menu</a>
            <a href="story/index.html">Our Story</a>
            <a href="wine/index.html">Wine</a>
            <a href="lounge/index.html">The Lounge</a>
            <a href="careers/index.html">Careers</a>
            <a href="../giftcards.canlis.com/index.html">Gift Cards</a>
            <a href="private-events/index.html">Private Events</a>
            <a href="#" class="btn-reserve mobile-reserve">RESERVE</a>
        </nav>
    </header>
`;

const footerHTML = `
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3 class="footer-logo">CANLIS</h3>
                    <p>Winner of three James Beard Awards and twenty-nine consecutive Wine Spectator Grand Awards.</p>
                </div>
                <div class="footer-section">
                    <h4>Visit Us</h4>
                    <p>2576 Aurora Ave N<br>Seattle, WA 98109</p>
                    <p><a href="tel:2062833313">(206) 283-3313</a></p>
                    <p><a href="mailto:reservations@canlis.com">reservations@canlis.com</a></p>
                </div>
                <div class="footer-section">
                    <h4>Explore</h4>
                    <p><a href="story/index.html">Our Story</a></p>
                    <p><a href="wine/index.html">Wine Program</a></p>
                    <p><a href="../giftcards.canlis.com/index.html">Gift Cards</a></p>
                    <p><a href="careers/index.html">Careers</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 Canlis Restaurant. All rights reserved.</p>
            </div>
        </div>
    </footer>
`;

// Inject immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    initMobileMenu();
});

/* ==========================================
   MOBILE MENU TOGGLE
   ========================================== */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const exploreToggle = document.getElementById('exploreToggle');
    const exploreMenu = document.getElementById('exploreMenu');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }

    if (exploreToggle && exploreMenu) {
        exploreToggle.addEventListener('click', () => {
            const expanded = exploreToggle.getAttribute('aria-expanded') === 'true';
            exploreToggle.setAttribute('aria-expanded', String(!expanded));
            exploreMenu.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            if (!exploreToggle.contains(event.target) && !exploreMenu.contains(event.target)) {
                exploreMenu.classList.remove('active');
                exploreToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/* ==========================================
   INSTANT REVEAL (No delay on load)
   ========================================== */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    /* Show everything immediately */
    section, .full-width-image, .food-gallery, .story-image-placeholder, .video-item {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    /* Hamburger animation */
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -7px); }
    
    /* Desktop explore */
    .desktop-explore { display: none; }
    @media (min-width: 769px) {
        .desktop-explore { display: block; cursor: pointer; font-size: 0.75rem; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; background: none; border: none; color: var(--color-text); }
    }
`;
document.head.appendChild(styleSheet);

/* ==========================================
   SCROLL SLIDE ANIMATION (LIGHTWEIGHT)
   ========================================== */
function initScrollSlide() {
    // We only target elements that have the 'scroll-slide' class
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 }); // Triggers as soon as 10% of the element is visible (very fast!)

    document.querySelectorAll('.scroll-slide').forEach(el => {
        // Set initial state for scroll elements
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

// Run it when the page loads
document.addEventListener('DOMContentLoaded', initScrollSlide);
