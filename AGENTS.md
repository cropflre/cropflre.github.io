# NOWEN Official Website — AI Agent Rules

For any UI, UX, responsive design, themes or visual refactor task, read:
- docs/skills/nowen-ui/SKILL.md
- docs/skills/nowen-ui/references/design-system.md
- docs/skills/nowen-ui/references/component-recipes.md
- docs/skills/nowen-ui/references/motion-responsive.md
- docs/skills/nowen-ui/README.md (website adaptation)

Site-specific constraints:
1. Retain native HTML/CSS/JS, the existing #/ route contract, tutorials/search/community, release API trust model, and current downloads.
2. Semantic tokens live in assets/css/nowen-ui-v2.css and adapt original --bg/--panel aliases; no build-framework migration purely for styling.
3. Deep Space dark / Solar Clarity light theme support system preference and saved choice; never sacrifice contrast.
4. Use restrained aurora, glass, Spotlight and Bento only when they improve hierarchy. Keep articles readable.
5. Mobile, touch, lite and prefers-reduced-motion need simpler/disabled effects. Test navigation, tabs, search, widths and keyboard accessibility.
6. Production domain is https://nowen.cn. Do not use the old blog or github.io host as canonical.
7. GitHub Releases are the only authority for published packages; unreleased development must be clearly labelled.
8. Use a feature branch and PR; do not merge into master without explicit human acceptance. Deploying master publishes the domain.
