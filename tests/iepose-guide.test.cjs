'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/help-iepose-v1.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'assets/js/help-app-v3.js'), 'utf8');

function executeExtension(note = { articles: [], popular: ['quick-start', 'first-note'] }) {
  const window = { NOWEN_HELP: { note } };
  vm.runInNewContext(source, { window });
  return window.NOWEN_HELP.note;
}

test('NAS iepose guide is discoverable in help center before router loads', () => {
  const dataScript = index.indexOf('help-data-v2.js');
  const guideScript = index.indexOf('help-iepose-v1.js');
  const routerScript = index.indexOf('help-app-v3.js');
  assert.ok(dataScript !== -1 && guideScript > dataScript && routerScript > guideScript);
  assert.match(home, /#\/note\/nas-iepose-remote/);
});

test('NAS iepose guide registers once and preserves other articles', () => {
  const original = { slug: 'quick-start', title: '5 分钟快速上手' };
  const note = executeExtension({ articles: [original], popular: ['quick-start'] });
  assert.equal(note.articles.length, 2);
  const guide = note.articles.find(a => a.slug === 'nas-iepose-remote');
  assert.ok(guide);
  assert.equal(guide.group, 'clients');
  assert.match(guide.title, /节点小宝/);
  assert.match(guide.keywords, /iepose/);
  assert.ok(note.popular.includes(guide.slug));
  vm.runInNewContext(source, { window: { NOWEN_HELP: { note } } });
  assert.equal(note.articles.filter(a => a.slug === guide.slug).length, 1);
  assert.equal(note.popular.filter(s => s === guide.slug).length, 1);
  assert.equal(note.articles[0], original);
});

test('NAS iepose guide covers both access options, Android login and API diagnostics', () => {
  const article = executeExtension().articles[0];
  const body = article.body;
  for (const term of [
    '192.168.1.20:3001', 'NAS', 'Docker', '内网穿透', '异地组网',
    'WebSocket', '/api/health', '/public/api/health', '/publicapi/health',
    '公开访问', '扫码认证', 'JSON', 'HTML', '重新检测连接'
  ]) {
    assert.ok(body.includes(term), 'missing required tutorial topic: ' + term);
  }
  assert.match(body, /默认管理员密码/);
  assert.match(body, /访问规则/);
  assert.match(body, /手机流量/);
  assert.match(body, /https:\/\/iepose\.com\/helpcenter/);
  assert.match(body, /reverse-proxy-compatibility\.md/);
});

test('extension is a safe no-op if help data is not ready', () => {
  assert.doesNotThrow(() => vm.runInNewContext(source, { window: {} }));
  assert.doesNotThrow(() => vm.runInNewContext(source, { window: { NOWEN_HELP: {} } }));
});
