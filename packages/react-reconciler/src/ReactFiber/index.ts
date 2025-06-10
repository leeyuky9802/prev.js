import type { ReactElement } from "shared/ReactTypes";
import { HostComponentFiber } from "./HostComponentFiber";
import type { HostRootFiber } from "./HostRootFiber";
import type { HostTextFiber } from "./HostTextFiber";

export type FiberNode = HostRootFiber | HostComponentFiber | HostTextFiber;

export function createFiberFromElement(element: ReactElement) {
  switch (typeof element.type) {
    case "string":
      return new HostComponentFiber(
        element.type,
        element.props,
        element.key,
        element.ref
      );
    default:
      throw new Error(
        "unhandled element type: " + JSON.stringify(element.type)
      );
  }
}
