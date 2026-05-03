document.addEventListener('DOMContentLoaded', () => {
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

            // ========== PAGE TRANSITIONS ==========
    const contentWrapper = document.getElementById('contentWrapper');
    const pageOverlay = document.getElementById('pageOverlay');
    
    if (contentWrapper && pageOverlay) {
        // Fade in on page load
        contentWrapper.style.opacity = '1';
        
        // Handle all internal navigation links
        document.querySelectorAll('a[href]').forEach(link => {
            const url = new URL(link.href, window.location.origin);
            if (url.origin === window.location.origin && 
                !link.href.startsWith('#') && 
                !link.hasAttribute('download') &&
                !link.target &&
                !link.href.startsWith('mailto:') &&
                !link.href.startsWith('tel:') &&
                !link.href.startsWith('https://wa.me')) {
                
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetUrl = this.href;
                    
                    // Reset loading animation
                    const loadingFill = pageOverlay.querySelector('.transition-loading-bar-fill');
                    if (loadingFill) {
                        loadingFill.style.animation = 'none';
                        loadingFill.offsetHeight; // Trigger reflow
                        loadingFill.style.animation = 'loadingBar 0.8s ease-in-out forwards';
                    }
                    
                    // Reset logo animation
                    const logo = pageOverlay.querySelector('.transition-logo');
                    if (logo) {
                        logo.style.animation = 'none';
                        logo.offsetHeight;
                        logo.style.animation = 'logoPulse 0.8s ease-in-out infinite';
                    }
                    
                    // Show overlay and fade out content
                    pageOverlay.classList.add('active');
                    contentWrapper.classList.add('fade-out');
                    
                    // Navigate after transition completes
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 800);
                });
            }
        });
        
        // Handle browser back/forward buttons
        window.addEventListener('pageshow', function(event) {
            if (event.persisted) {
                pageOverlay.classList.remove('active');
                contentWrapper.classList.remove('fade-out');
                contentWrapper.style.opacity = '1';
            }
        });
        
        // Remove overlay on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageOverlay.classList.remove('active');
                contentWrapper.classList.remove('fade-out');
            }, 100);
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
            
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: 'santiagogabrielstephen@gmail.com',
                reply_to: email
            };
            
            emailjs.send('service_ul3xlv9', 'template_bkw123i', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
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
                    messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => { messageBox.style.display = 'none'; }, 8000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
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
        
        const go = i => { idx = Math.max(0, Math.min(i, slides.length - 1)); update(); }; 
        const next = () => { idx = idx < slides.length - 1 ? idx + 1 : 0; update(); }; 
        const prev = () => { idx = idx > 0 ? idx - 1 : slides.length - 1; update(); }; 
        
        const startAutoPlay = () => {
            if (slides.length > 1) { stopAutoPlay(); interval = setInterval(next, 4000); }
        };
        const stopAutoPlay = () => { if (interval) { clearInterval(interval); interval = null; } };
        
        if (slides.length > 1) { 
            if (prevBtn) prevBtn.onclick = () => { prev(); startAutoPlay(); };
            if (nextBtn) nextBtn.onclick = () => { next(); startAutoPlay(); };
            startAutoPlay();
            const sliderContainer = track.parentElement;
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', stopAutoPlay);
                sliderContainer.addEventListener('mouseleave', startAutoPlay);
            }
            if (dotsContainer) { 
                dotsContainer.innerHTML = [...Array(slides.length)].map((_, i) => 
                    `<div class="${cls}${i === 0 ? ' active' : ''}" data-index="${i}"></div>`
                ).join(''); 
                dotsContainer.querySelectorAll(`.${cls}`).forEach(d => d.onclick = () => { go(+d.dataset.index); startAutoPlay(); }); 
            } 
        } else { 
            if (prevBtn) prevBtn.style.display = 'none'; 
            if (nextBtn) nextBtn.style.display = 'none'; 
        } 
    };
    
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
        
        const escHandler = (e) => { if (e.key === 'Escape') close(); };
        
        m.querySelector('.close-lightbox').onclick = close; 
        m.querySelector('.close-btn').onclick = close; 
        m.onclick = e => { if (e.target === m) close(); }; 
        document.addEventListener('keydown', escHandler);
        
        const focusableElements = m.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length > 0) focusableElements[0].focus();
        
        return m; 
    };

    // ========== CUSTOM VIDEO PLAYER HELPERS ==========
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const setupCustomVideoPlayer = (video, playPauseBtn, rewindBtn, ffBtn, progressBar, progressFilled, currentTimeEl, durationEl, volumeBtn, volumeSlider) => {
        if (!video) return;
        
        const container = video.parentElement;
        const loadingIndicator = container?.querySelector('.loading-indicator');
        const controls = container?.querySelector('.custom-controls');
        const playIcon = playPauseBtn?.querySelector('.play-icon');
        const pauseIcon = playPauseBtn?.querySelector('.pause-icon');
        const volumeHighIcon = volumeBtn?.querySelector('.volume-high-icon');
        const muteIcon = volumeBtn?.querySelector('.mute-icon');
        
        let userInteracted = false; // Track if user manually played/paused
        
        const updatePlayPauseUI = () => {
            if (!playIcon || !pauseIcon) return;
            if (video.paused) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
        };
        
        const updateVolumeUI = () => {
            if (!volumeSlider || !volumeHighIcon || !muteIcon) return;
            if (video.muted || video.volume === 0) {
                volumeHighIcon.style.display = 'none';
                muteIcon.style.display = 'block';
                volumeSlider.value = '0';
            } else {
                volumeHighIcon.style.display = 'block';
                muteIcon.style.display = 'none';
                volumeSlider.value = String(video.volume);
            }
        };
        
        // ========== SCROLL-BASED AUTOPLAY ==========
        const handleScrollPlay = () => {
            const rect = video.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Calculate how much of the video is visible
            const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
            const videoHeight = rect.height;
            const visiblePercent = visibleHeight / videoHeight;
            
            // Play when more than 50% visible, pause when less than 30% visible
            if (visiblePercent > 0.5 && video.paused && !userInteracted) {
                video.play().catch(() => {});
                updatePlayPauseUI();
            } else if (visiblePercent < 0.3 && !video.paused && !userInteracted) {
                video.pause();
                updatePlayPauseUI();
            }
        };
        
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && video.paused && !userInteracted) {
                        video.play().catch(() => {});
                        updatePlayPauseUI();
                    } else if (!entry.isIntersecting && !video.paused && !userInteracted) {
                        video.pause();
                        updatePlayPauseUI();
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(video);
        } else {
            // Fallback to scroll event
            window.addEventListener('scroll', handleScrollPlay, { passive: true });
        }
        
        // If user manually plays/pauses, stop auto-scroll behavior
        const markUserInteraction = () => {
            userInteracted = true;
            // Reset after 30 seconds of no interaction
            clearTimeout(video._interactionTimeout);
            video._interactionTimeout = setTimeout(() => {
                userInteracted = false;
            }, 30000);
        };
        
        // ========== PLAY/PAUSE ==========
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markUserInteraction();
                if (video.paused) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
                updatePlayPauseUI();
            });
        }
        
        video.addEventListener('click', () => {
            markUserInteraction();
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
            updatePlayPauseUI();
        });
        
        video.addEventListener('play', updatePlayPauseUI);
        video.addEventListener('pause', updatePlayPauseUI);
        video.addEventListener('ended', () => {
            updatePlayPauseUI();
            userInteracted = false; // Allow scroll-play again after video ends
        });
        
        // ========== LOADING INDICATOR ==========
        if (loadingIndicator) {
            video.addEventListener('waiting', () => loadingIndicator.classList.remove('hidden'));
            video.addEventListener('playing', () => loadingIndicator.classList.add('hidden'));
            video.addEventListener('canplay', () => loadingIndicator.classList.add('hidden'));
        }
        
        // ========== REWIND / FAST FORWARD ==========
        if (rewindBtn) {
            rewindBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markUserInteraction();
                video.currentTime = Math.max(0, video.currentTime - 10);
            });
        }
        if (ffBtn) {
            ffBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                markUserInteraction();
                video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
            });
        }
        
        // ========== PROGRESS BAR ==========
        video.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = formatTime(video.duration);
        });
        
        video.addEventListener('timeupdate', () => {
            if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
            if (progressFilled && video.duration) {
                progressFilled.style.width = `${(video.currentTime / video.duration) * 100}%`;
            }
        });
        
        if (progressBar) {
            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                markUserInteraction();
                const rect = progressBar.getBoundingClientRect();
                const seekTime = ((e.clientX - rect.left) / rect.width) * video.duration;
                if (!isNaN(seekTime)) video.currentTime = seekTime;
            });
        }
        
        // ========== VOLUME ==========
        if (volumeBtn) {
            volumeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                updateVolumeUI();
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                video.volume = parseFloat(this.value);
                video.muted = (this.value === '0');
                updateVolumeUI();
            });
            volumeSlider.addEventListener('click', (e) => e.stopPropagation());
        }
        
        // ========== KEYBOARD CONTROLS ==========
        video.setAttribute('tabindex', '0');
        video.addEventListener('keydown', (e) => {
            markUserInteraction();
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (video.paused) video.play().catch(() => {});
                    else video.pause();
                    updatePlayPauseUI();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 5);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    video.volume = Math.min(1, video.volume + 0.1);
                    video.muted = false;
                    updateVolumeUI();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    video.volume = Math.max(0, video.volume - 0.1);
                    updateVolumeUI();
                    break;
                case 'KeyM':
                    e.preventDefault();
                    video.muted = !video.muted;
                    updateVolumeUI();
                    break;
            }
        });
        
        // ========== AUTO-HIDE CONTROLS ==========
        if (controls && container) {
            let hideTimeout;
            container.addEventListener('mousemove', () => {
                controls.style.opacity = '1';
                clearTimeout(hideTimeout);
                if (!video.paused) {
                    hideTimeout = setTimeout(() => { controls.style.opacity = '0'; }, 2000);
                }
            });
            container.addEventListener('mouseleave', () => {
                if (!video.paused) controls.style.opacity = '0';
                clearTimeout(hideTimeout);
            });
            container.addEventListener('mouseenter', () => {
                controls.style.opacity = '1';
            });
        }
        
        // ========== MUTE BY DEFAULT FOR AUTOPLAY ==========
        // Browsers block autoplay with sound, so keep unmuted but try autoplay
        video.muted = false;
        
        // Initialize
        updatePlayPauseUI();
        updateVolumeUI();
        
        return { updatePlayPauseUI, updateVolumeUI };
    };
    
    // ========== HOMEPAGE CUSTOM VIDEO PLAYER ==========
    const homepageVideo = document.getElementById('homepage-video');
    if (homepageVideo) {
        setupCustomVideoPlayer(
            homepageVideo,
            document.getElementById('home-play-pause'),
            document.getElementById('home-rewind'),
            document.getElementById('home-fast-forward'),
            document.getElementById('home-progress-bar'),
            document.getElementById('home-progress-filled'),
            document.getElementById('home-current-time'),
            document.getElementById('home-duration'),
            document.getElementById('home-volume-btn'),
            document.getElementById('home-volume-slider')
        );
    }
    
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
        <div class="custom-video-container">
            <div class="loading-indicator hidden"><div class="spinner"></div></div>
            <video class="work-video work-custom-video" playsinline preload="metadata">
                <source src="${p.vid}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="custom-controls">
                <button class="control-button play-pause-btn work-play-pause">
                    <svg class="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <svg class="pause-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" style="display:none;"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                </button>
                <button class="control-button work-rewind">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
                <button class="control-button work-ff">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
                </button>
                <div class="progress-container">
                    <div class="progress-bar work-progress-bar"><div class="progress-filled work-progress-filled"></div></div>
                    <div class="time-display"><span class="work-current-time">0:00</span> / <span class="work-duration">0:00</span></div>
                </div>
                <button class="control-button work-volume-btn">
                    <svg class="volume-high-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    <svg class="mute-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="display:none;"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                </button>
                <input type="range" class="volume-slider work-volume-slider" min="0" max="1" step="0.1" value="1">
            </div>
        </div>
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
        
        // Initialize work page custom video player
        setTimeout(() => {
            const workVideo = document.querySelector('.work-custom-video');
            if (workVideo) {
                const container = workVideo.parentElement;
                setupCustomVideoPlayer(
                    workVideo,
                    container.querySelector('.work-play-pause'),
                    container.querySelector('.work-rewind'),
                    container.querySelector('.work-ff'),
                    container.querySelector('.work-progress-bar'),
                    container.querySelector('.work-progress-filled'),
                    container.querySelector('.work-current-time'),
                    container.querySelector('.work-duration'),
                    container.querySelector('.work-volume-btn'),
                    container.querySelector('.work-volume-slider')
                );
            }
        }, 300);
        
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
                        setTimeout(() => { c.style.display = 'none'; }, 300);
                    }
                }); 
            };
        });
    }
    
    // ========== EXPERIENCE PAGE - TIMELINE ==========
    const timeline = document.getElementById('timeline');
    if (timeline) {
        const experiences = [
            { y: '2023-Present', t: 'Freelance Creative Professional', c: 'Self-Employed - Dubai', d: 'Providing comprehensive creative services including coding, photography, videography, and graphic design for various clients across the UAE.' }, 
            { y: '2022-2023', t: 'Multimedia Assistant', c: 'Creative Agency', d: 'Assisted in video production and photography projects, developing skills in post-production and client management.' }, 
            { y: '2022-Present', t: 'Freelance Photographer', c: 'Various Clients', d: 'Specialized in events, corporate headshots, and product photography for e-commerce brands and luxury goods.' }
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
        
        const animateSkills = () => {
            const skillCards = skillsContainer.querySelectorAll('.skill-detailed-card');
            skillCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    const progressBar = card.querySelector('.skill-progress');
                    const targetWidth = card.querySelector('p').textContent;
                    if (progressBar && progressBar.style.width === '0%') {
                        setTimeout(() => { progressBar.style.width = targetWidth; }, 200);
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
        faqGrid.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const card = btn.parentElement;
                const isOpen = card.classList.contains('open');
                
                faqGrid.querySelectorAll('.faq-card.open').forEach(c => {
                    if (c !== card) {
                        c.classList.remove('open');
                        c.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    }
                });
                
                if (isOpen) {
                    card.classList.remove('open');
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('open');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        });
        
        const catBtns = document.querySelectorAll('.faq-cat-btn');
        const faqCards = document.querySelectorAll('.faq-card');
        
        catBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                catBtns.forEach(b => b.classList.remove('active-cat'));
                btn.classList.add('active-cat');
                const cat = btn.dataset.cat;
                
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
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });
        
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
            if (rect.top < window.innerHeight - 100) el.classList.add('revealed'); 
        });
    };
    
    window.addEventListener('scroll', revealElements, { passive: true });
    revealElements();
    
    // ========== BACK TO TOP BUTTON ==========
    const backBtn = document.createElement('button'); 
    backBtn.innerHTML = '<i class="fas fa-arrow-up"></i>'; 
    backBtn.className = 'back-to-top'; 
    backBtn.setAttribute('aria-label', 'Back to top');
    backBtn.style.display = 'none'; 
    document.body.appendChild(backBtn); 
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
        scrollTimeout = window.requestAnimationFrame(() => {
            backBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none'; 
        });
    }, { passive: true });
    
    backBtn.onclick = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };
    
    // ========== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // ========== KEYBOARD ACCESSIBILITY ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const lightbox = document.querySelector('.lightbox');
            if (lightbox) { lightbox.remove(); document.body.style.overflow = ''; }
        }
    });
});