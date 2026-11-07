(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function setTheme(theme) {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeMeta) themeMeta.content = theme === 'dark' ? '#111715' : '#f5f6f1';
  }

  let saved = 'dark';
  try { saved = localStorage.getItem('nick-portfolio-theme') || 'dark'; } catch {}
  setTheme(saved === 'light' ? 'light' : 'dark');
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try { localStorage.setItem('nick-portfolio-theme', next); } catch {}
  });

  const galleries = {
    everyday: {
      name: 'Everyday', url: 'https://downaironly.github.io/fitness-tracker/',
      slides: [
        { label: 'Home', image: './assets/screenshots/everyday-home.png' },
        { label: 'Lifting', image: './assets/screenshots/everyday-lifting.png' }
      ]
    },
    botanica: {
      name: 'Botanica', url: 'https://downaironly.github.io/botanica/',
      slides: [
        { label: 'Today', image: './assets/screenshots/botanica-today.png' },
        { label: 'Inventory', image: './assets/screenshots/botanica-inventory.png' }
      ]
    },
    edc: {
      name: 'EDC Pocket', url: 'https://downaironly.github.io/edc-planner/',
      slides: [
        { label: 'Lineup', image: './assets/screenshots/edc-lineup.png' },
        { label: 'My Plan', image: './assets/screenshots/edc-plan.png' }
      ]
    },
    command: {
      name: 'Command', url: 'https://downaironly.github.io/planner/',
      slides: [
        { label: 'Dashboard', image: './assets/screenshots/command-home.png' },
        { label: 'Projects', image: './assets/screenshots/command-projects.png' }
      ]
    },
    playlists: {
      name: 'USF Playlist Catalog', url: 'https://downaironly.github.io/usf-playlist-catalog/',
      slides: [
        { label: 'Website', image: 'https://image.thum.io/get/width/1000/crop/900/maxAge/24/https://downaironly.github.io/usf-playlist-catalog/' }
      ]
    }
  };

  const dialog = document.getElementById('screenshot-dialog');
  const img = document.getElementById('dialog-image');
  const link = document.getElementById('dialog-link');
  const heading = document.getElementById('dialog-title');
  const navigation = document.getElementById('gallery-nav');
  const count = document.getElementById('gallery-count');
  const previous = document.getElementById('gallery-prev');
  const next = document.getElementById('gallery-next');
  const stage = document.getElementById('gallery-stage');
  let activeGallery = null;
  let activeIndex = 0;
  let touchStart = null;

  function renderSlide() {
    if (!activeGallery) return;
    const slide = activeGallery.slides[activeIndex];
    heading.textContent = activeGallery.name + (activeGallery.slides.length > 1 ? ' — screenshots' : ' — screenshot');
    img.alt = activeGallery.name + ' — ' + slide.label + ' screenshot';
    img.src = slide.image;
    count.textContent = (activeIndex + 1) + ' of ' + activeGallery.slides.length + ' · ' + slide.label;
    navigation.hidden = activeGallery.slides.length < 2;
    link.href = activeGallery.url;
  }

  function advance(direction) {
    if (!activeGallery || activeGallery.slides.length < 2) return;
    activeIndex = (activeIndex + direction + activeGallery.slides.length) % activeGallery.slides.length;
    renderSlide();
  }

  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      const gallery = galleries[button.dataset.preview];
      if (!gallery) return;
      if (typeof dialog.showModal !== 'function') {
        window.open(gallery.url, '_blank', 'noopener');
        return;
      }
      activeGallery = gallery;
      activeIndex = 0;
      renderSlide();
      dialog.showModal();
    });
  });

  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      advance(event.key === 'ArrowRight' ? 1 : -1);
    }
  });

  stage.addEventListener('touchstart', event => {
    if (event.touches.length !== 1) return;
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  stage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) advance(dx < 0 ? 1 : -1);
  }, { passive: true });

  document.querySelectorAll('.screenshot img').forEach(image => {
    image.addEventListener('error', () => { image.hidden = true; });
  });
})();
