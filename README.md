# Nick — Portfolio

A responsive personal portfolio featuring three real software projects:

- **Everyday** — fitness, nutrition, lifting, budgeting and Firebase synchronization.
- **Botanica** — React + TypeScript inventory and small-batch production management.
- **USF Playlist Catalog** — an unofficial, structured music archive project.

Built with plain HTML, CSS and JavaScript. Includes theme switching, accessible project filters, detailed project notes and a mobile share action. No build step or environment variables.

## GitHub Pages

This repository is ready to publish at **https://downaironly.github.io/portfolio/**.

Enable Pages once:

1. Open [Settings → Pages](https://github.com/DownAirOnly/portfolio/settings/pages).
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch **main** and folder **/(root)**, then click **Save**.

GitHub Pages will then publish changes made to `main` automatically. The URL above is the expected address; verify it after Pages has been enabled.

## Structure

- `index.html` — content and semantic markup
- `styles.css` — dark/light visual themes and responsive layout
- `script.js` — filtering, theme storage and share logic
- `favicon.svg` — site icon
- `.nojekyll` — static GitHub Pages compatibility

## Portfolio accuracy

The images in the project cards are clearly labeled conceptual illustrations, not screenshots. Project descriptions reflect the public source repositories. The current contact link leads to GitHub; no private email address is published.

For local review, serve the root folder using `python -m http.server 8080` and open `http://localhost:8080`.
