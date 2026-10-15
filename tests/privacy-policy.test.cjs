"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");
const zh = read("privacy/index.html");
const en = read("privacy/en/index.html");

test("Chinese Windows policy is standalone, public and canonical", () => {
  assert.match(zh, /<html lang="zh-CN">/);
  assert.match(zh, /<link rel="canonical" href="https:\/\/nowen\.cn\/privacy\/"/);
  assert.match(zh, /<h1>Windows 桌面版隐私政策<\/h1>/);
  assert.match(zh, /<a class="privacy-skip"|class="privacy-skip"/);
  assert.match(zh, /<meta name="viewport"/);
  assert.match(zh, /<article class="privacy-paper">/);
});

test("English translation is reachable and canonical", () => {
  assert.match(en, /<html lang="en">/);
  assert.match(en, /<link rel="canonical" href="https:\/\/nowen\.cn\/privacy\/en\/"/);
  assert.match(en, /<h1>Windows Desktop Privacy Policy<\/h1>/);
  assert.match(en, /<a class="privacy-lang" hreflang="zh-CN" href="\.\.\/"/);
  assert.match(zh, /<a class="privacy-lang" hreflang="en" href="en\/"/);
});

test("Both policies cover all 13 store-relevant subjects", () => {
  const required = [
    "scope", "data", "local", "ai", "integrations", "diagnostics",
    "legal", "rights", "security", "retention", "children", "changes", "contact",
  ];
  for(const [language,content] of [["zh",zh],["en",en]]) {
    for(const key of required) {
      assert.match(content, new RegExp('<section id="' + key + '">'), language + " missing " + key);
      assert.match(content, new RegExp('href="#' + key + '"'), language + " toc missing " + key);
    }
    assert.equal((content.match(/<section id="/g)||[]).length, required.length);
    assert.match(content, /2026-10-15/);
    assert.match(content, /github\.com\/cropflre\/nowen-note\/issues/);
    assert.doesNotMatch(content, /TODO|TBD|placeholder|example\.com|待填写/i);
  }
});

test("Policy is honest about user hosting and optional AI transfers", () => {
  assert.match(zh, /自托管实例的运营者/);
  assert.match(zh, /Embedding/);
  assert.match(zh, /14 天/);
  assert.match(zh, /不自动向项目维护者上传崩溃报告/);
  assert.match(en, /does not automatically upload crash reports/);
  assert.match(en, /third-party cloud transfers/);
  assert.match(en, /Uninstalling the app may not erase/);
});

test("Public policy and translations are discoverable from sitemap and product pages", () => {
  const sitemap=read("sitemap.xml");
  for(const slug of ["/privacy/", "/privacy/en/"]) {
    assert.match(sitemap,new RegExp("https:\/\/nowen\.cn" + slug.replaceAll("/","\/")));
  }
  assert.match(read("assets/js/note-site-v1.js"),/Windows 隐私政策/);
  assert.match(read("note/index.html"),/\.\.\/privacy\//);
  assert.match(read("download/index.html"),/\.\.\/privacy\//);
  assert.match(read("assets/js/help-app-v3.js"),/Nowen Note Windows 隐私政策/);
});

test("Privacy pages do not require JavaScript or collect form data", () => {
  for(const doc of [zh,en]) {
    assert.doesNotMatch(doc, /<form|<input|google-analytics|gtag\(|hotjar|mixpanel/i);
    assert.match(doc, /<main id="privacyMain"/);
    assert.match(doc, /rel="alternate" hreflang="en"/);
    assert.match(doc, /rel="alternate" hreflang="zh-CN"/);
  }
});
