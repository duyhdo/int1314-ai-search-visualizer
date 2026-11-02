import { getAlgorithmName } from '../utils/searchContract.js'
import './Statistics.css'

/**
 * Statistics Component
 * Displays search result statistics and comparison data
 * 
 * @param {Object} props
 * @param {Object} [props.result] - Search result object
 * @param {string} [props.algorithmId] - ID of the algorithm used
 */
function Statistics({ result, algorithmId }) {
  if (!result) {
    return (
      <div className="panel statistics-panel">
        <h2>Statistics</h2>
        <div className="placeholder-content">
          <div className="placeholder-icon">📊</div>
          <p>Run a search to see statistics</p>
          <p className="placeholder-note">
            Comparison features to be implemented by Student 4
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel statistics-panel">
      <h2>Statistics</h2>

      {result.found ? (
        <>
          <div className="stats-item">
            <span className="stats-label">Algorithm</span>
            <span className="stats-value">
              {getAlgorithmName(algorithmId) || algorithmId}
            </span>
          </div>

          <div className="stats-item">
            <span className="stats-label">Path Found</span>
            <span className="stats-value success">✓ Yes</span>
          </div>

          <div className="stats-item">
            <span className="stats-label">Path Length</span>
            <span className="stats-value">{result.path.length} cells</span>
          </div>

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
        </>
      ) : (
        <>
          <div className="stats-item">
            <span className="stats-label">Algorithm</span>
            <span className="stats-value">
              {getAlgorithmName(algorithmId) || algorithmId}
            </span>
          </div>

          <div className="stats-item">
            <span className="stats-label">Path Found</span>
            <span className="stats-value error">✗ No</span>
          </div>

          <div className="stats-item">
            <span className="stats-label">Nodes Expanded</span>
            <span className="stats-value">{result.expandedNodes}</span>
          </div>

          <div className="stats-item">
            <span className="stats-label">Nodes Visited</span>
            <span className="stats-value">{result.visitedOrder.length}</span>
          </div>

          <div className="info-message" style={{ marginTop: 'var(--spacing-md)' }}>
            No path exists between start and goal.
          </div>
        </>
      )}

      <div className="comparison-placeholder">
        <p className="placeholder-note">
          Algorithm comparison features will be added by Student 4
        </p>
      </div>
    </div>
  )
}

export default Statistics
