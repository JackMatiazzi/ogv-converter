import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export class FFmpegLoadError extends Error {
  constructor(cause?: unknown) {
    super('ffmpeg load failed')
    this.name = 'FFmpegLoadError'
    this.cause = cause
  }
}

const CORE_BASE_URL = `${import.meta.env.BASE_URL}ffmpeg`

let instance: FFmpeg | null = null
let loading: Promise<FFmpeg> | null = null
let progressHandler: ((ratio: number) => void) | null = null

export async function getFFmpeg(onProgress?: (ratio: number) => void): Promise<FFmpeg> {
  progressHandler = onProgress ?? null

  if (instance) return instance
  if (loading) return loading

  loading = loadFFmpeg()
    .then((ffmpeg) => {
      instance = ffmpeg
      return ffmpeg
    })
    .catch((error) => {
      loading = null
      progressHandler = null
      throw new FFmpegLoadError(error)
    })

  return loading
}

export function clearFFmpegProgressHandler() {
  progressHandler = null
}

async function loadFFmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg()

  ffmpeg.on('progress', ({ progress }) => {
    progressHandler?.(progress)
  })

  await ffmpeg.load({
    coreURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${CORE_BASE_URL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  return ffmpeg
}
