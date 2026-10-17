import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, symlink } from 'node:fs/promises'
import path from 'node:path'

for (const [scenario, count] of [['paper', 12], ['meeting', 8], ['defense', 9]] as const) {
  test(`generated ${scenario} starter builds and its copied checker verifies every slide`, async () => {
    test.setTimeout(120000)
    const root = process.cwd()
    await mkdir('.work', { recursive: true })
    const destination = await mkdtemp(path.join(root, '.work', `${scenario}-scenario-`))
    const run = (file: string, args: string[], cwd = root) => execFileSync(process.execPath, [file, ...args], { cwd, stdio: 'pipe', env: process.env })
    run(path.join(root, '.agents/skills/bit-slidev/scripts/init_deck.mjs'), [destination, '--template', scenario, '--theme', root])
    await mkdir(path.join(destination, 'node_modules'))
    await symlink(root, path.join(destination, 'node_modules/slidev-theme-bit'), process.platform === 'win32' ? 'junction' : 'dir')
    run(path.join(root, 'node_modules/@slidev/cli/bin/slidev.mjs'), ['build', path.join(destination, 'slides.md'), '--out', 'dist'])
    run(path.join(destination, 'scripts/check_deck.mjs'), ['slides.md', '--strict'], destination)
    const report = JSON.parse(await readFile(path.join(destination, '.slidev-check/slides/report.json'), 'utf8'))
    expect(report.totalSlides).toBe(count)
    expect(report.errors).toBe(0)
    expect(report.warnings).toBe(0)
    expect(report.pages.every((page: { screenshot: string }) => page.screenshot.endsWith('.png'))).toBe(true)
  })
}
