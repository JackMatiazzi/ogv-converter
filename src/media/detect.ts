export type MediaKind = 'video' | 'audio' | 'unsupported'

const VIDEO_MIME = new Set([
  'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
  'video/x-matroska', 'video/ogg', 'video/mpeg',
])

const AUDIO_MIME = new Set([
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav',
  'audio/flac', 'audio/x-flac', 'audio/ogg', 'audio/aac',
  'audio/mp4', 'audio/webm',
])

const VIDEO_EXT = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'mpg', 'm4v'])
const AUDIO_EXT = new Set(['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a', 'wma'])

export function detect(file: File): MediaKind {
  if (VIDEO_MIME.has(file.type)) return 'video'
  if (AUDIO_MIME.has(file.type)) return 'audio'

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (VIDEO_EXT.has(ext)) return 'video'
  if (AUDIO_EXT.has(ext)) return 'audio'

  return 'unsupported'
}

export function outputName(file: File, kind: MediaKind): string {
  const base = file.name.replace(/\.[^.]+$/, '')
  return kind === 'video' ? `${base}.ogv` : `${base}.ogg`
}
