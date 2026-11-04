import { generateMaze } from './mazeGenerator'

export function createInitialAppState() {
  return {
    maze: generateMaze({ size: '15x20', density: 25 }),
    mazeSize: '15x20',
    obstacleDensity: 25,
    selectedAlgorithm: '',
    resultRecord: null,
    comparisonResults: [],
    isRunning: false,
    error: null,
    activeSearch: null,
  }
}

function matchesActiveSearch(state, action) {
  const activeSearch = state.activeSearch
  return (
    activeSearch !== null &&
    activeSearch.requestId === action.requestId &&
    activeSearch.maze === action.maze &&
    activeSearch.algorithmId === action.algorithmId &&
    state.maze === action.maze &&
    state.selectedAlgorithm === action.algorithmId
  )
}

export function appStateReducer(state, action) {
  switch (action.type) {
    case 'maze-generated':
      return {
        ...state,
        maze: action.maze,
        mazeSize: action.size,
        obstacleDensity: action.density,
        resultRecord: null,
        comparisonResults: [],
        isRunning: false,
        error: null,
        activeSearch: null,
      }
    case 'maze-generation-failed':
      return {
        ...state,
        isRunning: false,
        error: action.error,
        activeSearch: null,
      }
    case 'maze-settings-changed':
      return {
        ...state,
        mazeSize: action.size ?? state.mazeSize,
        obstacleDensity: action.density ?? state.obstacleDensity,
      }
    case 'algorithm-selected':
      return {
        ...state,
        selectedAlgorithm: action.algorithmId,
        resultRecord: null,
        error: null,
        isRunning: false,
        activeSearch: null,
      }
    case 'search-started':
      if (
        action.maze !== state.maze ||
        action.algorithmId !== state.selectedAlgorithm ||
        state.activeSearch !== null ||
        action.requestId === undefined ||
        action.requestId === null
      ) {
        return state
      }
      return {
        ...state,
        isRunning: true,
        resultRecord: null,
        error: null,
        activeSearch: {
          requestId: action.requestId,
          maze: action.maze,
          algorithmId: action.algorithmId,
        },
      }
    case 'search-succeeded':
      if (!matchesActiveSearch(state, action)) {
        return state
      }
      return {
        ...state,
        isRunning: false,
        error: null,
        activeSearch: null,
        resultRecord: {
          maze: action.maze,
          algorithmId: action.algorithmId,
          result: action.result,
          executionTimeMs: action.executionTimeMs,
        },
        comparisonResults: [
          ...state.comparisonResults.filter(
            (entry) =>
              entry.algorithmId !== action.algorithmId ||
              entry.maze !== action.maze,
          ),
          {
            maze: action.maze,
            algorithmId: action.algorithmId,
            result: action.result,
            executionTimeMs: action.executionTimeMs,
          },
        ],
      }
    case 'search-failed':
      if (!matchesActiveSearch(state, action)) {
        return state
      }
      return {
        ...state,
        isRunning: false,
        error: action.error,
        activeSearch: null,
      }
    case 'error-dismissed':
      return state.error === null ? state : { ...state, error: null }
    case 'reset':
      return {
        ...state,
        resultRecord: null,
        comparisonResults: [],
        isRunning: false,
        error: null,
        activeSearch: null,
      }
    default:
      return state
  }
}
