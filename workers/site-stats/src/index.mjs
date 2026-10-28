// Lightweight NOWEN site counter. D1 stores only SHA-256 of a random browser ID.
const ORIGINS = new Set(['https://nowen.cn', 'https://www.nowen.cn']);
const permitted = (origin, env) => ORIGINS.has(origin) || Boolean(env.DEV_ORIGIN && origin === env.DEV_ORIGIN);
function response(data, status, origin, env) {
  const headers = { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store',
    'X-Content-Type-Options':'nosniff', 'Vary':'Origin' };
  if (permitted(origin, env)) {
    Object.assign(headers, { 'Access-Control-Allow-Origin':origin,
      'Access-Control-Allow-Headers':'Content-Type',
      'Access-Control-Allow-Methods':'GET, POST, OPTIONS',
      'Access-Control-Max-Age':'600' });
  }
  return new Response(data === null ? null : JSON.stringify(data), { status, headers });
}
async function totals(db) {
  const row = await db.prepare('SELECT pv, uv FROM site_counters WHERE id = 1').first();
  if (!row) throw Error('schema_missing');
  return { pv:Number(row.pv), uv:Number(row.uv) };
}
async function hashed(id) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('nowen-site-v1:' + id));
  return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2,'0')).join('');
}
async function count(db, id, path) {
  const key = await hashed(id), now = Math.floor(Date.now()/1000);
  const inserted = await db.prepare(
    'INSERT OR IGNORE INTO site_visitors (visitor_hash, first_seen_at, last_counted_at, last_path) VALUES (?, ?, ?, ?)'
  ).bind(key,now,now,path).run();
  const fresh = inserted.meta?.changes === 1;
  let counted = fresh;
  if (!fresh) {
    const updated = await db.prepare(
      'UPDATE site_visitors SET last_path = ?, last_counted_at = ? WHERE visitor_hash = ? AND (last_path <> ? OR last_counted_at <= ?)'
    ).bind(path,now,key,path,now-30).run();
    counted = updated.meta?.changes === 1;
  }
  if (counted) {
    await db.prepare('UPDATE site_counters SET pv = pv + 1, uv = uv + ? WHERE id = 1')
      .bind(fresh ? 1 : 0).run();
  }
  return totals(db);
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '', url = new URL(request.url);
    if (request.method === 'OPTIONS') return response(null, permitted(origin,env)?204:403, origin,env);
    if (!['/api/stats','/api/visit'].includes(url.pathname)) return response({error:'not_found'},404,origin,env);
    if ((url.pathname==='/api/stats' && request.method!=='GET') ||
        (url.pathname==='/api/visit' && request.method!=='POST'))
      return response({error:'method_not_allowed'},405,origin,env);
    // CORS and Origin checks reduce accidental browser misuse; they do not prevent forged bots.
    if (origin && !permitted(origin,env)) return response({error:'origin_not_allowed'},403,origin,env);
    if (url.pathname === '/api/visit' && !permitted(origin,env))
      return response({error:'origin_required'},403,origin,env);
    if (!env.DB) return response({error:'stats_unavailable'},503,origin,env);
    try {
      if (url.pathname === '/api/stats') return response(await totals(env.DB),200,origin,env);
      if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json'))
        return response({error:'invalid_content_type'},415,origin,env);
      const raw = await request.text();
      if (raw.length > 512) return response({error:'body_too_large'},413,origin,env);
      let body;
      try { body=JSON.parse(raw); } catch { return response({error:'invalid_json'},400,origin,env); }
      if (!body || typeof body.visitorId!=='string' || !/^[a-f0-9]{32}$/.test(body.visitorId) ||
          typeof body.path!=='string' || body.path.length>160 || !body.path.startsWith('/') ||
          body.path.startsWith('//') || /[\u0000-\u001f]/.test(body.path))
        return response({error:'invalid_visit'},400,origin,env);
      return response(await count(env.DB,body.visitorId,body.path),200,origin,env);
    } catch (err) {
      console.error('Website stats D1 error',err instanceof Error ? err.name : 'UnknownError');
      return response({error:'stats_unavailable'},503,origin,env);
    }
  }
};
