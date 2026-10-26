'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const pages = [
  ['index.html', 'assets/js/site-visits.js'],
  ['note/index.html', '../assets/js/site-visits.js'],
  ['download/index.html', '../assets/js/site-visits.js'],
  ['privacy/index.html', '../assets/js/site-visits.js'],
  ['privacy/en/index.html', '../../assets/js/site-visits.js'],
];

for (const [file, src] of pages) {
  test(file + ' displays production site counters and preserves the ICP link', () => {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    for (const id of ['busuanzi_site_pv', 'busuanzi_site_uv']) {
      assert.equal(html.split('id="' + id + '"').length - 1, 1, id + ' must appear exactly once');
    }
    assert.equal(html.split('src="' + src + '"').length - 1, 1, 'load helper exactly once');
    assert.ok(html.includes('class="site-visit-stats"'));
    assert.ok(html.indexOf('site-visit-stats') < html.indexOf('粤ICP备2026067978号-1'));
    assert.ok(html.includes('https://beian.miit.gov.cn/'));
    assert.ok(html.includes('https://www.busuanzi.cc/'));
    assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root, file)), src)));
  });
}

const loader = fs.readFileSync(path.join(root, 'assets/js/site-visits.js'), 'utf8');
function simulate(hostname, hasStats = true) {
  const added = [];
  const elements = {};
  const document = {
    getElementById: id => hasStats ? (elements[id] ||= {}) : null,
    createElement: tag => {
      assert.equal(tag, 'script');
      return {};
    },
    querySelector: () => (elements.stats ||= {}),
    head: { appendChild: node => added.push(node) }
  };
  vm.runInNewContext(loader, { window: { location: { hostname } }, document });
  return { added, elements };
}

test('counter only loads on nowen.cn and www.nowen.cn', () => {
  for (const host of ['localhost', '127.0.0.1', 'cropflre.github.io', 'evilnowen.cn']) {
    assert.equal(simulate(host).added.length, 0, host);
  }
  assert.equal(simulate('nowen.cn', false).added.length, 0);
  for (const host of ['nowen.cn', 'www.nowen.cn']) {
    const { added, elements } = simulate(host);
    assert.equal(added.length, 1);
    assert.equal(added[0].async, true);
    assert.equal(added[0].src, 'https://cdn.busuanzi.cc/busuanzi/3.6.9/busuanzi.min.js');
    added[0].onerror();
    assert.match(elements.stats.title, /unavailable/);
  }
});
