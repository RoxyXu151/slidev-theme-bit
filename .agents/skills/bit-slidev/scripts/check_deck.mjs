#!/usr/bin/env node
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import path from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { inspectSlide, tocFindings, reportHtml } from './lib/checks.mjs'

export async function checkDeck(options) {
  const entry = path.resolve(options.entry || 'slides.md')
  const cwd = path.dirname(entry)
  const require = createRequire(path.join(cwd, 'package.json'))
  const { load } = await import(pathToFileURL(require.resolve('@slidev/parser/fs')).href)
  const playwright = await import(pathToFileURL(require.resolve('playwright-chromium')).href)
  const chromium = playwright.chromium || playwright.default.chromium
  const data = await load({ roots: [cwd], userRoot: cwd }, entry)
  const parseErrors = Object.values(data.markdownFiles).flatMap(md => (md.errors || []).map(e => ({ file: md.filepath, ...e })))
  if (parseErrors.length) throw new Error(`源稿解析失败：${JSON.stringify(parseErrors)}`)
  if (!data.slides.length) throw new Error('源稿没有可显示的页面')
  const out = path.resolve(options.out || path.join(cwd, '.slidev-check', path.basename(entry, '.md')))
  // Never replace the user's source or use its directory as a report destination.
  if (out === cwd || out === entry) throw new Error('检查报告输出目录必须独立于源稿目录')
  await mkdir(out, { recursive: true })
  let child, browser
  let log = ''
  let base = options.url
  try {
    if (!base) {
      const reservation = createServer()
      await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve) })
      const port = reservation.address().port
      await new Promise(resolve => reservation.close(resolve))
      base = `http://localhost:${port}/`
      child = spawn(process.execPath, [require.resolve('@slidev/cli/bin/slidev.mjs'), entry, '--port', String(port)], { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
      child.on('error', error => { log += error.message })
      child.stdout.on('data', data => { log = (log + data).slice(-12000) })
      child.stderr.on('data', data => { log = (log + data).slice(-12000) })
      const deadline = Date.now() + 60000
      let ready = false
      while (Date.now() < deadline) {
        if (child.exitCode !== null || child.signalCode !== null) throw new Error(`预览服务退出：${log}`)
        try { if ((await fetch(base, { signal: AbortSignal.timeout(1500) })).ok) { ready = true; break } } catch {}
        await delay(250)
      }
      if (!ready) throw new Error(`预览服务未能启动：${log}`)
    }
    base = base.replace(/\/?$/, '/')
    browser = await chromium.launch({ headless: true, ...(options.browser ? { channel: options.browser } : {}) })
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
    const pages = [], issues = []
    let runtimeErrors = []
    page.on('pageerror', error => runtimeErrors.push(error.message))
    for (let index = 1; index <= data.slides.length; index++) {
      runtimeErrors = []
      const source = data.slides[index - 1].source
      const record = { slide: index, title: data.slides[index - 1].title || '', source: source.filepath, line: source.start + 1 }
      try {
        await page.goto(new URL(String(index), base).href, { waitUntil: 'networkidle', timeout: 30000 })
        const root = page.locator(`#slide-content .slidev-page-${index} .slidev-layout`)
        await root.waitFor({ state: 'visible', timeout: 15000 })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(150)
        const snapshot = await root.evaluate(inspectSlide)
        Object.assign(record, { title: snapshot.title, section: snapshot.section, toc: snapshot.toc })
        issues.push(...snapshot.issues.map(issue => ({ slide: index, file: record.source, line: record.line, ...issue })))
        for (const message of runtimeErrors) issues.push({ slide: index, code: 'RUNTIME_ERROR', severity: 'error', message })
        // Prefer an explicit failure to silently checking the wrong deck at --url.
        const totalElement = root.locator('.bit-page-total').first()
        const navTotal = await totalElement.count() ? await totalElement.textContent() : null
        if (navTotal && Number(navTotal.replace(/\D/g, '')) !== data.slides.length)
          issues.push({ slide: index, code: 'DECK_MISMATCH', severity: 'error', message: '--url 中的报告页数与源稿不同，请核对预览地址。' })
      }
      catch (error) { issues.push({ slide: index, code: 'RENDER_FAILED', severity: 'error', message: error.message }) }
      record.screenshot = `slide-${String(index).padStart(2, '0')}.png`
      await page.screenshot({ path: path.join(out, record.screenshot) })
      pages.push(record)
    }
    issues.push(...tocFindings(pages, base))
    const report = { entry, generatedAt: new Date().toISOString(), totalSlides: pages.length, errors: issues.filter(i => i.severity === 'error').length, warnings: issues.filter(i => i.severity === 'warning').length, pages, issues }
    await writeFile(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`)
    await writeFile(path.join(out, 'index.html'), reportHtml(report))
    return { report, out }
  }
  finally {
    if (browser) await browser.close()
    if (child && child.exitCode === null) {
      child.kill()
      await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(3000)])
    }
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help')) {
    console.log('Usage: node check_deck.mjs [slides.md] [--out <directory>] [--url <preview-base-url>] [--browser chrome|msedge] [--strict]\n逐页检查并输出中文说明、JSON 与截图。默认自动启动并关闭独立预览。错误退出 1；--strict 时提醒也退出 1；运行失败退出 2。')
    return
  }
  const options = { browser: process.env.PLAYWRIGHT_CHANNEL }
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--strict') options.strict = true
    else if (['--out', '--url', '--browser'].includes(arg)) {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`缺少 ${arg} 参数`)
      options[arg.slice(2)] = args[++i]
    }
    else if (!arg.startsWith('-') && !options.entry) options.entry = arg
    else throw new Error(`未知参数：${arg}`)
  }
  const { report, out } = await checkDeck(options)
  for (const issue of report.issues) console.log(`${issue.severity === 'error' ? '错误' : '提醒'} · 第 ${issue.slide} 页 · ${issue.code}：${issue.message}${issue.text ? `\n  ${issue.text}` : ''}`)
  console.log(`\n检查 ${report.totalSlides} 页：${report.errors} 项错误，${report.warnings} 项提醒。\n打开 ${path.join(out, 'index.html')} 查看截图；AI 可读取 report.json。`)
  process.exitCode = report.errors || (options.strict && report.warnings) ? 1 : 0
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url)
  main().catch(error => { console.error(`检查未完成：${error.message}`); process.exitCode = 2 })
