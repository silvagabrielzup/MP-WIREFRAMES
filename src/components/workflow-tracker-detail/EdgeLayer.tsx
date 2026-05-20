import {
  CANVAS_H,
  CANVAS_W,
  edgePath,
  edges,
  indexOf,
  NODE_H,
  NODE_W,
  NODE_Y,
  nodeX,
  steps,
  verbToken,
} from './utils'

export function EdgeLayer({ selectedId }: { selectedId: string | null }) {
  return (
    <svg width={CANVAS_W} height={CANVAS_H} className="pointer-events-none absolute inset-0">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#3a3c45" />
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" className="fill-info" />
        </marker>
        <marker id="arrow-dead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#2a2b32" />
        </marker>
        {(['info', 'success', 'warning', 'accent'] as const).map((from) =>
          (['info', 'success', 'warning', 'accent'] as const).map((to) =>
            from === to ? null : (
              <linearGradient key={`${from}-${to}`} id={`g-${from}-${to}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={`text-${from}`} stopColor="currentColor" />
                <stop offset="100%" className={`text-${to}`} stopColor="currentColor" />
              </linearGradient>
            ),
          ),
        )}
      </defs>
      {edges.map((e) => {
        const fromIdx = indexOf(e.from)
        const toIdx = indexOf(e.to)
        if (fromIdx < 0 || toIdx < 0) return null
        const fromStep = steps[fromIdx]
        const toStep = steps[toIdx]
        const d = edgePath(fromIdx, toIdx)
        const isCross = fromStep.verb !== toStep.verb

        const stroke = e.failedPath
          ? 'stroke-failure'
          : e.active
          ? 'stroke-info'
          : e.dead
          ? 'stroke-[#2a2b32]'
          : isCross
          ? `[stroke:url(#g-${verbToken(fromStep.verb)}-${verbToken(toStep.verb)})]`
          : 'stroke-[#3a3c45]'

        const marker = e.active
          ? 'url(#arrow-active)'
          : e.dead
          ? 'url(#arrow-dead)'
          : 'url(#arrow)'

        const labelX = (nodeX(fromIdx) + NODE_W + nodeX(toIdx)) / 2
        const labelY = NODE_Y + NODE_H / 2 - 14

        const touched = selectedId && (selectedId === e.from || selectedId === e.to)
        return (
          <g key={`${e.from}-${e.to}`}>
            <path
              d={d}
              fill="none"
              strokeWidth={touched ? 2 : 1.5}
              className={`${stroke} ${e.conditional ? '[stroke-dasharray:4_4]' : ''}`}
              markerEnd={marker}
            />
            {e.conditionLabel && (
              <g>
                <rect
                  x={labelX - 110}
                  y={labelY - 9}
                  rx={3}
                  ry={3}
                  width={220}
                  height={18}
                  className="fill-[#101115] stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={labelX}
                  y={labelY + 4}
                  textAnchor="middle"
                  className="fill-text-muted"
                  style={{ font: '10px ui-monospace, SFMono-Regular, monospace' }}
                >
                  {e.conditionLabel}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
