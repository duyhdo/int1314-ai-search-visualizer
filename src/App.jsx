import { useState } from 'react'
import MazeGrid from './components/MazeGrid'
import ControlPanel from './components/ControlPanel'
import Animation from './components/Animation'
import Statistics from './components/Statistics'
import StatisticsComparison from './components/StatisticsComparison'
import { sampleMaze } from './data/sampleMaze'
import { validateInput, validateResult } from './utils/searchContract'
import * as bfsModule from './algorithms/bfs'
import * as dfsModule from './algorithms/dfs'
import * as ucsModule from './algorithms/ucs'
import * as greedyModule from './algorithms/greedy'
import * as astarModule from './algorithms/astar'
import './styles/app.css'
import './App.css'

function App() {
  const [maze] = useState(sampleMaze)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('')
  const [resultRecord, setResultRecord] = useState(null)
  const [comparisonResults, setComparisonResults] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)

  const currentResultRecord =
    resultRecord?.maze === maze ? resultRecord : null
  const currentResult = currentResultRecord?.result || null
  const currentComparisonResults = comparisonResults.filter(
    (entry) => entry.maze === maze,
  )

  const algorithmMap = {
    bfs: bfsModule.breadthFirstSearch,
    dfs: dfsModule.depthFirstSearch,
    ucs: ucsModule.uniformCostSearch,
    greedy: greedyModule.greedyBestFirstSearch,
    astar: astarModule.aStarSearch,
  }

  const handleRunSearch = async () => {
    setError(null)
    setIsRunning(true)
    setResultRecord(null)

    try {
      // Validate input
      const validation = validateInput(maze)
      if (!validation.valid) {
        throw new Error(`Invalid input: ${validation.error}`)
      }

      const searchFn = algorithmMap[selectedAlgorithm]
      if (!searchFn) {
        throw new Error('Selected algorithm not found')
      }

      // Execute search
      const startTime = performance.now()
      const searchResult = searchFn(maze)
      const measuredExecutionTimeMs = performance.now() - startTime

      // Validate result
      if (!searchResult) {
        throw new Error('Algorithm returned no result')
      }

      const resultValidation = validateResult(searchResult)
      if (!resultValidation.valid) {
        throw new Error(`Invalid result: ${resultValidation.error}`)
      }

      setResultRecord({
        maze,
        algorithmId: selectedAlgorithm,
        result: searchResult,
        executionTimeMs: measuredExecutionTimeMs,
      })
      setComparisonResults((previousResults) => [
        ...previousResults.filter(
          (entry) =>
            entry.algorithmId !== selectedAlgorithm || entry.maze !== maze,
        ),
        {
          maze,
          algorithmId: selectedAlgorithm,
          result: searchResult,
          executionTimeMs: measuredExecutionTimeMs,
        },
      ])
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during search'
      setError(errorMsg)
    } finally {
      setIsRunning(false)
    }
  }

  const handleAlgorithmChange = (algorithmId) => {
    setSelectedAlgorithm(algorithmId)
    setResultRecord(null)
    setError(null)
  }

  const handleReset = () => {
    setSelectedAlgorithm('')
    setResultRecord(null)
    setComparisonResults([])
    setError(null)
  }

  return (
    <>
      <header className="app-header">
        <h1>AI Search Visualizer</h1>
        <p>Visualize and compare pathfinding algorithms on a 2D maze</p>
      </header>

      <div className="app-container">
        <div className="app-main">
          <div className="panel">
            <h2>Maze</h2>
            <MazeGrid
              grid={maze.grid}
              start={maze.start}
              goal={maze.goal}
              visited={currentResult?.visitedOrder || []}
              path={currentResult?.path || []}
            />
          </div>

          <Animation result={currentResult} />
        </div>

        <div className="app-sidebar">
          <ControlPanel
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
            onRun={handleRunSearch}
            onReset={handleReset}
            isRunning={isRunning}
            hasResult={currentResult !== null}
          />

          <Statistics
            result={currentResult}
            algorithmId={selectedAlgorithm}
            executionTimeMs={currentResultRecord?.executionTimeMs}
          />

          {error && (
            <div className="panel">
              <h2>Error</h2>
              <div className="error-message">{error}</div>
            </div>
          )}
        </div>

        <StatisticsComparison results={currentComparisonResults} />
      </div>
    </>
  )
}

export default App
