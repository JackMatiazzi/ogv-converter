import { describe, expect, it } from 'vitest'
import { detect, outputName } from '../src/media/detect'

function file(name: string, type = ''): File {
  return new File(['sample'], name, { type })
}

describe('media detection', () => {
  it('detects video by MIME type', () => {
    expect(detect(file('clip.bin', 'video/mp4'))).toBe('video')
  })

  it('detects audio by MIME type', () => {
    expect(detect(file('track.bin', 'audio/flac'))).toBe('audio')
  })

  it('falls back to extension when MIME type is missing', () => {
    expect(detect(file('clip.mkv'))).toBe('video')
    expect(detect(file('track.m4a'))).toBe('audio')
  })

  it('rejects unknown formats', () => {
    expect(detect(file('notes.txt', 'text/plain'))).toBe('unsupported')
  })

  it('generates the expected output extension', () => {
    expect(outputName(file('game-intro.mp4'), 'video')).toBe('game-intro.ogv')
    expect(outputName(file('music.wav'), 'audio')).toBe('music.ogg')
  })
})
