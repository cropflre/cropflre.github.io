// NOWEN Guestbook API. All public posts are pending until a site owner approves them.
// This module intentionally does not touch the existing PV/UV counters.
const SITE_ORIGINS = new Set(['https://nowen.cn', 'https://www.nowen.cn']);
const STATUSES = new Set(['pending', 'approved', 'rejected']);
const MAX_BODY_BYTES = 4096;

function send(data, status, origin) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Vary': 'Origin'
  };
  if (SITE_ORIGINS.has(origin)) {
    Object.assign(headers, {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '600'
    });
  }
  return new Response(data === null ? null : JSON.stringify(data), { status, headers });
}
function problem(code, status, origin) {
  return send({ error: code }, status, origin);
}
function validText(value, max, min = 1) {
  if (typeof value !== 'string') return null;
  const clean = value.trim();
  const count = Array.from(clean).length;
  if (count < min || count > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(clean)) return null;
  return clean;
}
async function bodyJson(request, origin) {
  if (!(request.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) {
    return { error: problem('json_required', 415, origin) };
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return { error: problem('payload_too_large', 413, origin) };
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return { error: problem('payload_too_large', 413, origin) };
  }
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error('bad');
    return { value };
  } catch {
    return { error: problem('invalid_json', 400, origin) };
  }
}
async function isAdmin(request, secret) {
  if (typeof secret !== 'string' || secret.length < 32) return false;
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return false;
  const supplied = auth.slice(7);
  if (supplied.length < 32 || supplied.length > 256) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(supplied)),
    crypto.subtle.digest('SHA-256', encoder.encode(secret))
  ]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < x.length; i++) difference |= x[i] ^ y[i];
  return difference === 0;
}
async function verifiedTurnstile(token, env) {
  if (typeof env.TURNSTILE_SECRET_KEY !== 'string' || !env.TURNSTILE_SECRET_KEY ||
      typeof token !== 'string' || token.length < 1 || token.length > 2048) return false;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const request = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: controller.signal
    });
    if (!request.ok) return false;
    const result = await request.json();
    return result.success === true &&
      SITE_ORIGINS.has('https://' + result.hostname) &&
      result.action === 'guestbook_submit';
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}
async function publicList(env, url, origin) {
  const page = Number(url.searchParams.get('page') || '1');
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000) return problem('invalid_page', 400, origin);
  const limit = 10;
  const rows = await env.DB.prepare(
    "SELECT id, nickname, content, admin_reply, created_at, reviewed_at FROM guestbook_messages WHERE status = 'approved' ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?"
  ).bind(limit + 1, (page - 1) * limit).all();
  const entries = rows.results || [];
  return send({ items: entries.slice(0, limit), hasMore: entries.length > limit, page }, 200, origin);
}
async function submit(request, env, origin) {
  if (!env.TURNSTILE_SECRET_KEY || !env.GUESTBOOK_LIMITER) return problem('not_configured', 503, origin);
  const parsed = await bodyJson(request, origin);
  if (parsed.error) return parsed.error;
  const { nickname: requestedName, content: requestedContent, turnstileToken, website } = parsed.value;
  if (website) return problem('invalid_submission', 400, origin); // honeypot
  const nickname = requestedName == null || requestedName === '' ? '匿名访客' : validText(requestedName, 24);
  const content = validText(requestedContent, 500, 3);
  if (!nickname || !content) return problem('invalid_content', 400, origin);
  const rateKey = request.headers.get('CF-Connecting-IP') || 'unknown-ip';
  const limited = await env.GUESTBOOK_LIMITER.limit({ key: 'post:' + rateKey });
  if (!limited.success) return problem('rate_limited', 429, origin);
  if (!await verifiedTurnstile(turnstileToken, env)) return problem('verification_failed', 403, origin);
  const id = crypto.randomUUID();
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    "INSERT INTO guestbook_messages (id,nickname,content,status,created_at) VALUES (?,?,?,'pending',?)"
  ).bind(id, nickname, content, now).run();
  return send({ status: 'pending', message: 'submitted_for_review' }, 201, origin);
}
async function adminList(env, url, origin) {
  const status = url.searchParams.get('status') || 'pending';
  if (!STATUSES.has(status)) return problem('invalid_status', 400, origin);
  const result = await env.DB.prepare(
    'SELECT id, nickname, content, status, admin_reply, created_at, reviewed_at FROM guestbook_messages WHERE status = ? ORDER BY created_at DESC, id DESC LIMIT 80'
  ).bind(status).all();
  return send({ items: result.results || [], status }, 200, origin);
}
async function adminAction(request, env, origin, pathname) {
  const parsed = await bodyJson(request, origin);
  if (parsed.error) return parsed.error;
  const { id, decision, reply } = parsed.value;
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)) return problem('invalid_id', 400, origin);
  if (pathname === '/api/guestbook/admin/delete') {
    const result = await env.DB.prepare('DELETE FROM guestbook_messages WHERE id = ?').bind(id).run();
    return result.meta?.changes ? send({ ok: true }, 200, origin) : problem('not_found', 404, origin);
  }
  if (decision !== 'approved' && decision !== 'rejected') return problem('invalid_decision', 400, origin);
  const adminReply = reply == null || reply === '' ? null : validText(reply, 500);
  if (reply != null && reply !== '' && !adminReply) return problem('invalid_reply', 400, origin);
  const result = await env.DB.prepare(
    'UPDATE guestbook_messages SET status = ?, admin_reply = ?, reviewed_at = ? WHERE id = ?'
  ).bind(decision, adminReply, Math.floor(Date.now() / 1000), id).run();
  return result.meta?.changes ? send({ ok: true }, 200, origin) : problem('not_found', 404, origin);
}
export async function handleGuestbook(request, env) {
  const origin = request.headers.get('origin') || '';
  const url = new URL(request.url);
  if (request.method === 'OPTIONS') {
    return send(null, SITE_ORIGINS.has(origin) ? 204 : 403, origin);
  }
  if (origin && !SITE_ORIGINS.has(origin)) return problem('origin_not_allowed', 403, origin);
  if (!env.DB) return problem('not_configured', 503, origin);
  const path = url.pathname;
  const isAdminPath = path.startsWith('/api/guestbook/admin/');
  if (isAdminPath) {
    if (!SITE_ORIGINS.has(origin)) return problem('origin_required', 403, origin);
    if (!env.GUESTBOOK_ADMIN_TOKEN || !await isAdmin(request, env.GUESTBOOK_ADMIN_TOKEN)) {
      return problem('unauthorized', 401, origin);
    }
  }
  try {
    if (path === '/api/guestbook/messages' && request.method === 'GET') {
      return await publicList(env, url, origin);
    }
    if (path === '/api/guestbook/messages' && request.method === 'POST') {
      if (!SITE_ORIGINS.has(origin)) return problem('origin_required', 403, origin);
      return await submit(request, env, origin);
    }
    if (path === '/api/guestbook/admin/messages' && request.method === 'GET') {
      return await adminList(env, url, origin);
    }
    if ((path === '/api/guestbook/admin/review' || path === '/api/guestbook/admin/delete') &&
        request.method === 'POST') {
      return await adminAction(request, env, origin, path);
    }
    return problem('not_found', 404, origin);
  } catch (err) {
    console.error('Guestbook unavailable', err instanceof Error ? err.name : 'UnknownError');
    return problem('service_unavailable', 503, origin);
  }
}
