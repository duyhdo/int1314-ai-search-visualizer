import { ALGORITHMS } from "./searchContract";

export const SHORTCUTS = [
  { keys: "Enter / Space", label: "Run search" },
  { keys: "R", label: "Reset" },
  { keys: "1 - 5", label: "Choose algorithm" },
  { keys: "Esc", label: "Close error" },
];

const TYPING_TAGS = ["INPUT", "SELECT", "TEXTAREA"];

/**
 * Map a keydown event to an app action.
 * Returns null when the key should be left alone (typing in a form field,
 * pressing Enter on a focused button, ctrl/cmd combos...).
 *
 * @param {KeyboardEvent} event
 * @returns {{type: string, algorithmId?: string} | null}
 */
export function getShortcutAction(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }

  const target = event.target;
  const tag = target?.tagName;

  if (event.key === "Escape") {
    return { type: "dismiss-error" };
  }

  if (TYPING_TAGS.includes(tag) || target?.isContentEditable) {
    return null;
  }

  if (event.key === "Enter" || event.key === " ") {
    // a focused button already reacts to Enter/Space by itself
    if (tag === "BUTTON") return null;
    return { type: "run" };
  }

  if (event.key === "r" || event.key === "R") {
    return { type: "reset" };
  }

  const index = Number(event.key) - 1;
  if (Number.isInteger(index) && index >= 0 && index < ALGORITHMS.length) {
    return { type: "select", algorithmId: ALGORITHMS[index].id };
  }

  return null;
}
