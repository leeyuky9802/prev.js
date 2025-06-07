import type { Container } from "ReactFiberConfig";
import type { HostRootFiber } from "./HostRootFiber";

export class FiberRootNode {
  container: Container;
  current: HostRootFiber;
  finishedWork: HostRootFiber | null;

  constructor(container: Container, hostRootFiber: HostRootFiber) {
    this.container = container;
    this.current = hostRootFiber;
    this.finishedWork = null;
  }
}
