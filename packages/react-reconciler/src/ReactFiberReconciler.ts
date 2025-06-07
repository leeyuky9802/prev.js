import type { Container } from "ReactFiberConfig";
import type { ReactNode } from "shared/ReactTypes";
import { FiberRootNode } from "./ReactFiber/FiberRootNode";
import { HostRootFiber } from "./ReactFiber/HostRootFiber";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

export function createContainer(container: Container) {
  const fiberRootNode = new FiberRootNode(container, {} as HostRootFiber);
  const hostRootFiber = new HostRootFiber(fiberRootNode);
  fiberRootNode.current = hostRootFiber;

  return fiberRootNode;
}

export function updateContainer(
  fiberRootNode: FiberRootNode,
  reactNode: ReactNode,
) {
  const hostRootFiber = fiberRootNode.current;
  const update = createUpdate<ReactNode>(reactNode);

  enqueueUpdate(hostRootFiber.updateQueue, update);

  return scheduleUpdateOnFiber(fiberRootNode.current);
}
