/* ============================================
   RISHAB MISHRA - 3D PORTFOLIO
   Three.js Background + Interactions
   ============================================ */

// ============================================
// 1. THREE.JS 3D BACKGROUND
// ============================================
(function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 30;

    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // === Particle Field ===
    const particleCount = 1500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPalette = [
        new THREE.Color(0x6c5ce7), // Primary purple
        new THREE.Color(0x00d2ff), // Cyan
        new THREE.Color(0xa29bfe), // Light purple
        new THREE.Color(0xff6b9d), // Pink
        new THREE.Color(0x00e676), // Green
    ];

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 100;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        particleSizes[i] = Math.random() * 2 + 0.5;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // === Floating Geometric Shapes ===
    const geometries = [];

    // Wireframe Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(3, 1);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x6c5ce7,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(-15, 8, -10);
    scene.add(icosahedron);
    geometries.push({ mesh: icosahedron, rotSpeed: { x: 0.003, y: 0.005 }, floatSpeed: 0.001, floatAmp: 2 });

    // Wireframe Torus
    const torusGeo = new THREE.TorusGeometry(2.5, 0.8, 16, 50);
    const torusMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.position.set(18, -5, -8);
    scene.add(torus);
    geometries.push({ mesh: torus, rotSpeed: { x: 0.004, y: 0.002 }, floatSpeed: 0.0015, floatAmp: 3 });

    // Wireframe Octahedron
    const octGeo = new THREE.OctahedronGeometry(2, 0);
    const octMat = new THREE.MeshBasicMaterial({
        color: 0xff6b9d,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(12, 12, -15);
    scene.add(octahedron);
    geometries.push({ mesh: octahedron, rotSpeed: { x: 0.005, y: 0.003 }, floatSpeed: 0.002, floatAmp: 1.5 });

    // Wireframe Dodecahedron
    const dodGeo = new THREE.DodecahedronGeometry(2, 0);
    const dodMat = new THREE.MeshBasicMaterial({
        color: 0x00e676,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const dodecahedron = new THREE.Mesh(dodGeo, dodMat);
    dodecahedron.position.set(-18, -10, -12);
    scene.add(dodecahedron);
    geometries.push({ mesh: dodecahedron, rotSpeed: { x: 0.002, y: 0.004 }, floatSpeed: 0.0012, floatAmp: 2.5 });

    // Wireframe TorusKnot
    const knotGeo = new THREE.TorusKnotGeometry(1.5, 0.5, 80, 16);
    const knotMat = new THREE.MeshBasicMaterial({
        color: 0xa29bfe,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
    });
    const torusKnot = new THREE.Mesh(knotGeo, knotMat);
    torusKnot.position.set(-8, -15, -10);
    scene.add(torusKnot);
    geometries.push({ mesh: torusKnot, rotSpeed: { x: 0.003, y: 0.002 }, floatSpeed: 0.001, floatAmp: 2 });

    // === Connection Lines Between Particles ===
    const lineCount = 80;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(lineCount * 6);
    const lineColors = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
        const idx1 = Math.floor(Math.random() * particleCount) * 3;
        const idx2 = Math.floor(Math.random() * particleCount) * 3;

        linePositions[i * 6] = particlePositions[idx1];
        linePositions[i * 6 + 1] = particlePositions[idx1 + 1];
        linePositions[i * 6 + 2] = particlePositions[idx1 + 2];
        linePositions[i * 6 + 3] = particlePositions[idx2];
        linePositions[i * 6 + 4] = particlePositions[idx2 + 1];
        linePositions[i * 6 + 5] = particlePositions[idx2 + 2];

        for (let j = 0; j < 6; j++) {
            lineColors[i * 6 + j] = j % 3 === 0 ? 0.42 : j % 3 === 1 ? 0.36 : 0.9;
        }
    }

    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.04,
        blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    // === Animation Loop ===
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse interpolation
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;

        // Rotate particles based on scroll and mouse
        particles.rotation.y = time * 0.05 + mouseX * 0.3;
        particles.rotation.x = mouseY * 0.2;

        // Animate geometric shapes
        geometries.forEach((item, i) => {
            item.mesh.rotation.x += item.rotSpeed.x;
            item.mesh.rotation.y += item.rotSpeed.y;
            item.mesh.position.y += Math.sin(time * item.floatSpeed * 100 + i) * 0.01 * item.floatAmp;
        });

        // Lines follow particles
        lines.rotation.y = particles.rotation.y;
        lines.rotation.x = particles.rotation.x;

        // Camera parallax
        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll-based depth
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        camera.position.z = 30 + scrollY * 0.01;
        particles.rotation.z = scrollY * 0.0003;
    });
})();


// ============================================
// 2. LOADING SCREEN
// ============================================
(function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.getElementById('loaderProgress');
    const percent = document.getElementById('loaderPercent');
    let loaded = 0;

    const interval = setInterval(() => {
        loaded += Math.random() * 15 + 5;
        if (loaded >= 100) {
            loaded = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
        progress.style.width = loaded + '%';
        percent.textContent = Math.floor(loaded) + '%';
    }, 100);
})();


