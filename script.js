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

window.addEventListener('scroll', () => {
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
            themeToggleDarkIcon.classList.add('hidden');
            themeToggleLightIcon.classList.remove('hidden');
        } else {
            themeToggleDarkIcon.classList.remove('hidden');
            themeToggleLightIcon.classList.add('hidden');
        }
    }
    // Mobile Icons
    if (themeToggleDarkIconMobile && themeToggleLightIconMobile) {
        if (isDark) {
            themeToggleDarkIconMobile.classList.add('hidden');
            themeToggleLightIconMobile.classList.remove('hidden');
        } else {
            themeToggleDarkIconMobile.classList.remove('hidden');
            themeToggleLightIconMobile.classList.add('hidden');
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
