import { test, expect } from '@playwright/test'
import { createServer, type Server } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'

let server: Server, base: string
const output = path.resolve('dist')
test.beforeAll(async () => {
  const index = await readFile(path.join(output, 'index.html'), 'utf8')
  const assetUrl = index.match(/<script\b[^>]*\bsrc="([^"]+)"/)?.[1]
  if (!assetUrl) throw new Error('Run npm run build:site before testing the website')
  const assetPath = new URL(assetUrl, 'http://localhost').pathname
  const prefix = assetPath.slice(0, assetPath.lastIndexOf('/assets/') + 1)
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
      if (!pathname.startsWith(prefix)) { response.writeHead(404).end(); return }
      const relative = pathname.slice(prefix.length)
      let target = path.resolve(output, relative || 'index.html')
      if (target !== output && !target.startsWith(output + path.sep)) { response.writeHead(403).end(); return }
      try {
        if ((await stat(target)).isDirectory()) {
          if (!pathname.endsWith('/')) { response.writeHead(301, { Location: `${pathname}/` }).end(); return }
          target = path.join(target, 'index.html')
        }
        await stat(target)
      }
      catch {
        if (path.extname(relative)) { response.writeHead(404).end(); return }
        target = path.join(output, '404.html')
      }
      const data = await readFile(target)
      const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.webm': 'video/webm', '.woff': 'font/woff', '.woff2': 'font/woff2', '.md': 'text/plain; charset=utf-8' }
      const headers = { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' }
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/)
      if (range) {
        const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : data.length - 1, data.length - 1)
        response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${data.length}`, 'Content-Length': end - start + 1 }).end(data.subarray(start, end + 1))
      }
      else response.writeHead(200, { ...headers, 'Content-Length': data.length }).end(data)
    } catch { response.writeHead(500).end() }
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}${prefix.replace(/\/$/, '')}`
})
test.afterAll(async () => { await new Promise<void>(resolve => server.close(() => resolve())) })

test('beginner guide selects scenarios, copies the command, and fits desktop and mobile', async ({ page }, testInfo) => {
  await page.goto(`${base}/guide/`)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('北理工')
  for (const scenario of ['meeting', 'defense', 'paper']) {
    await page.locator(`[data-template="${scenario}"]`).click()
    await expect(page.locator('#create-command')).toContainText(`--template ${scenario}`)
  }
  await page.locator('[data-copy="create-command"]').click()
  await expect(page.locator('[data-copy="create-command"] + .status')).toHaveText(/已复制|手动复制/)
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.evaluate(() => window.scrollTo(0, 0))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    await page.screenshot({ path: testInfo.outputPath(`guide-${width}.png`) })
  }
})

test('paper website loads every slide and the TOC works', async ({ page }) => {
  const errors: string[] = []
  const externalAssets: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => { if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(base).origin) externalAssets.push(request.url()) })
  for (let slide = 1; slide <= 14; slide++) {
    const response = await page.goto(`${base}/attention/${slide}`)
    expect(response?.status()).toBe(200)
    const layout = page.locator(`#slide-content .slidev-page-${slide} .slidev-layout`)
    await expect(layout).toBeVisible()
    await expect.poll(() => layout.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
    if ([4, 6, 7].includes(slide)) await expect(layout.locator('.katex').first()).toBeVisible()
    if (slide === 10) { await expect(layout).toContainText('28.4'); await expect(layout).toContainText('41.8') }
  }
  await page.goto(`${base}/attention/2`)
  await page.locator('.bit-toc-main').getByRole('link', { name: 'Transformer 架构', exact: true }).click()
  await expect(page).toHaveURL(/\/attention\/5$/)
  await expect(page.locator('.slidev-page-5 img[alt^="原论文图1"]')).toBeVisible()
  expect(errors).toEqual([])
  expect(externalAssets).toEqual([])
})

test('walkthrough is a playable two-minute video and sources are shipped', async ({ page, request }) => {
  await page.goto(`${base}/guide/`)
  const video = page.locator('video')
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => Number.isFinite(el.duration) ? el.duration : 0)).toBeGreaterThanOrEqual(118)
  expect(await video.evaluate((el: HTMLVideoElement) => el.duration)).toBeLessThan(130)
  await video.evaluate((el: HTMLVideoElement) => { el.muted = true; return el.play() })
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0)
  expect((await request.get(`${base}/attention/SOURCES.md`)).status()).toBe(200)
  expect((await request.get(`${base}/guide/transcript.md`)).status()).toBe(200)
})
