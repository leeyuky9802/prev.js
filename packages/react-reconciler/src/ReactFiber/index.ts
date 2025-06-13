import type { ReactElement } from "shared/ReactTypes";
import { HostComponentFiber } from "./HostComponentFiber";
import type { HostRootFiber } from "./HostRootFiber";
import type { HostTextFiber } from "./HostTextFiber";
import { FunctionComponentFiber } from "./FunctionComponent";
import { FragmentFiber } from "./FragmentFiber";

export type FiberNode =
  | HostRootFiber
  | HostComponentFiber
  | HostTextFiber
  | FunctionComponentFiber
  | FragmentFiber;

export function createFiberFromElement(element: ReactElement) {
  switch (typeof element.type) {
    case "string":
      return new HostComponentFiber(
        element.type,
        element.props,
        element.key,
        element.ref
      );
    case "function":
      return new FunctionComponentFiber(
        element.type,
        element.props,
        element.key
      );
    case "symbol":
      return new FragmentFiber(element.props.children, element.key);
    default:
      throw new Error(
        "unhandled element type: " + JSON.stringify(element.type)
      );
  }
}
