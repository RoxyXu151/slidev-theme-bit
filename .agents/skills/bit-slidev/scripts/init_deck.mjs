#!/usr/bin/env node
import { cp, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const themeArchive = 'https://github.com/RoxyXu151/slidev-theme-bit/releases/download/v0.3.0/slidev-theme-bit-0.3.0.tgz'
const templates = {
  defense: { file: 'starter.md', label: '学位论文答辩', pages: 9 },
  paper: { file: 'paper.md', label: '论文阅读汇报', pages: 12 },
  meeting: { file: 'meeting.md', label: '组会汇报', pages: 8 },
}
const usage = 'Usage: node init_deck.mjs <project-dir> [--template defense|paper|meeting] [--theme <local-theme-dir>]'

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && args[0] === '--list') {
    for (const [name, info] of Object.entries(templates)) console.log(`${name}\t${info.label}\t${info.pages} 页`)
    return
  }
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log(`${usage}\n--list lists the scenarios. No installation or network access. Refuses nonempty destinations.`)
    return
  }
  if (!args[0] || args[0].startsWith('-')) throw new Error(usage)
  const options = { template: 'defense' }
  const seen = new Set()
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i]
    if (!['--template', '--theme'].includes(flag) || !args[i + 1] || args[i + 1].startsWith('--') || seen.has(flag)) throw new Error(usage)
    seen.add(flag)
    options[flag.slice(2)] = args[i + 1]
  }
  if (!templates[options.template]) throw new Error(`Unknown template: ${options.template}. Choose defense, paper, or meeting.`)
  const template = templates[options.template]
  const destination = path.resolve(args[0])
  try {
    if (!(await stat(destination)).isDirectory() || (await readdir(destination)).length)
      throw new Error(`Refusing to overwrite a nonempty or non-directory destination: ${destination}`)
  }
  catch (error) { if (error.code !== 'ENOENT') throw error }

  let dependency = themeArchive
  if (options.theme) {
    const themeRoot = path.resolve(options.theme)
    const manifest = JSON.parse(await readFile(path.join(themeRoot, 'package.json'), 'utf8'))
    if (manifest.name !== 'slidev-theme-bit') throw new Error('--theme must point to a slidev-theme-bit theme directory')
    await stat(path.join(themeRoot, 'layouts', 'cover.vue'))
    await stat(path.join(themeRoot, 'layouts', 'default.vue'))
    const relative = path.relative(destination, themeRoot).split(path.sep).join('/')
    dependency = `file:${relative || '.'}`
  }
  const starter = await readFile(path.join(skillRoot, 'assets', template.file), 'utf8')
  const notice = await readFile(path.join(skillRoot, 'assets', 'NOTICE.md'), 'utf8')
  const manifest = {
    name: 'bit-slidev-presentation', private: true, type: 'module',
    engines: { node: '>=22.18.0' },
    scripts: { dev: 'slidev slides.md', build: 'slidev build slides.md', check: 'node scripts/check_deck.mjs', export: 'slidev export slides.md --output slides.pdf' },
    dependencies: { 'slidev-theme-bit': dependency },
    devDependencies: { '@slidev/cli': '53.0.0', '@slidev/parser': '53.0.0', '@slidev/theme-default': '0.25.0', 'playwright-chromium': '^1.61.1', vue: '^3.5.42' },
    overrides: { 'floating-vue': '5.2.2', dompurify: '^3.4.17' },
  }
  const readme = `# 北理工 · ${template.label}

当前起步稿 ${template.pages} 页，含待补充标记。需要 Node.js 22.18 或以上。

## 1. 启动预览

\`\`\`bash
npm install
npm run dev
\`\`\`

打开终端地址。Slidev 是网页幻灯片；编辑 slides.md 并保存，网页自动更新。图片放在 public/，以 /filename.png 引用。每页末尾的 HTML 注释是讲稿，按 P 查看。

## 2. 交给 AI 修改

提供真实材料和 slides.md，描述“第几页、改什么、希望怎样展示”。请 AI 先组织内容、复用已有布局、保留来源；不要编造数据，不用缩小字号塞内容。

## 3. 逐页检查与导出

\`\`\`bash
npx playwright install chromium
npm run check
npm run build
npm run export
\`\`\`

检查器自动启动独立预览，输出 .slidev-check/slides/index.html、report.json 和逐页截图，完成后关闭预览。若已有 Chrome，可用 \`npm run check -- --browser chrome\`。根据报告修改后重跑；检查器不验证研究事实或 PPTX 兼容性。

网页构建在 dist/，PDF 是 slides.pdf。修改源稿后须重新构建或导出。

本演示使用非官方社区主题 [slidev-theme-bit](https://github.com/RoxyXu151/slidev-theme-bit)。原模板设计韩宇（2019），素材权利说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
`
  const files = {
    'package.json': `${JSON.stringify(manifest, null, 2)}\n`,
    'slides.md': starter,
    '.gitignore': 'node_modules/\ndist/\n.slidev/\n.slidev-check/\n*.pdf\n.env\n.env.*\n',
    'README.md': readme,
    'AGENTS.md': `# 演示项目指引

这是用户的独立演示，源稿是 slides.md，图片放 public/。主题安装于 node_modules/slidev-theme-bit，版式接口见其中的 .agents/skills/bit-slidev/references/layouts.md。

- 先核对用户材料、用途、页数和时长，保留未知事实的待补充标记。
- 复用现有版式和组件，保持经典页眉。每页一个主题，内容过多时精简或拆页，不通过缩小字号塞内容。
- 数字、图片、文献和结论必须有来源；讲稿写在页面末尾的 HTML 注释中。
- 修改后运行 npm run check，读取 .slidev-check/slides/report.json 并查看逐页截图。修正错误，逐项处理提醒，再重新运行。
- 规则不核对研究事实、全部动画步骤或 PPTX 导出，仍要人工核查。不要删检查、隐藏内容来获得通过。
- 运行 npm run build 核对构建。按用户要求导出；源稿修改后重新导出。
- 不自动将用户报告提交、推送或公开部署。保留 THIRD_PARTY_NOTICES.md。
`,
    'THIRD_PARTY_NOTICES.md': notice,
  }
  await mkdir(destination, { recursive: true })
  for (const [name, content] of Object.entries(files))
    await writeFile(path.join(destination, name), content, { encoding: 'utf8', flag: 'wx' })
  await mkdir(path.join(destination, 'public'), { recursive: true })
  await mkdir(path.join(destination, 'scripts'), { recursive: true })
  await cp(path.join(skillRoot, 'scripts', 'check_deck.mjs'), path.join(destination, 'scripts', 'check_deck.mjs'))
  await cp(path.join(skillRoot, 'scripts', 'lib'), path.join(destination, 'scripts', 'lib'), { recursive: true })
  console.log(`Created BIT Slidev project: ${destination}\n${template.label} · ${template.pages} 页\nNext: enter that directory, run npm install, then npm run dev.\nReplace placeholders with verified material, then run npm run check.`)
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
