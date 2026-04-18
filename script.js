document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Theme: restore manual override if exists, otherwise CSS media query handles it
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    themeToggle.addEventListener('click', function() {
        const currentlyDark = document.documentElement.getAttribute('data-theme') === 'dark'
            || (!document.documentElement.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const newTheme = currentlyDark ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('target') === '_blank') return;
            e.preventDefault();

            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                setActiveLink(this);
            }
        });
    });

    // Scroll spy
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = ['hakkimda', 'deneyim', 'beceriler', 'projeler', 'iletisim'];

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 200;
        let currentActive = '';

        sections.forEach(id => {
            const section = document.getElementById(id);
            if (!section) return;
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                currentActive = id;
            }
        });

        if (!currentActive && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentActive = 'iletisim';
        }

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentActive}`);
        });
    }

    window.addEventListener('scroll', highlightNavOnScroll);

    // Check initial hash
    const hash = window.location.hash;
    if (hash) {
        const activeLink = document.querySelector(`.main-nav a[href="${hash}"]`);
        if (activeLink) setActiveLink(activeLink);
    } else {
        highlightNavOnScroll();
    }

    // Fade-in animation (replaces AOS library)
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
});
