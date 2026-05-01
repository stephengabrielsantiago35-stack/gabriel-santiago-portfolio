document.addEventListener('DOMContentLoaded', () => {
    // ========== MOBILE MENU TOGGLE ==========
    const mobileBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (mobileBtn && navLinks) {
        mobileBtn.onclick = e => { 
            e.stopPropagation(); 
            navLinks.classList.toggle('show'); 
            const i = mobileBtn.querySelector('i'); document.addEventListener('DOMContentLoaded', () => {
    // ========== MOBILE MENU TOGGLE ==========
    const mobileBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (mobileBtn && navLinks) {
        mobileBtn.onclick = e => { 
            e.stopPropagation(); 
            navLinks.classList.toggle('show'); 
            const i = mobileBtn.querySelector('i'); 
            if (i) i.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars'; 
        };
        
        document.onclick = e => { 
            if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) { 
                navLinks.classList.remove('show'); 
                const i = mobileBtn.querySelector('i'); 
                if (i) i.className = 'fas fa-bars'; 
            } 
        };
        
        navLinks.querySelectorAll('a').forEach(l => l.onclick = () => { 
            navLinks.classList.remove('show'); 
            const i = mobileBtn.querySelector('i'); 
            if (i) i.className = 'fas fa-bars'; 
        });
    }
    
    // ========== ACTIVE NAV LINK HIGHLIGHT ==========
    document.querySelectorAll('.nav-links a').forEach(l => { 
        if (l.getAttribute('href') === currentPage || (!currentPage && l.getAttribute('href') === 'index.html')) {
            l.classList.add('active-nav'); 
        }
    });
    
    // ========== CONTACT FORM WITH EMAILJS ==========
    const form = document.getElementById('contactForm');
    if (form) {
        // Initialize EmailJS with your public key
        (function() {
            emailjs.init("j3_2-biLMkVGQsQrz");
        })();
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const messageBox = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Validation
            let errors = [];
            if (!name) errors.push('Please enter your name');
            if (!email || !/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email)) {
                errors.push('Please enter a valid email address');
            }
            if (!subject) errors.push('Please enter a subject');
            if (!message || message.length < 10) {
                errors.push('Message must be at least 10 characters');
            }
            
            if (errors.length > 0) {
                messageBox.innerHTML = `
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>`;
                messageBox.style.display = 'block';
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'santiagogabrielstephen@gmail.com',
                reply_to: email
            };
            
            // Send email using EmailJS
            emailjs.send('service_ul3xlv9', 'template_bkw123i', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    // Success
                    messageBox.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <strong>Message Sent Successfully!</strong>
                                <p>Thank you ${name}! I'll get back to you within 24-48 hours.</p>
                            </div>
                        </div>`;
                    messageBox.style.display = 'block';
                    form.reset();
                    
                    // Scroll to message
                    messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Hide success message after 8 seconds
                    setTimeout(() => {
                        messageBox.style.display = 'none';
                    }, 8000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    // Error
                    messageBox.innerHTML = `
                        <div class="alert alert-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>Oops! Something went wrong.</strong>
                                <p>Please try again or email me directly at santiagogabrielstephen@gmail.com</p>
                            </div>
                        </div>`;
                    messageBox.style.display = 'block';
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                });
        });
    }
    
    // ========== IMAGE SLIDER FUNCTIONALITY ==========
    const createSlider = ({ track, slides, prevBtn, nextBtn, dotsContainer, cls = 'dot' }) => { 
        if (!track || !slides.length) return; 
        let idx = 0; 
        let interval;
        
        const update = () => { 
            track.style.transform = `translateX(-${idx * 100}%)`; 
            if (dotsContainer) {
                dotsContainer.querySelectorAll(`.${cls}`).forEach((d, i) => {
                    d.className = `${cls}${i === idx ? ' active' : ''}`;
                }); 
            }
        }; 
        
        const go = i => { 
            idx = Math.max(0, Math.min(i, slides.length - 1)); 
            update(); 
        }; 
        
        const next = () => { 
            idx = idx < slides.length - 1 ? idx + 1 : 0; 
            update(); 
        }; 
        
        const prev = () => { 
            idx = idx > 0 ? idx - 1 : slides.length - 1; 
            update(); 
        }; 
        
        const startAutoPlay = () => {
            if (slides.length > 1) {
                stopAutoPlay();
                interval = setInterval(next, 4000);
            }
        };
        
        const stopAutoPlay = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };
        
        if (slides.length > 1) { 
            if (prevBtn) prevBtn.onclick = () => {
                prev();
                startAutoPlay();
            };
            
            if (nextBtn) nextBtn.onclick = () => {
                next();
                startAutoPlay();
            };
            
            startAutoPlay();
            
            // Pause on hover
            const sliderContainer = track.parentElement;
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', stopAutoPlay);
                sliderContainer.addEventListener('mouseleave', startAutoPlay);
            }
            
            if (dotsContainer) { 
                dotsContainer.innerHTML = [...Array(slides.length)].map((_, i) => 
                    `<div class="${cls}${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
                ).join(''); 
                dotsContainer.querySelectorAll(`.${cls}`).forEach(d => d.onclick = () => {
                    go(+d.dataset.index);
                    startAutoPlay();
                }); 
            } 
        } else { 
            if (prevBtn) prevBtn.style.display = 'none'; 
            if (nextBtn) nextBtn.style.display = 'none'; 
        } 
    };
    
    // Initialize homepage sliders
    document.querySelectorAll('.image-slider').forEach(s => createSlider({ 
        track: s.querySelector('.slider-track'), 
        slides: s.querySelectorAll('.slide'), 
        prevBtn: s.querySelector('.prev-btn'), 
        nextBtn: s.querySelector('.next-btn'), 
        dotsContainer: s.querySelector('.slider-dots') 
    }));
    
    // ========== LIGHTBOX MODAL ==========
    const createModal = content => { 
        const m = document.createElement('div'); 
        m.className = 'lightbox'; 
        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-modal', 'true');
        m.innerHTML = `<div class="lightbox-content" style="max-width:550px">
            <span class="close-lightbox" aria-label="Close modal">&times;</span>
            ${content}
            <button class="btn btn-primary close-btn" style="margin-top:1rem">Close</button>
        </div>`; 
        document.body.style.overflow = 'hidden'; 
        
        const close = () => { 
            m.remove(); 
            document.body.style.overflow = ''; 
            document.removeEventListener('keydown', escHandler);
        }; 
        
        const escHandler = (e) => {
            if (e.key === 'Escape') close();
        };
        
        m.querySelector('.close-lightbox').onclick = close; 
        m.querySelector('.close-btn').onclick = close; 
        m.onclick = e => { 
            if (e.target === m) close(); 
        }; 
        
        document.addEventListener('keydown', escHandler);
        
        // Focus trap
        const focusableElements = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        return m; 
    };
    
    // ========== WORK PAGE - DYNAMIC PROJECTS ==========
    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
        const projects = [
            { 
                t: 'Brand Photography Portfolio', 
                c: 'Photography', 
                d: 'Luxury portraits, events, and product photography in Dubai.', 
                i: 'fa-camera', 
                imgs: ['photo1.jpg','photo2.jpg','photo3.jpg'], 
                tech: ['Canon R5','Lightroom','Photoshop'] 
            },
            { 
                t: 'Metaverse Age Training Institute', 
                c: 'Videography', 
                d: 'Promotional video for innovative educational programs.', 
                i: 'fa-video', 
                vid: 'images/welcome to metaverse (1).mp4', 
                tech: ['Premiere Pro','After Effects','Sony A7S III'] 
            },
            { 
                t: 'E-Commerce Web Platform', 
                c: 'Design', 
                d: 'Brand identity, UI/UX design, and website development.', 
                i: 'fa-store', 
                imgs: ['platform1.png','platform2.png','platform3.png'], 
                tech: ['HTML5','CSS3','React','Figma'] 
            }
        ];
        
        projects.forEach(p => {
            const card = document.createElement('div'); 
            card.className = 'work-card'; 
            card.dataset.category = p.c;
            
            card.innerHTML = `${p.vid ? 
                `<div class="card-img video-card-img">
                    <video class="work-video" controls playsinline>
                        <source src="${p.vid}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>` : 
                `<div class="work-image-slider">
                    <div class="work-slider-container">
                        <div class="work-slider-track">
                            ${p.imgs.map(img => `<div class="work-slide"><img src="images/${img}" alt="${p.t}" loading="lazy"></div>`).join('')}
                        </div>
                    </div>
                    <button class="work-slider-btn work-prev-btn" aria-label="Previous slide">‹</button>
                    <button class="work-slider-btn work-next-btn" aria-label="Next slide">›</button>
                    <div class="work-slider-dots"></div>
                </div>`}
                <h3>${p.t}</h3>
                <p>${p.d}</p>
                <div class="tech-tags">
                    ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="card-footer">
                    <a href="#" class="project-link">View Details <i class="fas fa-arrow-right"></i></a>
                </div>`;
                
            card.querySelector('.project-link').onclick = e => { 
                e.preventDefault(); 
                document.body.appendChild(createModal(`
                    <div class="lightbox-icon"><i class="fas ${p.i}"></i></div>
                    <h3>${p.t}</h3>
                    <p><strong>Category:</strong> ${p.c}</p>
                    <p>${p.d}</p>
                    <p><strong>Tools:</strong> ${p.tech.join(', ')}</p>
                `)); 
            };
            
            workGrid.appendChild(card);
        });
        
        // Initialize work page sliders
        setTimeout(() => {
            document.querySelectorAll('.work-image-slider').forEach(s => createSlider({ 
                track: s.querySelector('.work-slider-track'), 
                slides: s.querySelectorAll('.work-slide'), 
                prevBtn: s.querySelector('.work-prev-btn'), 
                nextBtn: s.querySelector('.work-next-btn'), 
                dotsContainer: s.querySelector('.work-slider-dots'), 
                cls: 'work-dot' 
            }));
        }, 100);
        
        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = function() { 
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter')); 
                this.classList.add('active-filter'); 
                
                const cat = this.dataset.filter; 
                document.querySelectorAll('.work-card').forEach((c, index) => { 
                    const show = cat === 'all' || c.dataset.category === cat; 
                    
                    if (show) {
                        c.style.display = 'block';
                        setTimeout(() => {
                            c.style.opacity = '1'; 
                            c.style.transform = 'scale(1)';
                        }, 50 * index);
                    } else {
                        c.style.opacity = '0'; 
                        c.style.transform = 'scale(0.95)'; 
                        setTimeout(() => {
                            c.style.display = 'none';
                        }, 300);
                    }
                }); 
            };
        });
    }
    
    // ========== EXPERIENCE PAGE - TIMELINE ==========
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const experiences = [
            { 
                y: '2023-Present', 
                t: 'Freelance Creative Professional', 
                c: 'Self-Employed - Dubai', 
                d: 'Providing comprehensive creative services including coding, photography, videography, and graphic design for various clients across the UAE.' 
            }, 
            { 
                y: '2022-2023', 
                t: 'Multimedia Assistant', 
                c: 'Creative Agency', 
                d: 'Assisted in video production and photography projects, developing skills in post-production and client management.' 
            }, 
            { 
                y: '2022-Present', 
                t: 'Freelance Photographer', 
                c: 'Various Clients', 
                d: 'Specialized in events, corporate headshots, and product photography for e-commerce brands and luxury goods.' 
            }
        ];
        
        experiences.forEach(e => {
            timeline.innerHTML += `
                <div class="timeline-item">
                    <div class="timeline-year">${e.y}</div>
                    <div class="timeline-content">
                        <h3>${e.t}</h3>
                        <p><strong>${e.c}</strong></p>
                        <p>${e.d}</p>
                    </div>
                </div>`;
        });
    }
    
    // ========== EXPERIENCE PAGE - SKILLS BARS ==========
    const skillsContainer = document.getElementById('skillsDetailed');
    if (skillsContainer) {
        const skillData = [
            { n: 'HTML5/CSS3/JavaScript', l: '90%', i: 'fab fa-html5' }, 
            { n: 'Photography', l: '85%', i: 'fas fa-camera' }, 
            { n: 'Videography', l: '80%', i: 'fas fa-video' }, 
            { n: 'Graphic Design', l: '85%', i: 'fas fa-pen-fancy' }, 
            { n: 'React.js', l: '75%', i: 'fab fa-react' }, 
            { n: 'Adobe Suite', l: '85%', i: 'fas fa-file-image' }
        ];
        
        skillData.forEach(s => {
            skillsContainer.innerHTML += `
                <div class="skill-detailed-card">
                    <i class="${s.i}"></i>
                    <h3>${s.n}</h3>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 0%"></div>
                    </div>
                    <p>${s.l}</p>
                </div>`;
        });
        
        // Animate skill bars when visible
        const animateSkills = () => {
            const skillCards = skillsContainer.querySelectorAll('.skill-detailed-card');
            skillCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    const progressBar = card.querySelector('.skill-progress');
                    const targetWidth = card.querySelector('p').textContent;
                    if (progressBar && progressBar.style.width === '0%') {
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 200);
                    }
                }
            });
        };
        
        window.addEventListener('scroll', animateSkills);
        setTimeout(animateSkills, 500);
    }
    
    // ========== FAQ PAGE - ACCORDION & FILTERING ==========
    const faqGrid = document.getElementById('faqGrid');
    if (faqGrid) {
        // Accordion toggle
        faqGrid.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.parentElement;
                const isOpen = card.classList.contains('open');
                
                // Close all other cards
                faqGrid.querySelectorAll('.faq-card.open').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('open');
                        c.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current card
                if (isOpen) {
                    card.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
        
        // Category filtering
        const catBtns = document.querySelectorAll('.faq-cat-btn');
        const faqCards = document.querySelectorAll('.faq-card');
        
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                catBtns.forEach(b => b.classList.remove('active-cat'));
                btn.classList.add('active-cat');
                
                const cat = btn.dataset.cat;
                
                // Filter cards with staggered animation
                faqCards.forEach((card, index) => {
                    if (cat === 'all' || card.dataset.cat === cat) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50 * index);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Open first FAQ item by default
        const firstCard = faqGrid.querySelector('.faq-card');
        if (firstCard) {
            firstCard.classList.add('open');
            firstCard.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    }
    
    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = () => {
        document.querySelectorAll('.skill-card, .work-card, .testimonial-card, .timeline-item, .preview-item, .faq-card').forEach(el => { 
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('revealed'); 
            }
        });
    };
    
    window.addEventListener('scroll', revealElements, { passive: true });
    revealElements(); // Initial check on page load
    
    // ========== BACK TO TOP BUTTON ==========
    const backBtn = document.createElement('button'); 
    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'; 
    backBtn.className = 'back-to-top'; 
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.style.display = 'none'; 
    document.body.appendChild(backBtn); 
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            backBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'; 
        });
    }, { passive: true });
    
    backBtn.onclick = () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        }); 
    };
    
    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== KEYBOARD ACCESSIBILITY ==========
    document.addEventListener('keydown', (e) => {
        // Close any open modals with ESC key
        if (e.key === 'Escape') {
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) {
                lightbox.remove();
                document.body.style.overflow = '';
            }
        }
    });
});
            if (i) i.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars'; 
        };
        
        document.onclick = e => { 
            if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) { 
                navLinks.classList.remove('show'); 
                const i = mobileBtn.querySelector('i'); 
                if (i) i.className = 'fas fa-bars'; 
            } 
        };
        
        navLinks.querySelectorAll('a').forEach(l => l.onclick = () => { 
            navLinks.classList.remove('show'); 
            const i = mobileBtn.querySelector('i'); 
            if (i) i.className = 'fas fa-bars'; 
        });
    }
    
    // ========== ACTIVE NAV LINK HIGHLIGHT ==========
    document.querySelectorAll('.nav-links a').forEach(l => { 
        if (l.getAttribute('href') === currentPage || (!currentPage && l.getAttribute('href') === 'index.html')) {
            l.classList.add('active-nav'); 
        }
    });
    
    // ========== CONTACT FORM WITH EMAILJS ==========
    const form = document.getElementById('contactForm');
    if (form) {
        // Initialize EmailJS with your public key
        (function() {
            emailjs.init("j3_2-biLMkVGQsQrz");
        })();
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const messageBox = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Validation
            let errors = [];
            if (!name) errors.push('Please enter your name');
            if (!email || !/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email)) {
                errors.push('Please enter a valid email address');
            }
            if (!subject) errors.push('Please enter a subject');
            if (!message || message.length < 10) {
                errors.push('Message must be at least 10 characters');
            }
            
            if (errors.length > 0) {
                messageBox.innerHTML = `
                    <div class="alert alert-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>`;
                messageBox.style.display = 'block';
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            
            // Prepare template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'santiagogabrielstephen@gmail.com',
                reply_to: email
            };
            
            // Send email using EmailJS
            emailjs.send('service_ul3xlv9', 'template_bkw123i', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    // Success
                    messageBox.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <strong>Message Sent Successfully!</strong>
                                <p>Thank you ${name}! I'll get back to you within 24-48 hours.</p>
                            </div>
                        </div>`;
                    messageBox.style.display = 'block';
                    form.reset();
                    
                    // Scroll to message
                    messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Hide success message after 8 seconds
                    setTimeout(() => {
                        messageBox.style.display = 'none';
                    }, 8000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    // Error
                    messageBox.innerHTML = `
                        <div class="alert alert-error">
                            <i class="fas fa-exclamation-triangle"></i>
                            <div>
                                <strong>Oops! Something went wrong.</strong>
                                <p>Please try again or email me directly at santiagogabrielstephen@gmail.com</p>
                            </div>
                        </div>`;
                    messageBox.style.display = 'block';
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline';
                    btnLoading.style.display = 'none';
                });
        });
    }
    
    // ========== IMAGE SLIDER FUNCTIONALITY ==========
    const createSlider = ({ track, slides, prevBtn, nextBtn, dotsContainer, cls = 'dot' }) => { 
        if (!track || !slides.length) return; 
        let idx = 0; 
        let interval;
        
        const update = () => { 
            track.style.transform = `translateX(-${idx * 100}%)`; 
            if (dotsContainer) {
                dotsContainer.querySelectorAll(`.${cls}`).forEach((d, i) => {
                    d.className = `${cls}${i === idx ? ' active' : ''}`;
                }); 
            }
        }; 
        
        const go = i => { 
            idx = Math.max(0, Math.min(i, slides.length - 1)); 
            update(); 
        }; 
        
        const next = () => { 
            idx = idx < slides.length - 1 ? idx + 1 : 0; 
            update(); 
        }; 
        
        const prev = () => { 
            idx = idx > 0 ? idx - 1 : slides.length - 1; 
            update(); 
        }; 
        
        const startAutoPlay = () => {
            if (slides.length > 1) {
                stopAutoPlay();
                interval = setInterval(next, 4000);
            }
        };
        
        const stopAutoPlay = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };
        
        if (slides.length > 1) { 
            if (prevBtn) prevBtn.onclick = () => {
                prev();
                startAutoPlay();
            };
            
            if (nextBtn) nextBtn.onclick = () => {
                next();
                startAutoPlay();
            };
            
            startAutoPlay();
            
            // Pause on hover
            const sliderContainer = track.parentElement;
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', stopAutoPlay);
                sliderContainer.addEventListener('mouseleave', startAutoPlay);
            }
            
            if (dotsContainer) { 
                dotsContainer.innerHTML = [...Array(slides.length)].map((_, i) => 
                    `<div class="${cls}${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
                ).join(''); 
                dotsContainer.querySelectorAll(`.${cls}`).forEach(d => d.onclick = () => {
                    go(+d.dataset.index);
                    startAutoPlay();
                }); 
            } 
        } else { 
            if (prevBtn) prevBtn.style.display = 'none'; 
            if (nextBtn) nextBtn.style.display = 'none'; 
        } 
    };
    
    // Initialize homepage sliders
    document.querySelectorAll('.image-slider').forEach(s => createSlider({ 
        track: s.querySelector('.slider-track'), 
        slides: s.querySelectorAll('.slide'), 
        prevBtn: s.querySelector('.prev-btn'), 
        nextBtn: s.querySelector('.next-btn'), 
        dotsContainer: s.querySelector('.slider-dots') 
    }));
    
    // ========== LIGHTBOX MODAL ==========
    const createModal = content => { 
        const m = document.createElement('div'); 
        m.className = 'lightbox'; 
        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-modal', 'true');
        m.innerHTML = `<div class="lightbox-content" style="max-width:550px">
            <span class="close-lightbox" aria-label="Close modal">&times;</span>
            ${content}
            <button class="btn btn-primary close-btn" style="margin-top:1rem">Close</button>
        </div>`; 
        document.body.style.overflow = 'hidden'; 
        
        const close = () => { 
            m.remove(); 
            document.body.style.overflow = ''; 
            document.removeEventListener('keydown', escHandler);
        }; 
        
        const escHandler = (e) => {
            if (e.key === 'Escape') close();
        };
        
        m.querySelector('.close-lightbox').onclick = close; 
        m.querySelector('.close-btn').onclick = close; 
        m.onclick = e => { 
            if (e.target === m) close(); 
        }; 
        
        document.addEventListener('keydown', escHandler);
        
        // Focus trap
        const focusableElements = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
        
        return m; 
    };
    
    // ========== WORK PAGE - DYNAMIC PROJECTS ==========
    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
        const projects = [
    { 
        t: 'Brand Photography Portfolio', 
        c: 'Photography', 
        d: 'Luxury portraits, events, and product photography in Dubai.', 
        i: 'fa-camera', 
        imgs: ['photo1.jpg','photo2.jpg','photo3.jpg'], 
        tech: ['Canon R5','Lightroom','Photoshop'] 
    },
    { 
        t: 'Metaverse Age Training Institute', 
        c: 'Videography', 
        d: 'Promotional video for innovative educational programs.', 
        i: 'fa-video', 
        vid: 'images/welcome to metaverse (1).mp4', 
        tech: ['Premiere Pro','After Effects','Sony A7S III'] 
    },
    { 
        t: 'E-Commerce Web Platform', 
        c: 'Design', 
        d: 'Brand identity, UI/UX design, and website development.', 
        i: 'fa-store', 
        imgs: ['platform1.png','platform2.png','platform3.png'], 
        tech: ['HTML5','CSS3','React','Figma'] 
    }
];
        
        projects.forEach(p => {
            const card = document.createElement('div'); 
            card.className = 'work-card'; 
            card.dataset.category = p.c;
            
            card.innerHTML = `${p.vid ? 
                `<div class="card-img video-card-img">
                    <video class="work-video" controls>
                        <source src="${p.vid}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>` : 
                `<div class="work-image-slider">
                    <div class="work-slider-container">
                        <div class="work-slider-track">
                            ${p.imgs.map(img => `<div class="work-slide"><img src="images/${img}" alt="${p.t}" loading="lazy"></div>`).join('')}
                        </div>
                    </div>
                    <button class="work-slider-btn work-prev-btn" aria-label="Previous slide">‹</button>
                    <button class="work-slider-btn work-next-btn" aria-label="Next slide">›</button>
                    <div class="work-slider-dots"></div>
                </div>`}
                <h3>${p.t}</h3>
                <p>${p.d}</p>
                <div class="tech-tags">
                    ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="card-footer">
                    <a href="#" class="project-link">View Details <i class="fas fa-arrow-right"></i></a>
                </div>`;
                
            card.querySelector('.project-link').onclick = e => { 
                e.preventDefault(); 
                document.body.appendChild(createModal(`
                    <div class="lightbox-icon"><i class="fas ${p.i}"></i></div>
                    <h3>${p.t}</h3>
                    <p><strong>Category:</strong> ${p.c}</p>
                    <p>${p.d}</p>
                    <p><strong>Tools:</strong> ${p.tech.join(', ')}</p>
                `)); 
            };
            
            workGrid.appendChild(card);
        });
        
        // Initialize work page sliders (with slight delay to ensure DOM is ready)
        setTimeout(() => {
            document.querySelectorAll('.work-image-slider').forEach(s => createSlider({ 
                track: s.querySelector('.work-slider-track'), 
                slides: s.querySelectorAll('.work-slide'), 
                prevBtn: s.querySelector('.work-prev-btn'), 
                nextBtn: s.querySelector('.work-next-btn'), 
                dotsContainer: s.querySelector('.work-slider-dots'), 
                cls: 'work-dot' 
            }));
        }, 100);
        
        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = function() { 
                // Update active button
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active-filter')); 
                this.classList.add('active-filter'); 
                
                const cat = this.dataset.filter; 
                document.querySelectorAll('.work-card').forEach((c, index) => { 
                    const show = cat === 'all' || c.dataset.category === cat; 
                    
                    if (show) {
                        c.style.display = 'block';
                        setTimeout(() => {
                            c.style.opacity = '1'; 
                            c.style.transform = 'scale(1)';
                        }, 50 * index);
                    } else {
                        c.style.opacity = '0'; 
                        c.style.transform = 'scale(0.95)'; 
                        setTimeout(() => {
                            c.style.display = 'none';
                        }, 300);
                    }
                }); 
            };
        });
    }
    
    // ========== EXPERIENCE PAGE - TIMELINE ==========
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const experiences = [
            { 
                y: '2023-Present', 
                t: 'Freelance Creative Professional', 
                c: 'Self-Employed - Dubai', 
                d: 'Providing comprehensive creative services including coding, photography, videography, and graphic design for various clients across the UAE.' 
            }, 
            { 
                y: '2022-2023', 
                t: 'Multimedia Assistant', 
                c: 'Creative Agency', 
                d: 'Assisted in video production and photography projects, developing skills in post-production and client management.' 
            }, 
            { 
                y: '2022-Present', 
                t: 'Freelance Photographer', 
                c: 'Various Clients', 
                d: 'Specialized in events, corporate headshots, and product photography for e-commerce brands and luxury goods.' 
            }
        ];
        
        experiences.forEach(e => {
            timeline.innerHTML += `
                <div class="timeline-item">
                    <div class="timeline-year">${e.y}</div>
                    <div class="timeline-content">
                        <h3>${e.t}</h3>
                        <p><strong>${e.c}</strong></p>
                        <p>${e.d}</p>
                    </div>
                </div>`;
        });
    }
    
    // ========== EXPERIENCE PAGE - SKILLS BARS ==========
    const skillsContainer = document.getElementById('skillsDetailed');
    if (skillsContainer) {
        const skillData = [
            { n: 'HTML5/CSS3/JavaScript', l: '90%', i: 'fab fa-html5' }, 
            { n: 'Photography', l: '85%', i: 'fas fa-camera' }, 
            { n: 'Videography', l: '80%', i: 'fas fa-video' }, 
            { n: 'Graphic Design', l: '85%', i: 'fas fa-pen-fancy' }, 
            { n: 'React.js', l: '75%', i: 'fab fa-react' }, 
            { n: 'Adobe Suite', l: '85%', i: 'fas fa-file-image' }
        ];
        
        skillData.forEach(s => {
            skillsContainer.innerHTML += `
                <div class="skill-detailed-card">
                    <i class="${s.i}"></i>
                    <h3>${s.n}</h3>
                    <div class="skill-bar">
                        <div class="skill-progress" style="width: 0%"></div>
                    </div>
                    <p>${s.l}</p>
                </div>`;
        });
        
        // Animate skill bars when visible
        const animateSkills = () => {
            const skillCards = skillsContainer.querySelectorAll('.skill-detailed-card');
            skillCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    const progressBar = card.querySelector('.skill-progress');
                    const targetWidth = card.querySelector('p').textContent;
                    if (progressBar && progressBar.style.width === '0%') {
                        setTimeout(() => {
                            progressBar.style.width = targetWidth;
                        }, 200);
                    }
                }
            });
        };
        
        window.addEventListener('scroll', animateSkills);
        setTimeout(animateSkills, 500);
    }
    
    // ========== FAQ PAGE - ACCORDION & FILTERING ==========
    const faqGrid = document.getElementById('faqGrid');
    if (faqGrid) {
        // Accordion toggle
        faqGrid.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.parentElement;
                const isOpen = card.classList.contains('open');
                
                // Close all other cards
                faqGrid.querySelectorAll('.faq-card.open').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('open');
                        c.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Toggle current card
                if (isOpen) {
                    card.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
        
        // Category filtering
        const catBtns = document.querySelectorAll('.faq-cat-btn');
        const faqCards = document.querySelectorAll('.faq-card');
        
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                catBtns.forEach(b => b.classList.remove('active-cat'));
                btn.classList.add('active-cat');
                
                const cat = btn.dataset.cat;
                
                // Filter cards with staggered animation
                faqCards.forEach((card, index) => {
                    if (cat === 'all' || card.dataset.cat === cat) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50 * index);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
        
        // Open first FAQ item by default
        const firstCard = faqGrid.querySelector('.faq-card');
        if (firstCard) {
            firstCard.classList.add('open');
            firstCard.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    }
    
    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = () => {
        document.querySelectorAll('.skill-card, .work-card, .testimonial-card, .timeline-item, .preview-item, .faq-card').forEach(el => { 
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('revealed'); 
            }
        });
    };
    
    window.addEventListener('scroll', revealElements, { passive: true });
    revealElements(); // Initial check on page load
    
    // ========== BACK TO TOP BUTTON ==========
    const backBtn = document.createElement('button'); 
    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'; 
    backBtn.className = 'back-to-top'; 
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.style.display = 'none'; 
    document.body.appendChild(backBtn); 
    
    // Throttled scroll handler for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            backBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'; 
        });
    }, { passive: true });
    
    backBtn.onclick = () => {
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        }); 
    };
    
    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ========== KEYBOARD ACCESSIBILITY ==========
    document.addEventListener('keydown', (e) => {
        // Close any open modals with ESC key
        if (e.key === 'Escape') {
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) {
                lightbox.remove();
                document.body.style.overflow = '';
            }
        }
    });
});
