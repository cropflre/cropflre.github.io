import test from 'node:test';
import assert from 'node:assert/strict';
import { handleGuestbook } from '../workers/site-stats/src/guestbook.mjs';

const ORIGIN = 'https://nowen.cn';
const BASE = 'https://nowen-site-stats.example.workers.dev';
const ADMIN = '0123456789abcdef'.repeat(4);
const validBody = {nickname:'测试用户',content:'这是测试留言内容。',turnstileToken:'test-token'};
class FakeD1 {
  constructor() { this.messages = new Map(); }
  prepare(query) {
    const self = this;
    return {
      bind(...values) {
        return {
          async run() {
            if (query.startsWith('INSERT INTO guestbook_messages')) {
              const [id,nickname,content,created_at]=values;
              self.messages.set(id,{id,nickname,content,created_at,status:'pending',admin_reply:null,reviewed_at:null});
              return {meta:{changes:1}};
            }
            if (query.startsWith('UPDATE guestbook_messages')) {
              const [status,admin_reply,reviewed_at,id]=values;
              const item=self.messages.get(id);
              if (!item) return {meta:{changes:0}};
              Object.assign(item,{status,admin_reply,reviewed_at});
              return {meta:{changes:1}};
            }
            if (query.startsWith('DELETE FROM guestbook_messages')) {
              return {meta:{changes:self.messages.delete(values[0])?1:0}};
            }
            throw Error('Unexpected SQL: '+query);
          },
          async all() {
            const sorted=[...self.messages.values()].sort((a,b)=>b.created_at-a.created_at||b.id.localeCompare(a.id));
            if(query.includes("status = 'approved'")) {
              const [limit,offset]=values;
              return {results:sorted.filter(x=>x.status==='approved').slice(offset,offset+limit).map(({id,nickname,content,admin_reply,created_at,reviewed_at})=>({id,nickname,content,admin_reply,created_at,reviewed_at}))};
            }
            if(query.includes('WHERE status = ?')) return {results:sorted.filter(x=>x.status===values[0]).slice(0,80)};
            throw Error('Unexpected SQL: '+query);
          }
        };
      }
    };
  }
}
const env = (db=new FakeD1()) => ({
  DB:db,
  GUESTBOOK_LIMITER:{limit:async()=>({success:true})},
  TURNSTILE_SECRET_KEY:'test-secret-key',
  GUESTBOOK_ADMIN_TOKEN:ADMIN
});
function req(path,method='GET',body=null,origin=ORIGIN,token=null) {
  const headers={Origin:origin};
  if(body!=null)headers['Content-Type']='application/json';
  if(token!=null)headers.Authorization='Bearer '+token;
  return new Request(BASE+path,{method,headers,body:body!=null?JSON.stringify(body):undefined});
}
async function send(envValue,path,method='GET',body=null,origin=ORIGIN,token=null){
  const response=await handleGuestbook(req(path,method,body,origin,token),envValue);
  return {code:response.status,data:await response.json(),headers:response.headers};
}
async function withTurnstile(outcome,run) {
  const old=globalThis.fetch;
  const requests=[];
  globalThis.fetch=async (url,options)=>{
    assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    requests.push(JSON.parse(options.body));
    return new Response(JSON.stringify(outcome),{status:200,headers:{'Content-Type':'application/json'}});
  };
  try {await run(requests);}finally{globalThis.fetch=old;}
}
test('all messages pending until authenticated approval, then public and reply visible',async()=>{
  const e=env(), approved={success:true,hostname:'nowen.cn',action:'guestbook_submit'};
  await withTurnstile(approved,async requests=>{
    const result=await send(e,'/api/guestbook/messages','POST',validBody);
    assert.equal(result.code,201);assert.equal(result.data.status,'pending');
    assert.equal(requests.length,1);
    assert.equal(requests[0].secret,'test-secret-key');
  });
  let list=await send(e,'/api/guestbook/messages');
  assert.equal(list.code,200);assert.deepEqual(list.data.items,[]);
  const item=[...e.DB.messages.values()][0];
  const notAuthorized=await send(e,'/api/guestbook/admin/messages','GET',null,ORIGIN,'invalid');
  assert.equal(notAuthorized.code,401);
  const pending=await send(e,'/api/guestbook/admin/messages?status=pending','GET',null,ORIGIN,ADMIN);
  assert.equal(pending.code,200);assert.equal(pending.data.items.length,1);
  const approve=await send(e,'/api/guestbook/admin/review','POST',{id:item.id,decision:'approved',reply:'感谢你的建议！'},ORIGIN,ADMIN);
  assert.equal(approve.code,200);
  list=await send(e,'/api/guestbook/messages');
  assert.equal(list.data.items.length,1);assert.equal(list.data.items[0].admin_reply,'感谢你的建议！');
  assert.ok(!('status' in list.data.items[0]),'public list excludes moderation status');
  const deleted=await send(e,'/api/guestbook/admin/delete','POST',{id:item.id},ORIGIN,ADMIN);
  assert.equal(deleted.code,200);
  assert.deepEqual((await send(e,'/api/guestbook/messages')).data.items,[]);
});
test('Turnstile fail-closed for missing secret, invalid token, wrong hostname or action',async()=>{
  const e=env();
  assert.equal((await send({...e,TURNSTILE_SECRET_KEY:''},'/api/guestbook/messages','POST',validBody)).code,503);
  assert.equal((await send({...e,GUESTBOOK_LIMITER:null},'/api/guestbook/messages','POST',validBody)).code,503);
  for(const testCase of [
    {success:false,hostname:'nowen.cn',action:'guestbook_submit'},
    {success:true,hostname:'attacker.test',action:'guestbook_submit'},
    {success:true,hostname:'nowen.cn',action:'different'}
  ]) {
    await withTurnstile(testCase,async()=>{
      const x=await send(e,'/api/guestbook/messages','POST',validBody);
      assert.equal(x.code,403);assert.equal(x.data.error,'verification_failed');
    });
  }
  assert.equal(e.DB.messages.size,0);
});
test('CORS, origin and preflight are scoped; forged origins never write',async()=>{
  const e=env();
  const forbidden=await send(e,'/api/guestbook/messages','POST',validBody,'https://attacker.test');
  assert.equal(forbidden.code,403);
  assert.equal(forbidden.headers.get('access-control-allow-origin'),null);
  const blank=await send(e,'/api/guestbook/messages','POST',validBody,'');
  assert.equal(blank.code,403);
  const options=await handleGuestbook(req('/api/guestbook/messages','OPTIONS'),e);
  assert.equal(options.status,204);
  assert.match(options.headers.get('access-control-allow-headers'),/Authorization/);
  const bad=await handleGuestbook(req('/api/guestbook/messages','OPTIONS',null,'https://attacker.test'),e);
  assert.equal(bad.status,403);
  assert.equal(e.DB.messages.size,0);
});
test('invalid payload, honeypot and limiter reject requests before siteverify',async()=>{
  const e=env();
  const invalid=[
    {...validBody,content:'a'},
    {...validBody,nickname:'X'.repeat(25)},
    {...validBody,content:'Z'.repeat(501)},
    {...validBody,content:'line\u0000'},
    {...validBody,website:'https://spam.example'}
  ];
  for(const body of invalid){
    const r=await send(e,'/api/guestbook/messages','POST',body);
    assert.equal(r.code,400);
  }
  const rate=await send({...e,GUESTBOOK_LIMITER:{limit:async()=>({success:false})}},'/api/guestbook/messages','POST',validBody);
  assert.equal(rate.code,429);
  assert.equal(e.DB.messages.size,0);
});
test('admin cannot read, mutate or delete with wrong token and route guards',async()=>{
  const e=env();
  assert.equal((await send(e,'/api/guestbook/admin/messages','GET',null,ORIGIN,'bad')).code,401);
  assert.equal((await send(e,'/api/guestbook/admin/messages','GET',null,'',ADMIN)).code,403);
  assert.equal((await send(e,'/api/guestbook/admin/messages','GET',null,'https://attacker.test',ADMIN)).code,403);
  assert.equal((await send(e,'/api/guestbook/admin/review','POST',{id:'bad',decision:'approved'},ORIGIN,ADMIN)).code,400);
  assert.equal((await send(e,'/api/guestbook/admin/messages?status=private','GET',null,ORIGIN,ADMIN)).code,400);
  assert.equal((await send(e,'/api/guestbook/messages?page=-1')).code,400);
});
test('public approved list pagination is bounded and does not expose pending',async()=>{
  const e=env();
  for(let i=0;i<27;i++){
    const id=String(i).padStart(36,'0');
    e.DB.messages.set(id,{id,nickname:'访客'+i,content:'留言'+i,status:i<23?'approved':'pending',admin_reply:null,created_at:i,reviewed_at:null});
  }
  const first=await send(e,'/api/guestbook/messages?page=1');
  assert.equal(first.data.items.length,10);assert.equal(first.data.hasMore,true);
  assert.equal(first.data.items[0].nickname,'访客22');
  const last=await send(e,'/api/guestbook/messages?page=3');
  assert.equal(last.data.items.length,3);assert.equal(last.data.hasMore,false);
});
