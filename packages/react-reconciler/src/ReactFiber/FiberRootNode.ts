import type { HostRootFiber } from "./HostRootFiber";
import type { Container } from "ReactFiberConfig";

export class FiberRootNode {
  container: Container;
  current: HostRootFiber;
  finishedWork: HostRootFiber | null = null;

  constructor(container: Container, hostRootFiber: HostRootFiber) {
    this.container = container;
    this.current = hostRootFiber;
  }
}
