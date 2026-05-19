import { useEffect, useMemo } from 'react'

interface Props {
  blob: Blob
  filename: string
  onReset: () => void
}

export function Result({ blob, filename, onReset }: Props) {
  const downloadUrl = useMemo(() => URL.createObjectURL(blob), [blob])
  const sizeMB = (blob.size / 1024 / 1024).toFixed(1)

  useEffect(() => {
    return () => URL.revokeObjectURL(downloadUrl)
  }, [downloadUrl])

  return (
    <div className="result-wrap">
      <div className="result-icon-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <p className="result-name">{filename}</p>
      <p className="result-size">{sizeMB} MB</p>
      <a className="btn-primary" href={downloadUrl} download={filename}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        baixar
      </a>
      <button className="btn-ghost" onClick={onReset}>converter outro</button>
    </div>
  )
}
