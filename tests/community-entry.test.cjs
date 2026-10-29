'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const URL='https://community.nowen.cn';
test('navigation prioritizes official community and retires the guestbook',()=>{
 const home=read('index.html');
 assert.match(home,/class="header-link header-community"/);
 assert.ok(home.includes('href="'+URL+'" target="_blank" rel="noopener noreferrer"'));
 assert.doesNotMatch(home,/href="\/guestbook\/"[^>]*>留言板/);
 assert.match(read('assets/css/nowen-ui-v2.css'),/\.header-actions \.header-community\{display:inline-flex/);
});
test('homepage, docs and download routes link to community',()=>{
 for(const p of ['assets/js/help-app-v3.js','assets/js/help-community-v5.js','assets/js/help-community-ui-v5.js','note/index.html','download/index.html']){
  assert.ok(read(p).includes(URL),p);
 }
 const content=read('assets/js/help-community-v5.js');
 assert.match(content,/弄文社区/);assert.match(content,/微信公众号/);assert.match(content,/QQ 群/);
 assert.match(read('assets/css/help-community-v5.css'),/\.community-v5-card\.forum-card/);
});
