import type { Container } from "ReactFiberConfig";
import { FiberRootNode } from "./ReactFiber/FiberRootNode";
import { HostRootFiber } from "./ReactFiber/HostRootFiber";
import type { ReactNode } from "shared/ReactTypes";

export function createContainer(container: Container) {
  const fiberRootNode = new FiberRootNode(container, {} as HostRootFiber);

  const hostRootFiber = new HostRootFiber(fiberRootNode);

  fiberRootNode.current = hostRootFiber;

  return fiberRootNode;
}

export function updateContainer(
  fiberRootNode: FiberRootNode,
  reactNode: ReactNode
) {
  const currentHostRootFiber = fiberRootNode.current;

  currentHostRootFiber.updateQueue = reactNode;

  // TODO: API for starting the rendering
}
