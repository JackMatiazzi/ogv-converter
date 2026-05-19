import { useCallback, useState } from 'react'
import { Dropzone } from './components/Dropzone'
import { Progress } from './components/Progress'
import { Result } from './components/Result'
import { ConversionError, convert } from './ffmpeg/convert'
import { FFmpegLoadError } from './ffmpeg/loader'
import { detect, outputName } from './media/detect'

const FILE_SIZE_LIMIT = 500 * 1024 * 1024

type State =
  | { status: 'idle' }
  | { status: 'converting'; label: string; ratio: number }
  | { status: 'done'; blob: Blob; filename: string }
  | { status: 'error'; message: string }

const MESSAGES = {
  unsupported: 'formato não suportado',
  tooLarge: 'arquivo muito grande (máx 500 MB)',
  loading: 'carregando…',
  converting: 'convertendo…',
  loadFailed: 'erro ao carregar o conversor',
  convertFailed: 'não foi possível converter este arquivo',
  failed: 'algo deu errado',
} as const

export function App() {
  const [state, setState] = useState<State>({ status: 'idle' })

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  const handleFile = useCallback(async (file: File) => {
    const kind = detect(file)

    if (kind === 'unsupported') {
      setState({ status: 'error', message: MESSAGES.unsupported })
      return
    }

    if (file.size > FILE_SIZE_LIMIT) {
      setState({ status: 'error', message: MESSAGES.tooLarge })
      return
    }

    setState({ status: 'converting', label: MESSAGES.loading, ratio: 0 })

    try {
      const filename = outputName(file, kind)
      const blob = await convert(file, kind, filename, (ratio) => {
        setState({ status: 'converting', label: MESSAGES.converting, ratio })
      })

      setState({ status: 'done', blob, filename })
    } catch (error) {
      console.error('[ogv] pipeline error:', error)

      if (error instanceof FFmpegLoadError) {
        setState({ status: 'error', message: MESSAGES.loadFailed })
      } else if (error instanceof ConversionError) {
        setState({ status: 'error', message: MESSAGES.convertFailed })
      } else {
        setState({ status: 'error', message: MESSAGES.failed })
      }
    }
  }, [])

  return (
    <>
      {state.status === 'idle' && <Dropzone onFile={handleFile} />}

      {state.status === 'converting' && (
        <Progress label={state.label} ratio={state.ratio} />
      )}

      {state.status === 'done' && (
        <Result blob={state.blob} filename={state.filename} onReset={reset} />
      )}

      {state.status === 'error' && (
        <div className="error-wrap">
          <p className="error-msg">{state.message}</p>
          <button className="btn-secondary" onClick={reset}>Tentar novamente</button>
        </div>
      )}
    </>
  )
}
