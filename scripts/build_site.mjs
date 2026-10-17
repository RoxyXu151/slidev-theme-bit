#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { load } from '@slidev/parser/fs'
const require = createRequire(import.meta.url)
const cli = require.resolve('@slidev/cli/bin/slidev.mjs')
const args = process.argv.slice(2)
if (args.length && !(args.length === 2 && args[0] === '--base')) throw new Error('Usage: npm run build:site -- [--base /repository-name/]')
const base = (args[1] || '/').replace(/\/?$/, '/')
if (!base.startsWith('/') || base.startsWith('//') || base.includes('..') || /[?#]/.test(base)) throw new Error('--base must be an absolute site pathname')
for (const [entry, out, url] of [['example.md', 'dist', base], ['attention.md', 'dist/attention', `${base}attention/`]]) {
  const result = spawnSync(process.execPath, [cli, 'build', entry, '--out', out, '--base', url], { stdio: 'inherit', windowsHide: true })
  if (result.error || result.status !== 0) throw result.error || new Error(`Build failed: ${entry}`)
  // Static hosts append '/' to real directories. Normalize numeric slide URLs
  // before Vue starts so a Markdown link '(5)' never resolves as '/2/5'.
  const index = path.join(out, 'index.html')
  const normalizeRoute = `<script>if(location.pathname.length>${url.length}&&/\\/[0-9]+\\/$/.test(location.pathname))history.replaceState(null,"",location.pathname.slice(0,-1)+location.search+location.hash)</script>`
  await writeFile(index, (await readFile(index, 'utf8')).replace('<head>', `<head>\n${normalizeRoute}`))
  // GitHub Pages uses the site's root 404 page. Real slide entry points keep
  // a bookmarked nested paper URL from booting the showcase application.
  const data = await load({ roots: [process.cwd()], userRoot: process.cwd() }, path.resolve(entry))
  const routes = ['overview', 'notes', 'presenter', ...data.slides.flatMap((_, index) => [String(index + 1), `presenter/${index + 1}`])]
  for (const route of routes) {
    await mkdir(path.join(out, route), { recursive: true })
    await cp(path.join(out, 'index.html'), path.join(out, route, 'index.html'))
  }
}
await mkdir('dist/guide', { recursive: true })
await cp('docs/quickstart', 'dist/guide', { recursive: true })
await cp('assets/bit-logo.png', 'dist/guide/bit-logo.png')
for (const file of ['GETTING_STARTED.md', 'GETTING_STARTED.en.md']) await cp(path.join('docs', file), path.join('dist', file))
await cp('docs/attention/SOURCES.md', 'dist/attention/SOURCES.md')
console.log(`Built theme ${base}, paper ${base}attention/, guide ${base}guide/`)
