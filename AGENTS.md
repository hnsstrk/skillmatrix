# Repository Guidelines

## Project Structure & Module Organization
The app is a static front-end served from the repository root. `index.html` loads the primary dashboard shell; companion pages such as `assignment-check.html`, `developer-profiles.html`, `skill-catalog.html`, and `training-planner.html` reuse the same layout. Shared styling lives in `styles.css`, and `script.js` provides lightweight behaviour (sidebar toggle, active nav highlighting). Keep new images or data assets lightweight and colocate them beside the HTML documents. Reuse existing class patterns (e.g., `sidebar__branding`) to stay consistent with the design system.

## Build, Test, and Development Commands
Use a static server to preview changes: `python3 -m http.server 4173` from the repository root, then open `http://localhost:4173/index.html`. For quick spot checks you can also open the HTML files directly in the browser, but the local server more faithfully mimics production hosting. No package installation is required; keep the stack dependency-free unless you coordinate a toolchain upgrade.

## Coding Style & Naming Conventions
Follow two-space indentation for HTML, CSS, and JavaScript. JavaScript prefers `const`/`let`, arrow functions, and single quotes for strings (see `script.js`). CSS follows a utility-light BEM-inspired naming scheme (`sidebar__toggle`, `nav-link__title`) and relies on root-level custom properties declared in `styles.css`; extend those variables rather than hard-coding colors. When adding markup, maintain accessible patterns (ARIA attributes, `data-page` hooks) so navigation state remains reliable.

## Testing Guidelines
Automated tests are not yet in place, so complete a manual smoke test on Chromium- and WebKit-based browsers before opening a pull request. Confirm sidebar collapsing, active navigation states, and cross-page styling consistency. When introducing larger changes, document manual test steps in the pull request and consider stubbed Playwright regression tests to capture critical flows.

## Commit & Pull Request Guidelines
Recent history shows concise, imperative commit subjects (e.g., "Map skills to defined categories"). Keep commits focused on one change, include context in the body when needed, and reference issue IDs where applicable. Pull requests should outline the problem, solution, and validation steps; add screenshots or screen recordings for visual tweaks and link related HTML files to help reviewers navigate the diff.
