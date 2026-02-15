// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add stagger effect for project cards
            if (entry.target.classList.contains('card-hover')) {
                const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // Trigger fade-in for hero section immediately
    setTimeout(() => {
        document.querySelectorAll('#inicio .fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 300);
});

// Navbar background change on scroll
let lastScroll = 0;
const navbar = document.getElementById('navbar');
let ticking = false; // Optimization variable

window.addEventListener('scroll', () => {
    // Throttling with requestAnimationFrame for better mobile performance
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                navbar.classList.remove('shadow-md');
                navbar.style.transform = 'translateY(0)';
            } else if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
                navbar.classList.add('shadow-md');
            }
            
            lastScroll = currentScroll;
            ticking = false;
        });

        ticking = true;
    }
});

// Parallax effect for hero section
const heroSection = document.querySelector('#inicio');
if (heroSection) {
    window.addEventListener('scroll', () => {
        if (window.innerWidth < 768) return; // Optimization: Disable on mobile
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.blob');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Add shimmer effect to buttons on hover
const buttons = document.querySelectorAll('a[class*="bg-gradient"], a[class*="bg-purple"], a[class*="bg-white"]');
if (window.matchMedia('(hover: hover)').matches) {
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            
            const shimmer = document.createElement('div');
            shimmer.className = 'shimmer';
            shimmer.style.position = 'absolute';
            shimmer.style.top = '0';
            shimmer.style.left = '-100%';
            shimmer.style.width = '100%';
            shimmer.style.height = '100%';
            shimmer.style.pointerEvents = 'none';
            
            this.appendChild(shimmer);
            
            setTimeout(() => {
                shimmer.remove();
            }, 2000);
        });
    });
}

// Card tilt effect on mouse move
const cards = document.querySelectorAll('.card-hover');
if (window.matchMedia('(hover: hover)').matches) { // Optimization: Disable on touch devices
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Cursor trail effect (optional, can be enabled/disabled)
let cursorTrail = false; // Set to true to enable

if (cursorTrail) {
    const coords = { x: 0, y: 0 };
    const circles = document.querySelectorAll('.circle');

    circles.forEach(function (circle) {
        circle.x = 0;
        circle.y = 0;
    });

    window.addEventListener('mousemove', function (e) {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });

    function animateCircles() {
        let x = coords.x;
        let y = coords.y;

        circles.forEach(function (circle, index) {
            circle.style.left = x - 12 + 'px';
            circle.style.top = y - 12 + 'px';
            circle.style.transform = `scale(${(circles.length - index) / circles.length})`;

            circle.x = x;
            circle.y = y;

            const nextCircle = circles[index + 1] || circles[0];
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        });

        requestAnimationFrame(animateCircles);
    }

    animateCircles();
}

// Tech stack icons animation
const techIcons = document.querySelectorAll('#inicio .flex-wrap > div');
techIcons.forEach((icon, index) => {
    icon.style.animationDelay = `${0.8 + (index * 0.1)}s`;
});

// Counter animation for stats (if you want to add stats)
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Project card click analytics (placeholder)
document.querySelectorAll('.card-hover a').forEach(link => {
    link.addEventListener('click', function(e) {
        const projectName = this.closest('.card-hover').querySelector('h3').textContent;
        console.log(`Project clicked: ${projectName}`);
        // Here you could add analytics tracking
    });
});

// Add particle effect on cursor (lightweight version)
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '4px';
    particle.style.height = '4px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.opacity = '0.6';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    let posX = x;
    let posY = y;
    let opacity = 0.6;
    
    function animate() {
        posX += Math.cos(angle) * velocity;
        posY += Math.sin(angle) * velocity;
        opacity -= 0.02;
        
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    animate();
}

// Optional: Enable particle effect on click
let particlesEnabled = false; // Set to true to enable
if (particlesEnabled) {
    document.addEventListener('click', (e) => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                createParticle(e.clientX, e.clientY);
            }, i * 50);
        }
    });
}

// Add typing effect to hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Performance optimization: Debounce scroll events
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

