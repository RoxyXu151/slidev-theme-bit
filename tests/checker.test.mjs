import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { checkDeck } from '../.agents/skills/bit-slidev/scripts/check_deck.mjs'
import { tocFindings, reportHtml } from '../.agents/skills/bit-slidev/scripts/lib/checks.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
test('checker distinguishes invalid invocation from an actual clean check', () => {
  const result = spawnSync(process.execPath, [path.join(root, '.agents/skills/bit-slidev/scripts/check_deck.mjs'), '--unknown'], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 2)
  assert.match(result.stderr, /检查未完成/)
})
test('TOC validation separates nonexistent pages from title mismatches and accepts subpaths', () => {
  const pages = [
    { slide: 1, title: '目录', toc: [{ label: '研究方法', href: '/repo/3' }, { label: '不存在', href: '/repo/99' }, { label: '研究问题', href: '/repo/2' }] },
    { slide: 2, title: '研究问题', section: '' },
    { slide: 3, title: '实验结果', section: '实验' },
  ]
  const issues = tocFindings(pages, 'http://localhost:3000/repo/')
  assert.deepEqual(issues.map(i => i.code), ['TOC_LABEL_MISMATCH', 'TOC_OUT_OF_RANGE'])
  const html = reportHtml({ entry: '/reports/<script>not executable', totalSlides: 0, pages: [], issues: [], errors: 0, warnings: 0 })
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(!html.includes('<script>'))
})

test('real user-deck check detects rendering faults and leaves source untouched', { timeout: 120000 }, async () => {
  await mkdir(path.join(root, '.work'), { recursive: true })
  const cwd = await mkdtemp(path.join(root, '.work', 'checker test '))
  const entry = path.join(cwd, 'slides.md')
  const source = `---
theme: ${JSON.stringify(root.replaceAll('\\', '/'))}
title: 检查器真实故障样例
---

# 检查器样例

---
layout: toc
---

1. [研究方法](3)
2. [不存在的页](99)

---
section: 实验
---

# 实验结果

<p style="position:absolute;top:560px">这段正文进入了页脚区域。</p>

---
layout: figure
image: /missing-figure.png
---

# 缺失图片

---
---

# 这是第一行<br>这是第二行<br>这是第三行

---
---

# 内容相交

<p style="position:absolute;top:140px">第一个内容块</p>
<p style="position:absolute;top:145px">第二个内容块</p>
<p style="position:absolute;top:250px;height:20px;overflow:hidden">第一行<br>第二行</p>
`
  await writeFile(entry, source)
  const { report, out } = await checkDeck({ entry, browser: process.env.PLAYWRIGHT_CHANNEL })
  assert.equal(report.totalSlides, 6)
  const codes = new Set(report.issues.map(i => i.code))
  for (const code of ['FOOTER_OVERLAP', 'IMAGE_MISSING', 'TITLE_TOO_LONG', 'CONTENT_OVERLAP', 'CLIPPED_CONTENT', 'TOC_OUT_OF_RANGE', 'TOC_LABEL_MISMATCH'])
    assert.ok(codes.has(code), `${code} not detected: ${JSON.stringify(report.issues)}`)
  assert.ok(report.errors > 0)
  assert.ok(report.warnings > 0)
  assert.equal(await readFile(entry, 'utf8'), source)
  assert.equal(JSON.parse(await readFile(path.join(out, 'report.json'), 'utf8')).totalSlides, 6)
  assert.ok((await readFile(path.join(out, 'slide-04.png'))).length > 1000)
})
