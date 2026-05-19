import { useRef } from 'react'

interface Props {
  onFile: (file: File) => void
}

const FORMATS = ['mp4', 'mov', 'mkv', 'mp3', 'wav', 'flac']

export function Dropzone({ onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  function handleDragLeave(e: React.DragEvent) {
    e.currentTarget.classList.remove('drag-over')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')

    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)

    e.target.value = ''
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
  }

  return (
    <div
      className="dropzone"
      role="button"
      tabIndex={0}
      aria-label="Dropzone"
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*,.mp4,.mov,.avi,.mkv,.webm,.mp3,.wav,.flac,.ogg,.aac,.m4a"
        className="sr-only"
        onChange={handleChange}
      />
      <div className="dropzone-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className="dropzone-label">solte o arquivo aqui</p>
      <p className="dropzone-hint">ou clique para escolher</p>
      <div className="dropzone-formats">
        {FORMATS.map((format) => (
          <span key={format} className="format-tag">{format}</span>
        ))}
      </div>
    </div>
  )
}
