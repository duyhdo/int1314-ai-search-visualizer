# AI Search Visualizer

A React-based web application for visualizing and comparing five fundamental pathfinding algorithms on a 2D maze.

## Overview

This is an **educational project** for the university AI course (INT1314) where students implement and compare search algorithms:

- **Breadth-First Search (BFS)** - Level-by-level exploration
- **Depth-First Search (DFS)** - Deep-first exploration  
- **Uniform Cost Search (UCS)** - Cost-based exploration
- **Greedy Best-First Search** - Heuristic-guided exploration
- **A* Search** - Optimal heuristic-guided exploration

Each student implements one algorithm and one application feature.

## Quick Start

### Prerequisites
- Node.js >= 18
- npm >= 10

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173` with hot-reload enabled.

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist/` directory.

### Testing

```bash
npm test
```

Runs unit tests for grid utilities and search contract validation.

### Linting

```bash
npm run lint
```

Checks code quality and consistency.

## Project Structure

```
src/
├── algorithms/          # Algorithm stub modules (students implement these)
│   ├── bfs.js
│   ├── dfs.js
│   ├── ucs.js
│   ├── greedy.js
│   └── astar.js
├── components/          # React UI components
│   ├── MazeGrid.jsx     # Grid visualization
│   ├── ControlPanel.jsx # Algorithm selection and controls
│   ├── Animation.jsx    # Placeholder for step-by-step visualization
│   └── Statistics.jsx   # Search result statistics
├── data/                # Sample maze data
│   └── sampleMaze.js
├── utils/               # Shared utilities
│   ├── grid.js          # Grid manipulation functions
│   └── searchContract.js # Algorithm interface and validation
├── styles/              # CSS styles
│   └── app.css
├── tests/               # Unit tests
│   ├── grid.test.js
│   └── searchContract.test.js
└── App.jsx              # Main app component
```

## Shared Data Model

All algorithms follow the same input/output contract:

### Input
```javascript
{
  grid: Array<Array<number>>,     // 2D grid (0=walkable, 1=blocked)
  start: {row: number, col: number},
  goal: {row: number, col: number}
}
```

### Output (Result)
```javascript
{
  found: boolean,                   // Whether a path exists
  path: Array<{row, col}>,         // Path from start to goal (including both)
  visitedOrder: Array<{row, col}>, // Nodes expanded in order (no duplicates)
  pathCost: number | null,         // Cost of the path (null if not found)
  expandedNodes: number             // Total nodes expanded
}
```

### Contract Rules
- **Successful path**: `found=true`, path includes start and goal, `pathCost` is number
- **No solution**: `found=false`, `path=[]`, `pathCost=null`
- **Deterministic**: Same input always produces same output
- **No mutations**: Input parameters must not be modified
- **4-directional movement**: Up, Right, Down, Left (in that order)
- **Unit cost**: Default move cost is 1
- **No duplicates**: `visitedOrder` lists each expanded node exactly once
- **Valid expansion count**: `expandedNodes === visitedOrder.length`

## Student Responsibilities

| Student | Algorithm | Feature |
|---------|-----------|---------|
| 1 | BFS | Grid utilities (grid.js helpers) |
| 2 | DFS | Maze editing UI |
| 3 | UCS | Search animation / step visualization |
| 4 | Greedy | Statistics & comparison view |
| 5 | A* | Controls integration & final polish |

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [docs/TASKS.md](./docs/TASKS.md) for detailed assignments.

## Development Workflow

### Branch Naming
```
  develop
  main
  feature/bfs-grid
  feature/dfs-maze-ui
  feature/ucs-animation
  feature/greedy-statistics
  feature/astar-controls
  bugfix/description
```

### Pull Requests
1. Create a feature branch
2. Implement your algorithm or feature
3. Write tests
4. Ensure `npm run build`, `npm run lint`, and `npm test` pass
5. Open a PR with a clear description
6. Request review from other students
7. Merge after approval

### Code Quality
- Follow ESLint rules (run `npm run lint`)
- Write unit tests for new utility functions
- Keep components focused and reusable
- Add JSDoc comments to public functions

## Testing

Unit tests cover:
- Grid utilities (createGrid, getNeighbors, etc.)
- Search contract validation (input/output)
- Algorithm interface expectations

Run tests:
```bash
npm test              # Single run
npm test -- --watch  # Watch mode
```

## Deployment

The app is ready to deploy to static hosting (Netlify, Vercel, GitHub Pages):

```bash
npm run build
# Deploy the dist/ folder
```

## Documentation

- [README.md](./README.md) - This file
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Development guidelines
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
- [docs/TASKS.md](./docs/TASKS.md) - Student assignments
- [.github/copilot-instructions.md](./.github/copilot-instructions.md) - AI-assisted development tips

## Dependencies

- **React 19** - UI framework
- **Vite 8** - Build tool
- **Vitest 1** - Testing framework
- **ESLint 10** - Linting

No third-party pathfinding libraries are used intentionally—students implement algorithms from scratch.

## Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3000
```

### Build fails
```bash
npm install
npm run build
```

### Tests fail
Ensure all utility functions are working correctly:
```bash
npm test -- --reporter=verbose
```

## Deadline

**November 6, 2026** - All algorithms and features must be complete and tested.

## License

Educational use only. Part of INT1314 AI Course Project.
