/**
 * Main JavaScript file for Modern Web Application
 * Author: Hikkun
 * Description: Handles all interactive elements and dynamic functionality
 */

// ==================== HAMBURGER MENU FUNCTIONALITY ====================
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    // Check if elements exist before adding event listeners
    if (hamburger && navMenu) {
        // Toggle menu visibility
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking on navigation links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Close menu when clicking outside the menu area
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) &&
                !hamburger.contains(event.target) &&
                navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // ==================== SMOOTH SCROLLING FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip external links and special cases
            if (href === '#' || href.startsWith('#!') ||
                this.getAttribute('target') === '_blank' ||
                this.hasAttribute('download')) {
                return;
            }

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                // Close menu if it's open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }

                // Calculate scroll position accounting for fixed header
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // ==================== NAVBAR SCROLL EFFECT ====================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        // Handle scroll events
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Initialize navbar state on page load
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        }
    }

    // ==================== IMAGE MODAL FUNCTIONALITY ====================
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const captionText = document.getElementById('modalCaption');
    const closeModal = document.querySelector('.close');

    // Open modal when clicking on gallery images
    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'block';
                modalImg.src = this.src;
                captionText.innerHTML = this.alt || this.nextElementSibling?.textContent || '';
            }
        });
    });

    // Close modal by clicking close button
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Close modal by clicking on background
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // ==================== PERFORMANCE OPTIMIZATION ====================
    // Preload critical resources
    function preloadCriticalResources() {
        const resources = [
            // Add paths to critical images or fonts here
        ];

        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.woff2') ? 'font' : 'image';
            document.head.appendChild(link);
        });
    }

    preloadCriticalResources();

    // Optimize performance during scrolling
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Disable animations during scrolling for better performance
        document.body.classList.add('disable-animations');

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('disable-animations');
        }, 100);
    });

    // ==================== FAQ TOGGLE FUNCTIONALITY ====================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.faq-toggle i');
        
        question.addEventListener('click', () => {
            const isExpanded = answer.classList.contains('show');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherToggleIcon = otherItem.querySelector('.faq-toggle i');
                if (otherItem !== item && otherAnswer.classList.contains('show')) {
                    otherAnswer.classList.remove('show');
                    otherToggleIcon.classList.remove('fa-chevron-up');
                    otherToggleIcon.classList.add('fa-chevron-down');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                answer.classList.remove('show');
                toggleIcon.classList.remove('fa-chevron-up');
                toggleIcon.classList.add('fa-chevron-down');
            } else {
                answer.classList.add('show');
                toggleIcon.classList.remove('fa-chevron-down');
                toggleIcon.classList.add('fa-chevron-up');
            }
        });
    });
});

// ==================== SMOOTH SCROLLING POLYFILL ====================
// Fallback for browsers without native smooth scrolling support
if (!('scrollBehavior' in document.documentElement.style)) {
    // Load smoothscroll polyfill
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => {
            // Polyfill activates automatically
        })
        .catch(err => console.error('Error loading smoothscroll polyfill:', err));
}

// ==================== TOUCH DEVICE DETECTION ====================
// Add class to HTML element based on device type
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-device');
} else {
    document.documentElement.classList.add('no-touch-device');
}