import './Animation.css'

/**
 * Animation Component
 * Placeholder for step-by-step search visualization
 * 
 * @param {Object} props
 * @param {Object} [props.result] - Search result object
 */
function Animation({ result }) {
  if (!result) {
    return (
      <div className="panel animation-panel">
        <h2>Animation</h2>
        <div className="placeholder-content">
          <div className="placeholder-icon">▶</div>
          <p>Run a search to see step-by-step animation</p>
          <p className="placeholder-note">
            Feature to be implemented by Student 3
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="panel animation-panel">
      <h2>Animation</h2>
      <div className="placeholder-content">
        <div className="placeholder-icon">▶</div>
        <p>Step-by-step visualization will appear here</p>
        <p className="placeholder-note">
          This feature is under development by Student 3
        </p>
        {result.visitedOrder && (
          <div className="animation-info">
            <p>Nodes visited: {result.visitedOrder.length}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Animation
