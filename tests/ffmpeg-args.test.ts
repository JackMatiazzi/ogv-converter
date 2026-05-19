import { describe, expect, it } from 'vitest'
import { createFFmpegArgs } from '../src/ffmpeg/convert'

describe('FFmpeg arguments', () => {
  it('builds video conversion args for Godot-friendly OGV', () => {
    expect(createFFmpegArgs('video', 'input.mp4', 'output.ogv')).toEqual([
      '-i',
      'input.mp4',
      '-c:v',
      'libtheora',
      '-q:v',
      '7',
      '-c:a',
      'libvorbis',
      '-q:a',
      '5',
      'output.ogv',
    ])
  })

  it('builds audio conversion args for OGG Vorbis', () => {
    expect(createFFmpegArgs('audio', 'input.wav', 'output.ogg')).toEqual([
      '-i',
      'input.wav',
      '-c:a',
      'libvorbis',
      '-q:a',
      '5',
      'output.ogg',
    ])
  })
})
