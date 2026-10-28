(() => {
  'use strict';
  const cfg=window.NOWEN_GUESTBOOK_CONFIG || {};
  const api=String(cfg.apiBaseUrl||'').replace(/\/$/,'');
  const $ = id=>document.getElementById(id);
  const notice=$('gbAdminNotice'), listing=$('gbAdminList');
  let token='';
  const setNotice=(v)=>{notice.textContent=v;};
  function element(tag,className,text) {
    const e=document.createElement(tag);if(className)e.className=className;
    if(text!=null)e.textContent=String(text);return e;
  }
  async function call(path, options={}) {
    const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),10000);
    try {
      const res=await fetch(api+path,{
        ...options, mode:'cors', credentials:'omit', cache:'no-store', signal:controller.signal,
        headers:{Accept:'application/json',Authorization:'Bearer '+token,...(options.headers||{})}
      });
      const json=await res.json().catch(()=>({}));
      if (!res.ok) {const err=new Error(json.error||'failed');err.status=res.status;throw err;}
      return json;
    } finally {clearTimeout(timer);}
  }
  function logout() {
    token='';$('gbAdminToken').value='';
    $('gbAdminPanel').hidden=true;$('gbLoginPanel').hidden=false;
    listing.replaceChildren();
    setNotice('已退出审核。');
  }
  function adminCard(message) {
    const card=element('article','gb-card gb-admin-item');
    const head=element('div','gb-message-head');
    head.append(element('strong','',message.nickname),element('span','gb-message-time',new Date(message.created_at*1000).toLocaleString('zh-CN')));
    const text=element('p','gb-message-content',message.content);
    const label=element('label','', '官方回复（选填，最多 500 字）');
    const reply=element('textarea','',message.admin_reply||'');
    reply.rows=3;reply.maxLength=500;reply.setAttribute('aria-label','回复 '+message.nickname);
    const controls=element('div','gb-admin-actions');
    const approve=element('button','gb-primary','通过 / 保存回复'),reject=element('button','gb-quiet','拒绝');
    const remove=element('button','gb-danger','永久删除');
    approve.type=reject.type=remove.type='button';
    async function update(path,body) {
      approve.disabled=reject.disabled=remove.disabled=true;
      try {
        await call(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
        setNotice('操作成功。');await load();
      }catch(err) {
        setNotice(err.status===401?'密钥无效，请重新进入。':'操作失败：'+err.message);
        if(err.status===401) logout();
        approve.disabled=reject.disabled=remove.disabled=false;
      }
    }
    approve.addEventListener('click',()=>update('/api/guestbook/admin/review',{id:message.id,decision:'approved',reply:reply.value}));
    reject.addEventListener('click',()=>update('/api/guestbook/admin/review',{id:message.id,decision:'rejected',reply:''}));
    remove.addEventListener('click',()=>{
      if(window.confirm('永久删除这条留言？此操作不可恢复。')){
        update('/api/guestbook/admin/delete',{id:message.id});
      }
    });
    controls.append(approve,reject,remove);
    card.append(head,text,label,reply,controls);
    return card;
  }
  async function load() {
    listing.replaceChildren(element('p','gb-list-empty','正在读取审核队列…'));
    try {
      const status=$('gbStatus').value;
      const data=await call('/api/guestbook/admin/messages?status='+encodeURIComponent(status));
      const items=data.items||[];
      listing.replaceChildren(...(items.length?items.map(adminCard):[element('p','gb-list-empty','当前没有此状态的留言。')]));
    } catch(err) {
      listing.replaceChildren();
      setNotice(err.status===401?'管理员密钥不正确。':'无法读取审核队列，请检查 Worker 密钥及 D1 配置。');
      if(err.status===401)logout();
    }
  }
  $('gbLogin').addEventListener('click',async()=>{
    if(!/^https:\/\/[^/?#]+$/.test(api)){setNotice('尚未配置 Worker 地址。');return;}
    const candidate=$('gbAdminToken').value.trim();
    if(candidate.length<32){setNotice('请填写至少 32 字符的管理员密钥。');return;}
    token=candidate;$('gbAdminToken').value='';
    try {
      await call('/api/guestbook/admin/messages?status=pending');
      $('gbLoginPanel').hidden=true;$('gbAdminPanel').hidden=false;
      setNotice('已验证管理员身份。');
      load();
    }catch{token='';setNotice('登录失败：管理员密钥不正确，或后端服务未就绪。');}
  });
  $('gbAdminToken').addEventListener('keydown',e=>{if(e.key==='Enter'){$('gbLogin').click();}});
  $('gbLogout').addEventListener('click',logout);
  $('gbStatus').addEventListener('change',load);
  $('gbAdminRefresh').addEventListener('click',load);
})();
