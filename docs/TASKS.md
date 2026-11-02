# Student Tasks & Assignments

This document outlines specific responsibilities for each student. Each student must implement **one algorithm** and **one application feature**.

**Deadline:** November 6, 2026

## Student 1: Breadth-First Search (BFS) + Grid Utilities

### Algorithm: Breadth-First Search
**File:** `src/algorithms/bfs.js`

**What to Implement:**
- Export function `breadthFirstSearch({ grid, start, goal })`
- Use queue-based (FIFO) frontier exploration
- Explore neighbors in order: Up, Right, Down, Left
- Track visited nodes to avoid duplicates
- Reconstruct path from parent pointers

**Algorithm Guarantees:**
- ✅ Finds shortest path (fewest moves)
- ✅ Complete (finds path if one exists)
- ✅ Optimal for unit-cost grids
- ⏱️ Slower for large mazes (exponential space)

**Contract:** Must match result format in `searchContract.js`
- `found`: boolean
- `path`: array of {row, col}
- `visitedOrder`: array of visited nodes in expansion order
- `pathCost`: number of moves in path
- `expandedNodes`: count of expanded nodes

**Key Implementation Notes:**
- Initialize queue with start node
- Use a Set or Map to track visited nodes
- Store parent pointers for path reconstruction
- Return path from goal back to start (then reverse)
- Ensure `visitedOrder` has no duplicates

### Feature: Grid Utilities

**Files to Complete/Test:**
- `src/utils/grid.js` - Implement all exported functions
- `src/tests/grid.test.js` - Verify all tests pass

**Functions to Verify/Implement:**
1. ✅ `createGrid(rows, cols, fillValue=0)` - Create rectangular 2D array
2. ✅ `isValidPosition(row, col, grid)` - Check bounds
3. ✅ `isWalkable(row, col, grid)` - Check if cell is 0
4. ✅ `getNeighbors(row, col, grid)` - Return adjacent walkable cells (Up, Right, Down, Left order)
5. ✅ `manhattanDistance(from, to)` - Calculate Manhattan distance
6. ✅ `positionsEqual(pos1, pos2)` - Compare positions
7. ✅ `positionToKey(pos)` / `keyToPosition(key)` - Serialization helpers

**Testing Requirements:**
- All `src/tests/grid.test.js` tests must pass
- Test edge cases (corners, edges, obstacles)
- Test that `getNeighbors` returns in correct order

**Deliverables:**
- [ ] `bfs.js` implemented and tested
- [ ] All grid utilities working correctly
- [ ] Grid tests passing: `npm test -- grid.test.js`
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console errors

**PR Template:**
```
Title: feat(student-1): BFS + Grid Utilities

- Implemented Breadth-First Search algorithm
- Completed grid utility functions
- All tests passing
- Builds successfully
```

---

## Student 2: Depth-First Search (DFS) + Maze Editing UI

### Algorithm: Depth-First Search
**File:** `src/algorithms/dfs.js`

**What to Implement:**
- Export function `depthFirstSearch({ grid, start, goal })`
- Use stack-based (LIFO) frontier exploration
- Explore neighbors in order: Up, Right, Down, Left
- Track visited nodes to avoid cycles
- Reconstruct path from parent pointers

**Algorithm Guarantees:**
- ✅ Complete (finds path if one exists)
- ❌ NOT optimal (may find longer paths)
- ⚠️ Memory efficient compared to BFS
- ⚠️ May explore deep dead-ends before backtracking

**Contract:** Must match result format in `searchContract.js`

**Key Implementation Notes:**
- Initialize stack with start node
- Pop from stack (opposite of BFS queue)
- Visit neighbors in same order: Up, Right, Down, Left
- Mark nodes as visited when expanding (not when adding to stack)
- Same parent pointer reconstruction as BFS

### Feature: Maze Editing UI

**What to Implement:**
- New React component: `src/components/MazeEditor.jsx`
- Add edit mode toggle in the UI
- Allow users to toggle cells between walkable/blocked
- Visual feedback for edit mode
- Reset maze to original state

