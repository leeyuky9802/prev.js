import type { ReactElement } from "shared/ReactTypes";

import { FragmentFiber } from "./FragmentFiber";
import { FunctionComponentFiber } from "./FunctionComponentFiber";
import { HostComponentFiber } from "./HostComponentFiber";
import type { HostRootFiber } from "./HostRootFiber";
import type { HostTextFiber } from "./HostTextFiber";

export { FiberRootNode } from "./FiberRootNode";
export { FragmentFiber } from "./FragmentFiber";
export { FunctionComponentFiber } from "./FunctionComponentFiber";
export { HostComponentFiber } from "./HostComponentFiber";
export { HostRootFiber } from "./HostRootFiber";
export { HostTextFiber } from "./HostTextFiber";

export type FiberNode =
  | HostTextFiber
  | HostComponentFiber
  | HostRootFiber
  | FragmentFiber
  | FunctionComponentFiber;

export function createFiberFromElement(element: ReactElement) {
  switch (typeof element.type) {
    case "string":
      return new HostComponentFiber(
        element.type,
        element.props,
        element.key,
        element.ref,
      );
    case "symbol":
      return new FragmentFiber(element.props, element.key);
    case "function":
      return new FunctionComponentFiber(
        element.type,
        element.props,
        element.key,
      );
    default:
      throw new Error("unknown element type: " + { element });
  }
}
