import './MazeGrid.css'

/**
 * MazeGrid Component
 * Displays the grid, obstacles, start position, and goal position
 * 
 * @param {Object} props
 * @param {Array<Array<number>>} props.grid - 2D grid (0=walkable, 1=obstacle)
 * @param {Object} props.start - Start position {row, col}
 * @param {Object} props.goal - Goal position {row, col}
 * @param {Array<{row, col}>} [props.visited] - Cells visited during search (optional)
 * @param {Array<{row, col}>} [props.path] - Final path from start to goal (optional)
 */
function MazeGrid({ grid, start, goal, visited = [], path = [] }) {
  if (!grid || grid.length === 0) {
    return <div className="maze-grid-error">Grid data not available</div>
  }

  const cols = grid[0].length

  // Create sets for quick lookup
  const visitedSet = new Set(visited.map((p) => `${p.row},${p.col}`))
  const pathSet = new Set(path.map((p) => `${p.row},${p.col}`))

  const getCellClass = (row, col) => {
    const cellKey = `${row},${col}`

    if (row === start.row && col === start.col) return 'cell-start'
    if (row === goal.row && col === goal.col) return 'cell-goal'
    if (grid[row][col] === 1) return 'cell-obstacle'
    if (pathSet.has(cellKey)) return 'cell-path'
    if (visitedSet.has(cellKey)) return 'cell-visited'

    return 'cell-empty'
  }

  return (
    <div className="maze-grid-container">
      <div className="maze-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <div key={`${rowIdx}-${colIdx}`} className={`maze-cell ${getCellClass(rowIdx, colIdx)}`}>
              <div className="cell-inner" />
            </div>
          ))
        )}
      </div>
      <div className="maze-legend">
        <div className="legend-item">
          <div className="legend-color cell-start"><div className="cell-inner" /></div>
          <span>Start</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-goal"><div className="cell-inner" /></div>
          <span>Goal</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-obstacle"><div className="cell-inner" /></div>
          <span>Obstacle</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-visited"><div className="cell-inner" /></div>
          <span>Visited</span>
        </div>
        <div className="legend-item">
          <div className="legend-color cell-path"><div className="cell-inner" /></div>
          <span>Path</span>
        </div>
      </div>
    </div>
  )
}

export default MazeGrid
