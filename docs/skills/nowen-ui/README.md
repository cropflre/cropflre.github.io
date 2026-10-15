# NOWEN UI · Website integration
This package is a verbatim copy of the original NOWEN UI design skill from https://github.com/cropflre/nowen-blog/tree/main/docs/skills/nowen-ui, plus this website-specific integration note.

## Primary instructions
Read SKILL.md, references/design-system.md, references/component-recipes.md, references/motion-responsive.md, and references/source-map.md before editing site UI.

## Adaptation to cropflre.github.io
- This website is intentionally HTML/CSS/vanilla JavaScript with hash routes. Do not copy its React/Tailwind example component into production.
- Production implementation: assets/css/nowen-ui-v2.css and assets/js/nowen-ui-v2.js.
- Keep existing CSS variables --bg, --panel, --text, --muted, --line, --brand etc. as stable aliases of design-system --color-* tokens.
- Keep root data-theme="dark" / "light" compatible with existing localStorage nowen-help-theme. Original 16-palette demo tokens are documentation, not imported globally.
- Apply restrained glass/Bento styling to landing and Note product routes, retain high-contrast/readable docs pages for Note / Reader / Video / community.
- Do not invent release assets, install platforms, measurements, screenshots, user metrics, or product functionality. Retain live Release API plus validated fallback.
- Disable hover/motion on touch/reduced-motion users, ensure keyboard-visible focus, adequate touch targets, mobile safe areas, and contrast.
- Production domain: https://nowen.cn. All SEO canonical / sitemap / robots entries should use it.
- Run browser smoke suite in Chromium, Firefox and WebKit before merging. Merge only after user acceptance.
