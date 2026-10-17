import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const skill = path.join(root, '.agents', 'skills', 'bit-slidev')
const init = path.join(skill, 'scripts', 'init_deck.mjs')
const install = path.join(skill, 'scripts', 'install_skill.mjs')
await mkdir(path.join(root, '.work'), { recursive: true })

function run(script, args, cwd) {
  return spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' })
}
async function sandbox() { return mkdtemp(path.join(root, '.work', 'skill check ')) }

test('initializer creates a usable manifest and editable starter from another working directory', async () => {
  const cwd = await sandbox()
  const destination = path.join(cwd, '论文答辩 with spaces')
  const result = run(init, [destination], cwd)
  assert.equal(result.status, 0, result.stderr)
  const manifest = JSON.parse(await readFile(path.join(destination, 'package.json'), 'utf8'))
  assert.equal(manifest.private, true)
  assert.equal(manifest.scripts.build, 'slidev build slides.md')
  assert.match(manifest.dependencies['slidev-theme-bit'], /^https:\/\/github\.com\/RoxyXu151\/slidev-theme-bit\/releases\/download\//)
  assert.equal(existsSync(path.join(destination, 'node_modules')), false, 'Scaffolding must not install dependencies')
  assert.equal(existsSync(path.join(destination, 'public')), true)
  assert.match(await readFile(path.join(destination, 'slides.md'), 'utf8'), /theme: bit/)
  assert.match(await readFile(path.join(destination, 'THIRD_PARTY_NOTICES.md'), 'utf8'), /韩宇/)
})

test('initializer preserves all existing destination contents', async () => {
  const cwd = await sandbox()
  const existing = path.join(cwd, 'existing')
  await mkdir(existing)
  await writeFile(path.join(existing, 'slides.md'), 'A report that must remain untouched')
  const result = run(init, [existing], cwd)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /Refusing to overwrite/)
  assert.equal(await readFile(path.join(existing, 'slides.md'), 'utf8'), 'A report that must remain untouched')
  assert.deepEqual(await readdir(existing), ['slides.md'])
})

test('initializer rejects an unrelated local theme before creating output', async () => {
  const cwd = await sandbox()
  const invalid = path.join(cwd, 'other theme')
  const destination = path.join(cwd, 'new report')
  await mkdir(invalid)
  await writeFile(path.join(invalid, 'package.json'), '{"name":"unrelated-theme"}')
  const result = run(init, [destination, '--theme', invalid], cwd)
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /slidev-theme-bit theme directory/)
  assert.equal(existsSync(destination), false)
})

test('installed skill is self-contained and installer refuses existing or recursive destinations', async () => {
  const cwd = await sandbox()
  const installed = path.join(cwd, 'installed skills', 'bit-slidev')
  const first = run(install, ['--dest', installed], cwd)
  assert.equal(first.status, 0, first.stderr)
  const copiedInit = path.join(installed, 'scripts', 'init_deck.mjs')
  const destination = path.join(cwd, 'from installed skill')
  assert.equal(run(copiedInit, [destination], cwd).status, 0)
  assert.equal(await readFile(path.join(destination, 'slides.md'), 'utf8'), await readFile(path.join(skill, 'assets', 'starter.md'), 'utf8'))
  assert.equal(await readFile(path.join(installed, 'references', 'layouts.md'), 'utf8'), await readFile(path.join(skill, 'references', 'layouts.md'), 'utf8'))
  await writeFile(path.join(installed, 'SKILL.md'), 'User customization')
  const repeat = run(install, ['--dest', installed], cwd)
  assert.notEqual(repeat.status, 0)
  assert.equal(await readFile(path.join(installed, 'SKILL.md'), 'utf8'), 'User customization')
  const recursive = run(install, ['--dest', path.join(skill, 'nested-install-check')], cwd)
  assert.notEqual(recursive.status, 0)
  assert.equal(existsSync(path.join(skill, 'nested-install-check')), false)
})
