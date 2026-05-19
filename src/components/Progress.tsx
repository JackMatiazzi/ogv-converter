interface Props {
  label: string
  ratio: number
}

export function Progress({ label, ratio }: Props) {
  const percent = Math.round(ratio * 100)

  return (
    <div className="progress-wrap">
      <p className="progress-label">{label}</p>
      <div className="progress-track">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="progress-pct">{percent}%</p>
      </div>
    </div>
  )
}
