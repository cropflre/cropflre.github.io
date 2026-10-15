/* Nowen Note Release service: verified links only, framework-free. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.NowenReleases = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';
  const API = 'https://api.github.com/repos/cropflre/nowen-note/releases/latest';
  const FALLBACK = 'assets/data/nowen-note-stable.json';
  const RELEASES = 'https://github.com/cropflre/nowen-note/releases';
  const CACHE_KEY = 'nowen-note-release-v1';
  const CACHE_TTL = 10 * 60 * 1000;
  const allowedTag = /^v\d+\.\d+\.\d+$/;

  function validateRelease(raw) {
    if (!raw || !allowedTag.test(raw.tag_name || '') || raw.draft === true || raw.prerelease === true) return null;
    let releasePage;
    try { releasePage = new URL(raw.html_url); }
    catch { return null; }
    if (releasePage.origin !== 'https://github.com' || releasePage.pathname !== '/cropflre/nowen-note/releases/tag/' + raw.tag_name) return null;
    const assets = (Array.isArray(raw.assets) ? raw.assets : []).filter(function (a) {
      if (!a || typeof a.name !== 'string' || !Number.isFinite(a.size) || a.size <= 0) return false;
      if (/(\.blockmap|\.ya?ml|\.sha\d*|\.json|\.txt)$/i.test(a.name)) return false;
      if (/[\/\\<>]/.test(a.name)) return false;
      try {
        const u = new URL(a.browser_download_url);
        const prefix = '/cropflre/nowen-note/releases/download/' + raw.tag_name + '/';
        return u.protocol === 'https:' && u.origin === 'https://github.com' && !u.search && !u.hash &&
          u.pathname === prefix + encodeURIComponent(a.name).replace(/%2E/gi, '.').replace(/%2D/gi, '-').replace(/%5F/gi, '_');
      } catch { return false; }
    }).map(function (a) {
      return { name: a.name, size: a.size, url: a.browser_download_url };
    });
    return { version: raw.tag_name, published: raw.published_at || '', url: releasePage.href, assets: assets };
  }

  function classifyAsset(asset) {
    const name = asset && asset.name || '';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-setup\.exe$/i.test(name)) return 'winSetup';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-portable\.exe$/i.test(name)) return 'winPortable';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-arm64\.dmg$/i.test(name)) return 'macArm';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-(x64|x86_64)\.dmg$/i.test(name)) return 'macIntel';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-x86_64\.AppImage$/.test(name)) return 'linuxAppImage';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+-amd64\.deb$/i.test(name)) return 'linuxDeb';
    if (/^Nowen-Note-Lite-v?\d+\.\d+\.\d+-x86_64\.AppImage$/.test(name)) return 'linuxLiteAppImage';
    if (/^Nowen-Note-Lite-v?\d+\.\d+\.\d+-amd64\.deb$/i.test(name)) return 'linuxLiteDeb';
    if (/^Nowen-Note-v?\d+\.\d+\.\d+\.apk$/i.test(name)) return 'androidApk';
    if (/^nowen-note-v?\d+\.\d+\.\d+\.fpk$/i.test(name)) return 'fnosFpk';
    if (/^nowen-note-v?\d+\.\d+\.\d+\.upk$/i.test(name)) return 'ugosUpk';
    if (/^nowen-clipper-(\d+\.\d+\.\d+)\.zip$/i.test(name)) return 'clipperZip';
    return null;
  }

  function matrix(release) {
    const result = Object.create(null);
    (release && release.assets || []).forEach(function (a) {
      const key = classifyAsset(a);
      if (key && !result[key]) result[key] = a;
    });
    return result;
  }

  function detectPlatform(ua) {
    const u = String(ua || '').toLowerCase();
    if (/android/.test(u)) return 'android';
    if (/iphone|ipad|ipod/.test(u)) return 'ios';
    if (/macintosh|mac os x/.test(u)) return 'mac';
    if (/windows/.test(u)) return 'windows';
    if (/linux|x11/.test(u)) return 'linux';
    return 'windows';
  }

  function sizeLabel(bytes) {
    return Number.isFinite(bytes) && bytes > 0 ? (bytes / 1048576).toFixed(1) + ' MB' : '';
  }

  function getCached(storage, now) {
    try {
      const entry = JSON.parse(storage.getItem(CACHE_KEY) || 'null');
      if (entry && Number.isFinite(entry.at) && now - entry.at >= 0 && now - entry.at < CACHE_TTL) {
        return validateRelease(entry.data);
      }
    } catch { /* private mode or malformed cache */ }
    return null;
  }

  async function fetchJson(url, timeout, fetcher) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(function () { controller.abort(); }, timeout) : null;
    try {
      const response = await fetcher(url, controller ? { signal: controller.signal, headers: { Accept: 'application/vnd.github+json' } } : {});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } finally { if (timer) clearTimeout(timer); }
  }

  async function load(onUpdate, options) {
    options = options || {};
    const fetcher = options.fetch || (typeof fetch !== 'undefined' ? fetch.bind(typeof window === 'undefined' ? globalThis : window) : null);
    const storage = options.storage !== undefined ? options.storage :
      (typeof sessionStorage !== 'undefined' ? sessionStorage : null);
    const now = options.now === undefined ? Date.now() : options.now;
    if (!fetcher) return { release: null, source: 'unavailable' };
    let fallback = null;
    try { fallback = validateRelease(await fetchJson(FALLBACK, 4500, fetcher)); }
    catch { /* manifest unavailable, API may still work */ }
    const cached = storage && getCached(storage, now);
    const initial = { release: cached || fallback, source: cached ? 'cached' : fallback ? 'fallback' : 'unavailable' };
    if (typeof onUpdate === 'function') onUpdate(initial);
    if (cached) return initial;
    try {
      const raw = await fetchJson(API, 6500, fetcher);
      const verified = validateRelease(raw);
      if (!verified) throw new Error('Invalid official release');
      if (storage) {
        try { storage.setItem(CACHE_KEY, JSON.stringify({ at: now, data: raw })); }
        catch { /* storage may be disabled */ }
      }
      const live = { release: verified, source: 'live' };
      if (typeof onUpdate === 'function') onUpdate(live);
      return live;
    } catch {
      return initial;
    }
  }

  return { API: API, RELEASES: RELEASES, validateRelease: validateRelease,
    classifyAsset: classifyAsset, matrix: matrix, detectPlatform: detectPlatform,
    sizeLabel: sizeLabel, getCached: getCached, load: load };
});
