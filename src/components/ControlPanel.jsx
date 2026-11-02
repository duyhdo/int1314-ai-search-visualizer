import { ALGORITHMS } from '../utils/searchContract.js'
import './ControlPanel.css'

/**
 * ControlPanel Component
 * Allows user to select algorithm and control search execution
 * 
 * @param {Object} props
 * @param {string} props.selectedAlgorithm - Currently selected algorithm ID
 * @param {Function} props.onAlgorithmChange - Callback when algorithm selection changes
 * @param {Function} props.onRun - Callback when Run button is clicked
 * @param {Function} props.onReset - Callback when Reset button is clicked
 * @param {boolean} [props.isRunning] - Whether search is currently running
 * @param {boolean} [props.hasResult] - Whether there is a result to show
 */
function ControlPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  onRun,
  onReset,
  isRunning = false,
  hasResult = false,
}) {
  return (
    <div className="panel control-panel">
      <h2>Search Control</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="algorithm-select">
          Algorithm
        </label>
        <select
          id="algorithm-select"
          className="form-select"
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isRunning}
        >
          <option value="">-- Select an algorithm --</option>
          {ALGORITHMS.map((algo) => (
            <option key={algo.id} value={algo.id}>
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      <div className="algorithm-description">
        {selectedAlgorithm &&
          ALGORITHMS.find((a) => a.id === selectedAlgorithm) && (
            <p className="description-text">
              {ALGORITHMS.find((a) => a.id === selectedAlgorithm).description}
            </p>
          )}
      </div>

      <div className="button-group button-group-vertical">
        <button
          className="button button-primary button-block"
          onClick={onRun}
          disabled={!selectedAlgorithm || isRunning}
        >
          {isRunning ? 'Running...' : 'Run Search'}
        </button>
        <button
          className="button button-secondary button-block"
          onClick={onReset}
          disabled={isRunning}
        >
          Reset
        </button>
      </div>

      {!selectedAlgorithm && (
        <div className="info-message">
          Select an algorithm above to begin.
        </div>
      )}

      {selectedAlgorithm && !hasResult && !isRunning && (
        <div className="info-message">
          Click "Run Search" to execute the algorithm.
        </div>
      )}

      {isRunning && (
        <div className="info-message">
          Search is in progress...
        </div>
      )}
    </div>
  )
}

export default ControlPanel
