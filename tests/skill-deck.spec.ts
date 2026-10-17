import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, symlink } from 'node:fs/promises'
import path from 'node:path'

test('skill-generated deck builds and renders with local theme sources', async ({ page }) => {
  test.setTimeout(60_000)
  const root = process.cwd()
  await mkdir('.work', { recursive: true })
  const destination = await mkdtemp(path.join(root, '.work', 'skill-deck-'))
  execFileSync(process.execPath, [path.join(root, '.agents/skills/bit-slidev/scripts/init_deck.mjs'), destination, '--theme', root], { cwd: root, stdio: 'pipe' })
  await mkdir(path.join(destination, 'node_modules'))
  await symlink(root, path.join(destination, 'node_modules', 'slidev-theme-bit'), process.platform === 'win32' ? 'junction' : 'dir')
  execFileSync(process.execPath, [path.join(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), 'build', path.join(destination, 'slides.md'), '--out', 'dist'], { cwd: root, stdio: 'pipe' })
  // Serve the independent build without changing the running showcase.
  const { createServer } = await import('node:http')
  const { readFile } = await import('node:fs/promises')
  const output = path.join(destination, 'dist')
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url || '/', 'http://localhost').pathname
    let target = path.resolve(output, `.${pathname}`)
    if (!target.startsWith(`${output}${path.sep}`) && target !== output) { response.writeHead(403).end(); return }
    try {
      let body: Buffer
      try { body = await readFile(target) }
      catch { target = path.join(output, 'index.html'); body = await readFile(target) }
      const types: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp' }
      response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream' }).end(body)
    }
    catch { response.writeHead(500).end() }
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`
  try {
    for (let index = 1; index <= 9; index++) {
      await page.goto(`${base}/${index}`)
      const slide = page.locator(`#slide-content .slidev-page-${index} .slidev-layout`)
      await expect(slide).toBeVisible()
      await expect(slide.locator('h1')).toBeVisible()
      await expect.poll(() => slide.locator('img').evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true)
      if (index === 5) await expect(slide.locator('.bit-columns > div')).toHaveCount(2)
    }
    await page.goto(`${base}/2`)
    await page.locator('#slide-content .slidev-page-2').getByRole('link', { name: '研究方法' }).click()
    await expect(page).toHaveURL(/\/5$/)
    await expect(page.locator('#slide-content .slidev-page-5')).toContainText('研究方法')
  }
  finally { await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())) }
})
