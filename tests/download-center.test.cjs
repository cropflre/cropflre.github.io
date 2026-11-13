'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const S = require('../assets/js/note-release-v1.js');
const root = path.resolve(__dirname, '..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/nowen-note-stable.json'), 'utf8'));
const official = S.validateRelease(snapshot);

test('fallback is verified v1.5.5 with supported installation assets', () => {
  assert.equal(official.version, 'v1.5.5');
  assert.equal(official.assets.length, 18);
  assert.ok(official.assets.every(a=>a.url.startsWith('https://github.com/cropflre/nowen-note/releases/download/v1.5.5/')));
  assert.ok(official.assets.every(a=>!/\.blockmap|\.ya?ml$/i.test(a.name)));
});
test('matrix maps real v1.5.5 packages and excludes unavailable Linux Lite', () => {
  const m=S.matrix(official);
  assert.equal(m.winSetup.name,'Nowen-Note-1.5.5-setup.exe');
  assert.equal(m.winPortable.name,'Nowen-Note-1.5.5-portable.exe');
  assert.equal(m.winLiteSetup.name,'Nowen-Note-Lite-1.5.5-setup.exe');
  assert.equal(m.winLitePortable.name,'Nowen-Note-Lite-1.5.5-portable.exe');
  assert.equal(m.macArm.name,'Nowen-Note-1.5.5-arm64.dmg');
  assert.equal(m.macIntel.name,'Nowen-Note-1.5.5-x64.dmg');
  assert.equal(m.linuxAppImage.name,'Nowen-Note-1.5.5-x86_64.AppImage');
  assert.equal(m.linuxDeb.name,'Nowen-Note-1.5.5-amd64.deb');
  assert.equal(m.linuxLiteAppImage,undefined);
  assert.equal(m.linuxLiteDeb,undefined);
  assert.equal(m.androidApk.name,'Nowen-Note-1.5.5.apk');
  assert.equal(m.fnosFpk.name,'nowen-note-1.5.5-fpk-r1.fpk');
  assert.equal(m.ugosAmd64.name,'amd64_io.nowen.note_1.5.5.0001.upk');
  assert.equal(m.ugosArm64.name,'arm64_io.nowen.note_1.5.5.0001.upk');
  assert.equal(m.clipperZip.name,'nowen-clipper-0.5.0.zip');
  assert.equal(m.clipperEdgeZip.name,'nowen-clipper-0.5.0-edge.zip');
  assert.equal(m.clipperFirefoxZip.name,'nowen-clipper-0.5.0-firefox.zip');
});
test('verified R2 mirror only replaces exact current GitHub release assets and preserves fallback', async () => {
  const chosen=[
    'Nowen-Note-1.5.5-setup.exe','Nowen-Note-1.5.5-arm64.dmg',
    'Nowen-Note-1.5.5-x64.dmg','Nowen-Note-1.5.5-x86_64.AppImage',
    'Nowen-Note-1.5.5-amd64.deb','Nowen-Note-1.5.5.apk',
    'nowen-note-1.5.5-fpk-r1.fpk',
    'nowen-clipper-0.5.0-edge.zip','nowen-clipper-0.5.0-firefox.zip',
    'nowen-clipper-0.5.0.zip'
  ];
  const manifest={schema:1,version:official.version,assets:chosen.map(name=>{
    const a=official.assets.find(x=>x.name===name);
    assert.ok(a,'GitHub-verified fallback must include '+name);
    return {name,size:a.size};
  })};
  const seen=[];
  const mirrored=await S.resolveMirrors(official,async (url,opts)=>{
    seen.push(url); assert.equal(opts.mode,'cors');
    return {ok:true,json:async()=>manifest};
  });
  assert.deepEqual(seen,['https://download.nowen.cn/v1.5.5/manifest.json']);
  assert.equal(mirrored.assets.filter(a=>a.source==='r2').length,10);
  assert.equal(mirrored.assets.find(a=>a.name==='Nowen-Note-1.5.5-setup.exe').url,
    'https://download.nowen.cn/v1.5.5/Nowen-Note-1.5.5-setup.exe');
  assert.equal(mirrored.assets.find(a=>a.name==='Nowen-Note-1.5.5-setup.exe').githubUrl,
    official.assets.find(a=>a.name==='Nowen-Note-1.5.5-setup.exe').url);
  assert.equal(S.matrix(mirrored).fnosFpk.url,
    'https://download.nowen.cn/v1.5.5/nowen-note-1.5.5-fpk-r1.fpk');
  for(const unsupported of ['Nowen-Note-1.5.5-portable.exe','amd64_io.nowen.note_1.5.5.0001.upk']){
    const a=mirrored.assets.find(x=>x.name===unsupported);
    assert.ok(a.url.startsWith('https://github.com/'));
    assert.equal(a.source,undefined);
  }
  const invalidCases=[
    {...manifest,version:'v1.5.6'},
    {...manifest,assets:[...manifest.assets.slice(0,-1),{name:'amd64_io.nowen.note_1.5.5.0001.upk',size:169014701}]},
    {...manifest,assets:manifest.assets.map((a,i)=>i===0?{...a,size:a.size+1}:a)},
    {...manifest,assets:manifest.assets.slice(1)},
    {...manifest,assets:manifest.assets.map((a,i)=>i===0?{...a,name:'evil.exe'}:a)}
  ];
  for(const bad of invalidCases) {
    const unchanged=await S.resolveMirrors(official,async()=>({ok:true,json:async()=>bad}));
    assert.equal(unchanged,official,'Bad or stale R2 manifest must retain GitHub links');
  }
  assert.equal(await S.resolveMirrors(official,async()=>({ok:false,status:404})),official);
  assert.equal(await S.resolveMirrors(official,async()=>{throw new Error('network blocked');}),official);
});

