/**
 * META IT SCHOOL — ULTIMATE INTERACTIVE CLIENT SCRIPT
 * Full-Stack Client Logic: Intro Preloader, Custom Cursor, Theme Switcher,
 * Sticky Nav, 3D Tilt, Live Code Typewriter, Search & Filter, Dynamic Modals,
 * Form Validation, LocalStorage Sync, Carousel, Lightbox & Toast Notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. TOAST NOTIFICATION ENGINE
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, type = 'info', duration = 4000) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-fadeout');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, duration);
  }

  /* ==========================================================================
     2. INTRO ANIMATION / PRELOADER
     ========================================================================== */
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderProgressFill');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const preloaderParticles = document.getElementById('preloaderParticles');

  // Generate floating particle elements in preloader background
  if (preloaderParticles) {
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.animationDuration = `${Math.random() * 4 + 4}s`;
      preloaderParticles.appendChild(p);
    }
  }

  let loadProgress = 0;
  const loadInterval = setInterval(() => {
    loadProgress += Math.floor(Math.random() * 12) + 6;
    if (loadProgress >= 100) {
      loadProgress = 100;
      clearInterval(loadInterval);

      if (preloaderFill) preloaderFill.style.width = '100%';
      if (preloaderPercent) preloaderPercent.textContent = '100%';

      setTimeout(() => {
        if (preloader) preloader.classList.add('fade-out');
        document.body.classList.add('loaded');
        // Start hero code typewriter after intro
        startCodeTypewriter();
      }, 450);
    } else {
      if (preloaderFill) preloaderFill.style.width = `${loadProgress}%`;
      if (preloaderPercent) preloaderPercent.textContent = `${loadProgress}%`;
    }
  }, 45);

  /* ==========================================================================
     3. CUSTOM DESKTOP GLOW CURSOR
     ========================================================================== */
  const customCursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('cursorDot');

  const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

  if (!isTouchDevice() && customCursor && cursorDot) {
    document.body.classList.add('cursor-active');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.22;
      cursorY += (mouseY - cursorY) * 0.22;
      customCursor.style.left = `${cursorX}px`;
      customCursor.style.top = `${cursorY}px`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover effect on interactable elements
    const interactables = document.querySelectorAll('a, button, input, textarea, select, .glass-card, .faq-question, .filter-tab');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', () => customCursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => customCursor.classList.remove('hover'));
    });
  }

  /* ==========================================================================
     4. SCROLL PROGRESS BAR & STICKY NAVBAR
     ========================================================================== */
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link, .drawer-nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress Bar
    if (scrollProgressBar && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Sticky Navbar Glass Effect
    if (siteHeader) {
      if (scrollY > 30) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Active Section Highlight in Nav
    let currentSection = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     5. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerNavLinks = document.querySelectorAll('.drawer-nav-link');

  const openDrawer = () => {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    mobileDrawer.classList.add('active');
    mobileDrawerOverlay.classList.add('active');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (!mobileDrawer || !mobileDrawerOverlay) return;
    mobileDrawer.classList.remove('active');
    mobileDrawerOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeDrawer);

  drawerNavLinks.forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  /* ==========================================================================
     6. DARK / LIGHT MODE THEME SWITCHER
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('meta_theme') || 'dark';

  const setTheme = (theme, notify = false) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('meta_theme', theme);
    if (notify) {
      if (theme === 'dark') {
        showToast('🌙 Tungi rejim faollashtirildi', 'info', 2500);
      } else {
        showToast('☀️ Kunduzgi rejim faollashtirildi', 'info', 2500);
      }
    }
  };

  // Set initial theme
  setTheme(savedTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const nextTheme = current === 'light' ? 'dark' : 'light';
      setTheme(nextTheme, true);
    });
  }

  /* ==========================================================================
     7. LIVE HERO CODE TYPEWRITER
     ========================================================================== */
  const codeTypewriter = document.getElementById('codeTypewriter');
  const sampleCode = `// META IT SCHOOL — Kelajakni yaratamiz
const student = new FutureDeveloper({
  name: "Sizning Ismingiz",
  academy: "META IT SCHOOL (Andijon)",
  major: "Frontend & Backend Engineer",
  level: "0 dan Professionalgacha",
  skills: ["HTML5", "CSS3", "JavaScript", "Python", "Robotics"]
});

await student.startLearning();
student.buildRealProjects();
console.log("🚀 Muvaffaqiyatli IT Karyera!");`;

  function startCodeTypewriter() {
    if (!codeTypewriter) return;
    let charIndex = 0;
    codeTypewriter.textContent = '';

    const typeChar = () => {
      if (charIndex < sampleCode.length) {
        codeTypewriter.textContent += sampleCode.charAt(charIndex);
        charIndex++;
        const delay = sampleCode.charAt(charIndex) === '\n' ? 120 : (Math.random() * 25 + 15);
        setTimeout(typeChar, delay);
      }
    };
    typeChar();
  }

  /* ==========================================================================
     8. 3D TILT EFFECT ON CARDS (DESKTOP)
     ========================================================================== */
  if (!isTouchDevice()) {
    const tiltCards = document.querySelectorAll('.course-card, .ide-perspective-wrap, .feature-card, .mentor-card, .cert-card-preview');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  /* ==========================================================================
     9. ANIMATED STATISTICS COUNTERS
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach((counter) => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const stepTime = 30;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('statistics');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersAnimated) {
          countersAnimated = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(statsSection);
  }

  /* ==========================================================================
     10. COURSES FILTERING & REAL-TIME SEARCH
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const courseCards = document.querySelectorAll('.course-card');
  const courseSearchInput = document.getElementById('courseSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const coursesEmptyState = document.getElementById('coursesEmptyState');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyCoursesFilter() {
    let visibleCount = 0;

    courseCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      const keywords = (card.getAttribute('data-keywords') || '').toLowerCase();
      const title = card.querySelector('.course-title')?.textContent.toLowerCase() || '';
      const excerpt = card.querySelector('.course-excerpt')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !searchQuery ||
        title.includes(searchQuery) ||
        excerpt.includes(searchQuery) ||
        keywords.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.classList.add('revealed');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (coursesEmptyState) {
      coursesEmptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeCategory = tab.getAttribute('data-filter');
      applyCoursesFilter();
    });
  });

  if (courseSearchInput) {
    courseSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
      }
      applyCoursesFilter();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (courseSearchInput) {
        courseSearchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        applyCoursesFilter();
      }
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (courseSearchInput) courseSearchInput.value = '';
      if (searchClearBtn) searchClearBtn.style.display = 'none';
      filterTabs.forEach((t) => {
        t.classList.toggle('active', t.getAttribute('data-filter') === 'all');
      });
      applyCoursesFilter();
    });
  }

  /* ==========================================================================
     11. GALLERY FILTERING & LIGHTBOX VIEWER
     ========================================================================== */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (filter === 'all' || itemCat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Open
  document.querySelectorAll('.gallery-zoom-btn, .gallery-item-inner').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      const item = trigger.closest('.gallery-item');
      if (!item) return;
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || '';
      const desc = item.querySelector('p')?.textContent || '';

      if (lightboxModal && lightboxImg && img) {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<strong>${title}</strong> — ${desc}`;
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  /* ==========================================================================
     12. TESTIMONIALS CAROUSEL
     ========================================================================== */
  const testimonialTrack = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('carouselPrevBtn');
  const nextBtn = document.getElementById('carouselNextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  const slides = document.querySelectorAll('.testimonial-card');

  let currentSlide = 0;
  const totalSlides = slides.length;
  let autoPlayTimer = null;

  function updateCarousel(index) {
    if (index < 0) currentSlide = totalSlides - 1;
    else if (index >= totalSlides) currentSlide = 0;
    else currentSlide = index;

    if (testimonialTrack) {
      testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlide - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlide + 1);
      resetAutoPlay();
    });
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateCarousel(i);
        resetAutoPlay();
      });
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 5500);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();

  const carouselWrap = document.querySelector('.testimonial-carousel-wrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    carouselWrap.addEventListener('mouseleave', () => startAutoPlay());
  }

  /* ==========================================================================
     13. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    // Init active one
    if (item.classList.contains('active') && answer) {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all
        faqItems.forEach((other) => {
          other.classList.remove('active');
          const otherQ = other.querySelector('.faq-question');
          const otherA = other.querySelector('.faq-answer');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherA) otherA.style.maxHeight = '0px';
        });

        // Toggle clicked
        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    }
  });

  /* ==========================================================================
     14. ADDRESS COPY & NAVIGATION
     ========================================================================== */
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const fullAddressText = document.getElementById('fullAddressText');

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = fullAddressText ? fullAddressText.textContent : 'Andijon viloyati, Lenin tumani, META IT SCHOOL';
      navigator.clipboard.writeText(address).then(() => {
        showToast('📍 Manzil xotiraga nusxalandi!', 'success');
      }).catch(() => {
        showToast('Manzilni nusxalab bo‘lmadi', 'error');
      });
    });
  }

  /* ==========================================================================
     15. REGISTRATION MODAL SYSTEM & PHONE FORMATTER
     ========================================================================== */
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');
  const modalSuccessState = document.getElementById('modalSuccessState');
  const successDetailsBox = document.getElementById('successDetailsBox');
  const regCourseSelect = document.getElementById('regCourse');
  const regPhoneInput = document.getElementById('regPhone');

  // Open Modal Triggers
  document.querySelectorAll('[data-modal-open="registerModal"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const preselectedCourse = btn.getAttribute('data-course');
      if (preselectedCourse && regCourseSelect) {
        // Try to match value
        for (let i = 0; i < regCourseSelect.options.length; i++) {
          if (regCourseSelect.options[i].value === preselectedCourse || regCourseSelect.options[i].text.includes(preselectedCourse)) {
            regCourseSelect.selectedIndex = i;
            break;
          }
        }
      }

      // Reset views
      if (registerForm) registerForm.style.display = 'block';
      if (modalSuccessState) modalSuccessState.style.display = 'none';

      openModal(registerModal);
    });
  });

  // Close Modal Triggers
  document.querySelectorAll('[data-modal-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-close');
      const targetModal = document.getElementById(modalId);
      if (targetModal) closeModal(targetModal);
    });
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Close on Backdrop click
  [registerModal, document.getElementById('courseDetailModal')].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (registerModal && registerModal.classList.contains('active')) closeModal(registerModal);
      const detailModal = document.getElementById('courseDetailModal');
      if (detailModal && detailModal.classList.contains('active')) closeModal(detailModal);
      if (lightboxModal && lightboxModal.classList.contains('active')) closeLightbox();
      if (mobileDrawer && mobileDrawer.classList.contains('active')) closeDrawer();
    }
  });

  // Phone number format mask: +998 (XX) XXX-XX-XX
  if (regPhoneInput) {
    regPhoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('998')) {
        val = val.substring(3);
      }
      val = val.substring(0, 9); // max 9 digits after 998

      let formatted = '+998';
      if (val.length > 0) formatted += ` (${val.substring(0, 2)}`;
      if (val.length >= 2) formatted += `) ${val.substring(2, 5)}`;
      if (val.length >= 5) formatted += `-${val.substring(5, 7)}`;
      if (val.length >= 7) formatted += `-${val.substring(7, 9)}`;

      e.target.value = formatted;
    });

    regPhoneInput.addEventListener('focus', (e) => {
      if (!e.target.value) e.target.value = '+998 ';
    });
  }

  // Quick contact phone formatting as well
  const contactPhoneInput = document.getElementById('contactPhone');
  if (contactPhoneInput) {
    contactPhoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('998')) val = val.substring(3);
      val = val.substring(0, 9);

      let formatted = '+998';
      if (val.length > 0) formatted += ` (${val.substring(0, 2)}`;
      if (val.length >= 2) formatted += `) ${val.substring(2, 5)}`;
      if (val.length >= 5) formatted += `-${val.substring(5, 7)}`;
      if (val.length >= 7) formatted += `-${val.substring(7, 9)}`;

      e.target.value = formatted;
    });
  }

  // Form Validation & Submission Handler
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const fullName = document.getElementById('regFullName');
      const phone = document.getElementById('regPhone');
      const age = document.getElementById('regAge');
      const course = document.getElementById('regCourse');
      const preferredTime = registerForm.querySelector('input[name="preferredTime"]:checked')?.value || 'Belgilanmagan';
      const notes = document.getElementById('regNotes')?.value.trim() || '';

      // Reset errors
      document.querySelectorAll('#registerForm .error-msg').forEach((el) => el.textContent = '');
      document.querySelectorAll('#registerForm input, #registerForm select').forEach((el) => el.classList.remove('invalid'));

      // 1. Full name validation
      if (!fullName.value.trim() || fullName.value.trim().length < 3) {
        document.getElementById('regFullNameError').textContent = 'Iltimos, to‘liq ism va familiyangizni kiriting (kamida 3 belgi).';
        fullName.classList.add('invalid');
        isValid = false;
      }

      // 2. Phone validation
      const digitsOnly = phone.value.replace(/\D/g, '');
      if (digitsOnly.length !== 12) { // 998 + 9 digits = 12 digits
        document.getElementById('regPhoneError').textContent = 'Telefon raqamini to‘liq kiriting: +998 (90) 123-45-67';
        phone.classList.add('invalid');
        isValid = false;
      }

      // 3. Age validation
      const ageVal = parseInt(age.value, 10);
      if (!ageVal || ageVal < 7 || ageVal > 80) {
        document.getElementById('regAgeError').textContent = 'Yoshingizni to‘g‘ri kiriting (7 dan 80 yoshgacha).';
        age.classList.add('invalid');
        isValid = false;
      }

      // 4. Course validation
      if (!course.value) {
        document.getElementById('regCourseError').textContent = 'Iltimos, o‘zingiz qiziqqan yo‘nalishni tanlang.';
        course.classList.add('invalid');
        isValid = false;
      }

      if (!isValid) {
        showToast('Iltimos, barcha majburiy maydonlarni to‘g‘ri to‘ldiring', 'error');
        return;
      }

      // Submit State
      const submitBtn = document.getElementById('regSubmitBtn');
      const btnText = submitBtn.querySelector('.btn-text');
      const spinner = submitBtn.querySelector('.spinner');

      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Yuborilmoqda...';
      if (spinner) spinner.style.display = 'inline-block';

      // Record lead data in LocalStorage (Demo Store)
      const leadData = {
        id: `META-${Date.now()}`,
        fullName: fullName.value.trim(),
        phone: phone.value.trim(),
        age: ageVal,
        course: course.value,
        preferredTime: preferredTime,
        notes: notes,
        submittedAt: new Date().toISOString()
      };

      const existingLeads = JSON.parse(localStorage.getItem('meta_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('meta_leads', JSON.stringify(existingLeads));

      // Simulate asynchronous server / Telegram dispatch
      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Arizani Tasdiqlash';
        if (spinner) spinner.style.display = 'none';

        // Switch to success view
        registerForm.style.display = 'none';
        registerForm.reset();

        if (successDetailsBox) {
          successDetailsBox.innerHTML = `
            <div><strong>O‘quvchi:</strong> ${leadData.fullName}</div>
            <div><strong>Telefon:</strong> ${leadData.phone}</div>
            <div><strong>Yo‘nalish:</strong> ${leadData.course}</div>
            <div><strong>Aloqa vaqti:</strong> ${leadData.preferredTime}</div>
            <div style="margin-top: 8px; color: var(--accent-emerald);">✔ Ma'lumotlar saqlandi (Demo Rejim)</div>
          `;
        }

        if (modalSuccessState) {
          modalSuccessState.style.display = 'block';
        }

        showToast('Tabriklaymiz! Arizangiz muvaffaqiyatli qabul qilindi 🎉', 'success');
      }, 750);
    });
  }

  /* ==========================================================================
     16. QUICK CONTACT FORM HANDLER
     ========================================================================== */
  const quickContactForm = document.getElementById('quickContactForm');
  if (quickContactForm) {
    quickContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const phone = document.getElementById('contactPhone');
      const msg = document.getElementById('contactMessage');
      let isValid = true;

      document.querySelectorAll('#quickContactForm .error-msg').forEach((el) => el.textContent = '');

      if (!name.value.trim() || name.value.trim().length < 3) {
        document.getElementById('contactNameError').textContent = 'Ismingizni to‘liq kiriting';
        name.classList.add('invalid');
        isValid = false;
      }

      const digits = phone.value.replace(/\D/g, '');
      if (digits.length !== 12) {
        document.getElementById('contactPhoneError').textContent = 'Telefon raqamini to‘liq kiriting';
        phone.classList.add('invalid');
        isValid = false;
      }

      if (!msg.value.trim() || msg.value.trim().length < 6) {
        document.getElementById('contactMessageError').textContent = 'Xabaringizni yozing (kamida 6 belgi)';
        msg.classList.add('invalid');
        isValid = false;
      }

      if (!isValid) {
        showToast('Iltimos, barcha maydonlarni to‘ldiring', 'error');
        return;
      }

      const submitBtn = document.getElementById('contactSubmitBtn');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Yuborilmoqda...';

      // Save message to LocalStorage
      const msgData = {
        id: `MSG-${Date.now()}`,
        name: name.value.trim(),
        phone: phone.value.trim(),
        message: msg.value.trim(),
        date: new Date().toISOString()
      };
      const existingMsgs = JSON.parse(localStorage.getItem('meta_messages') || '[]');
      existingMsgs.push(msgData);
      localStorage.setItem('meta_messages', JSON.stringify(existingMsgs));

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Xabarni Yuborish';
        quickContactForm.reset();
        showToast('Xabaringiz qabul qilindi! Tez orada aloqaga chiqamiz 🚀', 'success');
      }, 600);
    });
  }

  /* ==========================================================================
     17. DYNAMIC COURSE DETAIL MODAL (SYLLABUS & DEEP DIVE)
     ========================================================================== */
  const courseDetailsData = {
    'frontend': {
      title: 'Frontend Development',
      badge: 'DASTURLASH • 0 DAN PROGACHA',
      price: '480 000 so‘m / oy',
      oldPrice: '650 000 so‘m / oy',
      duration: '~6-8 oy (haftasiga 3 kun, 2 soatdan)',
      level: 'Boshlang‘ichdan Professionalgacha',
      summary: 'HTML, CSS, JavaScript, zamonaviy interfeyslar, Git, GitHub, responsivlik va real web-saytlar yaratish bo‘yicha to‘liq amaliy kurs.',
      syllabus: [
        { mod: '1-Modul: Web Asoslari', desc: 'HTML5 semantik teglari, CSS3 asoslari, Flexbox, CSS Grid, tipografiya va ranglar uyg‘unligi.' },
        { mod: '2-Modul: Responsivlik va Animatsiyalar', desc: 'Media query, mobil versiyalarga moslash, CSS animatsiyalari va zamonaviy UX/UI tamoyillari.' },
        { mod: '3-Modul: JavaScript ES6+ Dasturlash', desc: 'O‘zgaruvchilar, funksiyalar, sikllar, massivlar, obyektlar, DOM bilan ishlash va hodisalar.' },
        { mod: '4-Modul: Asinxron JS va API', desc: 'Fetch API, Promises, async/await, JSON ma\'lumotlar bilan ishlash va tashqi serverlarga ulanish.' },
        { mod: '5-Modul: Versiya Boshqaruvi & Loyihalar', desc: 'Git buyruqlari, GitHub, jamoaviy ishlash, Webpack/Vite vositalari va Portfolio himoyasi.' }
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'React.js Asoslari', 'Git / GitHub', 'Figma to Code', 'Vite', 'Tailwind CSS'],
      audience: 'Noldan boshlab chiroyli, interaktiv web-saytlar va ilovalar yaratmoqchi bo‘lgan har bir kishi uchun.'
    },
    'backend': {
      title: 'Backend Development',
      badge: 'SERVER MUHANDISLIGI',
      price: '600 000 so‘m / oy',
      oldPrice: '800 000 so‘m / oy',
      duration: '~6-9 oy (haftasiga 3 kun, 2 soatdan)',
      level: 'O‘rta - Yuqori daraja',
      summary: 'Server tomon dasturlash, RESTful API, ma\'lumotlar bazasi (PostgreSQL, MongoDB), xavfsizlik va yuqori yuklamali arxitektura.',
      syllabus: [
        { mod: '1-Modul: Dasturlash Dvigateli (Node.js/Python)', desc: 'Asinxron dasturlash, modullar, paketlar boshqaruvi (NPM/PIP) va terminal bilan ishlash.' },
        { mod: '2-Modul: Server Arxitekturasi & REST API', desc: 'Express.js / FastAPI freymvorklari, routing, middleware va HTTP so‘rovlar mantig‘i.' },
        { mod: '3-Modul: Ma\'lumotlar Bazasi (SQL & NoSQL)', desc: 'PostgreSQL, jadvallar aloqasi, indekslar, optimallashtirish va MongoDB hujjatli bazasi.' },
        { mod: '4-Modul: Xavfsizlik & Autentifikatsiya', desc: 'JWT (JSON Web Token), parollarni hash qilish, CORS, himoyalangan endpointlar yaratish.' },
        { mod: '5-Modul: Telegram Botlar & Cloud Deploy', desc: 'Bot API orqali murakkab xizmatlar qurish, VPS serverga joylash va Docker asoslari.' }
      ],
      technologies: ['Node.js', 'Express.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Linux VPS'],
      audience: 'Dasturlarning ichki mantig‘i, serverlar va ma\'lumotlar bazalari bilan ishlashni xohlovchilar uchun.'
    },
    'security': {
      title: 'Kiberxavfsizlik & Axborot Himoyasi',
      badge: 'XAVFSIZLIK VA TARMOQ',
      price: 'Maxsus kelishuv asosida (Admin orqali)',
      oldPrice: 'Bozor standartida',
      duration: '~5-7 oy (amaliy laboratoriyalar bilan)',
      level: 'Boshlang‘ichdan Mutaxassisgacha',
      summary: 'Tarmoq xavfsizligi, axborot xavfsizligi, Linux operatsion tizimi asoslari, kriptografiya va ethical hacking amaliyotlari.',
      syllabus: [
        { mod: '1-Modul: Linux va Buyruqlar Satri', desc: 'Kali Linux, fayl tizimi huquqlari, terminal skriptlari va xavfsiz konfiguratsiya.' },
        { mod: '2-Modul: Kompyuter Tarmoqlari & Protokollar', desc: 'TCP/IP, OSI modeli, DNS, Wireshark bilan paketlarni tahlil qilish.' },
        { mod: '3-Modul: Zaifliklarni Qidirish & Penetration Test', desc: 'Port skanerlash (Nmap), zaifliklarni aniqlash va xavfsizlik auditi o‘tkazish.' },
        { mod: '4-Modul: Veb-Ilovalar Xavfsizligi (OWASP Top 10)', desc: 'SQL Injection, XSS, CSRF kabi hujum turlarini amalda sinash va ulardan himoyalanish.' },
        { mod: '5-Modul: Kriptografiya va Himoya Strategiyalari', desc: 'Shifrlash algoritmlari, sertifikatlar, xavfsizlik devorlari (Firewall) va SIEM tizimlari.' }
      ],
      technologies: ['Linux / Kali', 'Wireshark', 'Nmap', 'Burp Suite', 'Metasploit', 'Python for Security', 'Cryptography'],
      audience: 'Tizimlar xavfsizligini tekshirish, kiberhujumlarni oldini olish va axborot himoyachisi bo‘lishni istovchilar uchun.'
    },
    'computer-literacy': {
      title: 'Kompyuter Savodxonligi',
      badge: 'BOSHLANG‘ICH ASOSLAR',
      price: 'Maxsus chegirmali narx (Admin orqali)',
      oldPrice: 'Mavjud chegirma',
      duration: '~2-3 oy (amaliy mashqlar)',
      level: '0 dan Boshlovchilar',
      summary: 'Windows tizimi, Microsoft Word, Excel formulalari, PowerPoint taqdimotlari, internetdan samarali va xavfsiz foydalanish.',
      syllabus: [
        { mod: '1-Modul: Kompyuter bilan Tanishuv', desc: 'Windows sozlamalari, klaviaturada tez yozish (blind typing), fayllar va papkalar boshqaruvi.' },
        { mod: '2-Modul: Microsoft Word Professional', desc: 'Hujjatlar tayyorlash, jadvallar, shriftlar, formatlash va rasmiy blankalar yaratish.' },
        { mod: '3-Modul: Microsoft Excel & Formulalar', desc: 'Hisob-kitob jadvallari, asosiy matematik formulalar, diagrammalar va ma\'lumotlar saralash.' },
        { mod: '4-Modul: PowerPoint & Taqdimotlar', desc: 'Chiroyli slaydlar tayyorlash, animatsiyalar qo‘shish va omma oldida taqdimot qilish sirlari.' },
        { mod: '5-Modul: Internet & Bulutli Xizmatlar', desc: 'Google Workspace (Drive, Docs, Sheets), elektron pochta, xavfsiz internet qoidalari.' }
      ],
      technologies: ['Windows 11', 'MS Word', 'MS Excel', 'MS PowerPoint', 'Google Workspace', 'Tez yozish'],
      audience: 'Kompyuter bilan ishlashni endi boshlayotgan o‘quvchilar, maktab bolalari, talabalar va ish faoliyatida kerak bo‘lganlar uchun.'
    },
    'robotics': {
      title: 'Robototexnika & Arduino',
      badge: 'ELEKTRONIKA VA ROBOTLAR',
      price: 'Maxsus kelishuv asosida (Admin orqali)',
      oldPrice: 'Amaliy laboratoriya to‘plami bilan',
      duration: '~4-6 oy (jonli modellar yig‘ish)',
      level: 'Boshlang‘ich - O‘rta',
      summary: 'Arduino mikrokontrollerlari, elektronika sxemalarini yig‘ish, turli datchiklar, mexanika va avtonom robotlar konstruksiyasi.',
      syllabus: [
        { mod: '1-Modul: Elektronika Asoslari', desc: 'Elektr toki, kuchlanish, rezistorlar, svetodiodlar, non-payka (breadboard) bilan ishlash.' },
        { mod: '2-Modul: Arduino Mikrokontrolleri', desc: 'Arduino Uno/Nano tuzilishi, portlar, C++ tilida dastlabki buyruqlarni yozish.' },
        { mod: '3-Modul: Sensorlar & Datchiklar', desc: 'Masofa datchigi (Ultrasonic), harorat, yorug‘lik, harakat va ovoz datchiklarini ulash.' },
        { mod: '4-Modul: Motorlar & Mexanika', desc: 'Servomotorlar, DC motorlar, motor drayverlari va harakatlanuvchi g‘ildirakli platformalar.' },
        { mod: '5-Modul: Aqlli Loyihalar (Smart Home & Robot)', desc: 'Chiziq bo‘ylab yuruvchi robot, to‘siqlarni aylanib o‘tuvchi mashina va aqlli uy maketi.' }
      ],
      technologies: ['Arduino IDE', 'C++ Asoslari', 'Sensorlar to‘plami', 'Sxemotexnika', 'Motor Drivers', 'IoT Modullari'],
      audience: 'O‘z qo‘llari bilan haqiqiy robotlar yasash, elektronika va muhandislikka qiziquvchi yoshlar uchun.'
    },
    'it-starter': {
      title: 'IT Starter (IT ga Ilk Qadam)',
      badge: 'ILK QADAM • MANTIQIY FIKRLASH',
      price: 'Maxsus chegirmali narx (Admin orqali)',
      oldPrice: 'Yangi guruhlar uchun',
      duration: '~3 oy',
      level: 'Mutlaqo Boshlovchilar',
      summary: 'IT sohasiga endi kirayotganlar uchun kompyuter arxitekturasi, mantiqiy fikrlash, algoritm tushunchasi va yo‘nalish tanlash qo‘llanmasi.',
      syllabus: [
        { mod: '1-Modul: IT Olamiga Sayohat', desc: 'IT qanday sohalardan iborat? Frontend, Backend, Mobil, Dizayn, Kiberxavfsizlik farqlari.' },
        { mod: '2-Modul: Algoritmik Mantiq', desc: 'Algoritmlar nima? Blok-sxemalar, muammolarni bosqichma-bosqich hal qilish san\'ati.' },
        { mod: '3-Modul: Vizual Dasturlash', desc: 'Scratch va blokli dasturlash orqali birinchi interaktiv o‘yinlar va animatsiyalar yasash.' },
        { mod: '4-Modul: Kodlashga Ilk Qadam', desc: 'Python yoki JavaScript tilida eng sodda dasturlarni yaratish va kod bilan muloqot.' },
        { mod: '5-Modul: Kelajak Yo‘nalishini Tanlash', desc: 'O‘quvchining qobiliyatiga qarab asosiy professional kasb yo‘nalishini belgilab olish.' }
      ],
      technologies: ['Algoritmlar', 'Mantiqiy o‘yinlar', 'Scratch', 'Python Kirish', 'IT Yo‘l Xaritasi'],
      audience: 'IT sohasiga qiziqqan, ammo aynan qaysi yo‘nalishni tanlashni bilmayotgan maktab o‘quvchilari va yoshlar uchun.'
    }
  };

  const courseDetailModal = document.getElementById('courseDetailModal');
  const courseDetailContent = document.getElementById('courseDetailContent');
  const detailModalTitle = document.getElementById('detailModalTitle');
  const detailCourseBadge = document.getElementById('detailCourseBadge');

  document.querySelectorAll('[data-modal-open="courseDetailModal"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const courseId = btn.getAttribute('data-course-id');
      const data = courseDetailsData[courseId];

      if (!data || !courseDetailModal) return;

      if (detailModalTitle) detailModalTitle.textContent = data.title;
      if (detailCourseBadge) detailCourseBadge.textContent = data.badge;

      let syllabusHtml = data.syllabus.map((item) => `
        <div class="syllabus-item">
          <strong>${item.mod}</strong>
          <span>${item.desc}</span>
        </div>
      `).join('');

      let techTagsHtml = data.technologies.map((t) => `<span class="tech-tag">${t}</span>`).join('');

      if (courseDetailContent) {
        courseDetailContent.innerHTML = `
          <div class="course-detail-grid">
            <div>
              <p style="font-size: 1.05rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px;">
                ${data.summary}
              </p>
              <h4 class="detail-section-title">📚 Kurs O‘quv Dasturi (Modullar)</h4>
              <div class="syllabus-list">
                ${syllabusHtml}
              </div>
            </div>
            <div>
              <div class="detail-sidebar-card">
                <div style="margin-bottom: 16px;">
                  <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Kurs Narxi:</span>
                  <div style="font-size: 1.4rem; font-weight: 900; color: var(--accent-cyan);">${data.price}</div>
                  <div style="font-size: 0.85rem; text-decoration: line-through; color: var(--text-muted);">${data.oldPrice}</div>
                </div>

                <div style="margin-bottom: 14px; font-size: 0.88rem;">
                  <strong>Davomiyligi:</strong>
                  <div style="color: var(--text-secondary);">${data.duration}</div>
                </div>

                <div style="margin-bottom: 14px; font-size: 0.88rem;">
                  <strong>Darajasi:</strong>
                  <div style="color: var(--text-secondary);">${data.level}</div>
                </div>

                <div style="margin-bottom: 18px; font-size: 0.88rem;">
                  <strong>Kimlar uchun:</strong>
                  <div style="color: var(--text-secondary);">${data.audience}</div>
                </div>

                <div style="margin-bottom: 20px;">
                  <strong style="font-size: 0.85rem; display: block; margin-bottom: 6px;">O‘rganiladigan Vositalar:</strong>
                  <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${techTagsHtml}
                  </div>
                </div>

                <button class="btn btn-primary btn-block btn-glow" id="detailEnrollBtn" data-course-name="${data.title}">
                  Ushbu Kursga Yozilish
                </button>
              </div>
            </div>
          </div>
        `;

        // Bind Enroll button inside modal
        const detailEnrollBtn = document.getElementById('detailEnrollBtn');
        if (detailEnrollBtn) {
          detailEnrollBtn.addEventListener('click', () => {
            closeModal(courseDetailModal);
            setTimeout(() => {
              const courseName = detailEnrollBtn.getAttribute('data-course-name');
              if (regCourseSelect) {
                for (let i = 0; i < regCourseSelect.options.length; i++) {
                  if (regCourseSelect.options[i].value === courseName || regCourseSelect.options[i].text.includes(courseName)) {
                    regCourseSelect.selectedIndex = i;
                    break;
                  }
                }
              }
              openModal(registerModal);
            }, 250);
          });
        }
      }

      openModal(courseDetailModal);
    });
  });

  /* ==========================================================================
     18. INTERSECTION OBSERVER FOR SCROLL REVEAL
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach((el) => revealObserver.observe(el));

  // Console Welcome & Architecture Info
  console.log(
    '%c⚡ META IT SCHOOL — Web Platform Activated Successfully! ⚡\n%cVersion: 2.0 Premium | Location: Andijon, Lenin | Architecture: Vanilla ES6+',
    'color: #00D9FF; font-size: 16px; font-weight: bold;',
    'color: #94A3B8; font-size: 12px;'
  );
});
