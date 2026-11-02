import { describe, it, expect } from "vitest";
import {
  validateInput,
  validateResult,
  createEmptyResult,
  ALGORITHMS,
  getAlgorithmName,
} from "../utils/searchContract";

describe("Search Contract", () => {
  describe("ALGORITHMS", () => {
    it("should have 5 algorithms", () => {
      expect(ALGORITHMS).toHaveLength(5);
    });

    it("should have required algorithm IDs", () => {
      const ids = ALGORITHMS.map((a) => a.id);
      expect(ids).toContain("bfs");
      expect(ids).toContain("dfs");
      expect(ids).toContain("ucs");
      expect(ids).toContain("greedy");
      expect(ids).toContain("astar");
    });

    it("should have names and descriptions", () => {
      ALGORITHMS.forEach((algo) => {
        expect(algo.name).toBeTruthy();
        expect(algo.description).toBeTruthy();
      });
    });
  });

  describe("getAlgorithmName", () => {
    it("should return algorithm name for valid ID", () => {
      expect(getAlgorithmName("bfs")).toBe("Breadth-First Search");
      expect(getAlgorithmName("astar")).toBe("A* Search");
    });

    it("should return null for invalid ID", () => {
      expect(getAlgorithmName("invalid")).toBeNull();
      expect(getAlgorithmName("xyz")).toBeNull();
    });
  });

  describe("validateInput", () => {
    const validGrid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    const validInput = {
      grid: validGrid,
      start: { row: 0, col: 0 },
      goal: { row: 2, col: 2 },
    };

    it("should accept valid input", () => {
      const result = validateInput(validInput);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should reject null input", () => {
      const result = validateInput(null);
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it("should reject non-object input", () => {
      const result = validateInput("string");
      expect(result.valid).toBe(false);
    });

    it("should reject empty grid", () => {
      const result = validateInput({
        grid: [],
        start: { row: 0, col: 0 },
        goal: { row: 0, col: 0 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-rectangular grid", () => {
      const result = validateInput({
        grid: [
          [0, 0, 0],
          [0, 0],
        ],
        start: { row: 0, col: 0 },
        goal: { row: 1, col: 1 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject grid with non-numeric values", () => {
      const result = validateInput({
        grid: [
          [0, "a", 0],
          [0, 0, 0],
        ],
        start: { row: 0, col: 0 },
        goal: { row: 1, col: 1 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject start position out of bounds", () => {
      const result = validateInput({
        grid: validGrid,
        start: { row: 5, col: 5 },
        goal: { row: 0, col: 0 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject goal position out of bounds", () => {
      const result = validateInput({
        grid: validGrid,
        start: { row: 0, col: 0 },
        goal: { row: -1, col: 0 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject start on obstacle", () => {
      const grid = [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const result = validateInput({
        grid,
        start: { row: 0, col: 0 },
        goal: { row: 2, col: 2 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject goal on obstacle", () => {
      const grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ];
      const result = validateInput({
        grid,
        start: { row: 0, col: 0 },
        goal: { row: 2, col: 2 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject invalid start position object", () => {
      const result = validateInput({
        grid: validGrid,
        start: { row: "a", col: 0 },
        goal: { row: 0, col: 0 },
      });
      expect(result.valid).toBe(false);
    });

    it("should reject missing start position", () => {
      const result = validateInput({
        grid: validGrid,
        goal: { row: 0, col: 0 },
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("validateResult", () => {
    const validSuccessResult = {
      found: true,
      path: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ],
      visitedOrder: [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
      ],
      pathCost: 1,
      expandedNodes: 2,
    };

    const validFailureResult = {
      found: false,
      path: [],
      visitedOrder: [],
      pathCost: null,
      expandedNodes: 0,
    };

    it("should accept valid success result", () => {
      const result = validateResult(validSuccessResult);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should accept valid failure result", () => {
      const result = validateResult(validFailureResult);
      expect(result.valid).toBe(true);
      expect(result.error).toBeNull();
    });

    it("should reject null result", () => {
      const result = validateResult(null);
      expect(result.valid).toBe(false);
    });

    it("should reject non-boolean found", () => {
      const result = validateResult({
        ...validSuccessResult,
        found: "yes",
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-array path", () => {
      const result = validateResult({
        ...validSuccessResult,
        path: "not an array",
      });
      expect(result.valid).toBe(false);
    });

    it("should reject empty path when found is true", () => {
      const result = validateResult({
        ...validSuccessResult,
        path: [],
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-empty path when found is false", () => {
      const result = validateResult({
        ...validFailureResult,
        path: [{ row: 0, col: 0 }],
      });
      expect(result.valid).toBe(false);
    });

    it("should reject path with invalid positions", () => {
      const result = validateResult({
        ...validSuccessResult,
        path: [
          { row: 0, col: 0 },
          { row: "a", col: 1 },
        ],
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-array visitedOrder", () => {
      const result = validateResult({
        ...validSuccessResult,
        visitedOrder: "not an array",
      });
      expect(result.valid).toBe(false);
    });

    it("should reject visitedOrder with duplicates", () => {
      const result = validateResult({
        ...validSuccessResult,
        visitedOrder: [
          { row: 0, col: 0 },
          { row: 0, col: 0 },
        ],
      });
      expect(result.valid).toBe(false);
    });

    it("should reject expandedNodes not matching visitedOrder length", () => {
      const result = validateResult({
        ...validSuccessResult,
        expandedNodes: 5,
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-numeric expandedNodes", () => {
      const result = validateResult({
        ...validSuccessResult,
        expandedNodes: "five",
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-numeric pathCost when found is true", () => {
      const result = validateResult({
        ...validSuccessResult,
        pathCost: "one",
      });
      expect(result.valid).toBe(false);
    });

    it("should reject non-null pathCost when found is false", () => {
      const result = validateResult({
        ...validFailureResult,
        pathCost: 5,
      });
      expect(result.valid).toBe(false);
    });

    it("should reject negative pathCost", () => {
      const result = validateResult({
        ...validSuccessResult,
        pathCost: -1,
      });
      expect(result.valid).toBe(false);
    });
  });

  describe("createEmptyResult", () => {
    it("should create a valid empty result", () => {
      const result = createEmptyResult();
      const validation = validateResult(result);
      expect(validation.valid).toBe(true);
    });

    it("should have found = false", () => {
      const result = createEmptyResult();
      expect(result.found).toBe(false);
    });

    it("should have empty arrays", () => {
      const result = createEmptyResult();
      expect(result.path).toEqual([]);
      expect(result.visitedOrder).toEqual([]);
    });

    it("should have null pathCost", () => {
      const result = createEmptyResult();
      expect(result.pathCost).toBeNull();
    });

    it("should have zero expandedNodes", () => {
      const result = createEmptyResult();
      expect(result.expandedNodes).toBe(0);
    });
  });
});
