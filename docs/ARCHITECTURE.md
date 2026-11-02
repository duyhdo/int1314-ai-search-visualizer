# Architecture Overview

## System Design

The AI Search Visualizer is a single-page React application that follows a modular, layered architecture designed for team collaboration.

```
┌─────────────────────────────────────────────────────────┐
│                  User Interface Layer                   │
│  App.jsx (orchestrator) → Components (UI)               │
│  MazeGrid | ControlPanel | Statistics | Animation       │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│              Business Logic Layer                       │
│  Search Algorithms (bfs.js, dfs.js, etc.)              │
│  Algorithm interface: (input) → result                 │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────────┐
│              Utilities & Data Access Layer             │
│  Grid utilities (grid.js)                              │
│  Search contract (searchContract.js)                   │
│  Sample data (sampleMaze.js)                           │
└─────────────────────────────────────────────────────────┘
```

## Module Breakdown

### 1. Algorithm Layer (`src/algorithms/`)

**Responsibility:** Implement search algorithms following a strict contract.

**Files:**
- `bfs.js` - Breadth-First Search (Student 1)
- `dfs.js` - Depth-First Search (Student 2)
- `ucs.js` - Uniform Cost Search (Student 3)
- `greedy.js` - Greedy Best-First Search (Student 4)
- `astar.js` - A* Search (Student 5)

**Interface:**
```javascript
export function searchAlgorithm({ grid, start, goal }) {
  // Implementation
  return {
    found: boolean,
    path: [{row, col}, ...],
    visitedOrder: [{row, col}, ...],
    pathCost: number | null,
    expandedNodes: number
  }
}
```

**Key Constraints:**
- No mutations of input
- 4-directional movement (Up, Right, Down, Left)
- Unit move cost
- Deterministic execution
- No third-party pathfinding libraries

### 2. Utility Layer (`src/utils/`)

#### `grid.js` - Grid Manipulation
Provides core grid operations for all algorithms.

**Public Functions:**
- `createGrid(rows, cols, fillValue)` - Create rectangular grid
- `isValidPosition(row, col, grid)` - Check bounds
- `isWalkable(row, col, grid)` - Check if cell is traversable
- `getNeighbors(row, col, grid)` - Get valid adjacent cells (Up, Right, Down, Left)
- `manhattanDistance(from, to)` - Heuristic for Greedy/A*
- `positionsEqual(pos1, pos2)` - Position comparison
- `positionToKey(pos)` / `keyToPosition(key)` - Position serialization

**Implementation Notes:**
- Always checks bounds before access
- Returns neighbors in strict order
- Uses Set-friendly key format

#### `searchContract.js` - Interface Validation
Ensures all algorithms comply with the shared contract.

**Public Functions:**
- `ALGORITHMS` - List of 5 algorithms with metadata
- `getAlgorithmName(id)` - Get display name
- `validateInput(input)` - Validate search input
- `validateResult(result)` - Validate search result
- `createEmptyResult()` - Create failed/empty result

**Validation Rules:**
- Input: grid must be rectangular, start/goal within bounds and walkable
- Result: found/path consistency, no duplicates in visitedOrder, counts match

### 3. Data Layer (`src/data/`)

#### `sampleMaze.js`
Provides test cases for development.

**Exports:**
- `sampleMaze` - 10×10 grid with valid path
- `simpleSquareMaze` - 3×3 minimal example
- `openMaze` - Fully open grid
- `mazeWithNoPath` - Unreachable goal

**No Fake Solutions:** Mazes are defined; algorithms produce results.

### 4. Component Layer (`src/components/`)

**Principles:**
- Single Responsibility - each component does one thing
- Props Only - no global state management yet
- Error Boundaries - graceful failure handling
- Styling - CSS modules per component

#### `MazeGrid.jsx`
Visualizes the 2D maze grid.

**Props:**
- `grid` - 2D array of cells
- `start` - {row, col}
- `goal` - {row, col}
- `visited` - cells explored during search
- `path` - final solution path

**States Rendered:**
- Empty (white) - walkable, unvisited
- Start (green) - starting position
- Goal (red) - target position
- Obstacle (black) - impassable wall
- Visited (light blue) - explored during search
- Path (yellow) - cells in solution

#### `ControlPanel.jsx`
Algorithm selection and search execution.

**Props:**
- `selectedAlgorithm` - current selection
- `onAlgorithmChange` - selection callback
- `onRun` - execute search
- `onReset` - clear results
- `isRunning` - disable during execution
- `hasResult` - disable if no result

**Features:**
- Algorithm dropdown with descriptions
- Run and Reset buttons
- Informational messages

#### `Statistics.jsx`
Displays search result metrics.

**Props:**
- `result` - search result object
- `algorithmId` - which algorithm was used

**Shows:**
- Found status (yes/no)
- Path length
- Path cost
- Nodes expanded
- Nodes visited
- Comparison placeholder (Student 4)

#### `Animation.jsx`
Placeholder for step-by-step visualization (Student 3).

**Props:**
- `result` - search result (optional)

**Future Enhancement:**
- Step controls (previous/next)
- Speed adjustment
- Cell highlighting by visit order
- Playback animation

### 5. Main App (`src/App.jsx`)

**Responsibilities:**
- Load sample maze
- Manage app state (selected algorithm, result, errors)
- Route algorithm selection to execution
- Handle errors gracefully
- Compose all components

