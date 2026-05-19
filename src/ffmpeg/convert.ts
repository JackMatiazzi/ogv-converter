import type { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import type { MediaKind } from '../media/detect'
import { clearFFmpegProgressHandler, getFFmpeg } from './loader'

export class ConversionError extends Error {
  constructor(cause?: unknown) {
    super('conversion failed')
    this.name = 'ConversionError'
    this.cause = cause
  }
}

export async function convert(
  file: File,
  kind: MediaKind,
  outputFilename: string,
  onProgress: (ratio: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFFmpeg(onProgress)
  const inputName = createInputName(file)

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file))
    await ffmpeg.exec(createFFmpegArgs(kind, inputName, outputFilename))

    const data = await ffmpeg.readFile(outputFilename)
    const mime = kind === 'video' ? 'video/ogg' : 'audio/ogg'

    if (!(data instanceof Uint8Array)) {
      throw new ConversionError('unexpected ffmpeg output type')
    }

    return new Blob([data.slice()], { type: mime })
  } catch (error) {
    if (error instanceof ConversionError) throw error
    throw new ConversionError(error)
  } finally {
    clearFFmpegProgressHandler()
    await deleteIfExists(ffmpeg, inputName)
    await deleteIfExists(ffmpeg, outputFilename)
  }
}

function createInputName(file: File): string {
  const safeName = file.name.replace(/[^a-z0-9.]/gi, '_')
  return `input_${crypto.randomUUID()}_${safeName}`
}

export function createFFmpegArgs(kind: MediaKind, inputName: string, outputFilename: string): string[] {
  if (kind === 'video') {
    return [
      '-i',
      inputName,
      '-c:v',
      'libtheora',
      '-q:v',
      '7',
      '-c:a',
      'libvorbis',
      '-q:a',
      '5',
      outputFilename,
    ]
  }

  return ['-i', inputName, '-c:a', 'libvorbis', '-q:a', '5', outputFilename]
}

async function deleteIfExists(ffmpeg: FFmpeg, filename: string) {
  try {
    await ffmpeg.deleteFile(filename)
  } catch (err) {
    console.warn('[ogv] cleanup failed for', filename, err)
  }
}
