/* =========================================
   MediCare+ — Main JavaScript
   ========================================= */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  document.getElementById('backTop').classList.toggle('show', window.scrollY > 400);
  updateActiveNav();
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== ACTIVE NAV LINK ON SCROLL =====
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const step = Math.ceil(target / 80);
    const timer = setInterval(() => {
      count += step;
      if (count >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
      else el.textContent = count.toLocaleString();
    }, 20);
  });
}

// ===== SCROLL ANIMATION FOR CARDS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for siblings
      const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
      let delay = 0;
      siblings.forEach((sib, idx) => { if (sib === entry.target) delay = idx * 80; });
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// Counter observer
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounters(); heroObserver.disconnect(); }
  });
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) heroObserver.observe(statsEl);

// ===== TESTIMONIAL SLIDER =====
let currentSlide = 0;
const track = document.getElementById('testimonialTrack');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
const dotsContainer = document.getElementById('sliderDots');

function setupDots() {
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(n) {
  currentSlide = n;
  track.style.transform = `translateX(-${n * 100}%)`;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === n));
}

function nextSlide() {
  goToSlide((currentSlide + 1) % cards.length);
}

setupDots();
let sliderInterval = setInterval(nextSlide, 4500);

// Pause on hover
track?.addEventListener('mouseenter', () => clearInterval(sliderInterval));
track?.addEventListener('mouseleave', () => { sliderInterval = setInterval(nextSlide, 4500); });

// Swipe support
let touchStartX = 0;
track?.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
track?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : goToSlide((currentSlide - 1 + cards.length) % cards.length);
});

// ===== HEALTH TIPS TICKER =====
const tips = [
  "💧 Drink at least 8 glasses of water daily to stay hydrated.",
  "🏃 30 minutes of moderate exercise daily reduces heart disease risk by 35%.",
  "🥗 Eat 5 servings of fruits and vegetables every day for optimal nutrition.",
  "😴 Adults need 7–9 hours of quality sleep each night.",
  "🧘 Practice deep breathing for 5 minutes daily to reduce stress.",
  "☀️ Wear sunscreen SPF 30+ every day, even when it's cloudy.",
  "🩺 Get a full health check-up at least once a year.",
  "🚭 Quitting smoking reduces lung cancer risk by 50% within 10 years.",
  "🦷 Brush and floss twice daily to prevent gum disease.",
  "🧠 Social connections and mental wellness are as important as physical health."
];

const tickerEl = document.getElementById('tickerContent');
if (tickerEl) {
  tickerEl.textContent = tips.join('   •••   ');
}

// ===== APPOINTMENT FORM =====
const apptForm = document.getElementById('appointmentForm');
apptForm?.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const date = document.getElementById('fdate').value;
  const dept = document.getElementById('fdept').value;

  if (!name || !phone || !date || !dept) {
    showToast('⚠️ Please fill in all required fields.', 'warn');
    return;
  }

  // Simulate success
  showToast(`✅ Appointment confirmed for ${name}! We'll contact you at ${phone} shortly.`, 'success');
  apptForm.reset();
});

// ===== MODAL =====
function openModal(doctorName) {
  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalDoctorName').textContent = 'With: ' + doctorName;

  // Set min date to today
  const dateInputs = document.querySelectorAll('#modalForm input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(d => d.setAttribute('min', today));
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Modal form submit
document.getElementById('modalForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const docName = document.getElementById('modalDoctorName').textContent.replace('With: ', '');
  showToast(`✅ Appointment with ${docName} booked successfully!`, 'success');
  closeModal();
  this.reset();
});

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#0a6b5e' : '#e67e22'};
    color: white; padding: 16px 28px; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2); z-index: 99999;
    opacity: 0; transition: all 0.4s ease; max-width: 90vw; text-align: center;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== SET MIN DATE ON APPOINTMENT FORM =====
const dateInput = document.getElementById('fdate');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ===== KEYBOARD: Close modal with Escape =====
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
