'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const S = require('../assets/js/note-release-v1.js');
const root = path.resolve(__dirname, '..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/nowen-note-stable.json'), 'utf8'));
const official = S.validateRelease(snapshot);

test('fallback is verified v1.5.2 with non-empty supported assets', () => {
  assert.equal(official.version, 'v1.5.2');
  assert.ok(official.assets.length >= 10);
  assert.ok(official.assets.every(a => a.url.startsWith('https://github.com/cropflre/nowen-note/releases/download/v1.5.2/')));
  assert.ok(official.assets.every(a => !/\.blockmap|\.yml$/i.test(a.name)));
});
test('matrix maps the real stable release correctly', () => {
  const m = S.matrix(official);
  assert.equal(m.winSetup.name, 'Nowen-Note-1.5.2-setup.exe');
  assert.equal(m.winPortable.name, 'Nowen-Note-1.5.2-portable.exe');
  assert.equal(m.macArm.name, 'Nowen-Note-1.5.2-arm64.dmg');
  assert.equal(m.macIntel.name, 'Nowen-Note-1.5.2-x64.dmg');
  assert.equal(m.linuxAppImage.name, 'Nowen-Note-1.5.2-x86_64.AppImage');
  assert.equal(m.linuxDeb.name, 'Nowen-Note-1.5.2-amd64.deb');
  assert.equal(m.linuxLiteAppImage.name, 'Nowen-Note-Lite-1.5.2-x86_64.AppImage');
  assert.equal(m.linuxLiteDeb.name, 'Nowen-Note-Lite-1.5.2-amd64.deb');
  assert.equal(m.androidApk.name, 'Nowen-Note-1.5.2.apk');
  assert.equal(m.fnosFpk.name, 'nowen-note-1.5.2.fpk');
  assert.equal(m.clipperZip.name, 'nowen-clipper-0.5.0.zip');
  assert.equal(m.ugosUpk, undefined);
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
  assert.equal(result.release.version,'v1.5.2');
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
  const next={...snapshot,tag_name:'v1.5.3',html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.3',assets:[]};
  const newer=await S.load(null,{storage,fetch:async url=>({
    ok:true,json:async()=>url.includes('api.github.com')?next:snapshot
  }),now:100000+11*60*1000});
  assert.equal(newer.release.version,'v1.5.3');
  assert.deepEqual(Object.keys(S.matrix(newer.release)),[]);
});
test('a newly verified v1.5.2 fallback supersedes a cached older v1.5.1',async()=>{
  const old={...snapshot,tag_name:'v1.5.1',
    html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.1',assets:[]};
  const cache=new Map([['nowen-note-release-v1',JSON.stringify({at:100000,data:old})]]);
  const result=await S.load(null,{now:100100,storage:{
    getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)
  },fetch:async url=>url.includes('api.github.com')
    ? {ok:false,status:429} : {ok:true,json:async()=>snapshot}});
  assert.equal(result.release.version,'v1.5.2');
  assert.equal(result.source,'fallback');
});
test('website release copy never calls v1.5.2 in development',()=>{
  const site=fs.readFileSync(path.join(root,'assets/js/note-site-v1.js'),'utf8');
  assert.match(site,/v1.5.2 已发布/);
  assert.doesNotMatch(site,/v1.5.2 开发中|v1.5.2 正在开发|开发中 · 不属于当前正式版/);
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
