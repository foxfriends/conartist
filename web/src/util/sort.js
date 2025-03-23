/*       */
import { model } from "../model";

export const Asc = Symbol("Asc");
export const Desc = Symbol("Desc");

/**
 * Creates a sort function based on the keys of an object.
 *
 * Booleans: True < False
 * Numbers: in order
 * Strings: by locale order
 * Object/Undefined: always equal
 *
 * In the case of type mismatch, boolean < number < string < object < undefined
 */
export function by(...orders) {
  return (a, b) => {
    // $FlowIgnore: not so good with defaulting optional values
    for (const [key, direction, typeDirection] of orders) {
      const dir = compute(key, direction, typeDirection)(a, b);
      if (dir === 0) {
        continue;
      } else {
        return dir;
      }
    }
    return 0;
  };
}

function compute(key, direction = Asc, typeDirection = Asc) {
  return redirect(direction, (a, b) => {
    const lhs = a[key];
    const rhs = b[key];
    if (typeof lhs !== typeof rhs) {
      return redirect(direction === typeDirection ? Asc : Desc, typeOrder)(
        typeof lhs,
        typeof rhs,
      );
    }
    if (lhs instanceof Date && rhs instanceof Date) {
      return lhs.getTime() - rhs.getTime();
    }
    switch (typeof lhs) {
      case "number":
        return lhs - rhs;
      case "string":
        return lhs.localeCompare(rhs, model.getValue().settings.language, {
          numeric: true,
          ignorePunctuation: true,
          sensitivity: "accent",
        });
      case "boolean":
        if (lhs === rhs) {
          return 0;
        }
        return lhs ? -1 : 1;
      default:
        return 0;
    }
  });
}

function typeOrder(lhs, rhs) {
  const order = ["boolean", "number", "string", "object", "undefined"];
  return order.indexOf(lhs) - order.indexOf(rhs);
}

function redirect(direction, fn) {
  return direction === Asc ? fn : (a, b) => -fn(a, b);
}
