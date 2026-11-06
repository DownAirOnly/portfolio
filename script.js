(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme');
    toggle.title = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0a1115' : '#f5f6f1');
  };
  let theme = 'dark';
  try { theme = localStorage.getItem('nick-portfolio-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'); } catch {}
  applyTheme(theme === 'light' ? 'light' : 'dark');
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('nick-portfolio-theme', next); } catch {}
  });
  const filters = [...document.querySelectorAll('.filter')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(other => { const selected = other === button; other.classList.toggle('active', selected); other.setAttribute('aria-pressed', selected ? 'true' : 'false'); });
    const filter = button.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  }));
  document.getElementById('year').textContent = String(new Date().getFullYear());
  const share = document.getElementById('share-button');
  const status = document.getElementById('share-status');
  share.addEventListener('click', async () => {
    const url = window.location.href.split('#')[0];
    try {
      if (navigator.share) { await navigator.share({ title: document.title, url }); status.textContent = ''; }
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(url); status.textContent = 'Portfolio link copied.'; }
      else { status.textContent = 'Copy this address: ' + url; }
    } catch(error) { if (error.name !== 'AbortError') status.textContent = 'Copy this address: ' + url; }
  });
})();