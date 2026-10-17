#!/usr/bin/env node
import { cp, mkdir, stat } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const source = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
async function main() {
  const args = process.argv.slice(2)
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) {
    console.log('Usage: node install_skill.mjs [--dest <skill-folder>]\nDefaults to ~/.agents/skills/bit-slidev. Existing destinations are never overwritten.')
    return
  }
  if (args.length && !(args.length === 2 && args[0] === '--dest' && args[1]))
    throw new Error('Usage: node install_skill.mjs [--dest <skill-folder>]')
  const destination = args.length ? path.resolve(args[1]) : path.join(os.homedir(), '.agents', 'skills', 'bit-slidev')
  const relative = path.relative(source, destination)
  if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative)))
    throw new Error('The installation destination must be outside the source skill folder')
  try { await stat(destination); throw new Error(`Destination already exists; no files changed: ${destination}`) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  await mkdir(path.dirname(destination), { recursive: true })
  await cp(source, destination, { recursive: true, force: false, errorOnExist: true })
  console.log(`Installed bit-slidev: ${destination}\nInvoke $bit-slidev in your agent. If the skill list has not refreshed, reopen the session.`)
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
