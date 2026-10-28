import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../workers/site-stats/src/index.mjs';
class Db {
 constructor(){this.visitors=new Map();this.pv=0;this.uv=0;}
 prepare(sql){
  const self=this;
  return {first:async()=>({pv:self.pv,uv:self.uv}),bind(...args){
   return {async run(){
    if(sql.startsWith('INSERT OR IGNORE INTO site_visitors')){
     const [id,first,last,path]=args;
     if(self.visitors.has(id))return {meta:{changes:0}};
     self.visitors.set(id,{first,last,path});return {meta:{changes:1}};
    }
    if(sql.startsWith('UPDATE site_visitors')){
     const [path,now,id,same,cutoff]=args,v=self.visitors.get(id);
     if(v&&(v.path!==same||v.last<=cutoff)){v.path=path;v.last=now;return {meta:{changes:1}};}
     return {meta:{changes:0}};
    }
    if(sql.startsWith('UPDATE site_counters')){self.pv++;self.uv+=args[0];return {meta:{changes:1}};}
    throw Error('unexpected SQL '+sql);
   }};
  }};
 }
}
const host='https://stat-worker.example.dev',a='0123456789abcdef0123456789abcdef',
 b='fedcba9876543210fedcba9876543210';
async function visit(db,id,page,origin='https://nowen.cn'){
 const r=await handler.fetch(new Request(host+'/api/visit',{
  method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},
  body:JSON.stringify({visitorId:id,path:page})
 }),{DB:db});
 return {status:r.status,body:await r.json(),headers:r.headers};
}
test('PV increments, UV unique per browser, same-path refresh dedupes',async()=>{
 const db=new Db();
 assert.deepEqual((await visit(db,a,'/')).body,{pv:1,uv:1});
 assert.deepEqual((await visit(db,a,'/')).body,{pv:1,uv:1});
 assert.deepEqual((await visit(db,a,'/#/note')).body,{pv:2,uv:1});
 assert.deepEqual((await visit(db,b,'/')).body,{pv:3,uv:2});
 const get=await handler.fetch(new Request(host+'/api/stats'),{DB:db});
 assert.deepEqual(await get.json(),{pv:3,uv:2});
});
test('untrusted origins, no origin, bad ID and bad path rejected',async()=>{
 const db=new Db();
 assert.equal((await visit(db,a,'/','https://evil.example')).status,403);
 assert.equal((await visit(db,'bad','/')).status,400);
 assert.equal((await visit(db,a,'//other')).status,400);
 assert.equal((await visit(db,a,'/'.repeat(161))).status,400);
 const noOrigin=await handler.fetch(new Request(host+'/api/visit',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorId:a,path:'/'})
 }),{DB:db});
 assert.equal(noOrigin.status,403);assert.equal(db.pv,0);
});
test('CORS preflight is restricted',async()=>{
 const db=new Db(),req=origin=>new Request(host+'/api/visit',{method:'OPTIONS',headers:{Origin:origin}});
 const ok=await handler.fetch(req('https://nowen.cn'),{DB:db});
 assert.equal(ok.status,204);
 assert.equal(ok.headers.get('Access-Control-Allow-Origin'),'https://nowen.cn');
 const bad=await handler.fetch(req('https://evil.example'),{DB:db});
 assert.equal(bad.status,403);assert.equal(bad.headers.get('Access-Control-Allow-Origin'),null);
});
test('no D1 database fails closed without sensitive details',async()=>{
 const r=await handler.fetch(new Request(host+'/api/stats'),{});
 assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:'stats_unavailable'});
});
