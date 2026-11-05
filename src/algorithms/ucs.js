
import { validateInput } from '../utils/searchContract.js';

const DIRECTIONS = [
  { dr: -1, dc: 0 }, // Lên
  { dr: 0, dc: 1 }, // Phải
  { dr: 1, dc: 0 }, // Xuống
  { dr: 0, dc: -1 }, // Trái
];

const STEP_COST = 1;

const keyOf = (row, col) => `${row},${col}`;

function inBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[row].length;
}

class PriorityQueue {
  constructor() {
    this.heap = [];
    this.counter = 0;
  }

  get size() {
    return this.heap.length;
  }

  less(a, b) {
    return a.cost < b.cost || (a.cost === b.cost && a.order < b.order);
  }

  push(item) {
    this.heap.push({ ...item, order: this.counter++ });
    let i = this.heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.less(this.heap[i], this.heap[parent])) break;
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
    }
  }

  pop() {
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = left + 1;
        let smallest = i;
        if (left < this.heap.length && this.less(this.heap[left], this.heap[smallest])) {
          smallest = left;
        }
        if (right < this.heap.length && this.less(this.heap[right], this.heap[smallest])) {
          smallest = right;
        }
        if (smallest === i) break;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
    return top;
  }
}

function buildPath(parents, goalKey, goal) {
  const path = [];
  let current = { row: goal.row, col: goal.col };
  let key = goalKey;
  while (key !== null) {
    path.push({ row: current.row, col: current.col });
    const parent = parents.get(key);
    if (!parent) break;
    current = parent.cell;
    key = parent.key;
  }
  return path.reverse();
}

/**
 * Uniform Cost Search trên lưới 2D (chi phí mỗi bước = 1).
 * @param {{grid: number[][], start: {row:number,col:number}, goal: {row:number,col:number}}} input
 * @returns {{found:boolean, path:Array, visitedOrder:Array, pathCost:number|null, expandedNodes:number}}
 */
export function uniformCostSearch(input) {
  const validation = validateInput(input);
  if (!validation.valid) {
    throw new Error(`Invalid input: ${validation.error}`);
  }
  const { grid, start, goal } = input;

  const startKey = keyOf(start.row, start.col);
  const goalKey = keyOf(goal.row, goal.col);

  const queue = new PriorityQueue();
  const bestCost = new Map([[startKey, 0]]); // chi phí tốt nhất đã biết tới mỗi ô
  const parents = new Map([[startKey, null]]);
  const closed = new Set(); // các ô đã mở rộng
  const visitedOrder = [];

  queue.push({ row: start.row, col: start.col, cost: 0 });

  while (queue.size > 0) {
    const current = queue.pop();
    const currentKey = keyOf(current.row, current.col);

    if (closed.has(currentKey)) continue;
    closed.add(currentKey);
    visitedOrder.push({ row: current.row, col: current.col });

    if (currentKey === goalKey) {
      return {
        found: true,
        path: buildPath(parents, goalKey, goal),
        visitedOrder,
        pathCost: current.cost,
        expandedNodes: visitedOrder.length,
      };
    }

    for (const { dr, dc } of DIRECTIONS) {
      const row = current.row + dr;
      const col = current.col + dc;
      if (!inBounds(grid, row, col) || grid[row][col] !== 0) continue;

      const key = keyOf(row, col);
      if (closed.has(key)) continue;

      const newCost = current.cost + STEP_COST;
      if (!bestCost.has(key) || newCost < bestCost.get(key)) {
        bestCost.set(key, newCost);
        parents.set(key, { key: currentKey, cell: { row: current.row, col: current.col } });
        queue.push({ row, col, cost: newCost });
      }
    }
  }

  return {
    found: false,
    path: [],
    visitedOrder,
    pathCost: null,
    expandedNodes: visitedOrder.length,
  };
}

export default uniformCostSearch;