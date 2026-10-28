'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const pages=[['index.html','assets/js/'],['note/index.html','../assets/js/'],['download/index.html','../assets/js/'],['privacy/index.html','../assets/js/'],['privacy/en/index.html','../../assets/js/']];
for(const [p,dir] of pages) test(p+' has self-hosted stats and retains ICP',()=>{
 const html=fs.readFileSync(path.join(root,p),'utf8');
 for(const id of ['nowen_site_pv','nowen_site_uv']) assert.equal(html.split('id="'+id+'"').length-1,1);
 assert.match(html,/class="site-visit-stats" hidden/);
 assert.ok(html.includes('src="'+dir+'site-visits-config.js"'));
 assert.ok(html.includes('src="'+dir+'site-visits.js"'));
 assert.ok(html.indexOf('site-visits-config.js')<html.indexOf('site-visits.js'));
 assert.ok(html.includes('/site-analytics/'));
 assert.ok(html.includes('粤ICP备2026067978号-1'));
 assert.doesNotMatch(html,/busuanzi/i);
});
const src=fs.readFileSync(path.join(root,'assets/js/site-visits.js'),'utf8');
const config=fs.readFileSync(path.join(root,'assets/js/site-visits-config.js'),'utf8');
test('public endpoint configuration is HTTPS and dashboard beacon stays opt-in',()=>{
 const sandbox={window:{}};
 vm.runInNewContext(config,sandbox);
 const settings=sandbox.window.NOWEN_VISITS_CONFIG;
 assert.equal(typeof settings.apiBaseUrl,'string');
 if (settings.apiBaseUrl) {
  const endpoint=new URL(settings.apiBaseUrl);
  assert.equal(endpoint.protocol,'https:');
  assert.equal(endpoint.pathname,'/');
  assert.equal(endpoint.username,'');
  assert.equal(endpoint.password,'');
  assert.equal(endpoint.search,'');
  assert.equal(endpoint.hash,'');
 }
 assert.ok(settings.cloudflareWebAnalyticsToken==='' || /^[a-f0-9]{32}$/i.test(settings.cloudflareWebAnalyticsToken));
});
function simulate(hostname,apiBaseUrl='',token='',storage=true){
 const items={nowen_site_pv:{textContent:'—'},nowen_site_uv:{textContent:'—'},group:{hidden:true}};
 const scripts=[],calls=[],listeners={};
 const window={location:{hostname,pathname:'/',hash:'#/note'},
  NOWEN_VISITS_CONFIG:{apiBaseUrl,cloudflareWebAnalyticsToken:token},
  localStorage:{getItem:()=>{if(!storage)throw Error('blocked');return '0123456789abcdef0123456789abcdef';},setItem(){}},
  crypto:{getRandomValues:a=>a.fill(5)},addEventListener:(k,cb)=>listeners[k]=cb};
 const document={getElementById:id=>items[id],querySelector:()=>items.group,
  createElement:()=>({setAttribute(k,v){this[k]=v;}}),head:{appendChild:n=>scripts.push(n)}};
 const fetch=async(url,options)=>{calls.push({url,options});return {ok:true,json:async()=>({pv:345,uv:23})};};
 vm.runInNewContext(src,{window,document,fetch,URL,AbortController,setTimeout,clearTimeout,Uint8Array});
 return {window,items,scripts,calls,listeners};
}
const settled=()=>new Promise(resolve=>setImmediate(resolve));
test('not enabled on preview and unrelated domains',async()=>{
 for(const host of ['localhost','cropflre.github.io','evilnowen.cn']){
  const s=simulate(host,'https://stats.example.workers.dev');await settled();assert.equal(s.calls.length,0);
 }
});
test('missing API config hides broken counter UI',async()=>{
 const s=simulate('nowen.cn');await settled();assert.equal(s.calls.length,0);assert.equal(s.items.group.hidden,true);
});
test('production POST includes route; SPA route transitions count',async()=>{
 const s=simulate('nowen.cn','https://stats.example.workers.dev');await settled();
 assert.equal(s.calls.length,1);assert.equal(s.calls[0].options.method,'POST');
 assert.equal(JSON.parse(s.calls[0].options.body).path,'/#/note');
 assert.equal(s.items.group.hidden,false);assert.equal(s.items.nowen_site_uv.textContent,'23');
 s.window.location.hash='#/reader';s.listeners.hashchange();await settled();
 assert.equal(s.calls.length,2);assert.equal(JSON.parse(s.calls[1].options.body).path,'/#/reader');
});
test('storage unavailable only reads totals',async()=>{
 const s=simulate('nowen.cn','https://stats.example.workers.dev','',false);await settled();
 assert.equal(s.calls[0].url,'https://stats.example.workers.dev/api/stats');
});
test('Cloudflare beacon only loads with opt-in token',()=>{
 assert.equal(simulate('nowen.cn').scripts.length,0);
 const s=simulate('nowen.cn','','0123456789abcdef0123456789abcdef');
 assert.equal(s.scripts.length,1);assert.match(s.scripts[0].src,/cloudflareinsights/);
 assert.match(s.scripts[0]['data-cf-beacon'],/"spa":true/);
});
