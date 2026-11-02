export const MAZE_SIZES = [
  { id: '10x10', rows: 10, cols: 10, label: '10 × 10' },
  { id: '15x20', rows: 15, cols: 20, label: '15 × 20' },
]

const MIN_DENSITY = 0
const MAX_DENSITY = 50
const DENSITY_STEP = 5

/**
 * Generate a rectangular maze with independently sampled obstacles.
 *
 * @param {Object} [options]
 * @param {string} [options.size='15x20'] - One of the supported MAZE_SIZES IDs
 * @param {number} [options.density=25] - Obstacle probability as a percentage
 * @param {() => number} [options.rng=Math.random] - Random source in [0, 1)
 * @returns {{grid: number[][], start: {row: number, col: number}, goal: {row: number, col: number}}}
 */
export function generateMaze({
  size = '15x20',
  density = 25,
  rng = Math.random,
} = {}) {
  const dimensions = MAZE_SIZES.find((candidate) => candidate.id === size)
  if (!dimensions) {
    throw new RangeError(`Unsupported maze size: ${size}`)
  }

  if (
    !Number.isInteger(density) ||
    density < MIN_DENSITY ||
    density > MAX_DENSITY ||
    density % DENSITY_STEP !== 0
  ) {
    throw new RangeError('Density must be a multiple of 5 between 0 and 50')
  }

  if (typeof rng !== 'function') {
    throw new TypeError('rng must be a function')
  }

  const start = { row: 0, col: 0 }
  const goal = {
    row: dimensions.rows - 1,
    col: dimensions.cols - 1,
  }
  const obstacleProbability = density / 100
  const grid = Array.from({ length: dimensions.rows }, (_, row) =>
    Array.from({ length: dimensions.cols }, (_, col) => {
      if (
        (row === start.row && col === start.col) ||
        (row === goal.row && col === goal.col) ||
        obstacleProbability === 0
      ) {
        return 0
      }

      const randomValue = rng()
      if (
        typeof randomValue !== 'number' ||
        !Number.isFinite(randomValue) ||
        randomValue < 0 ||
        randomValue >= 1
      ) {
        throw new RangeError('rng must return a number in [0, 1)')
      }

      return randomValue < obstacleProbability ? 1 : 0
    }),
  )

  return { grid, start, goal }
}
