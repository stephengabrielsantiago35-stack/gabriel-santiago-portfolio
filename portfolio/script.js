// ========== PORTFOLIO WEBSITE - MAIN JAVASCRIPT ==========
// Gabriel Santiago Portfolio - Multidisciplinary Creative

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. MOBILE NAVIGATION TOGGLE ==========
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('show')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('show') && 
                !navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('show');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', function() {
                if (navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    const icon = mobileMenuBtn.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    
    // ========== 2. ACTIVE NAVIGATION HIGHLIGHTING ==========
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    navLinksAll.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active-nav');
        } else if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active-nav');
        }
    });
    
    // ========== 3. CONTACT FORM HANDLING ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const subject = document.getElementById('subject')?.value || '';
            const message = document.getElementById('message')?.value || '';
            
            let errors = [];
            
            if (!name.trim()) errors.push('Please enter your name');
            if (!email.trim()) errors.push('Please enter your email');
            else if (!isValidEmail(email)) errors.push('Please enter a valid email address');
            if (!subject.trim()) errors.push('Please enter a subject');
            if (!message.trim()) errors.push('Please enter your message');
            else if (message.trim().length < 10) errors.push('Message must be at least 10 characters');
            
            const formMessage = document.getElementById('formMessage');
            if (formMessage) {
                if (errors.length > 0) {
                    formMessage.innerHTML = `
                        <div class="alert alert-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <ul>${errors.map(err => `<li>${err}</li>`).join('')}</ul>
                        </div>
                    `;
                    formMessage.style.display = 'block';
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    formMessage.innerHTML = `
                        <div class="alert alert-success">
                            <i class="fas fa-check-circle"></i>
                            <p>Thank you ${name}! Your message has been sent successfully. Gabriel Santiago will get back to you within 24 hours.</p>
                        </div>
                    `;
                    formMessage.style.display = 'block';
                    contactForm.reset();
                    
                    setTimeout(() => {
                        formMessage.style.opacity = '0';
                        setTimeout(() => {
                            formMessage.style.display = 'none';
                            formMessage.style.opacity = '1';
                        }, 500);
                    }, 5000);
                    
                    console.log('Form submitted by:', name, 'Email:', email, 'Subject:', subject);
                }
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ========== 4. HOMEPAGE IMAGE SLIDER FUNCTIONALITY ==========
    function initSliders() {
        const sliders = document.querySelectorAll('.image-slider');
        
        sliders.forEach(slider => {
            const track = slider.querySelector('.slider-track');
            const slides = slider.querySelectorAll('.slide');
            const prevBtn = slider.querySelector('.prev-btn');
            const nextBtn = slider.querySelector('.next-btn');
            const dotsContainer = slider.querySelector('.slider-dots');
            
            if (!track || slides.length === 0) return;
            
            let currentIndex = 0;
            const totalSlides = slides.length;
            let autoAdvance;
            
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalSlides; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(i));
                    dotsContainer.appendChild(dot);
                }
            }
            
            function updateDots() {
                if (!dotsContainer) return;
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
            
            function goToSlide(index) {
                if (index < 0) index = 0;
                if (index >= totalSlides) index = totalSlides - 1;
                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }
            
            function nextSlide() {
                if (currentIndex < totalSlides - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }
            
            function prevSlide() {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = totalSlides - 1;
                }
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }
            
            if (totalSlides > 1) {
                if (prevBtn) prevBtn.addEventListener('click', prevSlide);
                if (nextBtn) nextBtn.addEventListener('click', nextSlide);
                
                function startAutoAdvance() {
                    if (autoAdvance) clearInterval(autoAdvance);
                    autoAdvance = setInterval(() => {
                        nextSlide();
                    }, 4000);
                }
                
                function stopAutoAdvance() {
                    if (autoAdvance) {
                        clearInterval(autoAdvance);
                        autoAdvance = null;
                    }
                }
                
                startAutoAdvance();
                slider.addEventListener('mouseenter', stopAutoAdvance);
                slider.addEventListener('mouseleave', startAutoAdvance);
            } else {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
            }
        });
    }
    
    if (document.querySelectorAll('.image-slider').length > 0) {
        setTimeout(() => {
            initSliders();
        }, 100);
    }
    
        // ========== 5. WORK PAGE DYNAMIC PROJECTS ==========
    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
        const projects = [
            {
                title: 'Brand Photography Portfolio',
                category: 'Photography',
                description: 'Luxury portraits, events, and product photography in Dubai. Professional photoshoots for brands and individuals.',
                icon: 'fa-camera',
                images: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
                technologies: ['Canon R5', 'Lightroom', 'Photoshop', 'Studio Lighting']
            },
            {
                title: 'Metaverse Age Training Institute - Promotional Video',
                category: 'Videography',
                description: 'Professional promotional video for Metaverse Age Training Institute, showcasing their innovative educational programs and futuristic learning environment.',
                icon: 'fa-video',
                videoUrl: 'images/welcome-to-metaverse.mov',
                technologies: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Sony A7S III', 'Motion Graphics']
            },
            {
                title: 'E-Commerce Web Platform',
                category: 'Design',
                description: 'Complete brand identity, UI/UX design, and custom website development for e-commerce businesses.',
                icon: 'fa-store',
                images: ['platform1.png', 'platform2.png', 'platform3.png'],
                technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Figma', 'Illustrator']
            }
        ];
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'work-card';
            projectCard.setAttribute('data-category', project.category);
            
            let mediaContent = '';
            
            if (project.videoUrl) {
                mediaContent = `
                    <div class="card-img video-card-img">
                        <video class="work-video" poster="images/video-thumbnail.jpg" controls preload="metadata">
                            <source src="${project.videoUrl}" type="video/mp4">
                            <source src="${project.videoUrl}" type="video/quicktime">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            } else if (project.images && project.images.length > 0) {
                mediaContent = `
                    <div class="work-image-slider" data-slider="work-${project.title.replace(/\s/g, '')}">
                        <div class="work-slider-container">
                            <div class="work-slider-track">
                                ${project.images.map(img => `
                                    <div class="work-slide">
                                        <img src="images/${img}" alt="${project.title}">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <button class="work-slider-btn work-prev-btn">‹</button>
                        <button class="work-slider-btn work-next-btn">›</button>
                        <div class="work-slider-dots"></div>
                    </div>
                `;
            }
            
            projectCard.innerHTML = `
                ${mediaContent}
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="card-footer">
                    <a href="#" class="project-link">View Details <i class="fas fa-arrow-right"></i></a>
                </div>
            `;
            
            const projectLink = projectCard.querySelector('.project-link');
            projectLink.addEventListener('click', function(e) {
                e.preventDefault();
                showProjectDetails(project);
            });
            
            workGrid.appendChild(projectCard);
        });
        
        function initWorkSliders() {
            const sliders = document.querySelectorAll('.work-image-slider');
            
            sliders.forEach(slider => {
                const track = slider.querySelector('.work-slider-track');
                const slides = slider.querySelectorAll('.work-slide');
                const prevBtn = slider.querySelector('.work-prev-btn');
                const nextBtn = slider.querySelector('.work-next-btn');
                const dotsContainer = slider.querySelector('.work-slider-dots');
                
                if (!track || slides.length === 0) return;
                
                let currentIndex = 0;
                const totalSlides = slides.length;
                
                if (dotsContainer && totalSlides > 1) {
                    dotsContainer.innerHTML = '';
                    for (let i = 0; i < totalSlides; i++) {
                        const dot = document.createElement('div');
                        dot.classList.add('work-dot');
                        if (i === 0) dot.classList.add('active');
                        dot.addEventListener('click', () => goToSlide(i));
                        dotsContainer.appendChild(dot);
                    }
                }
                
                function updateDots() {
                    if (!dotsContainer) return;
                    const dots = dotsContainer.querySelectorAll('.work-dot');
                    dots.forEach((dot, index) => {
                        if (index === currentIndex) {
                            dot.classList.add('active');
                        } else {
                            dot.classList.remove('active');
                        }
                    });
                }
                
                function goToSlide(index) {
                    if (index < 0) index = 0;
                    if (index >= totalSlides) index = totalSlides - 1;
                    currentIndex = index;
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    updateDots();
                }
                
                function nextSlide() {
                    if (currentIndex < totalSlides - 1) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    updateDots();
                }
                
                function prevSlide() {
                    if (currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = totalSlides - 1;
                    }
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                    updateDots();
                }
                
                if (totalSlides > 1) {
                    prevBtn.addEventListener('click', prevSlide);
                    nextBtn.addEventListener('click', nextSlide);
                } else {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                }
            });
        }
        
        setTimeout(() => {
            initWorkSliders();
        }, 100);
        
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const category = this.getAttribute('data-filter');
                    filterBtns.forEach(b => b.classList.remove('active-filter'));
                    this.classList.add('active-filter');
                    
                    const allCards = document.querySelectorAll('.work-card');
                    allCards.forEach(card => {
                        if (category === 'all' || card.getAttribute('data-category') === category) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            card.style.opacity = '0';
                            card.style.transform = 'scale(0.95)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }
    
    function showProjectDetails(project) {
        const modal = document.createElement('div');
        modal.className = 'lightbox';
        modal.innerHTML = `
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <div class="lightbox-icon">
                    <i class="fas ${project.icon}"></i>
                </div>
                <h3>${project.title}</h3>
                <p><strong>Category:</strong> ${project.category}</p>
                <p>${project.description}</p>
                <p><strong>Tools/Technologies:</strong> ${project.technologies.join(', ')}</p>
                <button class="btn btn-primary close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        const closeBtn = modal.querySelector('.close-lightbox');
        const closeModalBtn = modal.querySelector('.close-btn');
        
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // ========== 6. EXPERIENCE PAGE ==========
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const experiences = [
            {
                year: '2023 - Present',
                title: 'Freelance Creative Professional',
                company: 'Self-Employed - Dubai, UAE',
                description: 'Providing coding, photography, videography, and graphic design services to clients across the UAE.'
            },
            {
                year: '2023 - 2024',
                title: 'Junior Creative Designer',
                company: 'Al Futtaim Group - Dubai, UAE',
                description: 'Worked on digital content creation, web development projects, and visual design for marketing campaigns.'
            },
            {
                year: '2022 - 2023',
                title: 'Multimedia Assistant',
                company: 'Creative Agency - Dubai, UAE',
                description: 'Assisted with video production, photography shoots, and graphic design for various client projects.'
            },
            {
                year: '2022 - Present',
                title: 'Freelance Photographer & Videographer',
                company: 'Various Clients - UAE',
                description: 'Covered events, corporate shoots, product photography, and brand videos for multiple companies.'
            }
        ];
        
        experiences.forEach(exp => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.innerHTML = `
                <div class="timeline-year">${exp.year}</div>
                <div class="timeline-content">
                    <h3>${exp.title}</h3>
                    <p><strong>${exp.company}</strong></p>
                    <p>${exp.description}</p>
                </div>
            `;
            timeline.appendChild(timelineItem);
        });
    }
    
    const skillsDetailed = document.getElementById('skillsDetailed');
    if (skillsDetailed) {
        const skillsList = [
            { name: 'HTML5/CSS3/JavaScript', level: '90%', icon: 'fab fa-html5' },
            { name: 'Photography', level: '85%', icon: 'fas fa-camera' },
            { name: 'Videography & Editing', level: '80%', icon: 'fas fa-video' },
            { name: 'Graphic Design', level: '85%', icon: 'fas fa-pen-fancy' },
            { name: 'React.js / Frontend', level: '75%', icon: 'fab fa-react' },
            { name: 'Adobe Creative Suite', level: '85%', icon: 'fas fa-adobe' }
        ];
        
        skillsList.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-detailed-card';
            skillCard.innerHTML = `
                <i class="${skill.icon}"></i>
                <h3>${skill.name}</h3>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.level}"></div>
                </div>
                <p>${skill.level}</p>
            `;
            skillsDetailed.appendChild(skillCard);
        });
    }
    
            // ========== 7. GALLERY PAGE WITH YOUR ACTUAL WORKS ==========
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryGrid) {
        const galleryItems = [
            // Photography Works
            { 
                title: 'Luxury Portrait Photography', 
                type: 'Photography', 
                image: 'images/photo1.jpg',
                icon: 'fa-camera',
                description: 'Professional portrait session for a luxury brand in Dubai.', 
                fullDescription: 'This portrait session was shot at a private villa in Dubai. Using natural light and professional editing, we captured the essence of luxury and elegance.' 
            },
            { 
                title: 'Event Coverage - Corporate Gala', 
                type: 'Photography', 
                image: 'images/photo2.jpg',
                icon: 'fa-camera-retro',
                description: 'Corporate event photography at Dubai World Trade Centre.', 
                fullDescription: 'Covered a high-profile corporate gala with over 500 attendees. Captured keynote speeches, networking moments, and candid interactions.' 
            },
            { 
                title: 'Product Photography', 
                type: 'Photography', 
                image: 'images/photo3.jpg',
                icon: 'fa-box',
                description: 'Studio product photography for e-commerce brand.', 
                fullDescription: 'Professional product photography for a luxury watch brand. Each piece was carefully lit to highlight details and craftsmanship.' 
            },
            
            // Videography Works - Metaverse Age Training Institute
            { 
                title: 'Metaverse Age Training Institute - Promo Video', 
                type: 'Videography', 
                image: 'images/video-thumbnail.jpg',
                icon: 'fa-video',
                description: 'Promotional video for Metaverse Age Training Institute.', 
                fullDescription: 'Created a professional promotional video for Metaverse Age Training Institute showcasing their innovative educational programs, state-of-the-art facilities, and futuristic approach to learning. The video highlights their commitment to preparing students for the digital age.' 
            },
            { 
                title: 'Metaverse Age - Student Testimonials', 
                type: 'Videography', 
                image: 'images/video-thumbnail.jpg',
                icon: 'fa-users',
                description: 'Student success stories and testimonials.', 
                fullDescription: 'Interview-style video featuring Metaverse Age Training Institute students sharing their success stories and learning experiences.' 
            },
            { 
                title: 'Metaverse Age - Course Highlights', 
                type: 'Videography', 
                image: 'images/video-thumbnail.jpg',
                icon: 'fa-graduation-cap',
                description: 'Overview of courses and programs offered.', 
                fullDescription: 'Dynamic video showcasing the various courses and programs available at Metaverse Age Training Institute, including AI, blockchain, and metaverse technologies.' 
            },
            
            // Design & Coding Works
            { 
                title: 'Brand Identity Design', 
                type: 'Design', 
                image: 'images/platform1.png',
                icon: 'fa-pen-nib',
                description: 'Complete brand identity for a startup company.', 
                fullDescription: 'Developed logo, color palette, typography, and brand guidelines. The client now has a cohesive brand presence.' 
            },
            { 
                title: 'UI/UX Website Design', 
                type: 'Design', 
                image: 'images/platform2.png',
                icon: 'fa-laptop-code',
                description: 'User interface design for e-commerce platform.', 
                fullDescription: 'Designed a fully responsive e-commerce website with focus on user experience and conversion optimization.' 
            },
            { 
                title: 'E-Commerce Development', 
                type: 'Coding', 
                image: 'images/platform3.png',
                icon: 'fa-store',
                description: 'Full-stack e-commerce website development.', 
                fullDescription: 'Built a complete e-commerce platform with shopping cart, payment integration, and admin dashboard.' 
            }
        ];
        
        galleryItems.forEach(item => {
            const galleryCard = document.createElement('div');
            galleryCard.className = 'gallery-card';
            galleryCard.setAttribute('data-type', item.type);
            
            // Use actual image if available, otherwise show icon
            let mediaContent = '';
            if (item.image && item.image !== 'images/video-thumbnail.jpg') {
                mediaContent = `<img src="${item.image}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">`;
            } else if (item.type === 'Videography') {
                mediaContent = `
                    <div style="position: relative; width:100%; height:100%; background: #1A1A1A; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${item.icon}" style="font-size: 3rem; color: #2FA4E7;"></i>
                        <div style="position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); padding: 4px 8px; border-radius: 20px; font-size: 0.7rem;">
                            <i class="fas fa-play"></i> Video
                        </div>
                    </div>
                `;
            } else {
                mediaContent = `<i class="fas ${item.icon}" style="font-size: 3rem; color: #2FA4E7;"></i>`;
            }
            
            galleryCard.innerHTML = `
                <div class="card-img gallery-img">
                    ${mediaContent}
                </div>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                    <span style="margin-left: 8px;">View Details</span>
                </div>
            `;
            
            galleryCard.addEventListener('click', function() {
                showGalleryDetails(item);
            });
            
            galleryGrid.appendChild(galleryCard);
        });
    }
    
    function showGalleryDetails(item) {
        const modal = document.createElement('div');
        modal.className = 'lightbox';
        
        let mediaHtml = '';
        if (item.type === 'Videography') {
            mediaHtml = `
                <div class="lightbox-video" style="margin: 1rem 0;">
                    <video controls style="width:100%; max-height: 300px; border-radius: 12px;">
                        <source src="images/welcome-to-metaverse.mov" type="video/mp4">
                        <source src="images/welcome-to-metaverse.mov" type="video/quicktime">
                        Your browser does not support the video tag.
                    </video>
                </div>
            `;
        } else if (item.image && item.image !== 'images/video-thumbnail.jpg') {
            mediaHtml = `<img src="${item.image}" alt="${item.title}" style="width:100%; max-height: 300px; object-fit: cover; border-radius: 12px; margin: 1rem 0;">`;
        } else {
            mediaHtml = `<div class="lightbox-icon"><i class="fas ${item.icon}" style="font-size: 4rem; color: #2FA4E7;"></i></div>`;
        }
        
        modal.innerHTML = `
            <div class="lightbox-content" style="max-width: 550px;">
                <span class="close-lightbox">&times;</span>
                ${mediaHtml}
                <h3 style="margin-top: 0;">${item.title}</h3>
                <p><strong>Category:</strong> ${item.type}</p>
                <p>${item.fullDescription || item.description}</p>
                <button class="btn btn-primary close-btn" style="margin-top: 1rem;">Close</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        const closeBtn = modal.querySelector('.close-lightbox');
        const closeModalBtn = modal.querySelector('.close-btn');
        
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // ========== 8. SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.skill-card, .work-card, .testimonial-card, .timeline-item, .preview-item');
    
    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };
    
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
    
    // ========== 9. BACK TO TOP BUTTON ==========
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
        } else {
            backToTop.style.display = 'none';
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    console.log('Gabriel Santiago Portfolio - Fully Loaded');
});