**Component API:**
```javascript
<MazeEditor 
  grid={grid}           // Current grid
  onGridChange={fn}     // Callback with updated grid
  isEditing={boolean}   // Is edit mode active
  onEditToggle={fn}     // Toggle edit mode
/>
```

**Features:**
- [ ] Click cells to toggle obstacle status (0 ↔ 1)
- [ ] Different cursor for edit mode
- [ ] Restore button to reset to sample maze
- [ ] Error message if start/goal become obstacles
- [ ] Visual indication of edit mode

**Styling:**
- Use plain CSS (consistent with existing styles)
- Highlight editable cells
- Show edit mode indicator

**Deliverables:**
- [ ] `dfs.js` implemented and tested
- [ ] `MazeEditor.jsx` component created
- [ ] Edit UI integrated into `App.jsx`
- [ ] DFS returns valid results
- [ ] Maze editing prevents invalid states
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console errors

**PR Template:**
```
Title: feat(student-2): DFS + Maze Editing

- Implemented Depth-First Search algorithm
- Added maze editing UI component
- Users can toggle obstacles in edit mode
- Prevents invalid start/goal positions
- All tests passing
```

---

## Student 3: Uniform Cost Search (UCS) + Search Animation

### Algorithm: Uniform Cost Search
**File:** `src/algorithms/ucs.js`

**What to Implement:**
- Export function `uniformCostSearch({ grid, start, goal })`
- Use priority queue (min-heap) frontier
- Expand nodes by lowest path cost (g value)
- Track path cost for each node
- Reconstruct path when goal found

**Algorithm Guarantees:**
- ✅ Finds lowest-cost path
- ✅ Optimal (if all costs ≥ 0)
- ✅ Complete
- ⏱️ Similar time/space to Dijkstra

**For Unit-Cost Grids:**
- UCS behaves like BFS (all moves cost 1)
- Should find shortest path with same expansion count

**Contract:** Must match result format in `searchContract.js`

**Key Implementation Notes:**
- Use priority queue ordered by path cost g(n)
- Every node should have a cost associated
- Track visited nodes by cost (update if cheaper path found)
- Expand lowest-cost node first
- Reconstruct path and count cost

**Priority Queue Implementation:**
- Use simple array with insertion sort, or
- Implement heap structure, or
- Use built-in solutions (Map/Object + sorting)

### Feature: Search Animation / Step Visualization

**Update Component:** `src/components/Animation.jsx`

**What to Implement:**
- Replace placeholder with interactive animation
- Display step-by-step search progression
- Show current node being explored
- Highlight frontier nodes
- Play/pause controls

**Features:**
- [ ] Play button to start animation
- [ ] Pause button to stop
- [ ] Step forward/backward through search
- [ ] Speed slider (fast/slow)
- [ ] Step counter (e.g., "Step 5 of 47")
- [ ] Current node highlighting
- [ ] Frontier highlighting
- [ ] Path highlighting when found

**Component API:**
```javascript
<Animation 
  result={result}          // Search result with visitedOrder
  isAnimating={boolean}    // Is animation playing
  onAnimationComplete={fn} // Callback when done
/>
```

**Data Flow:**
- Receive `result.visitedOrder` and `result.path`
- Break into time-steps
- Update parent `MazeGrid` with current visited/path subsets
- Use React state to track current step

**Styling:**
- Smooth transitions between steps
- Clear visual states (current, frontier, visited, path)
- Responsive controls

**Deliverables:**
- [ ] `ucs.js` implemented and tested
- [ ] Animation component enhanced with controls
- [ ] Animation step-through working
- [ ] Play/pause/step controls functional
- [ ] Speed adjustment working
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console errors

**PR Template:**
```
Title: feat(student-3): UCS + Search Animation

- Implemented Uniform Cost Search algorithm
- Enhanced Animation component with step controls
- Added play/pause and speed adjustment
- Smooth visualization of search progression
- Works with all search algorithms
```