test('rejects drafts, prereleases, malformed tags, redirected or executable URLs', () => {
  for (const fields of [{draft:true}, {prerelease:true}, {tag_name:'v1.5.2-rc.1'},
    {html_url:'https://attacker.example/releases/tag/v1.5.2'}]) {
    assert.equal(S.validateRelease({...snapshot,...fields}), null);
  }
  const malformed = {...snapshot, assets:[{
    name:'Nowen-Note-1.5.2-setup.exe', size:100, browser_download_url:'https://evil.example/download.exe'
  },{name:'Nowen-Note-1.5.2-setup.exe', size:100,
    browser_download_url:'https://github.com/cropflre/nowen-note/releases/download/v1.5.3/Nowen-Note-1.5.2-setup.exe'
  },{name:'latest.yml',size:100, browser_download_url:'https://github.com/cropflre/nowen-note/releases/download/v1.5.2/latest.yml'}]};
  assert.equal(S.validateRelease(malformed).assets.length, 0);
});
test('new official release uses only its own assets, not old fallback files', () => {
  const newRelease = {...snapshot,tag_name:'v1.5.3',
    html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.3',assets:[]};
  assert.deepEqual(Object.keys(S.matrix(S.validateRelease(newRelease))), []);
});
test('distinguishes Lite Linux and refuses update metadata', () => {
  assert.equal(S.classifyAsset({name:'Nowen-Note-Lite-1.5.2-amd64.deb'}),'linuxLiteDeb');
  assert.equal(S.classifyAsset({name:'Nowen-Note-1.5.2-amd64.deb'}),'linuxDeb');
  assert.equal(S.classifyAsset({name:'latest-linux.yml'}),null);
  assert.equal(S.classifyAsset({name:'Nowen-Note-1.5.2-setup.exe.blockmap'}),null);
  assert.equal(S.classifyAsset({name:'android-release-qa.apk'}),null);
});
test('platform recommendation never infers macOS architecture', () => {
  assert.equal(S.detectPlatform('Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0)'), 'mac');
  assert.equal(S.detectPlatform('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)'), 'ios');
  assert.equal(S.detectPlatform('Mozilla/5.0 (Linux; Android 15; Pixel 9)'), 'android');
});
test('API failure uses verified local manifest and does not confuse failure with absence', async () => {
  const seen = [];
  const result = await S.load(x => seen.push(x.source), {
    storage:null, fetch:async url => url.startsWith('assets/data/') ?
      {ok:true,json:async()=>snapshot} : {ok:false,status:403}
  });
  assert.equal(result.source,'fallback');
  assert.equal(result.release.version,'v1.5.5');
  assert.deepEqual(seen,['fallback']);
});
test('fresh cache avoids API fetch; stale cache permits a new formal release', async () => {
  const cache = new Map();
  const storage = {getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
  let calls=0;
  const fetcher = async url => { calls++; return {ok:true,json:async()=>snapshot}; };
  const first=await S.load(null,{storage,fetch:fetcher,now:100000});
  assert.equal(first.source,'live');
  const second=await S.load(null,{storage,fetch:fetcher,now:100100});
  assert.equal(second.source,'cached');
  assert.equal(calls,2+1); // first manifest + API, second manifest
  const next={...snapshot,tag_name:'v1.5.6',html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.6',assets:[]};
  const newer=await S.load(null,{storage,fetch:async url=>({
    ok:true,json:async()=>url.includes('api.github.com')?next:snapshot
  }),now:100000+11*60*1000});
  assert.equal(newer.release.version,'v1.5.6');
  assert.deepEqual(Object.keys(S.matrix(newer.release)),[]);
});
test('stale API release cannot replace newer verified fallback',async()=>{
  const old={...snapshot,tag_name:'v1.5.3',
    html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.3',assets:[]};
  const result=await S.load(null,{storage:null,fetch:async url=>({
    ok:true,json:async()=>url.includes('api.github.com')?old:snapshot
  })});
  assert.equal(result.release.version,'v1.5.5');
  assert.equal(result.source,'fallback');
});
test('a newly verified v1.5.5 fallback supersedes a cached older v1.5.3',async()=>{
  const old={...snapshot,tag_name:'v1.5.3',
    html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.3',assets:[]};
  const cache=new Map([['nowen-note-release-v1',JSON.stringify({at:100000,data:old})]]);
  const result=await S.load(null,{now:100100,storage:{
    getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)
  },fetch:async url=>url.includes('api.github.com')
    ? {ok:false,status:429} : {ok:true,json:async()=>snapshot}});
  assert.equal(result.release.version,'v1.5.5');
  assert.equal(result.source,'fallback');
});
test('website v1.5.5 release promotion does not imply 1.6.0 features ship',()=>{
 const site=fs.readFileSync(path.join(root,'assets/js/note-site-v1.js'),'utf8');
 assert.match(site,/v1\.5\.5 已正式发布/);
 assert.match(site,/v1\.6\.0/);
 assert.doesNotMatch(site,/NEW IN v1\.5\.3|PRODUCT FEATURES · v1\.5\.3/);
});
test('new routes do not collide with documented article slugs', () => {
  const data = ['assets/js/help-data-v2.js','assets/js/help-note-v4.js','assets/js/help-community-v5.js']
    .map(p=>fs.readFileSync(path.join(root,p),'utf8')).join('\n');
  const slugs = [...data.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]);
  for(const slug of ['download','features','changelog','tutorials']) assert.ok(!slugs.includes(slug));
  const router=fs.readFileSync(path.join(root,'assets/js/help-app-v3.js'),'utf8');
  assert.match(router,/slug === 'tutorials'/);
  assert.match(router,/note-site/);
  assert.match(router,/renderArticle\(route.product, route.slug\)/);
});
test('static SEO pages and downloadable fallback shipped', () => {
  for(const file of ['download/index.html','note/index.html','sitemap.xml','robots.txt',
    'assets/css/note-site-v1.css']) assert.ok(fs.existsSync(path.join(root,file)));
});
