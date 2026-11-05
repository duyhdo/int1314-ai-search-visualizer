import { useEffect, useReducer, useRef, useState } from 'react'
import MazeGrid from './components/MazeGrid'
import MazeEditor from './components/MazeEditor'
import { sampleMaze } from './data/sampleMaze'
import ControlPanel from './components/ControlPanel'
import Animation from './components/Animation'
import MazeGenerator from './components/MazeGenerator'
import Statistics from './components/Statistics'
import StatisticsComparison from './components/StatisticsComparison'
import { validateInput, validateResult } from './utils/searchContract'
import { generateMaze } from './utils/mazeGenerator'
import { appStateReducer, createInitialAppState } from './utils/appState'
import { getShortcutAction } from './utils/keyboard'
import * as bfsModule from './algorithms/bfs'
import * as dfsModule from './algorithms/dfs'
import * as ucsModule from './algorithms/ucs'
import * as greedyModule from './algorithms/greedy'
import * as astarModule from './algorithms/astar'
import './styles/app.css'
import './App.css'

function App() {
  const [state, dispatch] = useReducer(
    appStateReducer,
    undefined,
    createInitialAppState,
  )
  const [isEditing, setIsEditing] = useState(false)
  const nextRequestIdRef = useRef(0)
  const activeRequestRef = useRef(null)
  const {
    maze,
    selectedAlgorithm,
    resultRecord,
    comparisonResults,
    isRunning,
    error,
    mazeSize,
    obstacleDensity,
  } = state

  const currentResultRecord =
    resultRecord?.maze === maze ? resultRecord : null
  const currentResult = currentResultRecord?.result || null
  const currentComparisonResults = comparisonResults.filter((entry) => entry.maze === maze)
  const errorHint = error ? getErrorHint(error) : null

  const algorithmMap = {
    bfs: bfsModule.breadthFirstSearch,
    dfs: dfsModule.depthFirstSearch,
    ucs: ucsModule.uniformCostSearch,
    greedy: greedyModule.greedyBestFirstSearch,
    astar: astarModule.aStarSearch,
  }

  const handleRunSearch = async () => {
    if (activeRequestRef.current !== null) {
      return
    }

    const requestId = nextRequestIdRef.current + 1
    nextRequestIdRef.current = requestId
    const request = { requestId, maze, algorithmId: selectedAlgorithm }
    activeRequestRef.current = request
    setIsEditing(false)
    dispatch({ type: 'search-started', ...request })

    try {
      const validation = validateInput(maze)
      if (!validation.valid) {
        throw new Error(`Invalid input: ${validation.error}`)
      }

      const searchFn = algorithmMap[selectedAlgorithm]
      if (!searchFn) {
        throw new Error('Selected algorithm not found')
      }
      const startTime = performance.now()
      const searchOutput = searchFn(maze)
      const searchResult =
        searchOutput && typeof searchOutput.then === 'function'
          ? await searchOutput
          : searchOutput
      const measuredExecutionTimeMs = performance.now() - startTime
      if (!searchResult) {
        throw new Error('Algorithm returned no result')
      }

      const resultValidation = validateResult(searchResult)
      if (!resultValidation.valid) {
        throw new Error(`Invalid result: ${resultValidation.error}`)
      }

      dispatch({
        type: 'search-succeeded',
        ...request,
        result: searchResult,
        executionTimeMs: measuredExecutionTimeMs,
      })
    } catch (err) {
      const errorMsg = err.message || 'An error occurred during search'
      dispatch({ type: 'search-failed', ...request, error: errorMsg })
    } finally {
      if (activeRequestRef.current?.requestId === requestId) {
        activeRequestRef.current = null
      }
    }
  }

  const handleGenerateMaze = ({ size, density }) => {
    activeRequestRef.current = null
    try {
      const generatedMaze = generateMaze({ size, density })
      setIsEditing(false)
      dispatch({
        type: 'maze-generated',
        maze: generatedMaze,
        size,
        density,
      })
    } catch (err) {
      dispatch({
        type: 'maze-generation-failed',
        error: err.message || 'Unable to generate maze',
      })
    }
  }

  const handleAlgorithmChange = (algorithmId) => {
    activeRequestRef.current = null
    dispatch({ type: 'algorithm-selected', algorithmId })
  }

  const handleCellClick = (row, col) => {
    if (!isEditing || isRunning) return
    if ((row === maze.start.row && col === maze.start.col) ||
        (row === maze.goal.row && col === maze.goal.col)) return
    activeRequestRef.current = null
    const editedMaze = {
      ...maze,
      grid: maze.grid.map((cells, r) => r === row
        ? cells.map((value, c) => c === col ? 1 - value : value)
        : cells),
    }
    dispatch({ type: 'maze-edited', maze: editedMaze })
  }

  const handleRestore = () => {
    activeRequestRef.current = null
    setIsEditing(false)
    dispatch({ type: 'maze-generated', maze: structuredClone(sampleMaze), size: '10x10', density: obstacleDensity })
  }

  const handleReset = () => {
    activeRequestRef.current = null
    setIsEditing(false)
    dispatch({ type: 'reset' })
  }

  // re-attached every render so the handler always sees the latest state
  useEffect(() => {
    const onKeyDown = (event) => {
      const action = getShortcutAction(event)
      if (!action) return

      if (action.type === 'dismiss-error') {
        if (error) dispatch({ type: 'error-dismissed' })
        return
      }
      if (isRunning) return

      if (action.type === 'run') {
        event.preventDefault()
        if (selectedAlgorithm) handleRunSearch()
      } else if (action.type === 'reset') {
        handleReset()
      } else if (action.type === 'select') {
        handleAlgorithmChange(action.algorithmId)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

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
            <MazeEditor isEditing={isEditing} disabled={isRunning}
              onEditToggle={() => setIsEditing(current => !current)} onRestore={handleRestore} />
            <MazeGrid
              isEditing={isEditing && !isRunning}
              onCellClick={handleCellClick}
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
          <MazeGenerator
            onGenerate={handleGenerateMaze}
            size={mazeSize}
            density={obstacleDensity}
            onSizeChange={(size) =>
              dispatch({ type: 'maze-settings-changed', size })
            }
            onDensityChange={(density) =>
              dispatch({ type: 'maze-settings-changed', density })
            }
          />

          <ControlPanel
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmChange={handleAlgorithmChange}
            onRun={handleRunSearch}
            onReset={handleReset}
            isRunning={isRunning}
            hasResult={currentResult !== null}
            resultFound={currentResult?.found}
          />

          <Statistics
            result={currentResult}
            algorithmId={selectedAlgorithm}
            executionTimeMs={currentResultRecord?.executionTimeMs}
          />

          {error && (
            <div className="panel error-panel" role="alert">
              <div className="error-panel-header">
                <h2>Error</h2>
                <button
                  type="button"
                  className="error-close"
                  onClick={() => dispatch({ type: 'error-dismissed' })}
                  title="Close (Esc)"
                  aria-label="Close error"
                >
                  ×
                </button>
              </div>
              <div className="error-message">{error}</div>
              {errorHint && <p className="error-hint">{errorHint}</p>}
            </div>
          )}
        </div>

        <StatisticsComparison results={currentComparisonResults} />
      </div>
    </>
  )
}

function getErrorHint(message) {
  if (/not implemented/i.test(message)) {
    return 'This algorithm has not been merged yet. Try another one (keys 1-5).'
  }
  if (/walkable/i.test(message)) {
    return 'Start or goal is on a wall. Generate a new maze and try again.'
  }
  if (/Invalid result/.test(message)) {
    return 'The algorithm returned data that breaks the search contract. Check its unit tests.'
  }
  return null
}

export default App
