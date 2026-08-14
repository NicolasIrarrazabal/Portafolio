/* =========================================================
   NAV: mobile toggle
   ========================================================= */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// close mobile menu after clicking a link
navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* =========================================================
   NAV: scroll-spy (highlight current section)
   ========================================================= */
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('[data-nav]');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

sections.forEach((section) => spyObserver.observe(section));

/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */
const revealTargets = document.querySelectorAll(
  '.section__intro, .specs, .skill-card, .proc-card, .log__entry, .contact__grid > *'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

/* =========================================================
   HERO: uptime counter (fun nod to "STATUS: ONLINE")
   ========================================================= */
const uptimeEl = document.getElementById('uptime');
const startTime = Date.now();

function formatUptime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

setInterval(() => {
  uptimeEl.textContent = formatUptime(Date.now() - startTime);
}, 1000);

/* =========================================================
   PROJECTS: filter by category
   ========================================================= */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.proc-card');
const emptyMessage = document.getElementById('filtersEmpty');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    const filter = btn.dataset.filter;
    let visibleCount = 0;

    projectCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount !== 0;
  });
});

/* =========================================================
   CONTACT FORM: client-side validation (no backend)
   ========================================================= */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const validators = {
  name: (value) => value.trim().length >= 2 || 'Ingresa tu nombre completo.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Ingresa un correo válido.',
  message: (value) => value.trim().length >= 10 || 'Cuéntame un poco más (mínimo 10 caracteres).',
};

function validateField(field) {
  const row = field.closest('.form__row');
  const errorEl = row.querySelector('.form__error');
  const result = validators[field.name](field.value);

  if (result === true) {
    row.classList.remove('has-error');
    errorEl.textContent = '';
    return true;
  }

  row.classList.add('has-error');
  errorEl.textContent = result;
  return false;
}

form.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const fields = [...form.querySelectorAll('input, textarea')];
  const isValid = fields.map(validateField).every(Boolean);

  if (!isValid) {
    formStatus.style.color = 'var(--coral)';
    formStatus.textContent = 'Revisa los campos marcados antes de enviar.';
    return;
  }

  // No hay backend conectado: se simula el envío para esta entrega.
  const submitBtn = form.querySelector('.form__submit');
  submitBtn.disabled = true;
  formStatus.style.color = 'var(--amber)';
  formStatus.textContent = 'Enviando...';

  setTimeout(() => {
    formStatus.style.color = 'var(--green)';
    formStatus.textContent = '✓ Mensaje listo para enviar (conecta este formulario a tu backend o servicio de correo).';
    submitBtn.disabled = false;
    form.reset();
  }, 700);
});

/* =========================================================
   FOOTER: current year
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();
