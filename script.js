document.addEventListener('DOMContentLoaded', () => {
    // Helper: get element safely
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    // ========== MOBILE MENU ==========
    const mobileBtn = document.getElementById('mobile-menu');
    const navLinks = $('.nav-links');
    
    if (mobileBtn && navLinks) {
        const updateIcon = () => {
            const icon = mobileBtn.querySelector('i');
            if (icon) icon.className = navLinks.classList.contains('show') ? 'fas fa-times' : 'fas fa-bars';
        };
        
        mobileBtn.onclick = (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('show');
            updateIcon();
        };
        
        document.onclick = (e) => {
            if (navLinks.classList.contains('show') && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
                navLinks.classList.remove('show');
                updateIcon();
            }
        };
        
        navLinks.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navLinks.classList.remove('show');
                updateIcon();
            };
        });
    }

    // ========== PAGE TRANSITIONS ==========
    const contentWrapper = document.getElementById('contentWrapper');
    const pageOverlay = document.getElementById('pageOverlay');
    
    if (contentWrapper && pageOverlay) {
        contentWrapper.style.opacity = '1';
        
        const animateTransition = (link, targetUrl) => {
            const loadingFill = pageOverlay.querySelector('.transition-loading-bar-fill');
            const logo = pageOverlay.querySelector('.transition-logo');
            
            if (loadingFill) {
                loadingFill.style.animation = 'none';
                loadingFill.offsetHeight;
                loadingFill.style.animation = 'loadingBar 0.8s ease-in-out forwards';
            }
            if (logo) {
                logo.style.animation = 'none';
                logo.offsetHeight;
                logo.style.animation = 'logoPulse 0.8s ease-in-out infinite';
            }
            
            pageOverlay.classList.add('active');
            contentWrapper.classList.add('fade-out');
            
            setTimeout(() => { window.location.href = targetUrl; }, 800);
        };
        
        $$('a[href]').forEach(link => {
            const url = new URL(link.href, window.location.origin);
            const isInternal = url.origin === window.location.origin;
            const isSpecial = link.href.startsWith('#') || link.hasAttribute('download') || link.target || link.href.startsWith('mailto:') || link.href.startsWith('tel:') || link.href.startsWith('https://wa.me');
            
            if (isInternal && !isSpecial) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    animateTransition(link, link.href);
                });
            }
        });
        
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                pageOverlay.classList.remove('active');
                contentWrapper.classList.remove('fade-out');
                contentWrapper.style.opacity = '1';
            }
        });
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageOverlay.classList.remove('active');
                contentWrapper.classList.remove('fade-out');
            }, 100);
        });
    }
    
    // ========== ACTIVE NAV LINK ==========
