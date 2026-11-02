# Contributing Guidelines

Thank you for contributing to the AI Search Visualizer project! This document outlines expectations for code quality, testing, and collaboration.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd int1314-ai-search-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create your feature branch**
   ```bash
   git checkout -b feature/student-N-your-feature
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Code Standards

### JavaScript/React Style
- Use ES6+ features (arrow functions, destructuring, const/let)
- Follow the existing ESLint configuration
- Use meaningful variable and function names
- Keep functions small and focused
- Add JSDoc comments to public functions

### Example Function Documentation
```javascript
/**
 * Brief description of what the function does
 * 
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @throws {Error} When something goes wrong
 */
export function myFunction(paramName) {
  // implementation
}
```

### React Components
- Use functional components with hooks
- Use destructuring for props
- Keep components focused on a single responsibility
- Use descriptive component names

### File Organization
- Place related utilities together
- Keep components with their styles (ComponentName.jsx + ComponentName.css)
- Use clear, consistent naming

## Testing Requirements

### Before Submitting a PR
1. Run linting: `npm run lint`
2. Run tests: `npm test`
3. Build production: `npm run build`

All three must pass without errors or warnings.

### Writing Tests
- Test public API of utility functions
- Test edge cases (empty arrays, invalid input, boundaries)
- Test error conditions
- Aim for >80% code coverage on utilities
- Do NOT write tests for unimplemented algorithm stubs

### Example Test
```javascript
import { describe, it, expect } from 'vitest'
import { myFunction } from '../myFunction'

describe('myFunction', () => {
  it('should handle valid input', () => {
    const result = myFunction({ valid: true })
    expect(result).toBeDefined()
  })

  it('should reject invalid input', () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

## Algorithm Implementation

### Contract Compliance
Every search algorithm must follow the same interface:

**Input:**
```javascript
{
  grid: Array<Array<number>>,
  start: {row: number, col: number},
  goal: {row: number, col: number}
}
```

**Output:**
```javascript
{
  found: boolean,
  path: Array<{row, col}>,
  visitedOrder: Array<{row, col}>,
  pathCost: number | null,
  expandedNodes: number
}
```

### Key Requirements
- ✅ Do NOT mutate input parameters
- ✅ Ensure `visitedOrder` has NO duplicates
- ✅ Ensure `expandedNodes === visitedOrder.length`
- ✅ Include both start and goal in successful path
- ✅ Return empty path when no solution exists
- ✅ Explore neighbors in order: Up, Right, Down, Left
- ✅ Assume 4-directional movement only
- ✅ Return `pathCost` as number of moves (unit cost)
- ✅ Make algorithm deterministic

### Validation
Use the provided validation utilities:
```javascript
import { validateInput, validateResult } from '../utils/searchContract'

const validation = validateInput(input)
if (!validation.valid) {
  throw new Error(validation.error)
}

const result = mySearchAlgorithm(input)

const resultValidation = validateResult(result)
if (!resultValidation.valid) {
  throw new Error(resultValidation.error)
}
```

## Pull Request Workflow

### Before Opening a PR
1. Ensure your branch name follows the convention:
   - `feature/student-N-algorithm-name`
   - `feature/student-N-feature-description`
   - `bugfix/issue-description`

2. Test locally:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. Commit with clear messages:
   ```bash
   git commit -m "Brief description of change"
   ```

### Opening a PR
1. Push your branch to the repository
2. Open a PR with a descriptive title and body
3. Include a checklist:
   ```markdown
   - [ ] Code follows style guidelines
   - [ ] Tests pass: `npm test`
   - [ ] Lint passes: `npm run lint`
   - [ ] Build passes: `npm run build`
   - [ ] No console errors/warnings
   - [ ] Documentation updated
   ```

4. Request review from at least one other student
5. Address feedback promptly
6. Merge after approval by a maintainer

### PR Description Template
```markdown
## Description
Brief summary of what this PR does.

## Type of Change
- [ ] Algorithm implementation (BFS/DFS/UCS/Greedy/A*)
- [ ] Feature (Animation/Statistics/Maze editing/Controls)
- [ ] Bug fix
- [ ] Documentation
- [ ] Test coverage

## Testing
Describe the tests you've added or run.

## Verification
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Tested in browser at http://localhost:5173
```

## Common Pitfalls

### ❌ Mutating Input
```javascript
// WRONG - mutates the grid
function badSearch(input) {
  input.grid[0][0] = 99
  return result
}

// RIGHT - creates new structures
function goodSearch(input) {
  const visited = new Set()
  // use visited set instead
  return result
}
```

### ❌ Incorrect Neighbor Order
```javascript
// WRONG - neighbors in wrong order
const neighbors = [
  {row: r-1, col: c},  // Left (should be first)
  {row: r, col: c+1},  // Up (should be second)
  // ...
]

// RIGHT - neighbors in correct order
const neighbors = [
  {row: r-1, col: c},  // Up
  {row: r, col: c+1},  // Right
  {row: r+1, col: c},  // Down
  {row: r, col: c-1},  // Left
]
```

### ❌ Duplicates in visitedOrder
```javascript
// WRONG - may visit nodes multiple times
const visitedOrder = []
while (queue.length > 0) {
  const node = queue.shift()
  visitedOrder.push(node)  // Could add same node multiple times!
  // ...
}

// RIGHT - track visited nodes
const visited = new Set()
const visitedOrder = []
while (queue.length > 0) {
  const node = queue.shift()
  const key = `${node.row},${node.col}`
  if (!visited.has(key)) {
    visitedOrder.push(node)
    visited.add(key)
  }
}
```

### ❌ Wrong pathCost Calculation
```javascript
// WRONG - counting visited nodes instead of path moves
const pathCost = visitedOrder.length

// RIGHT - counting moves in the actual path
const pathCost = path.length - 1  // excludes start node
```

## Communication

- **Issues/Questions**: Use GitHub Issues or team chat
- **Design Decisions**: Discuss before implementing
- **Feedback**: Be respectful and constructive
- **Code Review**: Focus on the code, not the person

## Resources

- [React Documentation](https://react.dev)
- [MDN Web Docs](https://developer.mozilla.org)
- [Vite Documentation](https://vite.dev)
- [Vitest Documentation](https://vitest.dev)
- [ESLint Rules](https://eslint.org/docs/rules/)

## Questions?

Contact the course instructor or team lead for clarification.

**Happy coding! 🚀**
