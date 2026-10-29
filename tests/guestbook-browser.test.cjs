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
async function mockAdmin(page){
 await page.route('**/assets/js/guestbook-config.js',route=>route.fulfill({status:200,contentType:'application/javascript',body:"window.NOWEN_GUESTBOOK_CONFIG={apiBaseUrl:'https://guestbook-api.test',turnstileSiteKey:''};"}));
 await page.route('https://guestbook-api.test/**',route=>route.fulfill({status:401,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Authorization, Content-Type'},body:'{"error":"unauthorized"}'}));
}
for(const [name,engine] of [['Chromium',chromium],['Firefox',firefox],['WebKit',webkit]]) {
 test(name+': legacy guestbook redirects visitors to official community',async()=>{
  const browser=await engine.launch({headless:true});
  try{
   const page=await browser.newPage({viewport:{width:390,height:844}});
   await page.route('https://community.nowen.cn/**',route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:'<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"></head><body><h1>弄文社区</h1></body></html>'}));
   await page.goto(base+'/guestbook/',{waitUntil:'domcontentloaded'});
   await page.waitForURL('https://community.nowen.cn/',{timeout:12000});
   assert.match(await page.locator('h1').innerText(),/弄文社区/);
  }finally{await browser.close()}
 });
}
test('Chromium: admin surface does not persist authentication token',async()=>{
 const browser=await chromium.launch({headless:true});
 try {
   const page=await browser.newPage();
   await mockAdmin(page);
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
