import type { ReactElement, ReactNode } from "shared/ReactTypes";
import { HostComponentFiber } from "./HostComponentFiber";
import type { HostRootFiber } from "./HostRootFiber";
import { HostTextFiber } from "./HostTextFiber";
import { FunctionComponentFiber } from "./FunctionComponent";
import { FragmentFiber } from "./FragmentFiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";

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

export function createFiberFromArray(elements: ReactNode[]) {
  return new FragmentFiber(elements, null);
}

export function createFiberFromReactNode(
  reactNode: ReactNode
): FiberNode | null {
  if (
    reactNode === null ||
    reactNode === undefined ||
    typeof reactNode === "boolean"
  ) {
    return null;
  } else if (
    typeof reactNode === "string" ||
    typeof reactNode === "number" ||
    typeof reactNode === "bigint"
  ) {
    return new HostTextFiber(reactNode.toString());
  } else if (typeof reactNode === "object") {
    if (Array.isArray(reactNode)) {
      return createFiberFromArray(reactNode);
    } else {
      switch (reactNode.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return createFiberFromElement(reactNode);
        default:
          throw new Error(
            "unhandled react internal type: " + JSON.stringify(reactNode)
          );
      }
    }
  } else {
    console.error("Unexpected ReactNode type:", reactNode);
    return null;
  }
}
