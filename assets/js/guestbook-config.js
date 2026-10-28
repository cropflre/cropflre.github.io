// Public values only. TURNSTILE_SECRET_KEY and GUESTBOOK_ADMIN_TOKEN are Worker secrets.
window.NOWEN_GUESTBOOK_CONFIG = Object.freeze({
  apiBaseUrl: window.NOWEN_VISITS_CONFIG?.apiBaseUrl || '',
  // Configure after creating a Turnstile widget for nowen.cn; never put the Secret Key here.
  turnstileSiteKey: ''
});
