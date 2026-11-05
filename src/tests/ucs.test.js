import { describe, it, expect } from 'vitest';
import { uniformCostSearch } from '../algorithms/ucs.js';
import { validateResult } from '../utils/searchContract.js';

const run = (grid, start, goal) => uniformCostSearch({ grid, start, goal });

describe('uniformCostSearch', () => {
  it('tìm được đường đi ngắn nhất trên lưới trống', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const result = run(grid, { row: 0, col: 0 }, { row: 2, col: 2 });
    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(4);
    expect(result.path).toHaveLength(5);
    expect(result.path[0]).toEqual({ row: 0, col: 0 });
    expect(result.path[result.path.length - 1]).toEqual({ row: 2, col: 2 });
    expect(result.expandedNodes).toBe(result.visitedOrder.length);
  });

  it('đi vòng qua vật cản', () => {
    const grid = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    const result = run(grid, { row: 0, col: 0 }, { row: 0, col: 2 });
    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(6);
    for (const { row, col } of result.path) expect(grid[row][col]).toBe(0);
  });

  it('không có đường đi', () => {
    const grid = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    const result = run(grid, { row: 0, col: 0 }, { row: 0, col: 2 });
    expect(result.found).toBe(false);
    expect(result.path).toEqual([]);
    expect(result.pathCost).toBeNull();
    expect(result.expandedNodes).toBe(result.visitedOrder.length);
  });

  it('điểm bắt đầu trùng điểm đích', () => {
    const grid = [[0, 0], [0, 0]];
    const result = run(grid, { row: 1, col: 1 }, { row: 1, col: 1 });
    expect(result.found).toBe(true);
    expect(result.path).toEqual([{ row: 1, col: 1 }]);
    expect(result.pathCost).toBe(0);
  });

  it('ném lỗi khi start hoặc goal là vật cản', () => {
    const grid = [[0, 1], [0, 0]];
    expect(() => run(grid, { row: 0, col: 0 }, { row: 0, col: 1 })).toThrow();
    expect(() => run(grid, { row: 0, col: 1 }, { row: 1, col: 1 })).toThrow();
  });

  it('visitedOrder không có ô trùng và bắt đầu từ S', () => {
    const grid = [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ];
    const result = run(grid, { row: 0, col: 0 }, { row: 2, col: 3 });
    const keys = result.visitedOrder.map(({ row, col }) => `${row},${col}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(result.visitedOrder[0]).toEqual({ row: 0, col: 0 });
  });

  it('thứ tự mở rộng tuân theo Lên -> Phải -> Xuống -> Trái', () => {
    const grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const result = run(grid, { row: 1, col: 1 }, { row: 0, col: 0 });
    expect(result.visitedOrder.slice(0, 5)).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
    ]);
  });

  it('kết quả hợp lệ theo searchContract', () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    expect(validateResult(run(grid, { row: 0, col: 0 }, { row: 2, col: 2 })).valid).toBe(true);
    const blocked = [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ];
    expect(validateResult(run(blocked, { row: 0, col: 0 }, { row: 0, col: 2 })).valid).toBe(true);
  });

  it('không thay đổi dữ liệu đầu vào', () => {
    const grid = [[0, 0], [0, 0]];
    const input = { grid, start: { row: 0, col: 0 }, goal: { row: 1, col: 1 } };
    const snapshot = JSON.parse(JSON.stringify(input));
    uniformCostSearch(input);
    expect(input).toEqual(snapshot);
  });

  it('ném lỗi khi đầu vào không hợp lệ', () => {
    const grid = [[0, 0], [0, 0]];
    expect(() => run(grid, { row: -1, col: 0 }, { row: 1, col: 1 })).toThrow();
    expect(() => run(grid, { row: 0, col: 0 }, { row: 5, col: 5 })).toThrow();
    expect(() => run([], { row: 0, col: 0 }, { row: 0, col: 0 })).toThrow();
  });
});