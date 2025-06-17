<<<<<<< HEAD
import { REACT_FRAGMENT_TYPE } from "../shared/ReactSymbols";
import { ElementType, ReactElement } from "../shared/ReactTypes";

type ConvertableToString = {
  toString: () => string;
};

export function jsx(
  type: ElementType,
  props: Record<string, unknown> & { key?: ConvertableToString },
  maybeKey?: ConvertableToString
) {
  let key: string | null = null;

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

export const Fragment = REACT_FRAGMENT_TYPE;
=======
export { jsx, jsxs } from "./src/jsx";

export { REACT_FRAGMENT_TYPE as Fragment } from "shared/ReactSymbols";
>>>>>>> mount
