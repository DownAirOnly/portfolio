(() => {
  const root = document.documentElement;
  const appearanceTrigger = document.getElementById('theme-toggle');
  const appearanceDialog = document.getElementById('appearance-dialog');
  const appearanceClose = document.getElementById('appearance-close');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const paletteNameInput = document.getElementById('palette-custom-name');
  const message = document.getElementById('palette-message');
  const savedList = document.getElementById('saved-palettes');
  const countLabel = document.getElementById('palette-count');
  const colorInputs = {
    background: document.getElementById('color-background'),
    surface: document.getElementById('color-surface'),
    primary: document.getElementById('color-primary'),
    secondary: document.getElementById('color-secondary')
  };
  const paletteKeys = ['background', 'surface', 'primary', 'secondary'];
  const presets = {
    duality: { background: '#090C14', surface: '#151D30', primary: '#155FE4', secondary: '#FF4B61' },
    sonic: { background: '#081528', surface: '#142D50', primary: '#2E8AFF', secondary: '#78CBFF' },
    shadow: { background: '#100A11', surface: '#281820', primary: '#E23449', secondary: '#5895FF' },
    forest: { background: '#111715', surface: '#1B2420', primary: '#C0E39F', secondary: '#70AF97' },
    arctic: { background: '#F4F6FB', surface: '#FFFFFF', primary: '#175EDB', secondary: '#D3314C' }
  };
  const storageKey = 'nick-portfolio-appearance-v1';
  const maxCustomPalettes = 12;
  const isHex = color => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);
  const copyColors = source => Object.fromEntries(paletteKeys.map(key => [key, source[key].toUpperCase()]));
  const validColors = source => source && paletteKeys.every(key => isHex(source[key]));
  let state = {
    selection: { kind: 'preset', id: 'duality' },
    draft: copyColors(presets.duality),
    customs: []
  };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored && typeof stored === 'object') {
      if (validColors(stored.draft)) state.draft = copyColors(stored.draft);
      if (Array.isArray(stored.customs)) {
        state.customs = stored.customs.filter(item =>
          item && typeof item.id === 'string' && typeof item.name === 'string' &&
          item.name.trim() && validColors(item.colors)
        ).slice(0, maxCustomPalettes).map(item => ({
          id: item.id.slice(0, 60),
          name: item.name.trim().slice(0, 32),
          colors: copyColors(item.colors)
        }));
      }
      const selection = stored.selection;
      if (selection && selection.kind === 'preset' && presets[selection.id]) {
        state.selection = { kind: 'preset', id: selection.id };
      } else if (selection && selection.kind === 'custom' &&
                 state.customs.some(item => item.id === selection.id)) {
        state.selection = { kind: 'custom', id: selection.id };
      } else if (selection && selection.kind === 'draft') {
        state.selection = { kind: 'draft' };
      }
    } else if (localStorage.getItem('nick-portfolio-theme') === 'light') {
      // Respect the earlier portfolio's saved light-theme choice.
      state.selection = { kind: 'preset', id: 'arctic' };
    }
  } catch {
    // Keep a usable default when storage is unavailable.
  }

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
  }
  function rgb(hex) {
    return [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16));
  }
  function mix(first, second, weight) {
    const a = rgb(first), b = rgb(second);
    return '#' + a.map((channel, i) =>
      Math.round(channel * (1 - weight) + b[i] * weight)
        .toString(16).padStart(2, '0')
    ).join('').toUpperCase();
  }
  function luminance(hex) {
    const channels = rgb(hex).map(value => {
      const normalized = value / 255;
      return normalized <= .04045 ? normalized / 12.92 : Math.pow((normalized + .055) / 1.055, 2.4);
    });
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  }
  function foreground(hex) {
    const lightRatio = 1.05 / (luminance(hex) + .05);
    const darkRatio = (luminance(hex) + .05) / .05;
    return lightRatio >= darkRatio ? '#FFFFFF' : '#090C14';
  }
  function selectedColors() {
    if (state.selection.kind === 'preset') return presets[state.selection.id] || presets.duality;
    if (state.selection.kind === 'custom') {
      const item = state.customs.find(entry => entry.id === state.selection.id);
      if (item) return item.colors;
    }
    return state.draft;
  }
  function applyColors(colors) {
    const light = luminance(colors.background) > .43;
    const text = light ? '#142037' : '#F7F9FE';
    const values = {
      '--bg': colors.background,
      '--card': colors.surface,
      '--raised': mix(colors.surface, text, light ? .055 : .075),
      '--text': text,
      '--sub': mix(text, colors.background, .34),
      '--line': mix(colors.surface, text, light ? .18 : .16),
      '--accent': colors.primary,
      '--accent-dark': foreground(colors.primary),
      '--secondary': colors.secondary
    };
    for (const [key, value] of Object.entries(values)) root.style.setProperty(key, value);
    root.dataset.theme = light ? 'light' : 'dark';
    root.style.colorScheme = light ? 'light' : 'dark';
    if (themeMeta) themeMeta.content = colors.background;
  }
  function showMessage(text) { message.textContent = text; }
  function setInputs(colors) {
    for (const key of paletteKeys) colorInputs[key].value = colors[key].toLowerCase();
  }
  function readInputs() {
    return Object.fromEntries(paletteKeys.map(key => [key, colorInputs[key].value.toUpperCase()]));
  }
  function updateSelectedButtons() {
    document.querySelectorAll('[data-palette]').forEach(button => {
      button.setAttribute('aria-pressed',
        String(state.selection.kind === 'preset' && state.selection.id === button.dataset.palette));
    });
    savedList.querySelectorAll('[data-custom]').forEach(button => {
      button.setAttribute('aria-pressed',
        String(state.selection.kind === 'custom' && state.selection.id === button.dataset.custom));
    });
  }
  function makeSwatch(colors) {
    const swatch = document.createElement('span');
    swatch.className = 'palette-preview';
    const attributes = { background: '--sample-bg', surface: '--sample-card',
      primary: '--sample-primary', secondary: '--sample-secondary' };
    for (const key of paletteKeys) {
      swatch.style.setProperty(attributes[key], colors[key]);
      swatch.appendChild(document.createElement('span'));
    }
    swatch.setAttribute('aria-hidden', 'true');
    return swatch;
  }
  function renderSavedPalettes() {
    savedList.replaceChildren();
    countLabel.textContent = state.customs.length ? state.customs.length + ' saved' : '';
    if (!state.customs.length) {
      const placeholder = document.createElement('p');
      placeholder.className = 'appearance-empty';
      placeholder.textContent = 'No saved palettes yet.';
      savedList.appendChild(placeholder);
      return;
    }
    for (const item of state.customs) {
      const row = document.createElement('div');
      row.className = 'saved-palette-row';
      const choose = document.createElement('button');
      choose.type = 'button';
      choose.className = 'saved-palette-select';
      choose.dataset.custom = item.id;
      choose.appendChild(makeSwatch(item.colors));
      const label = document.createElement('span');
      label.className = 'palette-name';
      label.textContent = item.name;
      choose.appendChild(label);
      choose.setAttribute('aria-label', 'Use ' + item.name + ' palette');
      choose.addEventListener('click', () => {
        state.selection = { kind: 'custom', id: item.id };
        state.draft = copyColors(item.colors);
        setInputs(item.colors);
        paletteNameInput.value = item.name;
        applyColors(item.colors);
        updateSelectedButtons();
        persist();
        showMessage('Using ' + item.name + '.');
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'saved-palette-delete';
      remove.textContent = 'Delete';
      remove.setAttribute('aria-label', 'Delete ' + item.name + ' palette');
      remove.addEventListener('click', () => {
        state.customs = state.customs.filter(entry => entry.id !== item.id);
        if (state.selection.kind === 'custom' && state.selection.id === item.id) {
          state.selection = { kind: 'preset', id: 'duality' };
          setInputs(presets.duality);
          paletteNameInput.value = '';
          applyColors(presets.duality);
        }
        renderSavedPalettes();
        updateSelectedButtons();
        persist();
        showMessage('Deleted ' + item.name + '.');
      });
      row.append(choose, remove);
      savedList.appendChild(row);
    }
    updateSelectedButtons();
  }
  function selectPreset(id) {
    if (!presets[id]) return;
    state.selection = { kind: 'preset', id };
    state.draft = copyColors(presets[id]);
    setInputs(presets[id]);
    paletteNameInput.value = '';
    applyColors(presets[id]);
    updateSelectedButtons();
    persist();
    showMessage('');
  }

  applyColors(selectedColors());
  setInputs(selectedColors());
  if (state.selection.kind === 'custom') {
    const selected = state.customs.find(item => item.id === state.selection.id);
    if (selected) paletteNameInput.value = selected.name;
  }
  renderSavedPalettes();
  updateSelectedButtons();

  appearanceTrigger.addEventListener('click', () => {
    if (typeof appearanceDialog.showModal === 'function') appearanceDialog.showModal();
    else appearanceDialog.setAttribute('open', '');
    appearanceTrigger.setAttribute('aria-expanded', 'true');
  });
  function closeAppearance() {
    if (typeof appearanceDialog.close === 'function') appearanceDialog.close();
    else appearanceDialog.removeAttribute('open');
    appearanceTrigger.setAttribute('aria-expanded', 'false');
  }
  appearanceClose.addEventListener('click', closeAppearance);
  appearanceDialog.addEventListener('close', () => appearanceTrigger.setAttribute('aria-expanded', 'false'));
  appearanceDialog.addEventListener('click', event => {
    if (event.target === appearanceDialog) closeAppearance();
  });

  document.querySelectorAll('[data-palette]').forEach(button => {
    button.addEventListener('click', () => selectPreset(button.dataset.palette));
  });
  for (const key of paletteKeys) {
    colorInputs[key].addEventListener('input', () => {
      state.draft = readInputs();
      state.selection = { kind: 'draft' };
      applyColors(state.draft);
      updateSelectedButtons();
      persist();
      showMessage('Custom colors previewed. Save them below to name this palette.');
    });
  }
  document.getElementById('palette-save').addEventListener('click', () => {
    const name = paletteNameInput.value.trim().slice(0, 32) ||
      'Custom ' + (state.customs.length + 1);
    const colors = readInputs();
    if (!validColors(colors)) return;
    let match = state.customs.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!match) {
      if (state.customs.length >= maxCustomPalettes) {
        showMessage('You can save up to 12 palettes. Delete one to make room.');
        return;
      }
      match = { id: 'custom-' + Date.now().toString(36), name, colors: copyColors(colors) };
      state.customs.push(match);
    } else {
      match.colors = copyColors(colors);
      match.name = name;
    }
    state.draft = copyColors(colors);
    state.selection = { kind: 'custom', id: match.id };
    paletteNameInput.value = name;
    applyColors(colors);
    renderSavedPalettes();
    persist();
    showMessage('Saved ' + name + '.');
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
