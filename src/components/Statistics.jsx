import { getAlgorithmName } from '../utils/searchContract.js'
import './Statistics.css'

/**
 * Statistics Component
 * Displays metrics for one search result.
 * 
 * @param {Object} props
 * @param {Object} [props.result] - Search result object
 * @param {string} [props.algorithmId] - ID of the algorithm used
 * @param {number} [props.executionTimeMs] - Runtime metadata, in milliseconds
 */
function Statistics({ result, algorithmId, executionTimeMs }) {
  if (!result) {
    return (
      <div className="panel statistics-panel">
        <h2>Statistics</h2>
        <div className="placeholder-content">
          <div className="placeholder-icon" aria-hidden="true">📊</div>
          <p>Run a search to see statistics</p>
        </div>
      </div>
    )
  }

  const algorithmName = getAlgorithmName(algorithmId) || algorithmId || 'Unknown'
  const hasExecutionTime =
    Number.isFinite(executionTimeMs) && executionTimeMs >= 0

  return (
    <div className="panel statistics-panel">
      <h2>Statistics</h2>

      <div className="stats-item">
        <span className="stats-label">Algorithm</span>
        <span className="stats-value">{algorithmName}</span>
      </div>

      <div className="stats-item">
        <span className="stats-label">Path Found</span>
        <span className={`stats-value ${result.found ? 'success' : 'error'}`}>
          {result.found ? '✓ Yes' : '✗ No'}
        </span>
      </div>

      {result.found && (
        <div className="stats-item">
          <span className="stats-label">Path Length</span>
          <span className="stats-value">
            {result.path.length - 1}{' '}
            {result.path.length - 1 === 1 ? 'step' : 'steps'}
          </span>
        </div>
      )}

      <div className="stats-item">
        <span className="stats-label">Path Cost</span>
        <span className="stats-value">
          {result.pathCost !== null ? result.pathCost : 'N/A'}
        </span>
      </div>

      <div className="stats-item">
        <span className="stats-label">Nodes Expanded</span>
        <span className="stats-value">{result.expandedNodes}</span>
      </div>

      <div className="stats-item">
        <span className="stats-label">Nodes Visited</span>
        <span className="stats-value">{result.visitedOrder.length}</span>
      </div>

      {hasExecutionTime && (
        <div className="stats-item">
          <span className="stats-label">Execution Time</span>
          <span className="stats-value">
            {executionTimeMs.toFixed(2)} ms
          </span>
        </div>
      )}

      {!result.found && (
        <div className="info-message">
          No path exists between start and goal.
        </div>
      )}
    </div>
  )
}

export default Statistics