**Flow:**
1. User selects algorithm
2. User clicks "Run"
3. App validates input
4. App calls algorithm with maze data
5. App validates result
6. App updates state with result
7. Components re-render with new data
8. User sees results visualized

**Error Handling:**
- Input validation fails → error message
- Algorithm throws Error → caught, error displayed
- Result validation fails → error message

## Data Flow

### Normal Execution Path
```
App Component
  ├─ State: selectedAlgorithm, result, error, maze
  │
  ├─ handleRunSearch() triggered
  │   ├─ validateInput(maze) ← searchContract.js
  │   ├─ algorithmMap[selectedAlgorithm](maze) ← algorithms/
  │   ├─ validateResult(result) ← searchContract.js
  │   └─ setState({ result })
  │
  └─ Render with result
     ├─ MazeGrid: grid, start, goal, visited, path
     ├─ Statistics: result, algorithmId
     ├─ Animation: result
     └─ ControlPanel: handlers, state
```

### Algorithm Execution Context
```
Algorithm (e.g., bfs.js)
  ├─ Input: { grid, start, goal }
  │
  ├─ Use grid.js utilities:
  │   ├─ isWalkable(row, col, grid)
  │   ├─ getNeighbors(row, col, grid)
  │   └─ manhattanDistance(from, to)
  │
  ├─ Track state with Sets/Maps:
  │   ├─ visited - expanded nodes
  │   ├─ queue/stack - frontier
  │   ├─ parent - reconstruct path
  │
  └─ Return: { found, path, visitedOrder, pathCost, expandedNodes }
```

## Student Integration Points

### Student 1: BFS + Grid Utilities
- **Algorithm:** Implement `breadthFirstSearch()`
- **Feature:** Complete/test `grid.js` utility functions
- **Interface:** Use Queue (FIFO) for frontier

### Student 2: DFS + Maze Editing
- **Algorithm:** Implement `depthFirstSearch()`
- **Feature:** Add UI component to edit maze (toggle obstacles)
- **Interface:** Use Stack (LIFO) for frontier

### Student 3: UCS + Animation
- **Algorithm:** Implement `uniformCostSearch()`
- **Feature:** Implement `Animation.jsx` step visualization
- **Interface:** Use Priority Queue for frontier

### Student 4: Greedy + Statistics
- **Algorithm:** Implement `greedyBestFirstSearch()`
- **Feature:** Enhance `Statistics.jsx` with algorithm comparison
- **Interface:** Use Priority Queue with heuristic

### Student 5: A* + Controls
- **Algorithm:** Implement `aStarSearch()`
- **Feature:** Polish UI, add keyboard controls, final integration
- **Interface:** Use Priority Queue with f = g + h

## Testing Strategy

### Unit Tests (`src/tests/`)
- **grid.test.js:** All grid utilities
- **searchContract.test.js:** Validation rules
- No tests for algorithm stubs (not implemented)

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] Sample maze displays correctly
- [ ] Algorithm dropdown populates
- [ ] Each algorithm can be selected
- [ ] Run button is disabled until algorithm selected
- [ ] Run button triggers algorithm execution
- [ ] Result displays without errors
- [ ] Grid visualization updates with path/visited
- [ ] Reset button clears results
- [ ] No console errors

### Algorithm Testing Checklist (for each algorithm)
- [ ] Input validation passes
- [ ] Result validation passes
- [ ] Simple maze finds path
- [ ] Complex maze finds optimal/good path
- [ ] No-path maze returns found=false
- [ ] Corner case: start==goal
- [ ] No mutations of input grid
- [ ] Deterministic on same input
- [ ] visitedOrder has no duplicates
- [ ] expandedNodes matches visitedOrder.length

## Performance Considerations

- **Grid Size:** Currently 10×10, can handle 100×100+
- **Algorithm Complexity:** Varies by algorithm (see implementation)
- **React Rendering:** Memoization may be needed for large grids
- **Memory:** Storing entire visited order can be memory-intensive

## Future Enhancements

- **Undo/Redo:** Track multiple results
- **Preset Mazes:** Library of benchmark problems
- **Weighted Grids:** Different cell costs
- **Diagonal Movement:** Option for 8-directional
- **Real-time Editing:** Live maze updates
- **Performance Comparison:** Side-by-side benchmarks
- **Export Results:** Save paths to JSON/CSV
- **Accessibility:** ARIA labels, keyboard navigation

## Code Quality

### Standards Enforced
- **ESLint:** Consistent code style
- **Vitest:** Unit test coverage
- **JSDoc:** Function documentation
- **No Console:** Clean output (except errors)

### Review Checklist
- Code follows ESLint rules
- Tests pass
- Builds successfully
- No console warnings
- Functions documented
- No unused imports
- Descriptive commit messages

## Troubleshooting

### Algorithm Not Working
1. Check `validateInput()` passes
2. Check `validateResult()` passes
3. Verify neighbor order: Up, Right, Down, Left
4. Ensure no mutations of input
5. Print debug info during development

### UI Not Updating
1. Verify state is being set correctly
2. Check component re-render in React DevTools
3. Ensure props are passed correctly
4. Look for console errors

### Build Fails
1. Run `npm install`
2. Check for syntax errors
3. Verify imports are correct
4. Run `npm run lint`

---

**Last Updated:** November 2, 2026  
**Version:** 1.0 (Initial Skeleton)