---

## Student 4: Greedy Best-First Search + Statistics & Comparison

### Algorithm: Greedy Best-First Search
**File:** `src/algorithms/greedy.js`

**What to Implement:**
- Export function `greedyBestFirstSearch({ grid, start, goal })`
- Use priority queue (min-heap) frontier
- Expand nodes by lowest heuristic value h(n) only
- Use Manhattan distance as heuristic
- Do NOT use actual path cost g(n)

**Algorithm Guarantees:**
- ✅ Fast (explores fewer nodes than informed searches)
- ❌ NOT optimal (may find suboptimal paths)
- ✅ Complete (in finite mazes)
- ⚠️ Heuristic quality affects performance

**Heuristic:**
```javascript
function heuristic(current, goal) {
  return Math.abs(current.row - goal.row) + Math.abs(current.col - goal.col)
}
```

**Contract:** Must match result format in `searchContract.js`

**Key Implementation Notes:**
- Only consider heuristic value h(n) for priority
- Ignore actual cost g(n) in ordering
- Choose heuristic: Manhattan distance (no diagonals)
- Tie-breaking: use node discovery order

### Feature: Statistics & Comparison View

**Update Component:** `src/components/Statistics.jsx` & create comparison feature

**What to Implement:**
- Enhanced statistics display (already started)
- Add comparison view to show multiple algorithm results
- Comparison metrics table
- Visual comparison charts (optional)

**Current Statistics Display:**
- Algorithm name
- Path found (yes/no)
- Path length
- Path cost
- Nodes expanded
- Nodes visited

**New Comparison Features:**
- [ ] Store results from multiple algorithm runs
- [ ] Side-by-side comparison table
- [ ] Efficiency metrics (nodes expanded, path cost, path length)
- [ ] Time complexity indicators
- [ ] Visual comparison (bar charts showing node expansion)
- [ ] "Compare All" button to run all algorithms

**UI Components:**
```javascript
<StatisticsComparison 
  results={[
    { algorithmId: 'bfs', result: {...} },
    { algorithmId: 'dfs', result: {...} },
    // ... up to 5
  ]}
/>
```

**Comparison Table Schema:**
| Algorithm | Found | Path Len | Path Cost | Nodes Expanded | Efficiency* |
|-----------|-------|----------|-----------|----------------|-------------|
| BFS       | ✓ | 15 | 14 | 47 | ⭐⭐⭐⭐⭐ |
| Greedy    | ✓ | 16 | 15 | 23 | ⭐⭐⭐⭐ |
| A*        | ✓ | 15 | 14 | 31 | ⭐⭐⭐⭐⭐ |

*Efficiency = Best path cost / Lowest nodes expanded ratio

**Deliverables:**
- [ ] `greedy.js` implemented and tested
- [ ] Statistics component enhanced
- [ ] Comparison features added
- [ ] "Compare All" runs all 5 algorithms
- [ ] Comparison table displays correctly
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No console errors

**PR Template:**
```
Title: feat(student-4): Greedy + Statistics & Comparison

- Implemented Greedy Best-First Search algorithm
- Enhanced Statistics component with comparison view
- Added multi-algorithm comparison table
- Added "Compare All" feature
- Shows efficiency metrics for each algorithm
```

---

## Student 5: A* Search + UI Polish & Integration

### Algorithm: A* Search
**File:** `src/algorithms/astar.js`

**What to Implement:**
- Export function `aStarSearch({ grid, start, goal })`
- Use priority queue (min-heap) frontier
- Expand nodes by lowest f(n) = g(n) + h(n)
- g(n) = actual path cost from start
- h(n) = Manhattan distance to goal
- Track both cost and heuristic

**Algorithm Guarantees:**
- ✅ Optimal (with admissible heuristic)
- ✅ Complete
- ✅ More efficient than BFS/UCS
- ✅ Best general-purpose search (when heuristic is good)

**Contract:** Must match result format in `searchContract.js`

