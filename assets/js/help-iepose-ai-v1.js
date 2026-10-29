/* Progressive enhancement for the Nowen Note / 节点小宝 AI setup assistant.
 * This is an opt-in prompt handoff, NOT remote NAS control or credential collection.
 */
(function (root) {
  'use strict';

  const NAS = Object.freeze({
    ugos: '绿联 UGOS',
    fnos: '飞牛 fnOS',
    synology: '群晖 DSM',
    zspace: '极空间',
    qnap: '威联通 QTS',
    other: '其他 NAS / Docker 服务器',
    unknown: '暂时不清楚'
  });
  const MODES = Object.freeze({
    mesh: '节点小宝异地组网（推荐：仅个人设备访问，不公开笔记服务）',
    tunnel: '节点小宝内网穿透（生成远程 HTTPS 域名，需评估公网风险）'
  });
  const TOOLS = Object.freeze({
    workbuddy: { name: '腾讯 WorkBuddy', url: 'https://www.workbuddy.ai/' },
    doubao: { name: '豆包 / 豆包工作', url: 'https://www.doubao.com/' },
    qoder: { name: 'Qoder CN Agent', url: 'https://qoder.cn/' }
  });
  const owned = (map, key, fallback) =>
    Object.prototype.hasOwnProperty.call(map, key) ? map[key] : fallback;

  function buildPrompt(options) {
    const nas = owned(NAS, options && options.nas, NAS.unknown);
    const mode = owned(MODES, options && options.mode, MODES.mesh);
    const tool = owned(TOOLS, options && options.tool, TOOLS.workbuddy).name;
    return [
      '你是 Nowen Note（弄文笔记）的 NAS 远程访问配置助理，请真正协助我完成配置与验收，而不是只解释概念。',
      '',
      '我的环境：',
      '- NAS：' + nas,
      '- 使用的 AI：' + tool,
      '- 目标：' + mode,
      '- 我不懂 NAS、Docker、端口、代理，请尽量代我执行；确实必须人工操作时一次只告诉我一个具体动作。',
      '- Nowen Note 是否已安装、NAS IP、端口等信息请先帮助确认，不要自行猜测。',
      '',
      '请按照以下规则执行：',
      '1. 先明确你现在有没有控制本机浏览器、终端、文件或获授权 NAS 管理工具的能力。没有工具权限就如实说明，逐屏引导我，不得声称已经替我操作。',
      '2. 仅检查我有权限管理的设备；先以只读方式确认 NAS 在线、Nowen Note 是否运行、Docker 宿主端口及局域网健康检查。未经确认不得扫描其他设备或网络。',
      '3. 如 Nowen Note 尚未安装，先说明安装计划、数据目录、备份与风险，获得我明确授权才安装；如已安装，不重建、不迁移、不覆盖现有库。',
      '4. 参考节点小宝官方帮助 https://iepose.com/helpcenter/ 和 Nowen Note 反向代理说明 https://github.com/cropflre/nowen-note/blob/main/docs/reverse-proxy-compatibility.md 。',
      '5. 若选择异地组网，优先让 NAS 与访问端加入受控组网、找出实际组网 IP；不将 NAS 服务直接公开到互联网。',
      '6. 若选择内网穿透，先核实转发设备可访问的 NAS IP:PORT，再指导创建域名。公开访问或取消节点小宝扫码/密码保护前，必须向我明确说明风险并再次征得许可，绝不可自行关闭安全机制。',
      '7. 节点小宝实名认证、扫码、密码、验证码、设备绑定等操作由我在官方页面亲自完成。不要让我把密码、Token、Cookie、二维码、助记词或 NAS 管理员凭据发到聊天中。',
      '8. 所有影响服务的动作都要先说明具体目标及可恢复方案并等待我确认：停止/删除容器、升级、修改防火墙/路由器、开放公网、修改代理规则、重置密码、写配置文件。',
      '9. 帮我测试局域网或组网连接；若使用公网域名，检查 /api/health、/public/api/health 和 /publicapi/health 是否返回 Nowen Note JSON，而不是 HTML 认证页面；有条件时验证 /ws WebSocket Upgrade。',
      '10. 协助我在 Android Nowen Note 登录页填写服务器根地址，不要手动拼接 /api；登录与最终外网访问由我本人操作测试。注意网页能打开不代表 API 和同步正常。',
      '11. 如果缺少权限或节点小宝未提供受支持的自动配置接口，停止自动化操作，明确告诉我需要手动点击哪一项，不要使用未经确认的私有 API。',
      '12. 最后输出简短验收清单：NAS 服务状态、访问方式、外网地址（可脱敏）、API JSON 是否正常、WebSocket 是否验证、手机登录是否通过、仍未完成的步骤。',
      '',
      '现在先从只读环境检查开始。只问当前必须知道的一个问题，不要一次让我填写一堆参数。'
    ].join('\n');
  }

  root.NowenIeposeAI = { buildPrompt, NAS, MODES, TOOLS };

  if (typeof document === 'undefined') return;

  function readOptions(wizard) {
    return {
      nas: wizard.querySelector('[data-iepose-nas]').value,
      tool: wizard.querySelector('[data-iepose-tool]').value,
      mode: wizard.querySelector('[data-iepose-mode]').value
    };
  }

  function updateToolLink(wizard, options) {
    const tool = owned(TOOLS, options.tool, TOOLS.workbuddy);
    const link = wizard.querySelector('[data-iepose-ai-open]');
    if (!link) return;
    link.href = tool.url;
    link.textContent = '打开 ' + tool.name + ' ↗';
  }

  async function copyPrompt(prompt, textarea) {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(prompt);
        return true;
      }
    } catch (_) { /* Fall through to manual-copy fallback. */ }
    textarea.focus();
    textarea.select();
    try {
      return typeof document.execCommand === 'function' && document.execCommand('copy');
    } catch (_) {
      return false;
    }
  }

  document.addEventListener('change', function (event) {
    const wizard = event.target.closest && event.target.closest('#ieposeAiWizard');
    if (!wizard) return;
    const options = readOptions(wizard);
    updateToolLink(wizard, options);
    const preview = wizard.querySelector('[data-iepose-ai-preview]');
    if (preview && preview.value) preview.value = buildPrompt(options);
    const status = wizard.querySelector('[data-iepose-ai-status]');
    if (status) status.textContent = '配置已更新。点击「复制给 AI」即可获取新任务。';
  });

  document.addEventListener('click', async function (event) {
    const button = event.target.closest && event.target.closest('[data-iepose-ai-copy]');
    if (!button) return;
    const wizard = button.closest('#ieposeAiWizard');
    if (!wizard) return;
    const options = readOptions(wizard);
    const prompt = buildPrompt(options);
    const preview = wizard.querySelector('[data-iepose-ai-preview]');
    const details = wizard.querySelector('[data-iepose-ai-details]');
    const status = wizard.querySelector('[data-iepose-ai-status]');
    if (!preview || !status) return;
    preview.value = prompt;
    if (details) details.open = true;
    updateToolLink(wizard, options);
    const copied = await copyPrompt(prompt, preview);
    status.textContent = copied
      ? '已复制。打开右侧 AI 工具，将任务粘贴到对话框。需要授权时请亲自确认。'
      : '浏览器无法自动复制。请选中下面的任务内容手动复制，然后粘贴到 AI 工具。';
  });
})(window);
