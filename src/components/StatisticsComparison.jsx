import { ALGORITHMS, getAlgorithmName } from '../utils/searchContract.js'
import './StatisticsComparison.css'

/**
 * Displays only results supplied by the application state.
 *
 * @param {Object} props
 * @param {Array<{algorithmId: string, result: Object, executionTimeMs?: number}>} [props.results]
 */
function StatisticsComparison({ results = [] }) {
  const resultsByAlgorithm = new Map(
    results.map((entry) => [entry.algorithmId, entry]),
  )
  const knownAlgorithmIds = new Set(ALGORITHMS.map((algorithm) => algorithm.id))
  const algorithms = [
    ...ALGORITHMS,
    ...results
      .filter((entry) => !knownAlgorithmIds.has(entry.algorithmId))
      .map((entry) => ({
        id: entry.algorithmId,
        name: getAlgorithmName(entry.algorithmId) || entry.algorithmId,
      })),
  ]

  return (
    <div className="panel statistics-comparison-panel">
      <h2>Algorithm Comparison</h2>
      <div className="comparison-table-container">
        <table className="comparison-table">
          <caption className="comparison-caption">
            Results from algorithms actually run on the current maze
          </caption>
          <thead>
            <tr>
              <th scope="col">Algorithm</th>
              <th scope="col">Path Found</th>
              <th scope="col">Path Length</th>
              <th scope="col">Path Cost</th>
              <th scope="col">Expanded</th>
              <th scope="col">Execution Time</th>
            </tr>
          </thead>
          <tbody>
            {algorithms.map((algorithm) => {
              const entry = resultsByAlgorithm.get(algorithm.id)
              if (!entry?.result) {
                return (
                  <tr key={algorithm.id}>
                    <th scope="row">{algorithm.name}</th>
                    <td colSpan="5" className="comparison-no-data">
                      Chưa có dữ liệu
                    </td>
                  </tr>
                )
              }

              const { result, executionTimeMs } = entry
              const hasExecutionTime =
                Number.isFinite(executionTimeMs) && executionTimeMs >= 0

              return (
                <tr key={algorithm.id}>
                  <th scope="row">{algorithm.name}</th>
                  <td>{result.found ? 'Có' : 'Không'}</td>
                  <td>{result.path.length}</td>
                  <td>{result.pathCost ?? '—'}</td>
                  <td>{result.expandedNodes}</td>
                  <td>
                    {hasExecutionTime
                      ? `${executionTimeMs.toFixed(2)} ms`
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StatisticsComparison
