import { copyFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'node_modules/@ffmpeg/core/dist/esm')
const dest = resolve(root, 'public/ffmpeg')

mkdirSync(dest, { recursive: true })
copyFileSync(resolve(src, 'ffmpeg-core.js'), resolve(dest, 'ffmpeg-core.js'))
copyFileSync(resolve(src, 'ffmpeg-core.wasm'), resolve(dest, 'ffmpeg-core.wasm'))
