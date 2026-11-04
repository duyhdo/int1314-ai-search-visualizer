import { describe, expect, it } from 'vitest'
import {
  appStateReducer,
  createInitialAppState,
} from '../utils/appState'
import { generateMaze } from '../utils/mazeGenerator'

describe('maze-aware app state', () => {
  const foundResult = {
    found: true,
    path: [{ row: 0, col: 0 }],
    visitedOrder: [{ row: 0, col: 0 }],
    pathCost: 0,
    expandedNodes: 1,
  }

  const notFoundResult = {
    found: false,
    path: [],
    visitedOrder: [{ row: 0, col: 0 }],
    pathCost: null,
    expandedNodes: 1,
  }

  function startSearch(state, requestId, overrides = {}) {
    return appStateReducer(state, {
      type: 'search-started',
      requestId,
      maze: state.maze,
      algorithmId: state.selectedAlgorithm,
      ...overrides,
    })
  }

  function finishSearch(state, type, requestId, overrides = {}) {
    return appStateReducer(state, {
      type,
      requestId,
      maze: state.maze,
      algorithmId: state.selectedAlgorithm,
      result: foundResult,
      executionTimeMs: 1,
      error: 'request failed',
      ...overrides,
    })
  }

  function selectedSearchState() {
    return appStateReducer(createInitialAppState(), {
      type: 'algorithm-selected',
      algorithmId: 'greedy',
    })
  }

  it('starts with one random 15×20 maze at the requested default density', () => {
    const state = createInitialAppState()

    expect(state.maze.grid).toHaveLength(15)
    expect(state.maze.grid.every((row) => row.length === 20)).toBe(true)
    expect(state.maze.start).toEqual({ row: 0, col: 0 })
    expect(state.maze.goal).toEqual({ row: 14, col: 19 })
    expect(state.mazeSize).toBe('15x20')
    expect(state.obstacleDensity).toBe(25)
    expect(state.selectedAlgorithm).toBe('')
    expect(state.resultRecord).toBeNull()
    expect(state.comparisonResults).toEqual([])
  })

  it('clears result, error, comparison, and running state when a maze is generated', () => {
    const oldMaze = generateMaze({ size: '10x10', density: 0 })
    const state = {
      maze: oldMaze,
      selectedAlgorithm: 'greedy',
      resultRecord: { maze: oldMaze, result: { found: true } },
      comparisonResults: [{ maze: oldMaze, algorithmId: 'greedy' }],
      isRunning: true,
      error: 'old error',
      activeSearch: {
        requestId: 1,
        maze: oldMaze,
        algorithmId: 'greedy',
      },
    }
    const newMaze = generateMaze({ size: '15x20', density: 25 })
    const nextState = appStateReducer(state, {
      type: 'maze-generated',
      maze: newMaze,
      size: '15x20',
      density: 25,
    })

    expect(nextState.maze).toBe(newMaze)
    expect(nextState.resultRecord).toBeNull()
    expect(nextState.comparisonResults).toEqual([])
    expect(nextState.isRunning).toBe(false)
    expect(nextState.error).toBeNull()
    expect(nextState.selectedAlgorithm).toBe('greedy')
    expect(nextState.activeSearch).toBeNull()
  })

  it('reset cancels a pending search, clears old data, and keeps maze and algorithm', () => {
    const state = {
      ...selectedSearchState(),
      resultRecord: { result: foundResult },
      comparisonResults: [{ algorithmId: 'greedy' }],
      error: 'old error',
    }
    const pendingState = startSearch(state, 'request-1')
    const resetState = appStateReducer(pendingState, { type: 'reset' })

    expect(resetState.maze).toBe(state.maze)
    expect(resetState.selectedAlgorithm).toBe('greedy')
    expect(resetState.resultRecord).toBeNull()
    expect(resetState.comparisonResults).toEqual([])
    expect(resetState.error).toBeNull()
    expect(resetState.isRunning).toBe(false)
    expect(resetState.activeSearch).toBeNull()
    expect(
      finishSearch(resetState, 'search-succeeded', 'request-1'),
    ).toBe(resetState)
    expect(
      finishSearch(resetState, 'search-failed', 'request-1'),
    ).toBe(resetState)
  })

  it('rejects overlapping searches and only accepts the active request', () => {
    const state = selectedSearchState()
    const firstPending = startSearch(state, 'request-1')
    const overlappingPending = appStateReducer(firstPending, {
      type: 'search-started',
      requestId: 'request-2',
      maze: state.maze,
      algorithmId: state.selectedAlgorithm,
    })

    expect(overlappingPending).toBe(firstPending)
    expect(
      finishSearch(firstPending, 'search-succeeded', 'request-2'),
    ).toBe(firstPending)

    const completed = finishSearch(
      firstPending,
      'search-succeeded',
      'request-1',
    )
    expect(completed.resultRecord.result).toBe(foundResult)
    expect(completed.isRunning).toBe(false)
    expect(completed.activeSearch).toBeNull()
    expect(completed.comparisonResults).toHaveLength(1)
  })

  it('ignores late success and failure after generating a different maze', () => {
    const oldMaze = generateMaze({ size: '10x10', density: 0 })
    const stateWithOldMaze = {
      ...selectedSearchState(),
      maze: oldMaze,
      resultRecord: { maze: oldMaze, result: foundResult },
      comparisonResults: [{ maze: oldMaze, algorithmId: 'greedy' }],
    }
    const pendingState = startSearch(stateWithOldMaze, 'request-1')
    const newMaze = generateMaze({ size: '15x20', density: 0 })
    const state = appStateReducer(pendingState, {
      type: 'maze-generated',
      maze: newMaze,
      size: '15x20',
      density: 0,
    })

    expect(state.selectedAlgorithm).toBe('greedy')
    expect(state.resultRecord).toBeNull()
    expect(state.comparisonResults).toEqual([])
    expect(
      finishSearch(state, 'search-succeeded', 'request-1', {
        maze: oldMaze,
      }),
    ).toBe(state)
    expect(
      finishSearch(state, 'search-failed', 'request-1', {
        maze: oldMaze,
      }),
    ).toBe(state)
  })

  it('ignores pending search callbacks after the algorithm changes', () => {
    const pendingState = startSearch(selectedSearchState(), 'request-1')
    const changedState = appStateReducer(pendingState, {
      type: 'algorithm-selected',
      algorithmId: 'astar',
    })

    expect(changedState.selectedAlgorithm).toBe('astar')
    expect(changedState.isRunning).toBe(false)
    expect(changedState.activeSearch).toBeNull()
    expect(
      finishSearch(changedState, 'search-succeeded', 'request-1', {
        algorithmId: 'greedy',
      }),
    ).toBe(changedState)
    expect(
      finishSearch(changedState, 'search-failed', 'request-1', {
        algorithmId: 'greedy',
      }),
    ).toBe(changedState)
  })

  it('accepts a valid found=false result as a successful search execution', () => {
    const pendingState = startSearch(selectedSearchState(), 'request-1')
    const completed = finishSearch(
      pendingState,
      'search-succeeded',
      'request-1',
      { result: notFoundResult },
    )

    expect(completed.resultRecord.result).toBe(notFoundResult)
    expect(completed.comparisonResults[0].result).toBe(notFoundResult)
    expect(completed.error).toBeNull()
    expect(completed.activeSearch).toBeNull()
  })

  it('keeps current results when size or density settings change without generating', () => {
    const state = {
      ...createInitialAppState(),
      resultRecord: { result: { found: true } },
      comparisonResults: [{ algorithmId: 'greedy' }],
    }
    const unchangedState = appStateReducer(state, {
      type: 'maze-settings-changed',
      size: '10x10',
      density: 40,
    })

    expect(unchangedState.maze).toBe(state.maze)
    expect(unchangedState.resultRecord).toBe(state.resultRecord)
    expect(unchangedState.comparisonResults).toBe(state.comparisonResults)
    expect(unchangedState.mazeSize).toBe('10x10')
    expect(unchangedState.obstacleDensity).toBe(40)
  })
})

describe('error-dismissed', () => {
  it('clears the error and keeps everything else', () => {
    const state = { ...createInitialAppState(), error: 'boom', selectedAlgorithm: 'astar' }
    const next = appStateReducer(state, { type: 'error-dismissed' })

    expect(next.error).toBeNull()
    expect(next.selectedAlgorithm).toBe('astar')
    expect(next.maze).toBe(state.maze)
  })

  it('returns the same state if there is no error', () => {
    const state = createInitialAppState()
    expect(appStateReducer(state, { type: 'error-dismissed' })).toBe(state)
  })
})
