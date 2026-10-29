'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('public guestbook is retired and points to NOWEN Community',()=>{
 const html=read('guestbook/index.html');
 assert.match(html,/http-equiv="refresh" content="0;url=https:\/\/community\.nowen\.cn\/"/);
 assert.match(html,/href="https:\/\/community\.nowen\.cn\/"/);
 assert.match(html,/name="robots" content="noindex,follow"/);
 for(const id of ['guestbookForm','gbContent','gbSubmit','turnstileContainer'])assert.ok(!html.includes('id="'+id+'"'),id);
 assert.doesNotMatch(read('index.html'),/href="\/guestbook\/"[^>]*>留言板/);
 assert.doesNotMatch(read('sitemap.xml'),/https:\/\/nowen\.cn\/guestbook\//);
 assert.match(read('guestbook/privacy/index.html'),/历史留言/);
});
test('public config never embeds the Turnstile secret or admin token',()=>{
 const c=read('assets/js/guestbook-config.js');
 assert.match(c,/turnstileSiteKey: '(?:0x[A-Za-z0-9_-]+)?'/);
 assert.doesNotMatch(c,/SECRET_KEY:|GUESTBOOK_ADMIN_TOKEN:|Bearer [a-z0-9]{32}/i);
 const frontend=read('assets/js/guestbook.js');
 assert.match(frontend,/turnstile\.render/);
 assert.match(frontend,/textContent/);
 assert.doesNotMatch(frontend,/innerHTML\s*=/);
});
test('admin login does not persist its token and is nonindexed',()=>{
 const html=read('guestbook/admin/index.html');
 const js=read('assets/js/guestbook-admin.js');
 assert.match(html,/name="robots" content="noindex,nofollow"/);
 assert.match(html,/type="password"/);
 assert.match(js,/Authorization:'Bearer '/);
 assert.doesNotMatch(js,/localStorage|sessionStorage|document\.cookie|innerHTML/);
});
test('Worker fails closed and has explicit moderation plus Turnstile verification',()=>{
 const src=read('workers/site-stats/src/guestbook.mjs');
 for(const expected of ['TURNSTILE_SECRET_KEY','GUESTBOOK_ADMIN_TOKEN','GUESTBOOK_LIMITER','turnstile/v0/siteverify','guestbook_submit',"'pending'","isAdmin"])assert.ok(src.includes(expected),expected);
 assert.match(read('workers/site-stats/wrangler.jsonc'),/"name": "GUESTBOOK_LIMITER"/);
 assert.match(read('workers/site-stats/migrations/0002_guestbook.sql'),/guestbook_messages/);
});
