# Nick — Portfolio

Live on GitHub Pages: https://downaironly.github.io/portfolio/

A small portfolio with links to five public projects: Everyday, Botanica, EDC Pocket, Command, and the USF Playlist Catalog.

- `index.html`: content, project links and screenshot dialog
- `styles.css`: responsive desktop/mobile layout and color themes
- `script.js`: appearance presets, local Studio controls, screenshot galleries, and update checks
- `favicon.svg`: n. identity

## Project imagery

Everyday and Botanica screenshots are rendered from the **actual public application source** in GitHub Actions using fictional sample-data fixtures. A temporary build-time account harness is applied to Botanica without modifying its production repository.

EDC Pocket and Command use the separate `capture-new-app-screenshots.yml` workflow, which checks out their GitHub repositories, serves them locally, adds fictional festival picks/projects/tasks, and captures two real screens for each with Playwright. No personal accounts, cloud sign-in, or private data are used in these captures.

The USF Playlist Catalog thumbnail uses a public website capture service.

No private account data, stock records, or credentials are embedded in this portfolio.

## Publish

GitHub Pages deploys from `main` / `/(root)`. Changes to `main` deploy automatically.

## Fast updates (including iPhone Home Screen)

This static site does not register a service worker. GitHub Pages and iOS can still cache files.

- The HTML uses a `portfolio-release` meta value and requests CSS/JavaScript with a matching version query.
- **Bump that meta value in `index.html` whenever you publish a new change** (for example, `studio-20261107-2`). The browser checks it when returning to the app and reloads when an updated release is visible on GitHub Pages.
- In installed standalone mode, CSS and JavaScript also get fresh query URLs at launch to reduce stale web-app assets.
- In **Appearance > Open Studio > Updates**, `Load latest version` does a full cache-busted navigation, including HTML, CSS and JS. This does not clear local design preferences.
- If an older installed web app predates the loader and still shows old controls, close it completely and reopen it after deployment; if the old HTML remains stuck, reopening the URL in Safari and replacing the old Home Screen icon may be necessary.

## Studio

Open **Appearance > Open Studio**. Change project layout, headline typography, width, spacing, card corners, compactness, or whether the mobile project directory is displayed. Each adjustment previews on the page and is saved to this browser under `nick-portfolio-studio-v1`.

**Copy design settings** exports a JSON snapshot of the layout settings and selected appearance colors. These are local previews, not GitHub commits. To make a new design the public default, apply the exported choices to the tracked site CSS/HTML and merge a PR.

The original Appearance picker continues to manage built-in and custom palettes independently.
