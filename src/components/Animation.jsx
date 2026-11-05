import { useEffect, useMemo, useState } from 'react'
import './Animation.css'

const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
]

/**
 * Tính ô biên (frontier): ô đi được, kề với ô đã duyệt, nhưng chưa được duyệt.
 * @param {number[][]} grid
 * @param {Array<{row:number,col:number}>} visited
 * @returns {Array<{row:number,col:number}>}
 */
function computeFrontier(grid, visited) {
  const visitedKeys = new Set(visited.map((p) => `${p.row},${p.col}`))
  const seen = new Set()
  const frontier = []

  for (const { row, col } of visited) {
    for (const [dr, dc] of DIRECTIONS) {
      const r = row + dr
      const c = col + dc
      const key = `${r},${c}`
      if (
        r >= 0 &&
        r < grid.length &&
        c >= 0 &&
        c < grid[r].length &&
        grid[r][c] === 0 &&
        !visitedKeys.has(key) &&
        !seen.has(key)
      ) {
        seen.add(key)
        frontier.push({ row: r, col: c })
      }
    }
  }
  return frontier
}

/**
 * Animation Component
 * Hiển thị từng bước tìm kiếm: ô đang xét, ô biên, ô đã duyệt và đường đi.
 * Gửi trạng thái hiện tại lên App qua onFrameChange để MazeGrid vẽ lại.
 *
 * @param {Object} props
 * @param {Object} [props.result] - Kết quả tìm kiếm (visitedOrder, path, found)
 * @param {{grid: number[][]}} [props.maze] - Mê cung đang dùng
 * @param {Function} [props.onFrameChange] - Callback nhận frame { result, visited, current, frontier, path }
 * @param {Function} [props.onAnimationComplete] - Gọi khi animation chạy xong
 */
function Animation({ result, maze, onFrameChange, onAnimationComplete }) {
  const total = result?.visitedOrder?.length ?? 0

  const [step, setStep] = useState(total)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(6)
  const [prevResult, setPrevResult] = useState(result)

  // Có kết quả mới -> chạy lại từ đầu.
  if (result !== prevResult) {
    setPrevResult(result)
    setStep(total > 0 ? 0 : total)
    setPlaying(total > 0)
  }

  const delay = Math.round(800 / speed ** 1.5)

  useEffect(() => {
    if (!playing) return undefined
    const atEnd = step >= total
    const id = setTimeout(
      () => {
        if (atEnd) {
          setPlaying(false)
          onAnimationComplete?.()
        } else {
          setStep(step + 1)
        }
      },
      atEnd ? 0 : delay,
    )
    return () => clearTimeout(id)
  }, [playing, step, total, delay, onAnimationComplete])

  const frame = useMemo(() => {
    if (!result) return null
    const visited = result.visitedOrder.slice(0, step)
    return {
      result,
      visited,
      current: step > 0 ? result.visitedOrder[step - 1] : null,
      frontier: maze?.grid ? computeFrontier(maze.grid, visited) : [],
      path: result.found && step >= total ? result.path : [],
    }
  }, [result, maze, step, total])

  useEffect(() => {
    onFrameChange?.(frame)
  }, [frame, onFrameChange])

  if (!result) {
    return (
      <div className="panel animation-panel">
        <h2>Animation</h2>
        <div className="placeholder-content">
          <div className="placeholder-icon">▶</div>
          <p>Run a search to see step-by-step animation</p>
        </div>
      </div>
    )
  }

  const handlePlay = () => {
    if (step >= total) setStep(0)
    setPlaying(true)
  }

  const handlePause = () => setPlaying(false)

  const handleBack = () => {
    setPlaying(false)
    setStep((s) => Math.max(0, s - 1))
  }

  const handleForward = () => {
    setPlaying(false)
    setStep((s) => Math.min(total, s + 1))
  }

  const handleRestart = () => {
    setPlaying(false)
    setStep(0)
  }

  const status = step >= total
    ? result.found
      ? 'Path found'
      : 'No path found'
    : 'Searching...'

  return (
    <div className="panel animation-panel">
      <h2>Animation</h2>

      <div className="anim-counter" aria-live="polite">
        Step {step} of {total} — {status}
      </div>

      <input
        className="anim-progress"
        type="range"
        min="0"
        max={total}
        value={step}
        aria-label="Search step"
        onChange={(e) => {
          setPlaying(false)
          setStep(Number(e.target.value))
        }}
      />

      <div className="anim-controls">
        <button type="button" className="button button-secondary" onClick={handleRestart} disabled={step === 0}>
          ⏮ Restart
        </button>
        <button type="button" className="button button-secondary" onClick={handleBack} disabled={step === 0}>
          ◀ Back
        </button>
        {playing ? (
          <button type="button" className="button button-primary" onClick={handlePause}>
            ⏸ Pause
          </button>
        ) : (
          <button type="button" className="button button-primary" onClick={handlePlay} disabled={total === 0}>
            ▶ Play
          </button>
        )}
        <button type="button" className="button button-secondary" onClick={handleForward} disabled={step >= total}>
          Next ▶
        </button>
      </div>

      <label className="anim-speed">
        <span>Slow</span>
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          aria-label="Animation speed"
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>Fast</span>
      </label>
    </div>
  )
}

export default Animation
