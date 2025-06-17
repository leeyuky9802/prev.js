import type { ElementKey, ElementType } from "shared/ReactTypes";
import { ReactElement } from "shared/ReactTypes";

export function jsx(
  type: ElementType,
  props: Record<string, unknown> & { key?: string | number },
  maybeKey?: string | number,
) {
  let key: ElementKey = null;

  if (maybeKey) key = "" + maybeKey;

  let filteredProps: {
    [key: Exclude<string, "key">]: unknown;
  };

  if (props.key) {
    key = "" + props.key;

    filteredProps = {};
    for (const propName in props) {
      if (propName !== "key") {
        filteredProps[propName] = props[propName];
      }
    }
  } else {
    filteredProps = props;
  }

  return new ReactElement(type, filteredProps, key);
}

export const jsxs = jsx;
