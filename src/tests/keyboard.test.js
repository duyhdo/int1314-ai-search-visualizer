import { describe, expect, it } from "vitest";
import { getShortcutAction } from "../utils/keyboard";

const press = (key, extra = {}) => ({
  key,
  target: { tagName: "BODY" },
  ...extra,
});

describe("getShortcutAction", () => {
  it("runs on Enter and Space", () => {
    expect(getShortcutAction(press("Enter"))).toEqual({ type: "run" });
    expect(getShortcutAction(press(" "))).toEqual({ type: "run" });
  });

  it("resets on r / R", () => {
    expect(getShortcutAction(press("r"))).toEqual({ type: "reset" });
    expect(getShortcutAction(press("R"))).toEqual({ type: "reset" });
  });

  it("selects algorithms with 1-5", () => {
    expect(getShortcutAction(press("1"))).toEqual({
      type: "select",
      algorithmId: "bfs",
    });
    expect(getShortcutAction(press("5"))).toEqual({
      type: "select",
      algorithmId: "astar",
    });
    expect(getShortcutAction(press("0"))).toBeNull();
    expect(getShortcutAction(press("6"))).toBeNull();
  });

  it("dismisses the error on Escape, even inside a select", () => {
    expect(getShortcutAction(press("Escape"))).toEqual({ type: "dismiss-error" });
    expect(
      getShortcutAction(press("Escape", { target: { tagName: "SELECT" } })),
    ).toEqual({ type: "dismiss-error" });
  });

  it("ignores keys while typing in form fields", () => {
    for (const tagName of ["INPUT", "SELECT", "TEXTAREA"]) {
      expect(getShortcutAction(press("1", { target: { tagName } }))).toBeNull();
      expect(getShortcutAction(press("r", { target: { tagName } }))).toBeNull();
    }
  });

  it("lets a focused button handle Enter itself", () => {
    expect(
      getShortcutAction(press("Enter", { target: { tagName: "BUTTON" } })),
    ).toBeNull();
    expect(
      getShortcutAction(press("r", { target: { tagName: "BUTTON" } })),
    ).toEqual({ type: "reset" });
  });

  it("ignores ctrl / cmd / alt combos", () => {
    expect(getShortcutAction(press("r", { ctrlKey: true }))).toBeNull();
    expect(getShortcutAction(press("r", { metaKey: true }))).toBeNull();
    expect(getShortcutAction(press("1", { altKey: true }))).toBeNull();
  });

  it("returns null for other keys", () => {
    expect(getShortcutAction(press("a"))).toBeNull();
    expect(getShortcutAction(press("ArrowUp"))).toBeNull();
  });
});
