// Production website only; the counter never blocks navigation or search.
(() => {
  'use strict';
  const host=window.location.hostname.toLowerCase();
  if (host!=='nowen.cn' && host!=='www.nowen.cn') return;
  const settings=window.NOWEN_VISITS_CONFIG || {};
  const pv=document.getElementById('nowen_site_pv');
  const uv=document.getElementById('nowen_site_uv');
  const group=document.querySelector('.site-visit-stats');
  if (typeof settings.cloudflareWebAnalyticsToken==='string' &&
      /^[0-9a-f]{32}$/i.test(settings.cloudflareWebAnalyticsToken)) {
    const beacon=document.createElement('script');
    beacon.defer=true;
    beacon.src='https://static.cloudflareinsights.com/beacon.min.js';
    beacon.setAttribute('data-cf-beacon',JSON.stringify({
      token:settings.cloudflareWebAnalyticsToken,spa:true
    }));
    document.head.appendChild(beacon);
  }
  if (!pv || !uv || !group) return;
  let api;
  try {
    api=new URL(settings.apiBaseUrl);
    if (api.protocol!=='https:' || api.username || api.password ||
        api.pathname!=='/' || api.search || api.hash) return;
  } catch { return; } // Unconfigured: the footer stays clean instead of showing dashes.

  const key='nowen-site-visitor-v1';
  let id='';
  try {
    id=window.localStorage.getItem(key) || '';
    if (!/^[0-9a-f]{32}$/.test(id)) {
      const bytes=new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      id=Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
      window.localStorage.setItem(key,id);
    }
  } catch { id=''; } // No storage: read aggregate stats without tracking.

  let seq=0;
  const path=()=> (window.location.pathname +
    (window.location.hash.startsWith('#/') ? window.location.hash : '')).slice(0,160);
  async function fetchJson(endpoint, options={}) {
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),5000);
    try {
      const res=await fetch(new URL(endpoint,api).href,{
        ...options,signal:controller.signal,mode:'cors',cache:'no-store',referrerPolicy:'no-referrer'
      });
      if (!res.ok) throw Error('stats unavailable');
      return res.json();
    } finally { clearTimeout(timer); }
  }
  function render(result,n) {
    if (n!==seq || !result || !Number.isSafeInteger(result.pv) ||
        !Number.isSafeInteger(result.uv) || result.pv<0 || result.uv<0 || result.uv>result.pv) return;
    pv.textContent=result.pv.toLocaleString('zh-CN');
    uv.textContent=result.uv.toLocaleString('zh-CN');
    group.hidden=false;
  }
  async function refresh() {
    const n=++seq;
    try {
      const result=id ? await fetchJson('/api/visit',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({visitorId:id,path:path()})
      }) : await fetchJson('/api/stats');
      render(result,n);
    } catch {
      try { render(await fetchJson('/api/stats'),n); } catch { /* leave last valid numbers */ }
    }
  }
  refresh();
  window.addEventListener('hashchange',refresh);
})();