// ============================================
// 3. CUSTOM CURSOR
// ============================================
(function initCursor() {
    const dot = document.getElementById('cursorDot');
    const outline = document.getElementById('cursorOutline');
    let cursorX = 0, cursorY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
        dot.style.left = cursorX + 'px';
        dot.style.top = cursorY + 'px';
    });

    function animateOutline() {
        outlineX += (cursorX - outlineX) * 0.15;
        outlineY += (cursorY - outlineY) * 0.15;
        outline.style.left = outlineX + 'px';
        outline.style.top = outlineY + 'px';
        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // Cursor effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .glass-card, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.style.width = '14px';
            dot.style.height = '14px';
            dot.style.background = '#ff6b9d';
            outline.style.width = '50px';
            outline.style.height = '50px';
            outline.style.borderColor = '#ff6b9d';
        });
        el.addEventListener('mouseleave', () => {
            dot.style.width = '8px';
            dot.style.height = '8px';
            dot.style.background = '#00d2ff';
            outline.style.width = '36px';
            outline.style.height = '36px';
            outline.style.borderColor = '#a29bfe';
        });
    });
})();


// ============================================
// 4. NAVBAR
// ============================================
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const mobileOverlay = document.getElementById('mobileNavOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active section highlighting
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -20% 0px',
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.dataset.section === id);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileOverlay.classList.toggle('active');
        document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();


// ============================================
// 5. TYPEWRITER EFFECT
// ============================================
(function initTypewriter() {
    const element = document.getElementById('typewriter');
    const texts = [
        'Full-Stack Developer',
        'Generative AI Enthusiast',
        'Competitive Programmer',
        'Problem Solver',
        'Tech Innovator',
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after loader
    setTimeout(type, 2000);
})();


// ============================================
// 6. SCROLL REVEAL ANIMATIONS
// ============================================
(function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));
})();


// ============================================
// 7. SKILL BAR ANIMATIONS
// ============================================
(function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth + '%';
                bar.classList.add('animated');
                skillObserver.unobserve(bar);
            }
        });
    }, {
        threshold: 0.5,
    });

    skillBars.forEach(bar => skillObserver.observe(bar));
})();


// ============================================
// 8. COUNTER ANIMATION
// ============================================
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let current = 0;
                const increment = target / 40;
                const duration = 2000;
                const stepTime = duration / 40;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + '+';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, stepTime);

                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
})();


// ============================================
// 9. SMOOTH SCROLL
// ============================================
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });
})();


// ============================================
// 10. CONTACT FORM
// ============================================
(function initContactForm() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const message = document.getElementById('formMessage').value;

        // Create mailto link as fallback
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:rishabmishra8737@gmail.com?subject=${subject}&body=${body}`;

        // Show success feedback
        const btn = form.querySelector('.form-btn span');
        const originalText = btn.textContent;
        btn.textContent = 'Message Sent! ✓';
        btn.style.color = '#00e676';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.color = '';
            form.reset();
        }, 3000);
    });
})();


// ============================================
// 11. PARALLAX ON CARDS (Tilt Effect)
// ============================================
(function initCardTilt() {
    const cards = document.querySelectorAll('.project-card, .cert-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
})();


// ============================================
// 12. MAGNETIC BUTTON EFFECT
// ============================================
(function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();


// ============================================
// 13. SCROLL PROGRESS INDICATOR ON NAV
// ============================================
(function initScrollProgress() {
    const navbar = document.getElementById('navbar');

    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(135deg, #6c5ce7 0%, #00d2ff 100%);
        border-radius: 2px;
        transition: width 0.1s linear;
        z-index: 10;
    `;
    navbar.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
})();


// ============================================
// 14. PARTICLE BURST ON CLICK
// ============================================
(function initClickParticles() {
    document.addEventListener('click', (e) => {
        const colors = ['#6c5ce7', '#00d2ff', '#ff6b9d', '#00e676', '#a29bfe'];

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (Math.PI * 2 * i) / 8;
            const velocity = Math.random() * 60 + 30;

            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                transform: translate(-50%, -50%);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                opacity: 1;
            `;

            document.body.appendChild(particle);

            requestAnimationFrame(() => {
                particle.style.left = (e.clientX + Math.cos(angle) * velocity) + 'px';
                particle.style.top = (e.clientY + Math.sin(angle) * velocity) + 'px';
                particle.style.opacity = '0';
                particle.style.transform = 'translate(-50%, -50%) scale(0)';
            });

            setTimeout(() => particle.remove(), 600);
        }
    });
})();


// ============================================
// 15. PREFERS REDUCED MOTION
// ============================================
(function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (prefersReducedMotion.matches) {
        document.querySelectorAll('.name-letter').forEach(letter => {
            letter.style.animation = 'none';
            letter.style.opacity = '1';
            letter.style.transform = 'none';
        });
    }
})();
