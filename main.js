/* ============================================================
   main.js v4
   - Per-element stagger reveal
   - Work upload + preview tabs
   - Certification upload + lightbox
   - Booking form
   - Active nav
   ============================================================ */

/* ── Stagger reveal ── */
const revealed = new WeakSet();
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting || revealed.has(e.target)) return;
    const siblings = Array.from(e.target.parentElement.querySelectorAll(':scope > .reveal'))
                         .filter(s => !revealed.has(s));
    (siblings.length ? siblings : [e.target]).forEach((el, i) => {
      setTimeout(() => { el.classList.add('visible'); revealed.add(el); revObs.unobserve(el); }, i * 100);
    });
  });
}, { threshold: 0.07 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ── Hero entrance ── */
document.querySelectorAll('.hero-anim').forEach((el, i) => {
  Object.assign(el.style, { opacity:'0', transform:'translateY(26px)', transition:'opacity .7s cubic-bezier(.22,1,.36,1) '+((180+i*120)/1000)+'s, transform .7s cubic-bezier(.22,1,.36,1) '+((180+i*120)/1000)+'s' });
  setTimeout(() => { el.style.opacity='1'; el.style.transform='translateY(0)'; }, 50);
});

/* ── Active nav ── */
const secs = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
function setNav() {
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 85) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+cur));
}
window.addEventListener('scroll', setNav, {passive:true}); setNav();

/* ── Work Tabs ── */
document.querySelectorAll('.work-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.work-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.work-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

/* ── Work Image Upload ── */
function handleWorkUpload(inputEl) {
  const files = Array.from(inputEl.files);
  const panel = inputEl.closest('.work-panel');
  const grid  = panel.querySelector('.work-grid');
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const card = document.createElement('div');
      card.className = 'work-card reveal';
      card.innerHTML = `
        <div class="work-img-wrap">
          <img src="${e.target.result}" alt="work" onclick="openLightbox('${e.target.result}')">
        </div>
        <div class="work-info">
          <div class="work-title">${file.name.replace(/\.[^.]+$/,'')}</div>
          <div class="work-tag">${inputEl.dataset.category}</div>
        </div>`;
      // insert before add card
      const addCard = grid.querySelector('.add-card-wrap');
      grid.insertBefore(card, addCard);
      setTimeout(() => card.classList.add('visible'), 50);
    };
    reader.readAsDataURL(file);
  });
  inputEl.value = '';
}

/* ── Cert Upload ── */
function handleCertUpload(inputEl) {
  const files = Array.from(inputEl.files);
  const grid  = document.querySelector('.cert-upload-grid');
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const item = document.createElement('div');
      item.className = 'cert-item reveal';
      item.onclick = () => openLightbox(e.target.result);
      item.innerHTML = `
        <div class="cert-thumb" style="position:relative;">
          <img src="${e.target.result}" alt="cert">
          <div class="cert-view-overlay">
            <svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            <span>View</span>
          </div>
        </div>
        <div class="cert-body">
          <div class="cert-name">${file.name.replace(/\.[^.]+$/,'')}</div>
          <div class="cert-issuer">Uploaded Certificate</div>
        </div>`;
      const addWrap = grid.querySelector('.cert-add-wrap');
      grid.insertBefore(item, addWrap);
      setTimeout(() => item.classList.add('visible'), 50);
    };
    reader.readAsDataURL(file);
  });
  inputEl.value = '';
}

/* ── Lightbox ── */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lb-img').src = src;
  lb.classList.add('open');
}
document.getElementById('lb-close').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lightbox').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('lightbox').classList.remove('open');
});

/* ── Booking form ── */
document.getElementById('booking-form').addEventListener('submit', function(e) {
  e.preventDefault();
  this.style.display = 'none';
  document.getElementById('form-success').style.display = 'block';
  setTimeout(() => {
    this.style.display = 'flex';
    document.getElementById('form-success').style.display = 'none';
    this.reset();
  }, 4000);
});
