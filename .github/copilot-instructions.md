# AI-Assisted Development Guide

This document provides guidance for using GitHub Copilot and other AI tools to assist with algorithm implementation and feature development.

## How to Use AI Assistance Effectively

### 1. Algorithm Implementation

When asking AI to help with an algorithm:

**Good Prompt:**

```
"Implement breadthFirstSearch for a 2D grid maze using a queue-based approach.
The function should accept {grid, start, goal} and return {found, path, visitedOrder, pathCost, expandedNodes}.
- Grid is 2D array with 0=walkable, 1=blocked
- Neighbors are in order: Up, Right, Down, Left
- Do NOT mutate the input
- visitedOrder must have no duplicates and match expandedNodes count
- Use the getNeighbors function from src/utils/grid.js"
```

**Poor Prompt:**

```
"Write a BFS function"
```

### 2. Code Generation

Use Copilot for:

- ✅ Boilerplate code (component shells, test setup)
- ✅ Utility functions (sorting, searching helpers)
- ✅ React component structure
- ✅ CSS styling (as starting point)
- ✅ Error handling patterns

Avoid relying on AI for:

- ❌ Complex algorithm logic (verify carefully)
- ❌ Performance-critical sections
- ❌ Security decisions
- ❌ Architecture decisions

### 3. Testing

**Use AI to:**

- Generate test cases and edge cases
- Write parametrized test patterns
- Verify test coverage

**Example Prompt:**

```
"Generate comprehensive tests for the getNeighbors(row, col, grid) function.
Include tests for:
- Center cell (all 4 neighbors)
- Corner cells (2 neighbors)
- Edge cells (3 neighbors)
- Obstacles blocking neighbors
- Cells with all neighbors blocked
- Out-of-bounds positions"
```

### 4. Debugging

When using AI for debugging:

**Include:**

- Error message (full stack trace)
- Relevant code snippet (20-50 lines context)
- What you expected to happen
- What actually happened
- Steps to reproduce

**Example:**

```
"My BFS function is not finding paths that should exist.
Error: 'Cannot read property row of undefined'

Here's my frontier handling code:
[code snippet]

I expected the path length to be 15, but got an error instead.
This happens when running on a 10x10 grid with obstacles.
Steps to reproduce:
1. Load sampleMaze
2. Select BFS
3. Click Run"
```

### 5. Documentation & Comments

Use AI to:

- Generate JSDoc comments from function signatures
- Explain complex algorithms
- Write README sections
- Document edge cases

**Example:**

```
"Generate JSDoc comments for this function signature:
export function a StaarSearch({ grid, start, goal })

Include:
- Brief description of A* algorithm
- Parameter types and descriptions
- Return type and structure
- Notes about optimality and completeness
- Example usage"
```

## Best Practices

### Verify Generated Code

1. **Read the code carefully** - AI can produce syntactically correct but logically wrong code
2. **Test edge cases** - AI often misses boundary conditions
3. **Check the contract** - Verify output matches `searchContract.js`
4. **Run linting** - `npm run lint` catches many issues
5. **Run tests** - `npm test` validates logic

### Prompting Patterns

#### "Explain This Code"

```
"Explain this algorithm step by step:
[paste code]

Focus on:
1. What data structures are used
2. How neighbors are explored
3. When the algorithm terminates
4. Why this approach guarantees/doesn't guarantee optimality"
```

#### "Find the Bug"

```
"This function should return a valid result according to searchContract.js.
Current error: [error message]

Code:
[paste code]

What's wrong and how do I fix it?"
```

#### "Optimize This"

```
"This algorithm works but is slow on large grids.
Current implementation:
[paste code]

What could make this faster?
Consider:
1. Data structure choices
2. Redundant operations
3. Better algorithms"
```

#### "Generate Test Cases"

```
"Generate test cases for this function:
[function signature]

The function should:
[list requirements]

Include tests for:
1. Normal cases
2. Edge cases
3. Error conditions"
```

## What AI Is Good At

✅ **Pattern Recognition** - Recognizing common algorithm patterns
✅ **Code Generation** - Creating boilerplate and structure
✅ **Documentation** - Writing comments and READMEs
✅ **Refactoring** - Suggesting code improvements
✅ **Testing** - Generating test cases and assertions
✅ **Debugging** - Finding common issues and mistakes

