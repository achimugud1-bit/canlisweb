/* ==========================================================================
   CANLIS — QUIET LUXURY REDESIGN
   JavaScript for Animations, Interactions & Scroll Effects
   ========================================================================== */

(function() {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. NAVIGATION SCROLL EFFECT
  // --------------------------------------------------------------------------

  const siteNav = document.querySelector('.site-nav');
  
  function handleScroll() {
    if (window.scrollY > 50) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  }

  if (siteNav) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }

  // --------------------------------------------------------------------------
  // 2. SMOOTH IMAGE REVEAL ON SCROLL
  // --------------------------------------------------------------------------

  const imagesToReveal = document.querySelectorAll('.HomePhoto1, .HomePhoto2, .HomePhoto3, .HomePhoto4, .HomePhoto5');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  imagesToReveal.forEach(img => {
    imageObserver.observe(img);
  });

  // --------------------------------------------------------------------------
  // 3. FADE-IN SECTIONS ON SCROLL
  // --------------------------------------------------------------------------

  const fadeElements = document.querySelectorAll('.row, .PortraitCard, .LinkToStory');

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  fadeElements.forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 4. LIGHTBOX FUNCTIONALITY
  // --------------------------------------------------------------------------

  let lastFocusedElement = null;
  let activeLightboxKey = null;

  const closeButton = document.getElementById('LightboxClose');
  const lightbox = document.querySelector('.Lightbox');
  const lightboxItems = document.getElementById('LightboxItems');

  function hideAllLightboxItems() {
    document.querySelectorAll('.LightboxItem').forEach(item => {
      item.hidden = true;
    });
  }

  window.openLightbox = function(key, event) {
    const target = document.querySelector('[data-lightbox-item="' + key + '"]');
    
    if (!lightbox || !target) return;

    hideAllLightboxItems();
    target.hidden = false;
    lastFocusedElement = event.currentTarget;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lightboxItems) {
      lightboxItems.classList.add('is-open');
      lightboxItems.setAttribute('aria-hidden', 'false');
    }
    document.body.classList.add('lightbox-open');
    activeLightboxKey = key;

    setTimeout(() => {
      const closeBtn = document.getElementById('LightboxClose');
      if (closeBtn) closeBtn.focus();
    }, 50);
  };

  window.closeLightbox = function() {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxItems) {
      lightboxItems.classList.remove('is-open');
      lightboxItems.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('lightbox-open');

    hideAllLightboxItems();
    activeLightboxKey = null;
    
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && activeLightboxKey !== null) {
      const focusable = lightbox.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const focusableArray = Array.prototype.slice.call(focusable).filter(el => {
        return !el.closest('[hidden]');
      });

      const first = focusableArray[0];
      const last = focusableArray[focusableArray.length - 1];

      if (!first || !last) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (!lightbox.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }

    // Close lightbox with Escape key
    if (event.key === 'Escape' && activeLightboxKey !== null) {
      closeLightbox();
    }
  });

  // --------------------------------------------------------------------------
  // 5. MUURI GRID LAYOUT (if present)
  // --------------------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', () => {
    const gridEl = document.querySelector('.grid');
    
    if (!gridEl || typeof Muuri === 'undefined') {
      if (gridEl) {
        gridEl.classList.remove('muuri-ready');
      }
      return;
    }

    let grid;

    function relayout() {
      if (!grid) return;
      try {
        grid.refreshItems().layout();
      } catch (e) {
        console.error('Muuri relayout failed:', e);
      }
    }

    function initMuuri() {
      gridEl.classList.add('muuri-ready');

      try {
        grid = new Muuri(gridEl, {
          items: '.item',
          layoutDuration: 300,
          layoutEasing: 'ease'
        });
      } catch (e) {
        console.error('Muuri init failed:', e);
        gridEl.classList.remove('muuri-ready');
        return;
      }

      // Initialize Splide carousels within grid
      function initSplides() {
        if (typeof Splide === 'undefined') return;

        document.querySelectorAll('.js-item-splide').forEach(el => {
          const interval = parseInt(el.getAttribute('data-interval') || '4000', 10);

          const splide = new Splide(el, {
            type: 'fade',
            rewind: true,
            arrows: false,
            pagination: false,
            drag: false,
            autoplay: true,
            interval: interval,
            speed: 0,
            pauseOnHover: false,
            pauseOnFocus: false
          });

          splide.on('mounted moved resized', relayout);
          splide.mount();
        });
      }

      initSplides();
      relayout();

      // Handle image loading
      document.querySelectorAll('.item__img').forEach(img => {
        if (img.complete) return;
        img.addEventListener('load', relayout, { once: true });
        img.addEventListener('error', relayout, { once: true });
      });

      window.addEventListener('load', relayout);
      window.addEventListener('resize', relayout);

      setTimeout(relayout, 50);
      setTimeout(relayout, 300);
      setTimeout(relayout, 800);
    }

    if (document.readyState === 'complete') {
      initMuuri();
    } else {
      window.addEventListener('load', initMuuri, { once: true });
    }
  });

  // --------------------------------------------------------------------------
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // --------------------------------------------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 7. PARALLAX EFFECT FOR HERO BACKGROUND (Optional Enhancement)
  // --------------------------------------------------------------------------

  const heroBg = document.querySelector('.home-opening-step-3');
  
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      heroBg.style.transform = `translate(-50%, calc(-50% + ${scrolled * parallaxSpeed}px)) scale(1.1)`;
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 8. TOUCH DEVICE DETECTION (for better mobile experience)
  // --------------------------------------------------------------------------

  function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0));
  }

  if (isTouchDevice()) {
    document.body.classList.add('touch-device');
  }

  // --------------------------------------------------------------------------
  // 9. PERFORMANCE OPTIMIZATION - DEBOUNCE RESIZE EVENTS
  // --------------------------------------------------------------------------

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleResize = debounce(() => {
    window.dispatchEvent(new Event('optimized-resize'));
  }, 150);

  window.addEventListener('resize', handleResize);

  // --------------------------------------------------------------------------
  // 10. CONSOLE BRANDING (Optional)
  // --------------------------------------------------------------------------

  console.log('%cCANLIS', 'font-family: Cormorant Garamond, serif; font-size: 48px; font-weight: 300; color: #0A3D32;');
  console.log('%cQuiet Luxury Redesign', 'font-family: Inter, sans-serif; font-size: 14px; color: #6B6B6B;');

})();
