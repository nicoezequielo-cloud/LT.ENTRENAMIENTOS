document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const backToTop = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');

    // Header scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
                backToTop.classList.toggle('visible', window.scrollY > 400);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile menu
    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Back to top
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !email || !mensaje) {
                showFormMessage('Completá nombre, email y mensaje', 'error');
                return;
            }

            document.querySelector('input[name="_replyto"]').value = email;

            const formData = new FormData(contactForm);

            if (!nombre || !email || !mensaje) {
                showFormMessage('Completá nombre, email y mensaje', 'error');
                return;
            }

            const btn = contactForm.querySelector('.form__btn');
            const btnText = btn.querySelector('.btn__text');

            btnText.textContent = 'Enviando...';
            btn.disabled = true;

            try {
                const res = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (res.ok) {
                    showFormMessage('¡Mensaje enviado con éxito! Te responderé a la brevedad.', 'success');
                    contactForm.reset();
                } else {
                    const data = await res.json();
                    throw new Error(data?.error || 'Error al enviar el mensaje');
                }
            } catch (err) {
                showFormMessage(err.message || 'Error de conexión. Intentalo de nuevo.', 'error');
            } finally {
                btnText.textContent = 'Enviar mensaje';
                btn.disabled = false;
            }
        });
    }

    function showFormMessage(msg, type) {
        const existing = contactForm.querySelector('.form__msg');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.className = `form__msg form__msg--${type}`;
        el.textContent = msg;
        el.style.cssText = `
            padding: 0.75rem 1rem;
            border-radius: 12px;
            font-size: 0.9rem;
            font-weight: 500;
            background: ${type === 'error' ? '#fef2f2' : '#f0fdf4'};
            color: ${type === 'error' ? '#dc2626' : '#16a34a'};
            border: 1px solid ${type === 'error' ? '#fecaca' : '#bbf7d0'};
        `;
        contactForm.insertBefore(el, contactForm.querySelector('.form__btn'));

        setTimeout(() => el.remove(), 4000);
    }

    // Carousel
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && dotsContainer) {
        const slides = track.querySelectorAll('.carousel__slide');
        const total = slides.length;
        let current = 0;
        let autoplay;

        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'carousel__dot' + (i === 0 ? ' carousel__dot--active' : '');
            dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
            dotsContainer.appendChild(dot);
            dot.addEventListener('click', () => goTo(i));
        });

        const dots = dotsContainer.querySelectorAll('.carousel__dot');

        function goTo(index) {
            current = ((index % total) + total) % total;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('carousel__dot--active', i === current));
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
        nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

        function startAutoplay() {
            autoplay = setInterval(next, 6000);
        }

        function resetAutoplay() {
            clearInterval(autoplay);
            startAutoplay();
        }

        // Pause on hover/touch
        const carousel = document.querySelector('.carousel');
        carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('touchstart', () => clearInterval(autoplay), { passive: true });
        carousel.addEventListener('touchend', startAutoplay, { passive: true });

        // Keyboard navigation
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
            if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
        });

        startAutoplay();
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Popup
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popupClose');

    if (popup) {
        setTimeout(() => popup.classList.add('active'), 3000);
        popupClose.addEventListener('click', () => popup.classList.remove('active'));
        popup.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') popup.classList.remove('active');
        });
    }
});