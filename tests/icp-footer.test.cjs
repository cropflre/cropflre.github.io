'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const pages = [
  ['index.html', 'assets/css/site-icp.css'],
  ['note/index.html', '../assets/css/site-icp.css'],
  ['download/index.html', '../assets/css/site-icp.css'],
  ['privacy/index.html', '../assets/css/site-icp.css'],
  ['privacy/en/index.html', '../../assets/css/site-icp.css'],
];

for (const [page, cssHref] of pages) {
  test(page + ' includes the official ICP filing link at page bottom', () => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.equal(html.split('粤ICP备2026067978号-1').length - 1, 1);
    assert.match(html, /class="site-icp-footer"/);
    assert.match(html, /href="https:\/\/beian\.miit\.gov\.cn\/" target="_blank" rel="noopener noreferrer"/);
    assert.ok(html.includes('href="' + cssHref + '"'));
    assert.ok(html.indexOf('site-icp-footer') > html.indexOf('</main>'), 'ICP notice must follow main content');
    assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root, page)), cssHref)));
  });
}
