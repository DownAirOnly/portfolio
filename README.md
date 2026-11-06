# Nick — Portfolio

Live on GitHub Pages: https://downaironly.github.io/portfolio/

A small portfolio with links to five public projects: Everyday, Botanica, EDC Pocket, Command, and the USF Playlist Catalog.

- `index.html`: content, project links and screenshot dialog
- `styles.css`: responsive desktop/mobile layout and color themes
- `script.js`: theme switching and screenshot dialog
- `favicon.svg`: n. identity

## Project imagery

Everyday and Botanica screenshots are rendered from the **actual public application source** in GitHub Actions using fictional sample-data fixtures. A temporary build-time account harness is applied to Botanica without modifying its production repository.

EDC Pocket and Command use the separate `capture-new-app-screenshots.yml` workflow, which checks out their GitHub repositories, serves them locally, adds fictional festival picks/projects/tasks, and captures two real screens for each with Playwright. No personal accounts, cloud sign-in, or private data are used in these captures.

The USF Playlist Catalog thumbnail uses a public website capture service.

No private account data, stock records, or credentials are embedded in this portfolio.

## Publish

GitHub Pages deploys from `main` / `/(root)`. Changes to `main` deploy automatically.