window.addEventListener('load', function() {
    setTimeout(function() {
        let currentPath = window.location.pathname;
        
        let currentFile = currentPath.split('/').pop();
        
        if (currentFile === '' || currentPath === '/') {
            currentFile = 'index.html';
        }
        
        console.log('Setting active nav for:', currentFile);
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.remove('active-nav');
            
            if (href === currentFile) {
                link.classList.add('active-nav');
            }
            if (currentFile === 'index.html' && href === 'index.html') {
                link.classList.add('active-nav');
            }
        });
    }, 100);
});
observer.observe(document.body, { childList: true, subtree: true });
    
    // ========== CONTACT FORM ==========
    const form = document.getElementById('contactForm');
    if (form) {
        emailjs.init("j3_2-biLMkVGQsQrz");
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = $('#name').value.trim();
            const email = $('#email').value.trim();
            const subject = $('#subject').value.trim();
            const message = $('#message').value.trim();
            const messageBox = document.getElementById('formMessage');
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Validation
            const errors = [];
            if (!name) errors.push('Please enter your name');
            if (!email || !/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address');
            if (!subject) errors.push('Please enter a subject');
            if (!message || message.length < 10) errors.push('Message must be at least 10 characters');
            
            if (errors.length) {
                messageBox.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-circle"></i><ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul></div>`;
                messageBox.style.display = 'block';
                return;
            }
            
            // Submit
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            
            emailjs.send('service_ul3xlv9', 'template_bkw123i', {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'santiagogabrielstephen@gmail.com',
                reply_to: email
            }).then(() => {
                messageBox.innerHTML = `<div class="alert alert-success"><i class="fas fa-check-circle"></i><div><strong>Message Sent Successfully!</strong><p>Thank you ${name}! I'll get back to you within 24-48 hours.</p></div></div>`;
                messageBox.style.display = 'block';
                form.reset();
                messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => { messageBox.style.display = 'none'; }, 8000);
            }).catch(() => {
                messageBox.innerHTML = `<div class="alert alert-error"><i class="fas fa-exclamation-triangle"></i><div><strong>Oops! Something went wrong.</strong><p>Please try again or email me directly at santiagogabrielstephen@gmail.com</p></div></div>`;
                messageBox.style.display = 'block';
            }).finally(() => {
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            });
        });
    }
    
    // ========== IMAGE SLIDER ==========
    const createSlider = ({ track, slides, prevBtn, nextBtn, dotsContainer, dotClass = 'dot' }) => {
        if (!track || !slides.length) return;
        
        let currentIndex = 0;
        let interval = null;
        
        const updateSlider = () => {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            if (dotsContainer) {
                $$(`.${dotClass}`).forEach((dot, i) => {
                    dot.className = `${dotClass}${i === currentIndex ? ' active' : ''}`;
                });
            }
        };
        
        const goTo = (i) => {
            currentIndex = Math.max(0, Math.min(i, slides.length - 1));
            updateSlider();
        };
        
        const next = () => {
            currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
            updateSlider();
        };
        
        const prev = () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
            updateSlider();
        };
        
        const startAutoPlay = () => {
            if (slides.length > 1) {
                if (interval) clearInterval(interval);
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
            if (prevBtn) prevBtn.onclick = () => { prev(); startAutoPlay(); };
            if (nextBtn) nextBtn.onclick = () => { next(); startAutoPlay(); };
            startAutoPlay();
            
            const container = track.parentElement;
            if (container) {
                container.addEventListener('mouseenter', stopAutoPlay);
                container.addEventListener('mouseleave', startAutoPlay);
            }
            
            if (dotsContainer) {
                dotsContainer.innerHTML = [...Array(slides.length)].map((_, i) => `<div class="${dotClass}" data-index="${i}"></div>`).join('');
                dotsContainer.querySelectorAll(`.${dotClass}`).forEach(dot => {
                    dot.onclick = () => { goTo(parseInt(dot.dataset.index)); startAutoPlay(); };
                });
            }
        } else {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'none';
        }
    };
    
    $$('.image-slider').forEach(slider => {
        createSlider({
            track: slider.querySelector('.slider-track'),
            slides: slider.querySelectorAll('.slide'),
            prevBtn: slider.querySelector('.prev-btn'),
            nextBtn: slider.querySelector('.next-btn'),
            dotsContainer: slider.querySelector('.slider-dots')
        });
    });
    
    // ========== LIGHTBOX MODAL ==========
    const createModal = (content) => {
        const modal = document.createElement('div');
        modal.className = 'lightbox';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `<div class="lightbox-content" style="max-width:550px">
            <span class="close-lightbox" aria-label="Close modal">&times;</span>
            ${content}
            <button class="btn btn-primary close-btn" style="margin-top:1rem">Close</button>
        </div>`;
        
        document.body.style.overflow = 'hidden';
        
        const closeModal = () => {
            modal.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
        };
        
        const escHandler = (e) => { if (e.key === 'Escape') closeModal(); };
        
        modal.querySelector('.close-lightbox').onclick = closeModal;
        modal.querySelector('.close-btn').onclick = closeModal;
        modal.onclick = (e) => { if (e.target === modal) closeModal(); };
        document.addEventListener('keydown', escHandler);
        
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea');
        if (focusable.length) focusable[0].focus();
        
        return modal;
    };
    
    // ========== VIDEO PLAYER HELPERS ==========
    const formatTime = (sec) => {
        if (isNaN(sec)) return '0:00';
        const mins = Math.floor(sec / 60);
        const secs = Math.floor(sec % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    const setupVideoPlayer = (video, controlsObj) => {
        if (!video) return;
        
        const { playPause, rewind, ff, progressBar, progressFill, currentTime, duration, volumeBtn, volumeSlider } = controlsObj;
        const container = video.parentElement;
        const loadingIndicator = container?.querySelector('.loading-indicator');
        const controls = container?.querySelector('.custom-controls');
        const playIcon = playPause?.querySelector('.play-icon');
        const pauseIcon = playPause?.querySelector('.pause-icon');
        const volHighIcon = volumeBtn?.querySelector('.volume-high-icon');
        const muteIcon = volumeBtn?.querySelector('.mute-icon');
        
        let userInteracted = false;
        let interactionTimeout;
        
        const resetInteraction = () => {
            userInteracted = true;
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => { userInteracted = false; }, 30000);
        };
        
        const updatePlayUI = () => {
            if (!playIcon || !pauseIcon) return;
            const isPlaying = !video.paused;
            playIcon.style.display = isPlaying ? 'none' : 'block';
            pauseIcon.style.display = isPlaying ? 'block' : 'none';
        };
        
        const updateVolumeUI = () => {
            if (!volHighIcon || !muteIcon || !volumeSlider) return;
            const isMuted = video.muted || video.volume === 0;
            volHighIcon.style.display = isMuted ? 'none' : 'block';
            muteIcon.style.display = isMuted ? 'block' : 'none';
            volumeSlider.value = isMuted ? '0' : String(video.volume);
        };
        
        // Scroll-based play/pause with IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && video.paused && !userInteracted) {
                    video.play().catch(() => {});
                    updatePlayUI();
                } else if (!entry.isIntersecting && !video.paused && !userInteracted) {
                    video.pause();
                    updatePlayUI();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(video);
        
        // Event handlers
        const handleManualPlayPause = () => {
            resetInteraction();
            if (video.paused) video.play().catch(() => {});
            else video.pause();
            updatePlayUI();
        };
        
        if (playPause) playPause.addEventListener('click', handleManualPlayPause);
        video.addEventListener('click', handleManualPlayPause);
        video.addEventListener('play', updatePlayUI);
        video.addEventListener('pause', updatePlayUI);
        video.addEventListener('ended', () => { userInteracted = false; updatePlayUI(); });
        
        // Loading indicator
        if (loadingIndicator) {
            video.addEventListener('waiting', () => loadingIndicator.classList.remove('hidden'));
            video.addEventListener('playing', () => loadingIndicator.classList.add('hidden'));
            video.addEventListener('canplay', () => loadingIndicator.classList.add('hidden'));
        }
        
        // Rewind / Fast forward
        if (rewind) rewind.addEventListener('click', (e) => { e.stopPropagation(); resetInteraction(); video.currentTime = Math.max(0, video.currentTime - 10); });
        if (ff) ff.addEventListener('click', (e) => { e.stopPropagation(); resetInteraction(); video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); });
        
        // Progress bar
        video.addEventListener('loadedmetadata', () => { if (duration) duration.textContent = formatTime(video.duration); });
        video.addEventListener('timeupdate', () => {
            if (currentTime) currentTime.textContent = formatTime(video.currentTime);
            if (progressFill && video.duration) progressFill.style.width = `${(video.currentTime / video.duration) * 100}%`;
        });
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                resetInteraction();
                const rect = progressBar.getBoundingClientRect();
                const seek = ((e.clientX - rect.left) / rect.width) * video.duration;
                if (!isNaN(seek)) video.currentTime = seek;
            });
        }
        
        // Volume
        if (volumeBtn) volumeBtn.addEventListener('click', () => { video.muted = !video.muted; updateVolumeUI(); });
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                video.volume = parseFloat(this.value);
                video.muted = (this.value === '0');
                updateVolumeUI();
            });
            volumeSlider.addEventListener('click', (e) => e.stopPropagation());
        }
        
        // Keyboard controls
        video.setAttribute('tabindex', '0');
        video.addEventListener('keydown', (e) => {
            resetInteraction();
            const key = e.code;
            if (key === 'Space') { e.preventDefault(); video.paused ? video.play() : video.pause(); updatePlayUI(); }
            else if (key === 'ArrowLeft') { e.preventDefault(); video.currentTime = Math.max(0, video.currentTime - 5); }
            else if (key === 'ArrowRight') { e.preventDefault(); video.currentTime = Math.min(video.duration || 0, video.currentTime + 5); }
            else if (key === 'ArrowUp') { e.preventDefault(); video.volume = Math.min(1, video.volume + 0.1); video.muted = false; updateVolumeUI(); }
            else if (key === 'ArrowDown') { e.preventDefault(); video.volume = Math.max(0, video.volume - 0.1); updateVolumeUI(); }
            else if (key === 'KeyM') { e.preventDefault(); video.muted = !video.muted; updateVolumeUI(); }
        });
        
        // Auto-hide controls
        if (controls && container) {
            let hideTimeout;
            container.addEventListener('mousemove', () => {
                controls.style.opacity = '1';
                clearTimeout(hideTimeout);
                if (!video.paused) hideTimeout = setTimeout(() => { controls.style.opacity = '0'; }, 2000);
            });
            container.addEventListener('mouseleave', () => { if (!video.paused) controls.style.opacity = '0'; clearTimeout(hideTimeout); });
            container.addEventListener('mouseenter', () => { controls.style.opacity = '1'; });
        }
        
        video.muted = false;
        updatePlayUI();
        updateVolumeUI();
    };
    
    // Homepage video
    const homeVideo = document.getElementById('homepage-video');
    if (homeVideo) {
        setupVideoPlayer(homeVideo, {
            playPause: document.getElementById('home-play-pause'),
            rewind: document.getElementById('home-rewind'),
            ff: document.getElementById('home-fast-forward'),
            progressBar: document.getElementById('home-progress-bar'),
            progressFill: document.getElementById('home-progress-filled'),
            currentTime: document.getElementById('home-current-time'),
            duration: document.getElementById('home-duration'),
            volumeBtn: document.getElementById('home-volume-btn'),
            volumeSlider: document.getElementById('home-volume-slider')
        });
    }
    
    // ========== WORK PAGE ==========
    const workGrid = document.getElementById('workGrid');
    if (workGrid) {
        const projects = [
            { title: 'Brand Photography Portfolio', category: 'Photography', desc: 'Luxury portraits, events, and product photography in Dubai.', icon: 'fa-camera', images: ['photo1.jpg','photo2.jpg','photo3.jpg'], tech: ['Canon R5','Lightroom','Photoshop'] },
            { title: 'Metaverse Age Training Institute', category: 'Videography', desc: 'Promotional video for innovative educational programs.', icon: 'fa-video', video: 'images/welcome to metaverse (1).mp4', tech: ['Premiere Pro','After Effects','Sony A7S III'] },
            { title: 'E-Commerce Web Platform', category: 'Design', desc: 'Brand identity, UI/UX design, and website development.', icon: 'fa-store', images: ['platform1.png','platform2.png','platform3.png'], tech: ['HTML5','CSS3','React','Figma'] }
        ];
        
        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'work-card';
            card.dataset.category = proj.category;
            
            let mediaHtml = '';
            if (proj.video) {
                mediaHtml = `<div class="card-img video-card-img">
                    <div class="custom-video-container">
                        <div class="loading-indicator hidden"><div class="spinner"></div></div>
                        <video class="work-video work-custom-video" playsinline preload="metadata">
                            <source src="${proj.video}" type="video/mp4">
                        </video>
                        <div class="custom-controls">
                            <button class="control-button play-pause-btn work-play-pause"><svg class="play-icon" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><svg class="pause-icon" style="display:none;" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg></button>
                            <button class="control-button work-rewind"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg></button>
                            <button class="control-button work-ff"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg></button>
                            <div class="progress-container"><div class="progress-bar work-progress-bar"><div class="progress-filled work-progress-filled"></div></div><div class="time-display"><span class="work-current-time">0:00</span> / <span class="work-duration">0:00</span></div></div>
                            <button class="control-button work-volume-btn"><svg class="volume-high-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg><svg class="mute-icon" style="display:none;" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg></button>
                            <input type="range" class="volume-slider work-volume-slider" min="0" max="1" step="0.1" value="1">
                        </div>
                    </div>
                </div>`;
            } else if (proj.images) {
                mediaHtml = `<div class="work-image-slider">
                    <div class="work-slider-container"><div class="work-slider-track">${proj.images.map(img => `<div class="work-slide"><img src="images/${img}" alt="${proj.title}" loading="lazy"></div>`).join('')}</div></div>
                    <button class="work-slider-btn work-prev-btn">‹</button>
                    <button class="work-slider-btn work-next-btn">›</button>
                    <div class="work-slider-dots"></div>
                </div>`;
            }
            
            card.innerHTML = `${mediaHtml}
                <h3>${proj.title}</h3>
                <p>${proj.desc}</p>
                <div class="tech-tags">${proj.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <div class="card-footer"><a href="#" class="project-link">View Details <i class="fas fa-arrow-right"></i></a></div>`;
            
            card.querySelector('.project-link').onclick = (e) => {
                e.preventDefault();
                document.body.appendChild(createModal(`<div class="lightbox-icon"><i class="fas ${proj.icon}"></i></div><h3>${proj.title}</h3><p><strong>Category:</strong> ${proj.category}</p><p>${proj.desc}</p><p><strong>Tools:</strong> ${proj.tech.join(', ')}</p>`));
            };
            
            workGrid.appendChild(card);
        });
        
        setTimeout(() => {
            $$('.work-image-slider').forEach(slider => {
                createSlider({
                    track: slider.querySelector('.work-slider-track'),
                    slides: slider.querySelectorAll('.work-slide'),
                    prevBtn: slider.querySelector('.work-prev-btn'),
                    nextBtn: slider.querySelector('.work-next-btn'),
                    dotsContainer: slider.querySelector('.work-slider-dots'),
                    dotClass: 'work-dot'
                });
            });
            
            const workVideo = $('.work-custom-video');
            if (workVideo) {
                const container = workVideo.parentElement;
                setupVideoPlayer(workVideo, {
                    playPause: container.querySelector('.work-play-pause'),
                    rewind: container.querySelector('.work-rewind'),
                    ff: container.querySelector('.work-ff'),
                    progressBar: container.querySelector('.work-progress-bar'),
                    progressFill: container.querySelector('.work-progress-filled'),
                    currentTime: container.querySelector('.work-current-time'),
                    duration: container.querySelector('.work-duration'),
                    volumeBtn: container.querySelector('.work-volume-btn'),
                    volumeSlider: container.querySelector('.work-volume-slider')
                });
            }
        }, 100);
        
        // Filter buttons
        $$('.filter-btn').forEach(btn => {
            btn.onclick = function() {
                $$('.filter-btn').forEach(b => b.classList.remove('active-filter'));
                this.classList.add('active-filter');
                const category = this.dataset.filter;
                $$('.work-card').forEach((card, i) => {
                    const show = category === 'all' || card.dataset.category === category;
                    if (show) {
                        card.style.display = 'block';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50 * i);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            };
        });
    }
    
    // ========== TIMELINE ==========
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const experiences = [
            { year: '2023-Present', title: 'Freelance Creative Professional', company: 'Self-Employed - Dubai', desc: 'Providing comprehensive creative services including coding, photography, videography, and graphic design for various clients across the UAE.' },
            { year: '2022-2023', title: 'Multimedia Assistant', company: 'Creative Agency', desc: 'Assisted in video production and photography projects, developing skills in post-production and client management.' },
            { year: '2022-Present', title: 'Freelance Photographer', company: 'Various Clients', desc: 'Specialized in events, corporate headshots, and product photography for e-commerce brands and luxury goods.' }
        ];
        experiences.forEach(exp => {
            timeline.innerHTML += `<div class="timeline-item"><div class="timeline-year">${exp.year}</div><div class="timeline-content"><h3>${exp.title}</h3><p><strong>${exp.company}</strong></p><p>${exp.desc}</p></div></div>`;
        });
    }
    
    // ========== SKILLS BARS ==========
    const skillsContainer = document.getElementById('skillsDetailed');
    if (skillsContainer) {
        const skills = [
            { name: 'HTML5/CSS3/JavaScript', level: '90%', icon: 'fab fa-html5' },
            { name: 'Photography', level: '85%', icon: 'fas fa-camera' },
            { name: 'Videography', level: '80%', icon: 'fas fa-video' },
            { name: 'Graphic Design', level: '85%', icon: 'fas fa-pen-fancy' },
            { name: 'React.js', level: '75%', icon: 'fab fa-react' },
            { name: 'Adobe Suite', level: '85%', icon: 'fas fa-file-image' }
        ];
        
        skills.forEach(skill => {
            skillsContainer.innerHTML += `<div class="skill-detailed-card"><i class="${skill.icon}"></i><h3>${skill.name}</h3><div class="skill-bar"><div class="skill-progress" style="width:0%"></div></div><p>${skill.level}</p></div>`;
        });
        
        const animateSkills = () => {
            $$('.skill-detailed-card').forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    const progress = card.querySelector('.skill-progress');
                    const target = card.querySelector('p').textContent;
                    if (progress && progress.style.width === '0%') setTimeout(() => { progress.style.width = target; }, 200);
                }
            });
        };
        
        window.addEventListener('scroll', animateSkills);
        setTimeout(animateSkills, 500);
    }
    
    // ========== FAQ PAGE ==========
    const faqGrid = document.getElementById('faqGrid');
    if (faqGrid) {
        $$('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.parentElement;
                const isOpen = card.classList.contains('open');
                $$('.faq-card.open').forEach(c => { if (c !== card) { c.classList.remove('open'); c.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); } });
                if (isOpen) { card.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
                else { card.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
            });
        });
        
        $$('.faq-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                $$('.faq-cat-btn').forEach(b => b.classList.remove('active-cat'));
                btn.classList.add('active-cat');
                const cat = btn.dataset.cat;
                $$('.faq-card').forEach((card, i) => {
                    const show = cat === 'all' || card.dataset.cat === cat;
                    if (show) { card.style.display = 'block'; setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50 * i); }
                    else { card.style.opacity = '0'; card.style.transform = 'translateY(10px)'; setTimeout(() => { card.style.display = 'none'; }, 300); }
                });
            });
        });
        
        const firstCard = faqGrid.querySelector('.faq-card');
        if (firstCard) { firstCard.classList.add('open'); firstCard.querySelector('.faq-question').setAttribute('aria-expanded', 'true'); }
    }
    
    // ========== SCROLL REVEAL ==========
    const reveal = () => {
        $$('.skill-card, .work-card, .testimonial-card, .timeline-item, .preview-item, .faq-card').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 100) el.classList.add('revealed');
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();
    
    // ========== BACK TO TOP ==========
    const backBtn = document.createElement('button');
    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backBtn.className = 'back-to-top';
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.style.display = 'none';
    document.body.appendChild(backBtn);
    
    let scrollTimer;
    window.addEventListener('scroll', () => {
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(() => { backBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'; });
    });
    backBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // ========== SMOOTH SCROLL FOR ANCHORS ==========
    $$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target && anchor.getAttribute('href') !== '#') {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    // ========== ESCAPE KEY CLOSE MODAL ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) { lightbox.remove(); document.body.style.overflow = ''; }
        }
    });
});
