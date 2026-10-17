#!/usr/bin/env node
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const themeArchive = 'https://github.com/RoxyXu151/slidev-theme-bit/releases/download/v0.1.1/slidev-theme-bit-0.1.1.tgz'

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node init_deck.mjs <project-dir> [--theme <local-theme-dir>]\nCreates a new BIT Slidev project. No installation or network access. Refuses nonempty destinations.')
    return
  }
  if (!args[0] || args[0].startsWith('-') || (args.length !== 1 && !(args.length === 3 && args[1] === '--theme' && args[2])))
    throw new Error('Usage: node init_deck.mjs <project-dir> [--theme <local-theme-dir>]')

  const destination = path.resolve(args[0])
  try {
    if (!(await stat(destination)).isDirectory() || (await readdir(destination)).length)
      throw new Error(`Refusing to overwrite a nonempty or non-directory destination: ${destination}`)
  }
  catch (error) { if (error.code !== 'ENOENT') throw error }

  let dependency = themeArchive
  if (args.length === 3) {
    const themeRoot = path.resolve(args[2])
    const manifest = JSON.parse(await readFile(path.join(themeRoot, 'package.json'), 'utf8'))
    if (manifest.name !== 'slidev-theme-bit') throw new Error('--theme must point to a slidev-theme-bit theme directory')
    await stat(path.join(themeRoot, 'layouts', 'cover.vue'))
    await stat(path.join(themeRoot, 'layouts', 'default.vue'))
    const relative = path.relative(destination, themeRoot).split(path.sep).join('/')
    dependency = `file:${relative || '.'}`
  }

  const starter = await readFile(path.join(skillRoot, 'assets', 'starter.md'), 'utf8')
  const notice = await readFile(path.join(skillRoot, 'assets', 'NOTICE.md'), 'utf8')
  const manifest = {
    name: 'bit-slidev-presentation', private: true, type: 'module',
    engines: { node: '>=22.18.0' },
    scripts: { dev: 'slidev slides.md', build: 'slidev build slides.md', export: 'slidev export slides.md --output slides.pdf' },
    dependencies: { 'slidev-theme-bit': dependency },
    devDependencies: { '@slidev/cli': '53.0.0', '@slidev/theme-default': '0.25.0', vue: '^3.5.42' },
    overrides: { 'floating-vue': '5.2.2', dompurify: '^3.4.17' },
  }
  const readme = `# 北理工 Slidev 演示\n\n需要 Node.js 22.18 或以上。\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\n编辑 slides.md，图片放在 public/ 中并以 /filename.png 引用。当前起步稿为 9 页，含待补充标记。\n\n构建网页：\`npm run build\`。导出 PDF 前运行 \`npm install -D playwright-chromium\` 和 \`npx playwright install chromium\`，然后 \`npm run export\`。\n\n本演示使用非官方社区主题 [slidev-theme-bit](https://github.com/RoxyXu151/slidev-theme-bit)。保留主题原模板设计者韩宇（2019）的署名，素材权利说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。\n`
  const files = {
    'package.json': `${JSON.stringify(manifest, null, 2)}\n`,
    'slides.md': starter,
    '.gitignore': 'node_modules/\ndist/\n.slidev/\n*.pdf\n.env\n.env.*\n',
    'README.md': readme,
    'THIRD_PARTY_NOTICES.md': notice,
  }
  await mkdir(destination, { recursive: true })
  for (const [name, content] of Object.entries(files))
    await writeFile(path.join(destination, name), content, { encoding: 'utf8', flag: 'wx' })
  await mkdir(path.join(destination, 'public'), { recursive: true })
  console.log(`Created BIT Slidev project: ${destination}\nNext: enter that directory, run npm install, then npm run dev.\nEdit slides.md and replace all research placeholders with verified material.`)
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