// Console message for developers
console.log('%c¡Hola Desarrollador! 👋', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%c¿Interesado en cómo está hecho esto? ¡Contáctame!', 'color: #764ba2; font-size: 14px;');

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileOverlay = document.getElementById('mobile-overlay');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

if (mobileMenuBtn && mobileMenu) {
    const openMenu = () => {
        mobileMenu.classList.remove('hidden');
        mobileOverlay.classList.remove('hidden');
        setTimeout(() => {
            mobileMenu.classList.remove('translate-x-full');
        }, 10);
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overflow-hidden');
    };

    const closeMenu = () => {
        mobileMenu.classList.add('translate-x-full');
        mobileOverlay.classList.add('hidden');
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300); // Wait for transition
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
    };

    mobileMenuBtn.addEventListener('click', () => {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close when tapping overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }

    // Close when tapping anywhere outside the menu (desktop/mobile safety)
    document.addEventListener('click', (e) => {
        const isMenuOpen = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        if (!isMenuOpen) return;
        const clickInsideMenu = mobileMenu.contains(e.target);
        const clickOnButton = mobileMenuBtn.contains(e.target);
        if (!clickInsideMenu && !clickOnButton) {
            closeMenu();
        }
    }, true);

    // Swipe to close (rightward swipe inside the menu)
    let touchStartX = 0;
    let touchEndX = 0;
    mobileMenu.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    mobileMenu.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;
        if (deltaX > 50) { // swipe to the right
            closeMenu();
        }
    }, { passive: true });
}

// --- Dark Mode Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleDarkIconMobile = document.getElementById('theme-toggle-dark-icon-mobile');
    const themeToggleLightIconMobile = document.getElementById('theme-toggle-light-icon-mobile');

    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-mobile');

    function updateIcons(isDark) {
        // Desktop Icons
        if (themeToggleDarkIcon && themeToggleLightIcon) {
            if (isDark) {
                themeToggleDarkIcon.classList.remove('hidden');
                themeToggleLightIcon.classList.add('hidden');
            } else {
                themeToggleDarkIcon.classList.add('hidden');
                themeToggleLightIcon.classList.remove('hidden');
            }
        }
        // Mobile Icons
        if (themeToggleDarkIconMobile && themeToggleLightIconMobile) {
            if (isDark) {
                themeToggleDarkIconMobile.classList.remove('hidden');
                themeToggleLightIconMobile.classList.add('hidden');
            } else {
                themeToggleDarkIconMobile.classList.add('hidden');
                themeToggleLightIconMobile.classList.remove('hidden');
            }
        }
    }

    // Initial check
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        updateIcons(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateIcons(false);
    }

    function toggleTheme() {
        // toggle icons
        let isDarkNow = document.documentElement.classList.contains('dark');
        if (isDarkNow) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            updateIcons(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            updateIcons(true);
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.addEventListener('click', toggleTheme);
    }
});

// ==================== BUSCADOR INTELIGENTE ====================
const searchInput = document.getElementById('search-projects');

if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        // Debounce para optimizar rendimiento
        clearTimeout(searchTimeout);
        
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Obtener todas las tarjetas de proyectos
            const projectCards = document.querySelectorAll('.card-hover');
            const sections = document.querySelectorAll('section[id]:not(#inicio):not(#contacto)');
            
            if (searchTerm === '') {
                // Mostrar todo si no hay búsqueda
                projectCards.forEach(card => {
                    card.style.display = '';
                    card.classList.remove('search-highlight');
                });
                sections.forEach(section => {
                    section.style.display = '';
                });
                return;
            }
            
            let hasResults = false;
            const sectionResults = new Map();
            
            // Filtrar tarjetas
            projectCards.forEach(card => {
                const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = card.querySelector('p')?.textContent.toLowerCase() || '';
                const category = card.closest('section')?.querySelector('h2')?.textContent.toLowerCase() || '';
                
                // Buscar en título, descripción y categoría
                const matches = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               category.includes(searchTerm);
                
                if (matches) {
                    card.style.display = '';
                    card.classList.add('search-highlight');
                    hasResults = true;
                    
                    // Rastrear qué secciones tienen resultados
                    const section = card.closest('section');
                    if (section) {
                        sectionResults.set(section, true);
                    }
                } else {
                    card.style.display = 'none';
                    card.classList.remove('search-highlight');
                }
            });
            
            // Ocultar secciones sin resultados
            sections.forEach(section => {
                if (sectionResults.has(section)) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Efecto visual: animación suave
            projectCards.forEach((card, index) => {
                if (card.style.display !== 'none') {
                    card.style.animation = `fadeInScale 0.3s ease forwards ${index * 0.05}s`;
                }
            });
        }, 300); // 300ms de debounce
    });
    
    // Limpiar búsqueda al presionar Escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

