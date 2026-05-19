import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'node_modules/@ffmpeg/core/dist/esm')
const dest = resolve(root, 'public/ffmpeg')

if (process.env.CI || process.env.CF_PAGES) {
  console.log('[prebuild] CI environment - skipping wasm copy (using CDN)')
  process.exit(0)
}

const required = ['ffmpeg-core.js', 'ffmpeg-core.wasm']

for (const file of required) {
  if (!existsSync(resolve(src, file))) {
    console.error(`[prebuild] ${file} not found in node_modules/@ffmpeg/core`)
    console.error('[prebuild] run: npm install')
    process.exit(1)
  }
}

mkdirSync(dest, { recursive: true })

for (const file of required) {
  const from = resolve(src, file)
  const to = resolve(dest, file)

  if (sameFileContent(from, to)) continue

  try {
    copyFileSync(from, to)
  } catch (err) {
    if (err.code === 'EPERM') {
      console.error(`[prebuild] permission denied writing ${file}`)
      console.error('[prebuild] close any process that may be using public/ffmpeg/ and retry')
      process.exit(1)
    }
    throw err
  }
}

function sameFileContent(left, right) {
  if (!existsSync(right)) return false

  const leftContent = readFileSync(left)
  const rightContent = readFileSync(right)

  return leftContent.equals(rightContent)
}
