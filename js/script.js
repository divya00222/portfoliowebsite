/**
 * Divya Jyoti Chaudhary Portfolio Engine
 * Structural configuration file controlling framework events, light/dark runtime modes,
 * intersection statistical observers, and standard validation processes.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Animate On Scroll Framework
    AOS.init({
        duration: 800,
        once: true,
        offset: 50
    });

    // ==========================================================================
    // LIGHT / DARK MATRIX RUNTIME TOGGLE SYSTEM
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check architecture memory cache for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('portfolio-theme', nextTheme);
        updateThemeIcon(nextTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggleBtn.style.background = '#1E293B';
            themeToggleBtn.style.color = '#F59E0B';
        } else {
            icon.className = 'fas fa-moon';
            themeToggleBtn.style.background = '#E2E8F0';
            themeToggleBtn.style.color = '#0F172A';
        }
    }

    // ==========================================================================
    // TEXT TYPING ENGINE SUBSYSTEM
    // ==========================================================================
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["Front-End Developer", "UI/UX Designer", "Creative Engineering Specialist"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingSpeed + 1100);
        }
    }

    if (typedTextSpan) setTimeout(type, newTextDelay);

    // ==========================================================================
    // INTERSECTION MONITOR FOR SKILL BARS & STAT COUNTERS
    // ==========================================================================
    const skillsSection = document.getElementById('skills');
    const statsSection = document.querySelector('.stats-section');
    let skillsAnimated = false;
    let statsAnimated = false;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'skills' && !skillsAnimated) {
                    animateSkillBars();
                    skillsAnimated = true;
                }
                if (entry.target.classList.contains('stats-section') && !statsAnimated) {
                    animateStatCounters();
                    statsAnimated = true;
                }
            }
        });
    }, { threshold: 0.2 });

    if (skillsSection) sectionObserver.observe(skillsSection);
    if (statsSection) sectionObserver.observe(statsSection);

    function animateSkillBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });
    }

    function animateStatCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500; // Total execution runtime milliseconds
            const increment = target / (duration / 16); // 60fps tracking frame execution logic
            
            let count = 0;
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    counter.textContent = Math.ceil(count);
                    requestAnimationFrame(updateCount);
                } else {
                    counter.textContent = target + (target === 1 ? '+' : '');
                }
            };
            updateCount();
        });
    }

    // ==========================================================================
    // BOOTSTRAP FORM VERIFICATION PROTOCOLS
    // ==========================================================================
    //const contactForm = document.getElementById('portfolio-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            if (!contactForm.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                alert('Communication payload encrypted and simulated successfully to: businessinquiry2000@gmail.com');
                contactForm.reset();
                contactForm.classList.remove('was-validated');
                return;
            }
            contactForm.classList.add('was-validated');
        }, false);
    }

    // Dynamic collapsing for responsive navbar menus upon navigation selection
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(#theme-toggle)');
    const menuToggle = document.getElementById('navbarNav');
    const bsCollapse = menuToggle ? new bootstrap.Collapse(menuToggle, { toggle: false }) : null;
    
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && bsCollapse) {
                bsCollapse.toggle();
            }
        });
    });
});

// ==========================================================================
    // BOOTSTRAP FORM VERIFICATION & FIREBASE STRUCTURAL DATA TRANSFERENCE
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault(); // डिDefault सबमिट रोक्ने
            
            if (!contactForm.checkValidity()) {
                event.stopPropagation();
                contactForm.classList.add('was-validated');
            } else {
                // इनपुट फिल्डहरूबाट डेटा कलेक्सन गर्ने मेट्रिक्स
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const subject = document.getElementById('form-subject').value;
                const message = document.getElementById('form-message').value;
                const timestamp = new Date().toISOString(); // म्यासेज आएको समय ट्र्याक गर्न

                // सबमिट बटनलाई डिसेबल गर्ने (Double click रोक्न)
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Transmitting Payload... <i class="fas fa-spinner fa-spin ms-2"></i>';

                // फायरबेसको 'contacts' नोडमा डेटा सुरक्षित गर्ने स्ट्रिम
                database.ref('contacts').push({
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    timestamp: timestamp
                })
                .then(() => {
                    // म्यासेज सफलतापूर्वक गएपछि
                    alert('System System Matrix: Communication payload sent successfully to Firebase!');
                    contactForm.reset();
                    contactForm.classList.remove('was-validated');
                })
                .catch((error) => {
                    // कुनै इरर आएमा
                    console.error("Firebase Database Transmission Failure:", error);
                    alert('Transmission Error: ' + error.message);
                })
                .finally(() => {
                    // बटनलाई पुनः पहिलेकै अवस्थामा फर्काउने
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                });
            }
        }, false);
    }