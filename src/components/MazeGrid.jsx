import './MazeGrid.css'

function MazeGrid({ grid, start, goal, visited = [], path = [], isEditing = false, onCellClick }) {
  if (!grid || grid.length === 0) {
    return <div className="maze-grid-error">Grid data not available</div>
  }

  const cols = grid[0].length
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
      <div className={isEditing ? "maze-grid maze-grid-editing" : "maze-grid"} role="grid" aria-label="Maze grid" style={{ gridTemplateColumns: `repeat(${cols}, var(--cell-size))` }}>
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <button role="gridcell" type="button" key={`${rowIdx}-${colIdx}`} className={`maze-cell ${getCellClass(rowIdx, colIdx)}`}
              aria-label={`Row ${rowIdx + 1}, column ${colIdx + 1}: ${rowIdx === start.row && colIdx === start.col ? 'Start' : rowIdx === goal.row && colIdx === goal.col ? 'Goal' : cell === 1 ? 'Wall' : 'Open'}`}
              disabled={!isEditing || (rowIdx === start.row && colIdx === start.col) || (rowIdx === goal.row && colIdx === goal.col)}
              onClick={() => onCellClick?.(rowIdx, colIdx)}>
              <span className="cell-inner">{rowIdx === start.row && colIdx === start.col ? 'S' : rowIdx === goal.row && colIdx === goal.col ? 'G' : ''}</span>
            </button>
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
