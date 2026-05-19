import { useCallback, useState } from 'react'
import { Dropzone } from './components/Dropzone'
import { Progress } from './components/Progress'
import { Result } from './components/Result'
import { convert } from './ffmpeg/convert'
import { detect, outputName } from './media/detect'

type State =
  | { status: 'idle' }
  | { status: 'converting'; label: string; ratio: number }
  | { status: 'done'; blob: Blob; filename: string }
  | { status: 'error'; message: string }

const MESSAGES = {
  unsupported: 'formato não suportado',
  loading: 'carregando…',
  converting: 'convertendo…',
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

    setState({ status: 'converting', label: MESSAGES.loading, ratio: 0 })

    try {
      const filename = outputName(file, kind)
      const blob = await convert(file, kind, filename, (ratio) => {
        setState({ status: 'converting', label: MESSAGES.converting, ratio })
      })

      setState({ status: 'done', blob, filename })
    } catch (error) {
      console.error('Conversion failed:', error)
      setState({ status: 'error', message: MESSAGES.failed })
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
