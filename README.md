# Nick — Portfolio

Live on GitHub Pages: https://downaironly.github.io/portfolio/

A projects-first portfolio featuring Everyday, Command, Botanica, Fest, and the USF Playlist Catalog. Each project links to its live site and source repository.

- `index.html`: project cards, live-site title links, repository links, About, and Appearance/Studio UI
- `styles.css`: responsive desktop/mobile layout and color themes
- `script.js`: appearance presets, local Studio controls, and update checks
- `favicon.svg`: n. identity

## Project imagery

Everyday and Botanica screenshots are rendered from the **actual public application source** in GitHub Actions using fictional sample-data fixtures. A temporary build-time account harness is applied to Botanica without modifying its production repository.

Fest and Command use the separate `capture-new-app-screenshots.yml` workflow, which checks out their GitHub repositories, serves them locally, adds fictional festival picks/projects/tasks, and captures two real screens for each with Playwright. No personal accounts, cloud sign-in, or private data are used in these captures.

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

Open **Appearance > Open Studio**. Studio now opens as a non-modal bottom dock, so you can scroll and inspect the live page while changing project layout, headline typography, width, spacing, card corners, density, and mobile directory visibility. Tap **Minimize** to reduce the dock to a small handle or **Undo** to reverse the last layout change.

Use **Live page**, **Phone**, or **Desktop** to switch between the actual page and embedded responsive previews. The phone and desktop previews are real same-origin versions of the portfolio in 390px and 1200px-wide iframes, not screenshots. As you adjust Studio values or switch colors, the previews receive the current settings. The desktop view is scaled down to fit on narrow displays.

The recommended public defaults are: featured project layout, bold geometric typography, 1140px content width, 64px section spacing, 10px card corners, normal card density, and mobile directory hidden. Existing intentional custom settings stay in local storage; untouched older defaults are migrated.

**Copy design settings** exports a JSON snapshot of the layout settings and selected appearance colors. These are local previews, not GitHub commits. To make a new design the public default, apply the exported choices to the tracked site CSS/HTML and merge a PR.

The Appearance picker manages built-in and custom palettes independently. Each project card now shows a single captured app screenshot; extra image files are retained in the repository for a possible future slideshow.

## Page hierarchy

The page opens directly on Projects (no separate hero or project directory), followed by About. The About section mentions Hollywood Rip Ride Rockit and includes a GitHub profile with all five public project repositories; a separate generic GitHub call-to-action section was removed. Project order is Everyday, Command, Botanica, Fest, then USF Playlist Catalog.

## Editorial project archive

The projects page now uses open editorial rows instead of identical rounded cards.
Everyday has the most prominent title and image area, while Command, Botanica,
Fest, and USF Playlist Catalog alternate media/text placement on desktop.
On phones, each project becomes a single vertical sequence: repository link,
title, short description, technology list, then one real screenshot.

Each project title links to its live website, an outlined repository slug links
to the GitHub source, and a quieter live-site link remains beside it. The layout
continues to use the Appearance palette variables and Studio's Featured, Grid,
and Stack options; the mobile layout stays one column. Only EDC and Universal
non-affiliation notes remain.

The copy uses direct first-person explanations of why the projects exist.
About retains the nearly-nine-year Universal Orlando career, more than four
years at Hollywood Rip Ride Rockit, and the current Park Services Lead role,
without re-listing every product feature.

## More depth where the work is

The three most involved projects—Everyday, Command, and Botanica—now have short
first-person build notes below their main presentations. They talk about actual
repeated work: daily logging and Workout Buddy revisions, organizing what needs
attention in Command, and designing Botanica around my mom's existing workflow.
The notes use small text sections rather than another accordion or feature card.
On mobile the screenshot remains above the longer note; desktop keeps the
photograph beside the main text and note.

About now includes a compact, two-stop Universal Orlando work history: more than
four years at Hollywood Rip Ride Rockit as an Attractions Attendant, followed by
the current Park Services Lead role at Islands of Adventure. No invented career
metrics or technical credentials are used.

## Updated sample screenshots (November 12, 2026)

The portfolio now displays `everyday-demo-20261112.webp`, `command-demo-20261112.webp`, and `fest-demo-20261112.webp`.
These screenshots originate from the real app interfaces, but have been edited for safe public display: device status indicators are omitted, Everyday food names and nutrition numbers are fictional (980 calories, 78 g protein across the six sample foods), and Command's visible January shift dates/times are fictional. These are **examples**, not user records. The three portrait images all use the same 852×1847 resolution.

The Fest card replaces the former EDC Pocket name and links to the existing `edc-planner` repository. Icons are shown beside Everyday, Command, Botanica, and Fest names; no icon is used for the USF Playlist Catalog.

The earlier PNG capture assets and GitHub Actions workflows remain in the repository but are no longer selected for these three project thumbnails; they can be refreshed independently without replacing the portfolio's selected sample images.