## What AI Struggles With

❌ **Novel Problems** - Unique architectural decisions
❌ **Complex Interactions** - Behavior across multiple components
❌ **Performance Optimization** - True algorithmic speedups
❌ **Security** - Building secure systems
❌ **Deep Understanding** - Why something works, not just how

## Contract Validation with AI

When implementing an algorithm, ask AI:

```
"This function must return a result matching this contract:
{
  found: boolean,
  path: Array<{row, col}>,
  visitedOrder: Array<{row, col}>,
  pathCost: number | null,
  expandedNodes: number
}

Rules:
1. If found=true: path must include start and goal, pathCost must be number
2. If found=false: path must be empty, pathCost must be null
3. visitedOrder must have no duplicates
4. expandedNodes must equal visitedOrder.length

Given this implementation:
[paste code]

Does it satisfy all contract requirements? What's missing?"
```

## Copilot Chat Tips

### In VS Code

1. **Open Copilot Chat:** Cmd+I (Mac) or Ctrl+I (Windows/Linux)
2. **Select Code First:** Highlight relevant code, then ask
3. **Use @-mentions:** Reference specific files with @filename
4. **Keep Context:** Provide full function/class context
5. **Iterative Refinement:** Ask follow-up questions to improve

### Effective Copilot Interactions

**Good:**

```
User: "@grid.js How do I use getNeighbors to explore a maze?"
Copilot: [explains usage with examples]
```

**Better:**

```
User: "I need to explore all neighbors of cell (1,1) in a 3x3 grid.
@grid.js getNeighbors should help. Show me example usage."
Copilot: [tailored to your specific scenario]
```

## Testing AI-Generated Code

Always run this checklist:

```bash
# 1. Check style
npm run lint

# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Manual validation
npm run dev
# Test in browser
```

If any fails, ask AI for help with specific error message.

## Red Flags

When AI-generated code has these issues, investigate:

- ❌ Creates new global variables
- ❌ Mutates input parameters
- ❌ Uses `while(true)` without clear exit condition
- ❌ Ignores error cases
- ❌ Returns undefined/null without handling
- ❌ Uses deprecated functions
- ❌ Missing required imports

## Examples

### Example 1: Asking for Algorithm Help

**Prompt:**

```
I'm implementing BFS for a grid maze.
I need to:
1. Start from a given position
2. Explore neighbors in order: Up, Right, Down, Left
3. Track visited nodes to avoid cycles
4. Reconstruct the path when goal is found
5. Return the result matching this interface:
{found, path, visitedOrder, pathCost, expandedNodes}

I have these utilities available:
- isWalkable(row, col, grid)
- getNeighbors(row, col, grid) → [{row, col}, ...]

Sketch out the algorithm structure without full implementation."
```

**Result:** AI provides pseudocode or skeleton you can then fill in and verify.

### Example 2: Asking for Tests

**Prompt:**

```
Generate comprehensive tests for BFS using Vitest.
The function signature is:
export function breadthFirstSearch({ grid, start, goal })

Test scenarios:
- Simple path exists
- No path exists
- Start equals goal
- Single-cell maze
- Large maze
- Corners and edges
- All neighbors blocked

Use the imports from src/tests/searchContract.test.js as reference."
```

**Result:** AI generates test structure you can verify and adjust.

### Example 3: Debugging

**Prompt:**

```
My algorithm returns path length 20 when optimal is 15.
Error: visitedOrder has 157 elements but expandedNodes is 140.

Code snippet:
[paste the frontier handling code]

What's wrong? Is it:
1. Adding duplicates to visitedOrder?
2. Not counting all expansions?
3. Incorrect neighbor order?"
```

**Result:** AI identifies the specific issue (e.g., "You're adding to visitedOrder without checking for duplicates").

## Summary

**Use AI to accelerate** algorithm and feature development, but **always**:

- ✅ Understand generated code before using it
- ✅ Test thoroughly (`npm test`, `npm run lint`, `npm run build`)
- ✅ Verify against the contract specification
- ✅ Keep human review in the loop
- ✅ Ask for explanations if unclear

**Copilot is your assistant, not your implementation.** You are responsible for correctness.

---

**Happy coding! Let AI help, but you lead. 🚀**
