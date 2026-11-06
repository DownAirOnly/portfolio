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
  const screenshots = {
    everyday: { name: 'Everyday', url: 'https://downaironly.github.io/fitness-tracker/', image: './assets/screenshots/everyday-home.png' },
    botanica: { name: 'Botanica', url: 'https://downaironly.github.io/botanica/', image: './assets/screenshots/botanica-today.png' },
    playlists: { name: 'USF Playlist Catalog', url: 'https://downaironly.github.io/usf-playlist-catalog/' }
  };
  const dialog = document.getElementById('screenshot-dialog');
  const img = document.getElementById('dialog-image');
  const link = document.getElementById('dialog-link');
  const heading = document.getElementById('dialog-title');
  document.querySelectorAll('[data-preview]').forEach(button => {
    button.addEventListener('click', () => {
      const info = screenshots[button.dataset.preview];
      if (!info) return;
      heading.textContent = info.name + ' — public screenshot';
      img.alt = 'Capture of the public ' + info.name + ' website';
      img.src = info.image || 'https://image.thum.io/get/width/1000/crop/900/maxAge/24/' + info.url;
      link.href = info.url;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else window.open(info.url, '_blank', 'noopener');
    });
  });
  document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelectorAll('.screenshot img').forEach(img => {
    img.addEventListener('error', () => { img.hidden = true; });
  });
})();