**Key Implementation Notes:**
- Use closed set (visited) to track expanded nodes
- Use open set (frontier) for unexpanded nodes
- For each node, track: g(n), h(n), f(n)
- When finding node in frontier with better g: update it
- Expand node with lowest f value

**Formula:**
```javascript
g(node) = cost from start to node
h(node) = manhattanDistance(node, goal)
f(node) = g(node) + h(node)
```

### Feature: UI Polish & Final Integration

**What to Implement:**
- Keyboard controls for navigation
- Keyboard shortcut to run search
- Keyboard shortcut to reset
- Improved error messages
- Final visual polish
- Documentation updates
- Version bump (0.1.0)

**Keyboard Shortcuts:**
- `Enter` or `Space` - Run search (if algorithm selected)
- `R` - Reset search
- `1-5` - Select algorithm (1=BFS, 2=DFS, 3=UCS, 4=Greedy, 5=A*)
- `Escape` - Clear errors

**UI Enhancements:**
- [ ] Display keyboard shortcuts in tooltip/help
- [ ] Keyboard controls functional
- [ ] Better error messages with hints
- [ ] Loading state while search runs
- [ ] Success state after search completes
- [ ] Polish spacing, colors, fonts
- [ ] Improve responsive design (mobile friendly)
- [ ] Add keyboard hints to buttons

**Documentation:**
- [ ] Update README with final features
- [ ] Add keyboard shortcut documentation
- [ ] Final architecture review
- [ ] Update CONTRIBUTING with latest guidelines

**Testing:**
- [ ] All algorithms integrated and working
- [ ] No console errors or warnings
- [ ] Responsive on desktop/tablet/mobile
- [ ] Keyboard navigation complete
- [ ] All tests passing

**Deliverables:**
- [ ] `astar.js` implemented and tested
- [ ] Keyboard controls integrated
- [ ] UI polish and refinement
- [ ] Documentation updated
- [ ] All 5 algorithms working
- [ ] All tests passing
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Version in package.json updated to 0.1.0

**PR Template:**
```
Title: feat(student-5): A* + UI Polish & Final Integration

- Implemented A* Search algorithm
- Added keyboard shortcuts (1-5 for algorithm, Enter to run, R to reset)
- Polish UI styling and error messages
- Final responsive design improvements
- All 5 algorithms now fully integrated and working
- Ready for deployment
```

---

## Submission Checklist

Before submitting your PR, verify:

### Code Quality
- [ ] `npm run lint` returns no errors
- [ ] `npm run build` succeeds
- [ ] `npm test` passes all tests
- [ ] No console warnings or errors
- [ ] JSDoc comments on public functions
- [ ] Meaningful variable names
- [ ] No commented-out code

### Algorithm Implementation
- [ ] Follows shared contract in `searchContract.js`
- [ ] Input validation works
- [ ] Result validation works
- [ ] Handles edge cases (start==goal, no path, etc.)
- [ ] No input mutations
- [ ] Deterministic results
- [ ] Correct neighbor order (Up, Right, Down, Left)

### Testing
- [ ] Unit tests for new utilities (if applicable)
- [ ] Manual testing in browser
- [ ] Works with sample maze
- [ ] Works with at least one custom maze

### Documentation
- [ ] Code comments where unclear
- [ ] JSDoc for functions
- [ ] Commit messages are clear
- [ ] PR description explains changes

---

## Timeline Suggestions

- **Week 1 (Nov 1-3):** Get familiar with codebase, set up development environment
- **Week 2 (Nov 4-5):** Implement algorithms and features
- **Week 3 (Nov 6):** Testing, bug fixes, final polish and submission

---

## Support & Resources

- **Documentation:** See `docs/ARCHITECTURE.md` for detailed system design
- **Testing Guide:** See `CONTRIBUTING.md` for testing requirements
- **Grid API:** See `src/utils/grid.js` for available utility functions
- **Contract:** See `src/utils/searchContract.js` for validation rules

---

**Questions?** Ask the course instructor or team members on your team chat.

**Good luck! 🚀**
