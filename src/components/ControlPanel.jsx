import { ALGORITHMS } from '../utils/searchContract.js'
import { SHORTCUTS } from '../utils/keyboard.js'
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
 * @param {boolean} [props.resultFound] - Whether the last search reached the goal
 */
function ControlPanel({
  selectedAlgorithm,
  onAlgorithmChange,
  onRun,
  onReset,
  isRunning = false,
  hasResult = false,
  resultFound = false,
}) {
  const selected = ALGORITHMS.find((a) => a.id === selectedAlgorithm)

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
          {ALGORITHMS.map((algo, i) => (
            <option key={algo.id} value={algo.id}>
              {i + 1}. {algo.name}
            </option>
          ))}
        </select>
      </div>

      <div className="algorithm-description">
        {selected && <p className="description-text">{selected.description}</p>}
      </div>

      <div className="button-group button-group-vertical">
        <button
          className="button button-primary button-block"
          onClick={onRun}
          disabled={!selectedAlgorithm || isRunning}
        >
          {isRunning ? 'Running...' : 'Run Search'}
          {!isRunning && <kbd className="key-hint">Enter</kbd>}
        </button>
        <button
          className="button button-secondary button-block"
          onClick={onReset}
          disabled={isRunning}
        >
          Reset
          <kbd className="key-hint">R</kbd>
        </button>
      </div>

      {!selectedAlgorithm && (
        <div className="info-message">
          Select an algorithm above (or press 1-5) to begin.
        </div>
      )}

      {selectedAlgorithm && !hasResult && !isRunning && (
        <div className="info-message">
          Click "Run Search" to execute the algorithm.
        </div>
      )}

      {isRunning && (
        <div className="info-message loading-message">
          <span className="spinner" aria-hidden="true" />
          Search is in progress...
        </div>
      )}

      {hasResult && !isRunning && (
        <div className={resultFound ? 'success-message' : 'warning-message'}>
          {resultFound
            ? `${selected?.name ?? 'Search'} finished: path found.`
            : `${selected?.name ?? 'Search'} finished: no path to the goal.`}
        </div>
      )}

      <details className="shortcut-help">
        <summary>Keyboard shortcuts</summary>
        <ul>
          {SHORTCUTS.map((s) => (
            <li key={s.keys}>
              <kbd>{s.keys}</kbd>
              <span>{s.label}</span>
            </li>
          ))}
        </ul>
      </details>
    </div>
  )
}

export default ControlPanel