// CSS Animation para search highlight (inyectar si no existe)
if (!document.querySelector('#search-styles')) {
    const style = document.createElement('style');
    style.id = 'search-styles';
    style.textContent = `
        .search-highlight {
            animation: searchPulse 0.5s ease;
        }
        
        @keyframes searchPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); box-shadow: 0 8px 30px rgba(124, 58, 237, 0.3); }
            100% { transform: scale(1); }
        }
        
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
}

// Optimization: "Load More" functionality for sections
document.addEventListener('DOMContentLoaded', () => {
    // Function to handle the "Load More" logic
    const initLoadMore = () => {
        // Find all grids and keep only those containing project cards
        const grids = Array.from(document.querySelectorAll('div.grid'))
            .filter(grid => grid.querySelector('.card-zoom'));

        // Config: How many cards to show initially
        const ITEMS_PER_PAGE = 3;

        grids.forEach(grid => {
            // Avoid processing grids that are already processed (just in case)
            if (grid.dataset.loadMoreInitialized) return;
            grid.dataset.loadMoreInitialized = 'true';

            const cards = Array.from(grid.querySelectorAll('.card-zoom'));

            // If we have more cards than the limit
            if (cards.length > ITEMS_PER_PAGE) {
                // Hide the extra cards
                cards.slice(ITEMS_PER_PAGE).forEach(card => {
                    card.classList.add('hidden-card');
                    card.style.display = 'none'; // Force hide
                    card.setAttribute('aria-hidden', 'true');
                });

                // Create "Ver más" button
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'w-full flex justify-center mt-12 mb-16 relative z-10';

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.setAttribute('aria-label', 'Ver más proyectos');
                btn.innerHTML = `<span class="relative z-10 flex items-center gap-3 uppercase tracking-wide">Ver más proyectos <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></span>`;
                btn.className = 'group relative px-10 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-lg font-extrabold rounded-full shadow-2xl ring-2 ring-purple-300/60 dark:ring-purple-500/60 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-purple-300/60';

                // Add shine effect element
                const shine = document.createElement('div');
                shine.className = 'absolute inset-0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12';
                btn.appendChild(shine);

                btn.addEventListener('click', () => {
                    const isExpanded = btn.dataset.expanded === 'true';

                    if (!isExpanded) {
                        // Show all hidden cards in this grid
                        const hiddenCards = grid.querySelectorAll('.hidden-card');

                        hiddenCards.forEach((card, index) => {
                            card.style.display = '';
                            card.classList.remove('hidden-card');
                            card.removeAttribute('aria-hidden');

                            card.animate([
                                { opacity: 0, transform: 'translateY(20px)' },
                                { opacity: 1, transform: 'translateY(0)' }
                            ], {
                                duration: 500,
                                delay: index * 100,
                                fill: 'forwards',
                                easing: 'ease-out'
                            });
                        });

                        btn.dataset.expanded = 'true';
                        btn.innerHTML = `<span class="relative z-10 flex items-center gap-3 uppercase tracking-wide">Ver menos <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg></span>`;
                    } else {
                        // Hide extra cards again
                        const cardsToHide = Array.from(grid.querySelectorAll('.card-zoom')).slice(ITEMS_PER_PAGE);

                        cardsToHide.forEach((card, index) => {
                            card.animate([
                                { opacity: 1, transform: 'translateY(0)' },
                                { opacity: 0, transform: 'translateY(10px)' }
                            ], {
                                duration: 300,
                                delay: index * 40,
                                fill: 'forwards',
                                easing: 'ease-out'
                            });

                            setTimeout(() => {
                                card.classList.add('hidden-card');
                                card.style.display = 'none';
                                card.setAttribute('aria-hidden', 'true');
                            }, 280);
                        });

                        btn.dataset.expanded = 'false';
                        btn.innerHTML = `<span class="relative z-10 flex items-center gap-3 uppercase tracking-wide">Ver más proyectos <svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg></span>`;

                        // On mobile/tablet, return the user to the section header
                        if (window.innerWidth < 1280) {
                            const heading = (grid.previousElementSibling && grid.previousElementSibling.tagName === 'H3')
                                ? grid.previousElementSibling
                                : grid.closest('section')?.querySelector('h3[id]');
                            if (heading) {
                                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                        }
                    }
                });

                buttonContainer.appendChild(btn);
                // Insert button after the grid
                grid.parentNode.insertBefore(buttonContainer, grid.nextSibling);
            }
        });
    };

    // Run immediately if ready, or wait a bit to ensure DOM elements are fully parsed
    initLoadMore();
});
