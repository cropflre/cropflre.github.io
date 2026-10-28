// Public configuration only. No secrets belong in static GitHub Pages assets.
window.NOWEN_VISITS_CONFIG = Object.freeze({
  // After deploying workers/site-stats, set to e.g. https://nowen-site-stats.<account>.workers.dev
  apiBaseUrl: '',
  // Optional Cloudflare Web Analytics site beacon token (32 hex characters).
  // Leave empty when Cloudflare already injects the beacon automatically.
  cloudflareWebAnalyticsToken: ''
});
