'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {chromium,firefox,webkit}=require('playwright');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
let server,base;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
test.before(async()=>{
 await new Promise(resolve=>{
   server=http.createServer(async(req,res)=>{
     try{
       const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
       const target=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
       if(!target.startsWith(root+path.sep))throw Error('invalid path');
       const data=await fs.readFile(target);
       res.writeHead(200,{'content-type':mime[path.extname(target)]||'application/octet-stream'});res.end(data);
     }catch{res.writeHead(404);res.end('Not found');}
   }).listen(0,'127.0.0.1',()=>{base='http://127.0.0.1:'+server.address().port;resolve();});
 });
});
test.after(async()=>new Promise(resolve=>server.close(resolve)));
const injected='<img src=x onerror="window.__injected=true">';
async function mock(page) {
 await page.route('**/assets/js/guestbook-config.js',route=>route.fulfill({
   status:200,contentType:'application/javascript',
   body:"window.NOWEN_GUESTBOOK_CONFIG={apiBaseUrl:'https://guestbook-api.test',turnstileSiteKey:''};"
 }));
 await page.route('https://guestbook-api.test/**',route=>route.fulfill({
   status:200,contentType:'application/json',
   headers:{'Access-Control-Allow-Origin':'*'},
   body:JSON.stringify({items:[{id:'1',nickname:injected,content:injected,admin_reply:injected,created_at:1790000000}],hasMore:false,page:1})
 }));
}
for(const [name,engine] of [['Chromium',chromium],['Firefox',firefox],['WebKit',webkit]]) {
 test(name+': guestbook displays safe plain text and graceful disabled submission',async()=>{
   const browser=await engine.launch({headless:true});
   try{
     const page=await browser.newPage({viewport:{width:390,height:844}});
     const errors=[];page.on('pageerror',e=>errors.push(e.message));
     await mock(page);
     await page.goto(base+'/guestbook/',{waitUntil:'domcontentloaded'});
     await page.locator('.gb-message-card').first().waitFor({timeout:10000});
     assert.match(await page.locator('h1').first().innerText(),/把你的想法/);
     assert.equal(await page.locator('.gb-message-content').innerText(),injected);
     assert.equal(await page.locator('.gb-reply p').innerText(),injected);
     assert.equal(await page.locator('.gb-message-card img').count(),0);
     assert.equal(await page.evaluate(()=>window.__injected===true),false);
     assert.equal(await page.locator('#gbSubmit').isDisabled(),true);
     assert.match(await page.locator('#submitNotice').innerText(),/暂未开放/);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
     await page.locator('#themeToggle').click();
     assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
     assert.deepEqual(errors,[]);
   } finally{await browser.close();}
 });
}
test('Chromium: admin surface does not persist authentication token',async()=>{
 const browser=await chromium.launch({headless:true});
 try {
   const page=await browser.newPage();
   await mock(page);
   await page.goto(base+'/guestbook/admin/');
   assert.equal(await page.locator('#gbAdminPanel').isHidden(),true);
   await page.locator('#gbAdminToken').fill('a'.repeat(64));
   await page.locator('#gbLogin').click();
   await page.getByText(/登录失败/).waitFor({timeout:10000});
   assert.equal(await page.locator('#gbAdminPanel').isHidden(),true);
   const sensitive=await page.evaluate(()=>JSON.stringify(localStorage).includes('aaaaaaaa'));
   assert.equal(sensitive,false);
 } finally {await browser.close();}
});
