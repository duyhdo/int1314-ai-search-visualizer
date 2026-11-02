import { useState } from 'react'
import MazeGrid from './components/MazeGrid'
import ControlPanel from './components/ControlPanel'
import Animation from './components/Animation'
import Statistics from './components/Statistics'
import { sampleMaze } from './data/sampleMaze'
import { validateInput, createEmptyResult } from './utils/searchContract'
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
  const [result, setResult] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState(null)

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
      const searchResult = searchFn(maze)

      // Validate result
      if (!searchResult) {
        throw new Error('Algorithm returned no result')
      }

      setResult(searchResult)
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during search'
      setError(errorMsg)
      setResult(createEmptyResult())
    } finally {
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setSelectedAlgorithm('')
    setResult(null)
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
              visited={result?.visitedOrder || []}
              path={result?.path || []}
            />
          </div>

          <Animation result={result} />
        </div>

        <div className="app-sidebar">
          <ControlPanel
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={setSelectedAlgorithm}
            onRun={handleRunSearch}
            onReset={handleReset}
            isRunning={isRunning}
            hasResult={result !== null}
          />

          <Statistics result={result} algorithmId={selectedAlgorithm} />

          {error && (
            <div className="panel">
              <h2>Error</h2>
              <div className="error-message">{error}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
