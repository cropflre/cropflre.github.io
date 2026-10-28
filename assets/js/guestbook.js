(() => {
  'use strict';
  const config = window.NOWEN_GUESTBOOK_CONFIG || {};
  const form = document.getElementById('guestbookForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const list = $('gbList'), submit = $('gbSubmit'), notice = $('submitNotice');
  const content = $('gbContent'), count = $('gbChars');
  const pageLabel = $('gbPage'), prev = $('gbPrev'), next = $('gbNext');
  let page = 1, hasMore = false, token = '', widgetId = null, busy = false;
  const api = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const siteKey = String(config.turnstileSiteKey || '');
  const ready = /^https:\/\/[^/?#]+$/.test(api);
  const setNotice = (message, type='') => { notice.textContent=message; notice.dataset.state=type; };
  function toggleSubmit() { submit.disabled = busy || !ready || !siteKey || !token; }
  async function request(path, options={}) {
    const controller = new AbortController(), timeout = setTimeout(()=>controller.abort(),10000);
    try {
      const res = await fetch(api+path, {
        ...options, mode:'cors', credentials:'omit', cache:'no-store', signal:controller.signal,
        headers:{ 'Accept':'application/json', ...(options.headers||{}) }
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) {
        const error = new Error(data.error || 'request_failed');
        error.status=res.status; throw error;
      }
      return data;
    } finally { clearTimeout(timeout); }
  }
  const errors = {
    rate_limited:'提交有些频繁，请稍后再试。',
    verification_failed:'人机验证已失效，请重新完成验证。',
    not_configured:'留言功能尚未配置完成，请稍后再试。',
    invalid_content:'昵称或留言内容不符合要求。',
    invalid_submission:'提交内容无效，请刷新后重试。',
    service_unavailable:'留言服务暂时不可用，请稍后重试。'
  };
  function node(tag, className, value) {
    const element=document.createElement(tag);
    if (className) element.className=className;
    if (value != null) element.textContent=String(value);
    return element;
  }
  function card(item) {
    const article=node('article','gb-message-card');
    const header=node('div','gb-message-head');
    const avatar=node('span','gb-avatar',Array.from(item.nickname||'匿')[0]||'匿');
    const intro=node('div','gb-message-author');
    intro.append(node('strong','',item.nickname||'匿名访客'));
    const date=node('time','gb-message-time');
    const dateObj=new Date(Number(item.created_at)*1000);
    if (Number.isFinite(dateObj.valueOf())) {
      date.dateTime=dateObj.toISOString();
      date.textContent=new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit'}).format(dateObj);
    }
    intro.append(date); header.append(avatar,intro);
    article.append(header,node('p','gb-message-content',item.content));
    if (item.admin_reply) {
      const reply=node('div','gb-reply');
      reply.append(node('strong','', 'NOWEN 官方回复'),node('p','',item.admin_reply));
      article.append(reply);
    }
    return article;
  }
  async function load() {
    list.replaceChildren(node('p','gb-list-empty','正在加载留言…'));
    list.setAttribute('aria-busy','true');
    if (!ready) {
      list.replaceChildren(node('p','gb-list-empty','留言服务暂不可用。'));
      list.setAttribute('aria-busy','false'); return;
    }
    try {
      const data=await request('/api/guestbook/messages?page='+page);
      const items=Array.isArray(data.items)?data.items:[];
      list.replaceChildren(...(items.length?items.map(card):[node('p','gb-list-empty','这里还没有公开留言，欢迎成为第一个分享想法的人。')]));
      hasMore=data.hasMore===true;
    } catch {
      list.replaceChildren(node('p','gb-list-empty','留言读取失败，请稍后刷新重试。'));
      hasMore=false;
    } finally {
      list.setAttribute('aria-busy','false');
      pageLabel.textContent='第 '+page+' 页';
      prev.disabled=page<=1; next.disabled=!hasMore;
    }
  }
  function resetTurnstile() {
    token='';
    if (widgetId!=null && window.turnstile?.reset) window.turnstile.reset(widgetId);
    toggleSubmit();
  }
  function startTurnstile() {
    if (!ready || !siteKey) {
      setNotice('暂未开放新留言提交，已审核的留言仍可浏览。'); return;
    }
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.onload=()=>{
      if (!window.turnstile?.render) { setNotice('人机验证加载失败，请刷新重试。','error');return; }
      widgetId=window.turnstile.render('#turnstileContainer',{
        sitekey:siteKey, action:'guestbook_submit', theme:'auto',
        callback: result=>{ token=result;setNotice('验证完成，可以提交留言。');toggleSubmit(); },
        'expired-callback':()=>{ token='';setNotice('验证已过期，请重新验证。');toggleSubmit(); },
        'error-callback':()=>{ token='';setNotice('验证失败，请稍后重试。','error');toggleSubmit(); }
      });
      setNotice('请先完成人机验证，留言审核通过后才会公开。');
    };
    script.onerror=()=>setNotice('验证服务暂不可用，请稍后再试。','error');
    document.head.appendChild(script);
  }
  content.addEventListener('input',()=>{ count.textContent=Array.from(content.value).length+' / 500'; });
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if (busy || !token || !ready || !siteKey) return;
    const text=content.value.trim();
    if (Array.from(text).length<3 || Array.from(text).length>500) {
      setNotice('留言请输入 3–500 字。','error');return;
    }
    busy=true;toggleSubmit();setNotice('正在提交…');
    try {
      await request('/api/guestbook/messages',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          nickname:$('gbNickname').value.trim(),content:text,
          website:$('gbWebsite').value, turnstileToken:token
        })
      });
      content.value=''; count.textContent='0 / 500';
      setNotice('留言已提交，审核通过后会展示在这里。','success');
    } catch(err) {
      setNotice(errors[err.message]||'提交失败，请稍后再试。','error');
    } finally {
      busy=false; resetTurnstile();
    }
  });
  $('gbRefresh').addEventListener('click',load);
  prev.addEventListener('click',()=>{if(page>1){page--;load();}});
  next.addEventListener('click',()=>{if(hasMore){page++;load();}});
  $('themeToggle')?.addEventListener('click',()=>{
    const choice=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=choice;
    try {localStorage.setItem('nowen-help-theme',choice);}catch{}
  });
  load(); startTurnstile();
})();
