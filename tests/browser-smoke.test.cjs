'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { chromium, firefox, webkit, devices } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
let server, base;
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml','.xml':'application/xml; charset=utf-8'};
const startServer = () => new Promise(resolve => {
  server = http.createServer(async (req,res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const name = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
      const file = path.resolve(root,'.' + name);
      if (!file.startsWith(root + path.sep)) throw Error('forbidden');
      const buf = await fs.readFile(file);
      res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream'});
      res.end(buf);
    } catch {res.writeHead(404);res.end('Not found');}
  }).listen(0,'127.0.0.1',()=>{
    base='http://127.0.0.1:' + server.address().port;
    resolve();
  });
});
const fakeApi = async route => route.fulfill({status:429,contentType:'application/json',body:'{"message":"rate limited"}'});
test.before(async () => { await startServer(); });
test.after(async () => { await new Promise(resolve=>server.close(resolve)); });
for (const [engineName, engine] of [['Chromium',chromium],['Firefox',firefox],['WebKit Safari',webkit]]) {
  test(engineName + ': legacy help, Note routes, download fallback and OS tabs', async () => {
    const browser = await engine.launch({headless:true});
    const page = await browser.newPage({viewport:{width:1280,height:850}});
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://api.github.com/repos/cropflre/nowen-note/releases/latest',fakeApi);
    try {
      await page.goto(base + '/#/note/download',{waitUntil:'domcontentloaded'});
      await page.locator('#noteReleaseMeta strong').waitFor({timeout:15000});
      assert.match(await page.locator('#noteReleaseMeta').innerText(),/v1\.5\.1/);
      await page.getByRole('tab',{name:'macOS'}).click();
      assert.equal(await page.locator('a[href$="-arm64.dmg"]').count(),1);
      assert.equal(await page.locator('a[href$="-x64.dmg"]').count(),1);
      await page.getByRole('tab',{name:'Windows'}).click();
      assert.equal(await page.locator('a[href$="-setup.exe"]').count(),1);
      await page.locator('summary').first().click();
      assert.equal(await page.locator('a[href$="-portable.exe"]').count(),1);
      await page.getByRole('tab',{name:'绿联 UGOS'}).click();
      assert.equal(await page.locator('a[href$=".upk"]').count(),0);
      await page.getByRole('tab',{name:'飞牛 fnOS'}).click();
      assert.equal(await page.locator('a[href$=".fpk"]').count(),1);
      await page.getByRole('tab',{name:'Android'}).click();
      assert.equal(await page.locator('a[href$=".apk"]').count(),1);
      await page.getByRole('tab',{name:'浏览器插件'}).click();
      assert.equal(await page.locator('a[href*="chromewebstore.google.com"]').count(),1);
      await page.getByRole('tab',{name:'Docker / NAS'}).click();
      assert.match(await page.locator('.note-code').innerText(),/--branch v1\.5\.1/);
      await page.goto(base + '/#/note/quick-start');
      assert.match(await page.locator('h1').first().innerText(),/快速|上手|入门/);
      await page.goto(base + '/#/reader/quick-start');
      assert.ok((await page.locator('.article-wrap').count())===1);
      await page.goto(base + '/#/note/tutorials');
      assert.ok((await page.locator('.guide-grid').count())===1);
      await page.goto(base + '/#/note');
      assert.match(await page.locator('h1').innerText(),/记录灵感/);
      assert.deepEqual(errors,[]);
    } finally { await browser.close(); }
  });
}
test('Chromium: responsive no overflow on all required widths', async () => {
  const browser=await chromium.launch({headless:true});
  try {
    for (const width of [375,768,1280,1920]) {
      const page=await browser.newPage({viewport:{width,height:800}});
      await page.route('https://api.github.com/repos/cropflre/nowen-note/releases/latest',fakeApi);
      for (const hash of ['#/note','#/note/download','#/note/features']) {
        await page.goto(base+'/'+hash);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth + 1),true,
          hash + ' overflows at ' + width);
        if (width === 375 || width === 1280) {
          const artifacts = path.join(root, 'test-artifacts');
          await fs.mkdir(artifacts, {recursive:true});
          await page.screenshot({path:path.join(artifacts, hash.replace(/[^a-z]/gi,'-') + '-' + width + '.png'), fullPage:true});
        }
      }
      await page.close();
    }
  } finally { await browser.close(); }
});
test('Chromium: live formal release with missing assets never reuses v1.5.1 downloads',async()=>{
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage();
  const release={tag_name:'v1.5.2',published_at:'2026-10-15T00:00:00Z',
    html_url:'https://github.com/cropflre/nowen-note/releases/tag/v1.5.2',
    draft:false,prerelease:false,assets:[]};
  await page.route('https://api.github.com/repos/cropflre/nowen-note/releases/latest',route=>
    route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(release)}));
  try {
    await page.goto(base+'/#/note/download');
    await page.locator('#noteReleaseMeta strong').getByText('v1.5.2').waitFor({timeout:15000});
    assert.equal(await page.locator('.note-platform-panel a[href$="-setup.exe"]').count(),0);
    assert.match(await page.locator('.note-platform-panel').innerText(),/未提供安装包/);
  } finally {await browser.close();}
});
test('Mobile browser identities recommend Android or iOS without false install links',async()=>{
  const browser=await webkit.launch({headless:true});
  try{
    const iphone=await browser.newPage({...devices['iPhone 13']});
    await iphone.route('https://api.github.com/repos/cropflre/nowen-note/releases/latest',fakeApi);
    await iphone.goto(base+'/#/note/download');
    assert.equal(await iphone.locator('[data-note-platform="ios"]').getAttribute('aria-selected'),'true');
    assert.equal(await iphone.locator('a[href$=".ipa"]').count(),0);
    await iphone.close();
  }finally{await browser.close();}
  const android=await chromium.launch({headless:true});
  try{
    const pixel=await android.newPage({...devices['Pixel 7']});
    await pixel.route('https://api.github.com/repos/cropflre/nowen-note/releases/latest',fakeApi);
    await pixel.goto(base+'/#/note/download');
    assert.equal(await pixel.locator('[data-note-platform="android"]').getAttribute('aria-selected'),'true');
    await pixel.close();
  }finally{await android.close();}
});
